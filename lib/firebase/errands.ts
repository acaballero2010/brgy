import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  Unsubscribe
} from "firebase/firestore";
import { db } from "./client";
import { Errand, ErrandItem, ErrandStatus } from "@/types/economy";

const COLLECTION_NAME = "errands";

/**
 * Creates a new Pabili / Padala errand request in Firestore.
 */
export async function createFirestoreErrand(payload: {
  requesterId: string;
  requesterName: string;
  requesterPhone: string;
  errandType: "PABILI" | "PADALA";
  storeName: string;
  storeLocationOrPurok: string;
  deliveryPurok: string;
  deliveryAddress: string;
  itemsList: ErrandItem[];
  specialInstructions?: string;
}): Promise<Errand> {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const trackingCode = `PABILI-2026-${randomSuffix}`;
  const customId = `errand-${Date.now()}`;
  const now = new Date().toISOString();

  const estimatedBudget = payload.itemsList.reduce(
    (sum, item) => sum + (Number(item.estimatedPrice) || 0),
    0
  );
  const serviceFee = 40; // Standard Pamplona Uno intra-purok delivery fee

  const newErrand: Errand = {
    id: customId,
    trackingCode,
    requesterId: payload.requesterId,
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
    requestedAt: now,
  };

  try {
    const docRef = doc(db, COLLECTION_NAME, customId);
    await setDoc(docRef, {
      ...newErrand,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Firestore errand create error, falling back:", err);
  }

  return newErrand;
}

/**
 * Real-time subscription to an errand's progression.
 */
export function subscribeToErrand(
  errandId: string,
  onUpdate: (errand: Errand) => void
): Unsubscribe {
  try {
    const docRef = doc(db, COLLECTION_NAME, errandId);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          onUpdate({
            id: snapshot.id,
            trackingCode: data.trackingCode,
            requesterId: data.requesterId,
            requesterName: data.requesterName,
            requesterPhone: data.requesterPhone,
            runnerId: data.runnerId || null,
            runnerName: data.runnerName,
            runnerPhone: data.runnerPhone,
            errandType: data.errandType || "PABILI",
            storeName: data.storeName,
            storeLocationOrPurok: data.storeLocationOrPurok,
            deliveryPurok: data.deliveryPurok,
            deliveryAddress: data.deliveryAddress,
            itemsList: data.itemsList || [],
            estimatedBudget: Number(data.estimatedBudget) || 0,
            actualReceiptTotal: data.actualReceiptTotal,
            serviceFee: Number(data.serviceFee) || 40,
            totalPayableAmount: Number(data.totalPayableAmount) || 0,
            status: data.status as ErrandStatus,
            specialInstructions: data.specialInstructions,
            requestedAt: data.requestedAt || new Date().toISOString(),
            assignedAt: data.assignedAt,
            completedAt: data.completedAt,
          });
        }
      },
      (err) => {
        console.warn("Firestore errand subscription error:", err);
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to errand:", err);
    return () => {};
  }
}

/**
 * Runner assigns and updates errand progress.
 */
export async function updateErrandStatusInFirestore(
  errandId: string,
  status: ErrandStatus,
  runnerDetails?: { runnerId: string; runnerName: string; runnerPhone: string }
): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_NAME, errandId);
    const updates: Record<string, unknown> = {
      status,
      updatedAt: serverTimestamp(),
    };
    if (runnerDetails) {
      updates.runnerId = runnerDetails.runnerId;
      updates.runnerName = runnerDetails.runnerName;
      updates.runnerPhone = runnerDetails.runnerPhone;
      updates.assignedAt = new Date().toISOString();
    }
    if (status === "DELIVERED") {
      updates.completedAt = new Date().toISOString();
    }
    await updateDoc(docRef, updates);
    return true;
  } catch (err) {
    console.warn("Failed to update errand status in Firestore:", err);
    return false;
  }
}
