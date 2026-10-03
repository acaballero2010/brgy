"use server";

import { revalidateTag } from "next/cache";
import {
  Ride,
  Driver,
  Errand,
  MarketplaceItem,
  JobPosting,
  RideStatus,
  FareDiscountType,
  MarketplaceCategory,
  GigType,
  ContactMode
} from "@/types/economy";
import {
  MOCK_PUTODA_DRIVERS,
  MOCK_MARKETPLACE_ITEMS,
  MOCK_JOBS,
  calculateTodaFare
} from "@/lib/economy-data";

// In-memory relational state store for demo session
const STORED_RIDES: Record<string, Ride> = {};
const STORED_ERRANDS: Record<string, Errand> = {};
const STORED_MARKETPLACE: MarketplaceItem[] = [...MOCK_MARKETPLACE_ITEMS];
const STORED_JOBS: JobPosting[] = [...MOCK_JOBS];
const STORED_DRIVERS: Driver[] = [...MOCK_PUTODA_DRIVERS];

/**
 * 1. Book a TODA Ride (Server Action)
 * Calculates statutory fare, locks initial request state,
 * and notifies candidate drivers in the nearest purok terminal.
 */
export async function bookTodaRide(payload: {
  passengerName: string;
  passengerPhone: string;
  pickupPurok: string;
  pickupLandmark: string;
  dropoffPurok: string;
  dropoffLandmark: string;
  discountType?: FareDiscountType;
  passengerCount?: number;
}): Promise<{ success: boolean; ride: Ride }> {
  if (!payload.passengerName || !payload.passengerPhone || !payload.pickupPurok || !payload.dropoffPurok) {
    throw new Error("Missing required trip parameters.");
  }

  const discount = payload.discountType || "REGULAR";
  const fareResult = calculateTodaFare(payload.pickupPurok, payload.dropoffPurok, discount);

  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const trackingCode = `PUTODA-2026-${randomSuffix}`;

  const newRide: Ride = {
    id: `ride-${Date.now()}`,
    trackingCode,
    passengerId: `usr-${Date.now().toString(36)}`,
    passengerName: payload.passengerName,
    passengerPhone: payload.passengerPhone,
    driverId: null,
    driver: null,
    pickupPurok: payload.pickupPurok,
    pickupLandmark: payload.pickupLandmark,
    dropoffPurok: payload.dropoffPurok,
    dropoffLandmark: payload.dropoffLandmark,
    estimatedDistanceKm: 1.4,
    fareAmount: fareResult.fare,
    discountType: discount,
    status: "REQUESTED",
    requestedAt: new Date().toISOString(),
  };

  STORED_RIDES[newRide.id] = newRide;
  STORED_RIDES[trackingCode] = newRide;

  revalidateTag("toda-rides", "default");

  return { success: true, ride: newRide };
}

/**
 * 2. Accept a TODA Ride (Atomic Driver Acceptance)
 * Prevents race conditions: only updates if current status is REQUESTED.
 */
export async function acceptTodaRide(
  rideId: string,
  driverId: string
): Promise<{ success: boolean; message: string; ride?: Ride }> {
  const ride = STORED_RIDES[rideId];
  if (!ride) {
    throw new Error("Trip request not found.");
  }

  if (ride.status !== "REQUESTED") {
    return {
      success: false,
      message: "This trip was already accepted by another PUTODA driver or cancelled.",
    };
  }

  const driver = STORED_DRIVERS.find((d) => d.id === driverId) || STORED_DRIVERS[0];

  ride.status = "ACCEPTED";
  ride.driverId = driver.id;
  ride.driver = driver;
  ride.acceptedAt = new Date().toISOString();

  revalidateTag("toda-rides", "default");

  return {
    success: true,
    message: `Trip accepted! Assigned to Body No. ${driver.bodyNumber} (${driver.fullName})`,
    ride,
  };
}

/**
 * 3. Update Ride Trip Progress
 */
export async function updateRideStatus(
  rideId: string,
  status: RideStatus
): Promise<{ success: boolean; ride: Ride }> {
  const ride = STORED_RIDES[rideId];
  if (!ride) {
    throw new Error("Trip not found.");
  }

  ride.status = status;
  if (status === "COMPLETED") {
    ride.completedAt = new Date().toISOString();
  }

  revalidateTag("toda-rides", "default");
  return { success: true, ride };
}

/**
 * 4. Submit Pabili / Padala Errand Request
 */
