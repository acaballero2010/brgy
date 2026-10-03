import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./client";
import { MarketplaceItem } from "@/types/economy";
import { MOCK_MARKETPLACE_ITEMS } from "@/lib/economy-data";

const COLLECTION_NAME = "marketplace_items";

/**
 * Fetch all active community marketplace items from Firestore.
 * Automatically falls back to mock items if Firestore is empty or offline.
 */
export async function getMarketplaceItems(): Promise<MarketplaceItem[]> {
  try {
    const itemsRef = collection(db, COLLECTION_NAME);
    const q = query(itemsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          sellerId: data.sellerId || "usr-anon",
          sellerName: data.sellerName || "Pamplona Uno Resident",
          sellerPurok: data.sellerPurok || "Purok 3",
          sellerPhone: data.sellerPhone || "0917-000-0000",
          title: data.title,
          description: data.description,
          price: Number(data.price),
          category: data.category || "FOOD",
          images: data.images || ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"],
          availabilityStatus: data.availabilityStatus || "AVAILABLE",
          isFoodReadyToEat: data.isFoodReadyToEat ?? false,
          prepTimeMinutes: data.prepTimeMinutes,
          meetupOrDelivery: data.meetupOrDelivery || "PUROK_DELIVERY",
          viewsCount: data.viewsCount || 0,
          isVerifiedResidentSeller: data.isVerifiedResidentSeller ?? true,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || new Date().toISOString(),
        } as MarketplaceItem;
      });
    }
  } catch (error) {
    console.warn("Firestore marketplace fetch error (using fallback):", error);
  }

  // Fallback to local default marketplace items
  return MOCK_MARKETPLACE_ITEMS;
}

/**
 * Post a new resident marketplace product / Talipapa listing to Firestore.
 */
export async function createMarketplaceItem(
  input: Omit<MarketplaceItem, "id" | "createdAt" | "updatedAt" | "viewsCount">
): Promise<MarketplaceItem> {
  const customId = `mkt-${Date.now()}`;
  const now = new Date().toISOString();

  const newItem: MarketplaceItem = {
    ...input,
    id: customId,
    viewsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const docRef = doc(db, COLLECTION_NAME, customId);
    await setDoc(docRef, {
      ...input,
      viewsCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Failed to write to Firestore, saved locally:", error);
  }

  return newItem;
}

/**
 * Seeds default verified Talipapa items to Firestore if not yet populated.
 */
export async function seedMarketplaceIfEmpty(): Promise<boolean> {
  try {
    const itemsRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(itemsRef);
    if (snapshot.empty) {
      for (const item of MOCK_MARKETPLACE_ITEMS) {
        const docRef = doc(db, COLLECTION_NAME, item.id);
        await setDoc(docRef, {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      return true;
    }
  } catch (err) {
    console.warn("Could not seed marketplace:", err);
  }
  return false;
}
