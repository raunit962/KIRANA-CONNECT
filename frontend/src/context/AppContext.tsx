import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { KiranaStore, Parcel, PayoutLog, UserRole, NotificationItem } from '../types';
import { INITIAL_KIRANA_STORES, INITIAL_PARCELS, INITIAL_PAYOUT_LOGS } from '../lib/mockData';
import { validatePickupHandoff } from '../lib/security';
import { findBestKiranaStores } from '../lib/matchingEngine';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  stores: KiranaStore[];
  parcels: Parcel[];
  payoutLogs: PayoutLog[];
  notifications: NotificationItem[];
  activeStoreId: string;
  setActiveStoreId: (id: string) => void;
  activeTrackingNumber: string;
  setActiveTrackingNumber: (num: string) => void;
  
  // Actions
  dropParcelAtKirana: (parcelId: string, proofPhotoUrl?: string) => { success: boolean; message: string };
  verifyAndReleaseParcel: (parcelId: string, inputCode: string) => { success: boolean; message: string; method?: string };
  requestUpiWithdrawal: (storeId: string, amount: number, upiId: string) => { success: boolean; message: string };
  createAndDispatchParcel: (orderData: Partial<Parcel>) => { success: boolean; parcel?: Parcel; message: string };
  registerKiranaStore: (storeData: Partial<KiranaStore>) => { success: boolean; store?: KiranaStore; message: string };
  resetToDemoState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('CUSTOMER');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  
  const [stores, setStores] = useState<KiranaStore[]>(() => {
    const saved = localStorage.getItem('kc_stores');
    return saved ? JSON.parse(saved) : INITIAL_KIRANA_STORES;
  });

  const [parcels, setParcels] = useState<Parcel[]>(() => {
    const saved = localStorage.getItem('kc_parcels');
    return saved ? JSON.parse(saved) : INITIAL_PARCELS;
  });

  const [payoutLogs, setPayoutLogs] = useState<PayoutLog[]>(() => {
    const saved = localStorage.getItem('kc_payouts');
    return saved ? JSON.parse(saved) : INITIAL_PAYOUT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeStoreId, setActiveStoreId] = useState<string>('store-1');
  const [activeTrackingNumber, setActiveTrackingNumber] = useState<string>('KC-70091-KOL');

  useEffect(() => {
    localStorage.setItem('kc_stores', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem('kc_parcels', JSON.stringify(parcels));
  }, [parcels]);

  useEffect(() => {
    localStorage.setItem('kc_payouts', JSON.stringify(payoutLogs));
  }, [payoutLogs]);

  // Delivery Rider drops parcel at Kirana
  const dropParcelAtKirana = (parcelId: string, proofPhotoUrl?: string) => {
    const parcel = parcels.find((p) => p.id === parcelId);
    if (!parcel) return { success: false, message: 'Parcel not found' };

    const store = stores.find((s) => s.id === parcel.kiranaStoreId);
    if (!store) return { success: false, message: 'Assigned Kirana store not found' };

    if (store.currentCapacity >= store.maxCapacity) {
      return { success: false, message: `Store ${store.storeName} is at maximum capacity (${store.maxCapacity}/${store.maxCapacity})!` };
    }

    const defaultPhoto = proofPhotoUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80';

    // Update parcel state
    setParcels((prev) =>
      prev.map((p) =>
        p.id === parcelId
          ? {
              ...p,
              status: 'DROPPED_AT_KIRANA',
              droppedAt: new Date().toISOString(),
              dropProofPhoto: defaultPhoto,
            }
          : p
      )
    );

    // Increment store capacity
    setStores((prev) =>
      prev.map((s) =>
        s.id === store.id ? { ...s, currentCapacity: s.currentCapacity + 1 } : s
      )
    );

    // Push Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      recipientPhone: parcel.customerPhone,
      title: '📦 Parcel Ready for Pickup!',
      message: `Your package ${parcel.trackingNumber} has arrived at ${store.storeName}. Show OTP: ${parcel.pickupOtp} to collect.`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'WHATSAPP',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return { success: true, message: `Parcel dropped successfully at ${store.storeName}!` };
  };

  // Kirana Merchant validates Customer OTP/QR and releases package
  const verifyAndReleaseParcel = (parcelId: string, inputCode: string) => {
    const parcel = parcels.find((p) => p.id === parcelId);
    if (!parcel) return { success: false, message: 'Parcel not found' };

    if (parcel.status !== 'DROPPED_AT_KIRANA') {
      return {
        success: false,
        message: `Cannot release parcel. Current status is ${parcel.status.replace(/_/g, ' ')}.`,
      };
    }

    const validation = validatePickupHandoff(inputCode, parcel);
    if (!validation.isValid) {
      return { success: false, message: validation.message };
    }

    const store = stores.find((s) => s.id === parcel.kiranaStoreId);
    const commissionEarned = store ? store.commissionRate : 15.0;

    // Update parcel to COLLECTED
    setParcels((prev) =>
      prev.map((p) =>
        p.id === parcelId
          ? {
              ...p,
              status: 'COLLECTED',
              collectedAt: new Date().toISOString(),
              pickupProofPhoto: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=500&auto=format&fit=crop&q=80',
            }
          : p
      )
    );

    // Decrement capacity & Credit ₹15 commission to Kirana
    setStores((prev) =>
      prev.map((s) =>
        s.id === parcel.kiranaStoreId
          ? {
              ...s,
              currentCapacity: Math.max(0, s.currentCapacity - 1),
              walletBalance: s.walletBalance + commissionEarned,
              totalParcelsHandled: s.totalParcelsHandled + 1,
            }
          : s
      )
    );

    // Celebrate with confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    return {
      success: true,
      method: validation.method,
      message: `Verified via ${validation.method}! Parcel released & ₹${commissionEarned} credited to merchant wallet.`,
    };
  };

  // UPI Payout Withdrawal for Kirana Owner
  const requestUpiWithdrawal = (storeId: string, amount: number, upiId: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (!store) return { success: false, message: 'Store not found' };

    if (amount <= 0 || amount > store.walletBalance) {
      return { success: false, message: 'Invalid withdrawal amount or insufficient balance.' };
    }

    setStores((prev) =>
      prev.map((s) =>
        s.id === storeId ? { ...s, walletBalance: s.walletBalance - amount } : s
      )
    );

    const newPayout: PayoutLog = {
      id: `pay-${Date.now()}`,
      kiranaStoreId: storeId,
      storeName: store.storeName,
      amount,
      upiId,
      status: 'SUCCESS',
      referenceId: `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      timestamp: new Date().toISOString(),
    };

    setPayoutLogs((prev) => [newPayout, ...prev]);

    return {
      success: true,
      message: `₹${amount} withdrawn successfully to UPI ID: ${upiId}. Ref: ${newPayout.referenceId}`,
    };
  };

  // Admin creates & dispatches a new order with auto-matching
  const createAndDispatchParcel = (orderData: Partial<Parcel>) => {
    const pincode = orderData.destinationPincode || '700091';
    const coords = orderData.destinationCoords || { latitude: 22.5815, longitude: 88.4385 };

    // Run smart matching algorithm
    const matchResults = findBestKiranaStores(coords, pincode, stores);
    const bestMatch = matchResults.find((m) => m.hasCapacity && m.store.isVerified);

    if (!bestMatch) {
      return {
        success: false,
        message: 'No available Kirana store with capacity in this region!',
      };
    }

    const parcelId = `parcel-${Date.now().toString().slice(-4)}`;
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    const trackingNo = `KC-${Math.floor(10000 + Math.random() * 90000)}-IN`;

    const newParcel: Parcel = {
      id: parcelId,
      trackingNumber: trackingNo,
      orderId: orderData.orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: orderData.customerName || 'Priya Patel',
      customerPhone: orderData.customerPhone || '+91 98765 01928',
      destinationAddress: orderData.destinationAddress || 'Flat 4B, Shivalik Apartments',
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
      pickupOtp: randomCode,
      qrToken: `KC-AUTH-${randomCode}-${Date.now().toString(36).toUpperCase()}`,
      packageSize: orderData.packageSize || 'SMALL',
      packageItem: orderData.packageItem || 'Noise Smart Watch ColorFit Pro 4',
      estimatedPrice: orderData.estimatedPrice || 2199,
    };

    setParcels((prev) => [newParcel, ...prev]);
    setActiveTrackingNumber(newParcel.trackingNumber);

    return {
      success: true,
      parcel: newParcel,
      message: `Order assigned to nearest hub "${bestMatch.store.storeName}" (${bestMatch.distanceKm} km away).`,
    };
  };

  const registerKiranaStore = (storeData: Partial<KiranaStore>) => {
    const newStore: KiranaStore = {
      id: `store-${Date.now().toString().slice(-3)}`,
      storeName: storeData.storeName || 'New Partner Kirana',
      ownerName: storeData.ownerName || 'Store Manager',
      phone: storeData.phone || '+91 98000 00000',
      pincode: storeData.pincode || '110024',
      address: storeData.address || 'Main Road',
      city: storeData.city || 'New Delhi',
      latitude: storeData.latitude || 28.5670,
      longitude: storeData.longitude || 77.2430,
      maxCapacity: storeData.maxCapacity || 40,
      currentCapacity: 0,
      walletBalance: 0,
      commissionRate: 15.0,
      isVerified: true,
      openTime: storeData.openTime || '08:00 AM',
      closeTime: storeData.closeTime || '10:00 PM',
      photoUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=500&auto=format&fit=crop&q=80',
      rating: 5.0,
      totalParcelsHandled: 0,
    };

    setStores((prev) => [...prev, newStore]);
    return { success: true, store: newStore, message: `Store "${newStore.storeName}" registered & verified!` };
  };

  const resetToDemoState = () => {
    setStores(INITIAL_KIRANA_STORES);
    setParcels(INITIAL_PARCELS);
    setPayoutLogs(INITIAL_PAYOUT_LOGS);
    setNotifications([]);
    setActiveTrackingNumber('KC-70091-KOL');
    setActiveStoreId('store-1');
    localStorage.removeItem('kc_stores');
    localStorage.removeItem('kc_parcels');
    localStorage.removeItem('kc_payouts');
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        language,
        setLanguage,
        stores,
        parcels,
        payoutLogs,
        notifications,
        activeStoreId,
        setActiveStoreId,
        activeTrackingNumber,
        setActiveTrackingNumber,
        dropParcelAtKirana,
        verifyAndReleaseParcel,
        requestUpiWithdrawal,
        createAndDispatchParcel,
        registerKiranaStore,
        resetToDemoState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
