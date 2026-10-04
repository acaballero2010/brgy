import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  limit,
  serverTimestamp,
  Unsubscribe
} from "firebase/firestore";
import { db } from "./client";
import { Ride, Driver, RideStatus, FareDiscountType } from "@/types/economy";
import { calculateTodaFare, MOCK_PUTODA_DRIVERS } from "@/lib/economy-data";

const COLLECTION_NAME = "rides";

/**
 * Creates a new TODA ride request in Firestore.
 */
export async function createFirestoreRide(payload: {
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  pickupPurok: string;
  pickupLandmark: string;
  dropoffPurok: string;
  dropoffLandmark: string;
  discountType: FareDiscountType;
}): Promise<Ride> {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const trackingCode = `PUTODA-2026-${randomSuffix}`;
  const customId = `ride-${Date.now()}`;
  const fareResult = calculateTodaFare(payload.pickupPurok, payload.dropoffPurok, payload.discountType);
  const now = new Date().toISOString();

  const newRide: Ride = {
    id: customId,
    trackingCode,
    passengerId: payload.passengerId,
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
    discountType: payload.discountType,
    status: "REQUESTED",
    requestedAt: now,
  };

  try {
    const docRef = doc(db, COLLECTION_NAME, customId);
    await setDoc(docRef, {
      ...newRide,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Firestore ride create error, falling back locally:", error);
  }

  return newRide;
}

/**
 * Subscribes to real-time status updates of a specific ride using onSnapshot.
 */
export function subscribeToRide(
  rideId: string,
  onUpdate: (ride: Ride) => void
): Unsubscribe {
  try {
    const docRef = doc(db, COLLECTION_NAME, rideId);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          onUpdate({
            id: snapshot.id,
            trackingCode: data.trackingCode,
            passengerId: data.passengerId,
            passengerName: data.passengerName,
            passengerPhone: data.passengerPhone,
            driverId: data.driverId || null,
            driver: data.driver || null,
            pickupPurok: data.pickupPurok,
            pickupLandmark: data.pickupLandmark,
            dropoffPurok: data.dropoffPurok,
            dropoffLandmark: data.dropoffLandmark,
            estimatedDistanceKm: Number(data.estimatedDistanceKm) || 1.4,
            fareAmount: Number(data.fareAmount) || 30,
            discountType: data.discountType || "REGULAR",
            status: data.status as RideStatus,
            requestedAt: data.requestedAt || new Date().toISOString(),
            acceptedAt: data.acceptedAt,
            completedAt: data.completedAt,
          });
        }
      },
      (err) => {
        console.warn("Firestore ride subscription error:", err);
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to ride:", err);
    return () => {};
  }
}

/**
 * Subscribes to pending ride requests for PUTODA drivers on duty.
 */
export function subscribeToIncomingRides(
  onUpdate: (rides: Ride[]) => void
): Unsubscribe {
  try {
    const ridesRef = collection(db, COLLECTION_NAME);
    const q = query(
      ridesRef,
      where("status", "==", "REQUESTED"),
      limit(10)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const rides = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            trackingCode: data.trackingCode,
            passengerId: data.passengerId,
            passengerName: data.passengerName,
            passengerPhone: data.passengerPhone,
            driverId: data.driverId || null,
            driver: data.driver || null,
            pickupPurok: data.pickupPurok,
            pickupLandmark: data.pickupLandmark,
            dropoffPurok: data.dropoffPurok,
            dropoffLandmark: data.dropoffLandmark,
            estimatedDistanceKm: Number(data.estimatedDistanceKm) || 1.4,
            fareAmount: Number(data.fareAmount) || 30,
            discountType: data.discountType || "REGULAR",
            status: data.status as RideStatus,
            requestedAt: data.requestedAt || new Date().toISOString(),
          } as Ride;
        });
        onUpdate(rides);
      },
      (err) => {
        console.warn("Firestore driver rides subscription error:", err);
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to incoming rides:", err);
    return () => {};
  }
}

/**
 * Driver accepts a ride request on Firestore.
 */
export async function acceptRideInFirestore(
  rideId: string,
  driver: Driver = MOCK_PUTODA_DRIVERS[0]
): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, rideId);
    await updateDoc(docRef, {
      status: "ACCEPTED",
      driverId: driver.id,
      driver,
      acceptedAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.warn("Failed to accept ride in Firestore:", err);
    return false;
  }
}

/**
 * Updates trip progress (ARRIVED_AT_PICKUP, IN_TRANSIT, COMPLETED, CANCELLED).
 */
export async function updateRideStatusInFirestore(
  rideId: string,
  status: RideStatus
): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, rideId);
    const updates: Record<string, unknown> = {
      status,
      updatedAt: serverTimestamp(),
    };
    if (status === "COMPLETED") {
      updates.completedAt = new Date().toISOString();
    }
    await updateDoc(docRef, updates);
    return true;
  } catch (err) {
    console.warn("Failed to update ride status in Firestore:", err);
    return false;
  }
}