export async function submitErrandRequest(payload: {
  requesterName: string;
  requesterPhone: string;
  errandType: "PABILI" | "PADALA";
  storeName: string;
  storeLocationOrPurok: string;
  deliveryPurok: string;
  deliveryAddress: string;
  itemsList: { name: string; quantity: string | number; estimatedPrice?: number }[];
  specialInstructions?: string;
}): Promise<{ success: boolean; errand: Errand }> {
  if (!payload.requesterName || !payload.requesterPhone || !payload.deliveryAddress) {
    throw new Error("Missing required errand details.");
  }

  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const trackingCode = `PABILI-2026-${randomSuffix}`;

  const estimatedBudget = payload.itemsList.reduce(
    (sum, item) => sum + (Number(item.estimatedPrice) || 0),
    0
  );
  const serviceFee = 40; // Standard Purok runner fee

  const newErrand: Errand = {
    id: `errand-${Date.now()}`,
    trackingCode,
    requesterId: `usr-${Date.now().toString(36)}`,
    requesterName: payload.requesterName,
    requesterPhone: payload.requesterPhone,
    runnerId: null,
    errandType: payload.errandType,
    storeName: payload.storeName,
    storeLocationOrPurok: payload.storeLocationOrPurok,
    deliveryPurok: payload.deliveryPurok,
    deliveryAddress: payload.deliveryAddress,
    itemsList: payload.itemsList,
    estimatedBudget,
    serviceFee,
    totalPayableAmount: estimatedBudget + serviceFee,
    status: "REQUESTED",
    specialInstructions: payload.specialInstructions,
    requestedAt: new Date().toISOString(),
  };

  STORED_ERRANDS[newErrand.id] = newErrand;
  STORED_ERRANDS[trackingCode] = newErrand;

  revalidateTag("errands", "default");
  return { success: true, errand: newErrand };
}

/**
 * 5. Create Community Marketplace Listing
 */
export async function createMarketplaceListing(payload: {
  sellerName: string;
  sellerPurok: string;
  sellerPhone: string;
  title: string;
  description: string;
  price: number;
  category: MarketplaceCategory;
  meetupOrDelivery: "PICKUP_ONLY" | "PUROK_DELIVERY" | "MEETUP";
  imageUrl?: string;
}): Promise<{ success: boolean; item: MarketplaceItem }> {
  if (!payload.title || !payload.sellerPhone || payload.price <= 0) {
    throw new Error("Invalid marketplace listing parameters.");
  }

  const newItem: MarketplaceItem = {
    id: `mkt-${Date.now()}`,
    sellerId: `usr-${Date.now().toString(36)}`,
    sellerName: payload.sellerName,
    sellerPurok: payload.sellerPurok,
    sellerPhone: payload.sellerPhone,
    title: payload.title,
    description: payload.description,
    price: payload.price,
    category: payload.category,
    images: payload.imageUrl ? [payload.imageUrl] : ["https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60"],
    availabilityStatus: "AVAILABLE",
    meetupOrDelivery: payload.meetupOrDelivery,
    viewsCount: 1,
    isVerifiedResidentSeller: true,
    createdAt: "Just now",
    updatedAt: "Just now",
  };

  STORED_MARKETPLACE.unshift(newItem);
  revalidateTag("marketplace", "default");

  return { success: true, item: newItem };
}

/**
 * 6. Post Local Barangay Job
 */
export async function postLocalJob(payload: {
  employerName: string;
  title: string;
  description: string;
  gigType: GigType;
  rateType: "PER_PROJECT" | "PER_DAY" | "PER_HOUR";
  rateAmount: number;
  purok: string;
  landmark: string;
  contactMode: ContactMode;
  contactNumber: string;
  requiredSkills: string[];
}): Promise<{ success: boolean; job: JobPosting }> {
  if (!payload.title || !payload.employerName || !payload.contactNumber) {
    throw new Error("Invalid job posting parameters.");
  }

  const newJob: JobPosting = {
    id: `job-${Date.now()}`,
    employerId: `usr-${Date.now().toString(36)}`,
    employerName: payload.employerName,
    title: payload.title,
    description: payload.description,
    gigType: payload.gigType,
    rateType: payload.rateType,
    rateAmount: payload.rateAmount,
    purok: payload.purok,
    landmark: payload.landmark,
    contactMode: payload.contactMode,
    contactNumber: payload.contactNumber,
    requiredSkills: payload.requiredSkills,
    status: "OPEN",
    applicantsCount: 0,
    expiresAt: "In 7 days",
    createdAt: "Just now",
  };

  STORED_JOBS.unshift(newJob);
  revalidateTag("jobs", "default");

  return { success: true, job: newJob };
}
