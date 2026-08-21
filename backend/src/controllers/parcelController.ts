import { Request, Response } from 'express';
import { db } from '../data/mockDatabase';
import { findBestKiranaHub } from '../services/matchingEngine';
import { generate4DigitOtp, generateQrToken, validatePickupHandoff } from '../services/securityService';
import { Parcel } from '../models/types';

export const getAllParcels = (req: Request, res: Response) => {
  const parcels = db.getParcels();
  res.json({ success: true, count: parcels.length, data: parcels });
};

export const getParcelByTracking = (req: Request, res: Response) => {
  const trackingNumber = String(req.params.trackingNumber);
  const parcel = db.getParcelByTracking(trackingNumber);

  if (!parcel) {
    return res.status(404).json({ success: false, message: 'Parcel not found' });
  }

  const store = db.getStoreById(parcel.kiranaStoreId);
  res.json({ success: true, data: { ...parcel, store } });
};

export const createParcel = (req: Request, res: Response) => {
  const {
    customerName,
    customerPhone,
    packageItem,
    destinationAddress,
    destinationPincode,
    destinationCoords,
    packageSize,
    orderId,
  } = req.body;

  const stores = db.getStores();
  const coords = destinationCoords || { latitude: 28.5680, longitude: 77.2435 };
  const pincode = destinationPincode || '110024';

  const matches = findBestKiranaHub(coords, pincode, stores);
  const bestMatch = matches.find((m) => m.hasCapacity && m.store.isVerified);

  if (!bestMatch) {
    return res.status(400).json({
      success: false,
      message: 'No available Kirana store with open shelf capacity found in this region.',
    });
  }

  const parcelId = `parcel-${Date.now().toString().slice(-4)}`;
  const randomOtp = generate4DigitOtp();
  const trackingNumber = `KC-${Math.floor(10000 + Math.random() * 90000)}-IN`;

  const newParcel: Parcel = {
    id: parcelId,
    trackingNumber,
    orderId: orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    customerName: customerName || 'Aarav Sharma',
    customerPhone: customerPhone || '+91 98765 00000',
    destinationAddress: destinationAddress || 'Lajpat Nagar IV',
    destinationPincode: pincode,
    destinationCoords: coords,
    kiranaStoreId: bestMatch.store.id,
    agentId: 'agent-1',
    agentName: 'Vikram Singh (Shadowfax Rider)',
    agentPhone: '+91 91234 56780',
    status: 'IN_TRANSIT',
    orderedAt: new Date().toISOString(),
    dispatchedAt: new Date().toISOString(),
    expiryDate: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    pickupOtp: randomOtp,
    qrToken: generateQrToken(parcelId),
    packageSize: packageSize || 'SMALL',
    packageItem: packageItem || 'boAt Airdopes 141',
    estimatedPrice: 1499,
  };

  db.addParcel(newParcel);
  res.status(201).json({
    success: true,
    message: `Order assigned to nearest hub "${bestMatch.store.storeName}" (${bestMatch.distanceKm} km away).`,
    data: newParcel,
  });
};

export const dropParcelAtKirana = (req: Request, res: Response) => {
  const { parcelId, proofPhotoUrl } = req.body;
  const parcel = db.getParcelById(parcelId);

  if (!parcel) {
    return res.status(404).json({ success: false, message: 'Parcel not found' });
  }

  const store = db.getStoreById(parcel.kiranaStoreId);
  if (!store) {
    return res.status(404).json({ success: false, message: 'Assigned Kirana store not found' });
  }

  if (store.currentCapacity >= store.maxCapacity) {
    return res.status(400).json({
      success: false,
      message: `Store ${store.storeName} is at maximum capacity (${store.maxCapacity}/${store.maxCapacity})!`,
    });
  }

  const updatedParcel = db.updateParcel(parcelId, {
    status: 'DROPPED_AT_KIRANA',
    droppedAt: new Date().toISOString(),
    dropProofPhoto: proofPhotoUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500',
  });

  db.updateStore(store.id, {
    currentCapacity: store.currentCapacity + 1,
  });

  res.json({
    success: true,
    message: `Parcel successfully dropped at ${store.storeName}. Ready for customer collection.`,
    data: updatedParcel,
  });
};

export const verifyAndReleaseParcel = (req: Request, res: Response) => {
  const { parcelId, inputCode } = req.body;
  const parcel = db.getParcelById(parcelId);

  if (!parcel) {
    return res.status(404).json({ success: false, message: 'Parcel not found' });
  }

  if (parcel.status !== 'DROPPED_AT_KIRANA') {
    return res.status(400).json({
      success: false,
      message: `Cannot release parcel with status ${parcel.status}.`,
    });
  }

  const validation = validatePickupHandoff(inputCode, parcel);
  if (!validation.isValid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  const store = db.getStoreById(parcel.kiranaStoreId);
  const commission = store ? store.commissionRate : 15.0;

  const updatedParcel = db.updateParcel(parcelId, {
    status: 'COLLECTED',
    collectedAt: new Date().toISOString(),
    pickupProofPhoto: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=500',
  });

  if (store) {
    db.updateStore(store.id, {
      currentCapacity: Math.max(0, store.currentCapacity - 1),
      walletBalance: store.walletBalance + commission,
      totalParcelsHandled: store.totalParcelsHandled + 1,
    });
  }

  res.json({
    success: true,
    method: validation.method,
    message: `Verified via ${validation.method}! Parcel released & ₹${commission} credited to merchant wallet.`,
    data: updatedParcel,
  });
};
