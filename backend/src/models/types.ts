export type UserRole = 'CUSTOMER' | 'AGENT' | 'MERCHANT' | 'ADMIN';

export type ParcelStatus = 
  | 'ORDERED'
  | 'IN_TRANSIT'
  | 'DROPPED_AT_KIRANA'
  | 'COLLECTED'
  | 'RETURNED_TO_ORIGIN';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface KiranaStore {
  id: string;
  storeName: string;
  ownerName: string;
  phone: string;
  pincode: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  maxCapacity: number;
  currentCapacity: number;
  walletBalance: number;
  commissionRate: number; // ₹15 per parcel
  isVerified: boolean;
  openTime: string;
  closeTime: string;
  photoUrl: string;
  rating: number;
  totalParcelsHandled: number;
}

export interface Parcel {
  id: string;
  trackingNumber: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  destinationAddress: string;
  destinationPincode: string;
  destinationCoords: Coordinates;
  kiranaStoreId: string;
  agentId?: string;
  agentName?: string;
  agentPhone?: string;
  status: ParcelStatus;
  orderedAt: string;
  dispatchedAt?: string;
  droppedAt?: string;
  collectedAt?: string;
  expiryDate: string;
  pickupOtp: string;
  qrToken: string;
  dropProofPhoto?: string;
  pickupProofPhoto?: string;
  packageSize: 'SMALL' | 'MEDIUM' | 'LARGE';
  packageItem: string;
  estimatedPrice: number;
}

export interface PayoutLog {
  id: string;
  kiranaStoreId: string;
  storeName: string;
  amount: number;
  upiId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  referenceId: string;
  timestamp: string;
}
