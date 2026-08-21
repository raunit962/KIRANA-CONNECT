import { KiranaStore, Parcel, PayoutLog } from '../models/types';

export class Database {
  private stores: KiranaStore[] = [
    {
      id: 'store-1',
      storeName: 'Gupta General Store & Daily Needs',
      ownerName: 'Ramesh Gupta',
      phone: '+91 98112 34567',
      pincode: '110024',
      address: 'Shop No. 14, Main Market, Lajpat Nagar IV',
      city: 'New Delhi',
      latitude: 28.5672,
      longitude: 77.2435,
      maxCapacity: 40,
      currentCapacity: 12,
      walletBalance: 1850.0,
      commissionRate: 15.0,
      isVerified: true,
      openTime: '07:30 AM',
      closeTime: '10:30 PM',
      photoUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=500&auto=format&fit=crop&q=80',
      rating: 4.8,
      totalParcelsHandled: 342,
    },
    {
      id: 'store-2',
      storeName: 'Shri Balaji Super Mart',
      ownerName: 'Venkat Raman',
      phone: '+91 98450 12890',
      pincode: '560038',
      address: '12th Main Rd, HAL 2nd Stage, Indiranagar',
      city: 'Bengaluru',
      latitude: 12.9719,
      longitude: 77.6412,
      maxCapacity: 50,
      currentCapacity: 28,
      walletBalance: 3420.0,
      commissionRate: 15.0,
      isVerified: true,
      openTime: '08:00 AM',
      closeTime: '11:00 PM',
      photoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80',
      rating: 4.9,
      totalParcelsHandled: 618,
    },
    {
      id: 'store-3',
      storeName: 'Sharmaji Kirana & Stationary',
      ownerName: 'Mahesh Sharma',
      phone: '+91 99201 88472',
      pincode: '110024',
      address: 'B-42, Central Market, Near Metro Gate 2',
      city: 'New Delhi',
      latitude: 28.5701,
      longitude: 77.2410,
      maxCapacity: 30,
      currentCapacity: 8,
      walletBalance: 960.0,
      commissionRate: 15.0,
      isVerified: true,
      openTime: '07:00 AM',
      closeTime: '10:00 PM',
      photoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
      rating: 4.6,
      totalParcelsHandled: 184,
    },
  ];

  private parcels: Parcel[] = [
    {
      id: 'parcel-101',
      trackingNumber: 'KC-84920-DL',
      orderId: 'FLIP-9821734',
      customerName: 'Aarav Mehta',
      customerPhone: '+91 98765 43210',
      destinationAddress: 'Flat 302, Greenview Heights, Lajpat Nagar IV',
      destinationPincode: '110024',
      destinationCoords: { latitude: 28.5685, longitude: 77.2442 },
      kiranaStoreId: 'store-1',
      agentId: 'agent-1',
      agentName: 'Vikram Singh (Shadowfax Rider)',
      agentPhone: '+91 91234 56780',
      status: 'DROPPED_AT_KIRANA',
      orderedAt: '2026-08-20T14:30:00Z',
      dispatchedAt: '2026-08-21T08:15:00Z',
      droppedAt: '2026-08-21T10:05:00Z',
      expiryDate: '2026-08-23T23:59:59Z',
      pickupOtp: '4892',
      qrToken: 'KC-AUTH-8492-2026-XPQ',
      dropProofPhoto: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80',
      packageSize: 'SMALL',
      packageItem: 'boAt Airdopes 141 Bluetooth Earbuds',
      estimatedPrice: 1299,
    },
    {
      id: 'parcel-102',
      trackingNumber: 'KC-39104-BLR',
      orderId: 'AMZN-4491028',
      customerName: 'Pooja Sharma',
      customerPhone: '+91 97412 88901',
      destinationAddress: 'Villa 12, Palm Meadows, Indiranagar',
      destinationPincode: '560038',
      destinationCoords: { latitude: 12.9725, longitude: 77.6425 },
      kiranaStoreId: 'store-2',
      agentId: 'agent-2',
      agentName: 'Rajesh Kumar (Delhivery Agent)',
      agentPhone: '+91 98860 11223',
      status: 'IN_TRANSIT',
      orderedAt: '2026-08-20T18:45:00Z',
      dispatchedAt: '2026-08-21T09:20:00Z',
      expiryDate: '2026-08-23T23:59:59Z',
      pickupOtp: '7315',
      qrToken: 'KC-AUTH-3910-2026-MNV',
      packageSize: 'MEDIUM',
      packageItem: 'Philips Air Fryer HD9200',
      estimatedPrice: 4999,
    }
  ];

  private payouts: PayoutLog[] = [
    {
      id: 'pay-001',
      kiranaStoreId: 'store-1',
      storeName: 'Gupta General Store & Daily Needs',
      amount: 1500.0,
      upiId: 'rameshgupta@okhdfcbank',
      status: 'SUCCESS',
      referenceId: 'UPI-774910284129',
      timestamp: '2026-08-20T19:00:00Z',
    }
  ];

  // Stores
  getStores(): KiranaStore[] {
    return this.stores;
  }

  getStoreById(id: string): KiranaStore | undefined {
    return this.stores.find((s) => s.id === id);
  }

  addStore(store: KiranaStore): KiranaStore {
    this.stores.push(store);
    return store;
  }

  updateStore(id: string, updates: Partial<KiranaStore>): KiranaStore | null {
    const idx = this.stores.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.stores[idx] = { ...this.stores[idx], ...updates };
    return this.stores[idx];
  }

  // Parcels
  getParcels(): Parcel[] {
    return this.parcels;
  }

  getParcelById(id: string): Parcel | undefined {
    return this.parcels.find((p) => p.id === id);
  }

  getParcelByTracking(tracking: string): Parcel | undefined {
    return this.parcels.find((p) => p.trackingNumber === tracking);
  }

  addParcel(parcel: Parcel): Parcel {
    this.parcels.unshift(parcel);
    return parcel;
  }

  updateParcel(id: string, updates: Partial<Parcel>): Parcel | null {
    const idx = this.parcels.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.parcels[idx] = { ...this.parcels[idx], ...updates };
    return this.parcels[idx];
  }

  // Payouts
  getPayouts(): PayoutLog[] {
    return this.payouts;
  }

  addPayout(payout: PayoutLog): PayoutLog {
    this.payouts.unshift(payout);
    return payout;
  }
}

export const db = new Database();
