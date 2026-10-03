import { EmergencyContact, FeedPost, OfflineCacheSnapshot } from "@/types/portal";
import { EMERGENCY_CONTACTS, MOCK_ANNOUNCEMENTS } from "@/lib/data";

const OFFLINE_CACHE_KEY = "brgy_offline_cache_v1";

/**
 * Saves Emergency Hotlines and the 10 latest bulletins to localStorage.
 */
export function saveOfflineSnapshot(
  hotlines: EmergencyContact[] = EMERGENCY_CONTACTS,
  bulletins?: FeedPost[]
): OfflineCacheSnapshot {
  if (typeof window === "undefined") {
    return {
      version: "1.0",
      cachedAt: new Date().toISOString(),
      hotlines,
      latestBulletins: [],
    };
  }

  // If bulletins not provided, use the 10 latest mock announcements
  const postsToCache: FeedPost[] = (bulletins || MOCK_ANNOUNCEMENTS).slice(0, 10).map((b, i) => ({
    ...b,
    publishedTimestamp: Date.now() - i * 86400000,
  }));

  const snapshot: OfflineCacheSnapshot = {
    version: "1.0",
    cachedAt: new Date().toISOString(),
    hotlines,
    latestBulletins: postsToCache,
  };

  try {
    localStorage.setItem(OFFLINE_CACHE_KEY, JSON.stringify(snapshot));
    console.log(
      `[OFFLINE CACHE] Cached ${hotlines.length} hotlines & ${postsToCache.length} bulletins to localStorage.`
    );
  } catch (err) {
    console.warn("[OFFLINE CACHE] Storage quota exceeded or disabled", err);
  }

  return snapshot;
}

/**
 * Retrieves the cached Emergency Hotlines and 10 bulletins from localStorage.
 * Falls back to default constants if storage is empty.
 */
export function getOfflineSnapshot(): OfflineCacheSnapshot {
  if (typeof window === "undefined") {
    return {
      version: "1.0",
      cachedAt: new Date().toISOString(),
      hotlines: EMERGENCY_CONTACTS,
      latestBulletins: MOCK_ANNOUNCEMENTS.slice(0, 10).map((b, i) => ({
        ...b,
        publishedTimestamp: Date.now() - i * 86400000,
      })),
    };
  }

  try {
    const raw = localStorage.getItem(OFFLINE_CACHE_KEY);
    if (raw) {
      const parsed: OfflineCacheSnapshot = JSON.parse(raw);
      if (parsed?.hotlines && parsed?.latestBulletins) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[OFFLINE CACHE] Failed to read from localStorage", err);
  }

  // Initialize cache if absent
  return saveOfflineSnapshot();
}
