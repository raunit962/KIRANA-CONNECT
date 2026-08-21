import { KiranaStore, Parcel, PayoutLog } from '../models/types';

export class Database {
  private stores: KiranaStore[] = [
    {
      id: 'store-1',
      storeName: 'Ghosh Brothers Daily Provisions & Kirana',
      ownerName: 'Subhashish Ghosh',
      phone: '+91 98301 23456',
      pincode: '700091',
      address: 'Shop 8, Near Webel More, Sector V, Salt Lake',
      city: 'Kolkata',
      latitude: 22.5804,
      longitude: 88.4378,
      maxCapacity: 40,
      currentCapacity: 12,
      walletBalance: 1850.0,
      commissionRate: 15.0,
      isVerified: true,
      openTime: '07:00 AM',
      closeTime: '10:30 PM',
      photoUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=500&auto=format&fit=crop&q=80',
      rating: 4.9,
      totalParcelsHandled: 412,
    },
    {
      id: 'store-2',
      storeName: 'Maa Tara Super Mart & Stationers',
      ownerName: 'Debabrata Banerjee',
      phone: '+91 98312 88901',
      pincode: '700091',
      address: 'Plot EP & GP, Near College More & RDB Boulevard, Sector V',
      city: 'Kolkata',
      latitude: 22.5835,
      longitude: 88.4320,
      maxCapacity: 50,
      currentCapacity: 28,
      walletBalance: 3420.0,
      commissionRate: 15.0,
      isVerified: true,
      openTime: '07:30 AM',
      closeTime: '11:00 PM',
      photoUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80',
      rating: 4.8,
      totalParcelsHandled: 640,
    },
    {
      id: 'store-3',
      storeName: 'Mukherjee Variety Store',
      ownerName: 'Sourav Mukherjee',
      phone: '+91 98360 44321',
      pincode: '700091',
      address: 'Near SDF Building, Block GP, Sector V',
      city: 'Kolkata',
      latitude: 22.5768,
      longitude: 88.4345,
      maxCapacity: 35,
      currentCapacity: 9,
      walletBalance: 1200.0,
      commissionRate: 15.0,
      isVerified: true,
      openTime: '08:00 AM',
      closeTime: '10:00 PM',
      photoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
      rating: 4.7,
      totalParcelsHandled: 215,
    },
  ];

  private parcels: Parcel[] = [
    {
      id: 'parcel-101',
      trackingNumber: 'KC-70091-KOL',
      orderId: 'FLIP-9821734',
      customerName: 'Anirban Chatterjee',
      customerPhone: '+91 98300 12894',
      destinationAddress: 'Tower 3, Godrej Waterside, Sector V, Salt Lake',
      destinationPincode: '700091',
      destinationCoords: { latitude: 22.5815, longitude: 88.4385 },
      kiranaStoreId: 'store-1',
      agentId: 'agent-1',
      agentName: 'Tapas Sen (Shadowfax / Delhivery Rider)',
      agentPhone: '+91 98302 99881',
      status: 'DROPPED_AT_KIRANA',
      orderedAt: '2026-08-20T14:30:00Z',
      dispatchedAt: '2026-08-21T08:15:00Z',
      droppedAt: '2026-08-21T10:05:00Z',
      expiryDate: '2026-08-23T23:59:59Z',
      pickupOtp: '4892',
      qrToken: 'KC-AUTH-7009-2026-XPQ',
      dropProofPhoto: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80',
      packageSize: 'SMALL',
      packageItem: 'boAt Airdopes 141 Bluetooth Earbuds',
      estimatedPrice: 1299,
    },
    {
      id: 'parcel-102',
      trackingNumber: 'KC-55104-KOL',
      orderId: 'AMZN-4491028',
      customerName: 'Sneha Sengupta',
      customerPhone: '+91 98311 55672',
      destinationAddress: 'Millennium City IT Park, DN Block, Sector V',
      destinationPincode: '700091',
      destinationCoords: { latitude: 22.5842, longitude: 88.4330 },
      kiranaStoreId: 'store-2',
      agentId: 'agent-1',
      agentName: 'Tapas Sen (Shadowfax / Delhivery Rider)',
      agentPhone: '+91 98302 99881',
      status: 'IN_TRANSIT',
      orderedAt: '2026-08-20T18:45:00Z',
      dispatchedAt: '2026-08-21T09:20:00Z',
      expiryDate: '2026-08-23T23:59:59Z',
      pickupOtp: '7315',
      qrToken: 'KC-AUTH-5510-2026-MNV',
      packageSize: 'MEDIUM',
      packageItem: 'Philips Air Fryer HD9200',
      estimatedPrice: 4999,
    }
  ];

  private payouts: PayoutLog[] = [
    {
      id: 'pay-001',
      kiranaStoreId: 'store-1',
      storeName: 'Ghosh Brothers Daily Provisions & Kirana',
      amount: 1500.0,
      upiId: 'subhashishghosh@okhdfcbank',
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
