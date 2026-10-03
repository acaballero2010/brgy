/**
 * Hyper-Local Economic Module Type Definitions
 * Barangay Pamplona Uno, Las Piñas City
 *
 * Covers:
 * 1. Ride-Hailing (TODA Dispatch)
 * 2. Pabili / Padala (Errands & Delivery)
 * 3. Community Marketplace (Food, Goods, Services)
 * 4. Barangay Job Board (Gigs & Local Hiring)
 */

// ==========================================
// 1. TODA Ride-Hailing Module
// ==========================================

export type RideStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "ARRIVED_AT_PICKUP"
  | "IN_TRANSIT"
  | "COMPLETED"
  | "CANCELLED";

export type FareDiscountType = "REGULAR" | "SENIOR_CITIZEN" | "STUDENT" | "PWD";

export interface Driver {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  todaAssociation: string; // e.g., "Pamplona Uno TODA (PUTODA)"
  bodyNumber: string; // e.g., "T-042"
  licenseNo: string;
  isOnline: boolean;
  currentPurok: string;
  latitude?: number;
  longitude?: number;
  franchiseExpiryDate: string;
  ratingAverage: number;
  totalCompletedRides: number;
  isVerifiedByBarangay: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ride {
  id: string;
  trackingCode: string; // e.g., "RIDE-2026-X8K9"
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  driverId?: string | null;
  driver?: Driver | null;
  pickupPurok: string;
  pickupLandmark: string;
  dropoffPurok: string;
  dropoffLandmark: string;
  estimatedDistanceKm: number;
  fareAmount: number; // In Philippine Peso (₱)
  discountType: FareDiscountType;
  status: RideStatus;
  cancellationReason?: string;
  cancelledBy?: "PASSENGER" | "DRIVER" | "TIMEOUT";
  requestedAt: string;
  acceptedAt?: string;
  completedAt?: string;
}

// ==========================================
// 2. Pabili / Padala (Errands & Delivery)
// ==========================================

export type ErrandStatus =
  | "REQUESTED"
  | "ASSIGNED"
  | "PURCHASING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface ErrandItem {
  name: string;
  quantity: string | number;
  estimatedPrice?: number;
  brandOrNote?: string;
}

export interface Errand {
  id: string;
  trackingCode: string; // e.g., "PABILI-2026-N491"
  requesterId: string;
  requesterName: string;
  requesterPhone: string;
  runnerId?: string | null;
  runnerName?: string;
  runnerPhone?: string;
  errandType: "PABILI" | "PADALA";
  storeName: string;
  storeLocationOrPurok: string;
  deliveryPurok: string;
  deliveryAddress: string;
  itemsList: ErrandItem[];
  estimatedBudget: number;
  actualReceiptTotal?: number;
  serviceFee: number; // e.g., ₱40 standard purok delivery fee
  totalPayableAmount?: number; // estimatedBudget + serviceFee
  receiptPhotoUrl?: string;
  status: ErrandStatus;
  specialInstructions?: string;
  requestedAt: string;
  assignedAt?: string;
  completedAt?: string;
}

// ==========================================
// 3. Community Marketplace (Talipapa & Food)
// ==========================================

export type MarketplaceCategory = "FOOD" | "GOODS" | "SERVICES";

export type MarketplaceItemStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "OUT_OF_STOCK"
  | "ARCHIVED";

export interface MarketplaceItem {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPurok: string;
  sellerPhone: string;
  title: string;
  description: string;
  price: number; // In Philippine Peso (₱)
  category: MarketplaceCategory;
  images: string[];
  availabilityStatus: MarketplaceItemStatus;
  isFoodReadyToEat?: boolean;
  prepTimeMinutes?: number;
  meetupOrDelivery: "PICKUP_ONLY" | "PUROK_DELIVERY" | "MEETUP";
  viewsCount: number;
  isVerifiedResidentSeller: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 4. Barangay Job Board (Gigs & Local Hiring)
// ==========================================

export type GigType = "ONE_TIME" | "PART_TIME" | "FULL_TIME";

export type JobStatus = "OPEN" | "IN_PROGRESS" | "FILLED" | "EXPIRED";

export type ContactMode = "PHONE_CALL" | "SMS_TEXT" | "BARANGAY_DESK";

export interface JobPosting {
  id: string;
  employerId: string;
  employerName: string;
  title: string;
  description: string;
  gigType: GigType;
  rateType: "PER_PROJECT" | "PER_DAY" | "PER_HOUR";
  rateAmount: number; // In Philippine Peso (₱)
  purok: string;
  landmark: string;
  contactMode: ContactMode;
  contactNumber: string;
  requiredSkills: string[];
  status: JobStatus;
  applicantsCount: number;
  expiresAt: string;
  createdAt: string;
}

// ==========================================
// Real-Time Dispatch Event Payloads
// ==========================================

export type DispatchEventType =
  | "RIDE_BROADCAST_REQUESTED"
  | "RIDE_DRIVER_ACCEPTED"
  | "RIDE_STATUS_UPDATED"
  | "ERRAND_ASSIGNED"
  | "ERRAND_RECEIPT_UPLOADED"
  | "DRIVER_LOCATION_PING";

export interface RideDispatchEvent {
  eventType: DispatchEventType;
  rideId: string;
  driverId?: string;
  passengerId: string;
  status: RideStatus;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
}
