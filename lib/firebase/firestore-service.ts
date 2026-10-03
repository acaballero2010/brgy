import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
  Unsubscribe
} from "firebase/firestore";
import { db } from "./client";
import { StoredDocumentRequest } from "@/lib/document-store";
import { Ride, MarketplaceItem } from "@/types/economy";

/**
 * Persists an official document request to Cloud Firestore
 */
export async function saveDocumentRequestToFirestore(request: StoredDocumentRequest): Promise<void> {
  try {
    const docRef = doc(db, "document_requests", request.trackingCode);
    await setDoc(docRef, {
      ...request,
      updatedAtFirestore: serverTimestamp(),
    }, { merge: true });
    console.log(`[FIRESTORE] Document request ${request.trackingCode} saved to Cloud Firestore.`);
  } catch (err) {
    console.warn("[FIRESTORE] Failed to save document request:", err);
  }
}

/**
 * Retrieves a document request from Cloud Firestore by tracking code
 */
export async function getDocumentRequestFromFirestore(trackingCode: string): Promise<StoredDocumentRequest | null> {
  try {
    const docRef = doc(db, "document_requests", trackingCode.toUpperCase());
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as StoredDocumentRequest;
    }
  } catch (err) {
    console.warn("[FIRESTORE] Failed to fetch document request:", err);
  }
  return null;
}

/**
 * Persists an incident report to Cloud Firestore
 */
export async function saveIncidentReportToFirestore(report: {
  trackingCode: string;
  category: string;
  purok: string;
  landmark?: string;
  title: string;
  description: string;
  isAnonymous: boolean;
  reporterName?: string;
  reporterPhone?: string;
  uploadedImageUrl?: string;
}): Promise<void> {
  try {
    const docRef = doc(db, "incident_reports", report.trackingCode);
    await setDoc(docRef, {
      ...report,
      status: "OPEN",
      tanodDispatchStatus: "DISPATCHED",
      createdAtFirestore: serverTimestamp(),
    });
    console.log(`[FIRESTORE] Incident ticket ${report.trackingCode} saved to Cloud Firestore.`);
  } catch (err) {
    console.warn("[FIRESTORE] Failed to save incident report:", err);
  }
}

/**
 * Real-time listener for TODA Ride requests
 */
export function subscribeToTodaRides(
  callback: (rides: Ride[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "rides"),
    orderBy("requestedAt", "desc"),
    limit(20)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const rides: Ride[] = [];
      snapshot.forEach((doc) => {
        rides.push(doc.data() as Ride);
      });
      callback(rides);
    },
    (err) => {
      console.warn("[FIRESTORE] Ride subscription error:", err);
    }
  );
}

/**
 * Persists a TODA Ride request to Cloud Firestore
 */
export async function saveTodaRideToFirestore(ride: Ride): Promise<void> {
  try {
    const docRef = doc(db, "rides", ride.id);
    await setDoc(docRef, {
      ...ride,
      updatedAtFirestore: serverTimestamp(),
    }, { merge: true });
    console.log(`[FIRESTORE] Ride ${ride.trackingCode} saved to Cloud Firestore.`);
  } catch (err) {
    console.warn("[FIRESTORE] Failed to save ride:", err);
  }
}

/**
 * Updates a TODA Ride status in Cloud Firestore
 */
export async function updateTodaRideInFirestore(
  rideId: string,
  updates: Partial<Ride>
): Promise<void> {
  try {
    const docRef = doc(db, "rides", rideId);
    await updateDoc(docRef, {
      ...updates,
      updatedAtFirestore: serverTimestamp(),
    });
  } catch (err) {
    console.warn("[FIRESTORE] Failed to update ride:", err);
  }
}

/**
 * Real-time listener for Community Marketplace items
 */
export function subscribeToMarketplaceItems(
  callback: (items: MarketplaceItem[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "marketplace_items"),
    orderBy("createdAt", "desc"),
    limit(30)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: MarketplaceItem[] = [];
      snapshot.forEach((doc) => {
        items.push(doc.data() as MarketplaceItem);
      });
      callback(items);
    },
    (err) => {
      console.warn("[FIRESTORE] Marketplace subscription error:", err);
    }
  );
}

/**
 * Persists a Marketplace listing to Cloud Firestore
 */
export async function saveMarketplaceItemToFirestore(item: MarketplaceItem): Promise<void> {
  try {
    const docRef = doc(db, "marketplace_items", item.id);
    await setDoc(docRef, {
      ...item,
      createdAtFirestore: serverTimestamp(),
    }, { merge: true });
    console.log(`[FIRESTORE] Item ${item.title} saved to Cloud Firestore.`);
  } catch (err) {
    console.warn("[FIRESTORE] Failed to save marketplace item:", err);
  }
}
