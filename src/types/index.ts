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
  commissionRate: number; // e.g. 15 for ₹15/parcel
  isVerified: boolean;
  openTime: string;
  closeTime: string;
  photoUrl: string;
  rating: number;
  totalParcelsHandled: number;
}

export interface Parcel {
  id: string;
  trackingNumber: string; // e.g. "KC-84920-DL"
  orderId: string; // E-commerce ref e.g. "FLIP-902148"
  customerName: string;
  customerPhone: string;
  destinationAddress: string;
  destinationPincode: string;
  destinationCoords: Coordinates;
  
  // Assigned Kirana Hub
  kiranaStoreId: string;
  
  // Delivery Agent
  agentId?: string;
  agentName?: string;
  agentPhone?: string;

  // Status & Timestamps
  status: ParcelStatus;
  orderedAt: string;
  dispatchedAt?: string;
  droppedAt?: string;
  collectedAt?: string;
  expiryDate: string; // 48-72h limit

  // Security & Proofs
  pickupOtp: string; // 4-digit code e.g. "5821"
  qrToken: string; // Cryptographic unique token e.g. "KC-QR-98AF23E"
  dropProofPhoto?: string; // Image URL of delivery agent drop
  pickupProofPhoto?: string; // Image URL of customer pickup

  packageSize: 'SMALL' | 'MEDIUM' | 'LARGE';
  packageItem: string; // e.g. "boAt Airdopes 141 Headphones"
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

export interface NotificationItem {
  id: string;
  recipientPhone: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'SMS' | 'WHATSAPP' | 'SYSTEM';
  read: boolean;
}
