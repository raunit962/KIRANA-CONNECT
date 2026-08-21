import { Request, Response } from 'express';
import { db } from '../data/mockDatabase';
import { KiranaStore, PayoutLog } from '../models/types';

export const getAllStores = (req: Request, res: Response) => {
  const stores = db.getStores();
  res.json({ success: true, count: stores.length, data: stores });
};

export const getStoreById = (req: Request, res: Response) => {
  const id = String(req.params.id);
  const store = db.getStoreById(id);

  if (!store) {
    return res.status(404).json({ success: false, message: 'Store not found' });
  }

  const storeParcels = db.getParcels().filter((p) => p.kiranaStoreId === id);
  res.json({ success: true, data: { ...store, parcels: storeParcels } });
};

export const createStore = (req: Request, res: Response) => {
  const {
    storeName,
    ownerName,
    phone,
    pincode,
    address,
    city,
    latitude,
    longitude,
    maxCapacity,
  } = req.body;

  if (!storeName || !ownerName) {
    return res.status(400).json({ success: false, message: 'Store name and owner name are required' });
  }

  const newStore: KiranaStore = {
    id: `store-${Date.now().toString().slice(-4)}`,
    storeName,
    ownerName,
    phone: phone || '+91 99000 00000',
    pincode: pincode || '110024',
    address: address || 'Main Market',
    city: city || 'New Delhi',
    latitude: latitude || 28.5670,
    longitude: longitude || 77.2430,
    maxCapacity: maxCapacity || 40,
    currentCapacity: 0,
    walletBalance: 0,
    commissionRate: 15.0,
    isVerified: true,
    openTime: '08:00 AM',
    closeTime: '10:00 PM',
    photoUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=500',
    rating: 5.0,
    totalParcelsHandled: 0,
  };

  db.addStore(newStore);
  res.status(201).json({ success: true, message: 'Kirana partner registered and verified!', data: newStore });
};

export const withdrawUpiEarnings = (req: Request, res: Response) => {
  const { storeId, amount, upiId } = req.body;
  const store = db.getStoreById(storeId);

  if (!store) {
    return res.status(404).json({ success: false, message: 'Store not found' });
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0 || numAmount > store.walletBalance) {
    return res.status(400).json({
      success: false,
      message: 'Invalid withdrawal amount or insufficient wallet balance.',
    });
  }

  db.updateStore(storeId, {
    walletBalance: store.walletBalance - numAmount,
  });

  const newPayout: PayoutLog = {
    id: `pay-${Date.now()}`,
    kiranaStoreId: storeId,
    storeName: store.storeName,
    amount: numAmount,
    upiId: upiId || 'merchant@upi',
    status: 'SUCCESS',
    referenceId: `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
    timestamp: new Date().toISOString(),
  };

  db.addPayout(newPayout);

  res.json({
    success: true,
    message: `₹${numAmount} successfully transferred to ${upiId}. Ref: ${newPayout.referenceId}`,
    data: newPayout,
  });
};
