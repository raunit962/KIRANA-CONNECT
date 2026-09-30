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
  // Amazon MyHub & Store Delivery Extensions
  deliveryRadiusKm?: number; // e.g. 2.5 km
  hasStoreHelper?: boolean;
  helperName?: string;
  helperPhone?: string;
  doorstepDeliveryRate?: number; // e.g. ₹25 - ₹30 per delivery
  upiId?: string;
  cctvInstalled?: boolean;
  storageType?: string;
  gstin?: string;
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
  company?: string; // e.g. "Flipkart Logistics", "Amazon Transportation", "Delhivery"
  packageDimensions?: string; // e.g. "24 × 18 × 8 cm"
  packageWeight?: string; // e.g. "0.85 kg"
  serialTag?: string; // e.g. "TAG-70091-01A"
  shelfSlot?: string; // e.g. "A-01"
  category?: ParcelCategory;

  // HyperLocal Delivery Preference (Amazon Hub Delivery Model)
  deliveryPreference?: 'SELF_PICKUP' | 'STORE_DOORSTEP';
  deliverySlot?: string; // e.g. "Evening 7:00 PM - 9:00 PM"
  assignedHelperName?: string; // e.g. "Ramesh Kumar (Store Helper)"
  assignedHelperPhone?: string;
  doorstepDeliveryFee?: number; // e.g. ₹30
  doorstepDeliveredAt?: string;
}

export type ParcelCategory = 
  | 'ELECTRONICS_FRAGILE'
  | 'APPAREL_SKINCARE'
  | 'BOOKS_DOCUMENTS'
  | 'HOME_KITCHEN'
  | 'HEALTH_BABY_ESSENTIALS';

export interface ParcelCategoryConfig {
  id: ParcelCategory;
  name: string;
  nameHindi: string;
  colorName: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  slotBg: string;
  slotBorder: string;
  slotHoverBg: string;
  slotText: string;
  dotColor: string;
  ringColor: string;
  icon: string;
  tagColor: string;
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

export interface UserSession {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  storeId?: string;
  storeName?: string;
  agentId?: string;
  carrier?: string;
  avatarUrl?: string;
  loggedInAt: string;
}
