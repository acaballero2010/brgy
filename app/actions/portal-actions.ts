"use server";

import { unstable_cache, revalidateTag } from "next/cache";
import { MOCK_ANNOUNCEMENTS } from "@/lib/data";
import {
  FeedPost,
  FeedPostsQuery,
  FeedPostsResponse,
  DocumentRequestPayload,
  DocumentRequestResponse,
  IssueReportPayload,
  IssueReportResponse
} from "@/types/portal";
import { getDocumentPickupInfo } from "@/lib/document-store";
import { sendApplicationReceivedSms } from "@/lib/services/sms-service";
import { uploadIncidentProofToCloud } from "@/lib/services/cloud-storage";

// In-memory data store for server-rendered session persistence
// (Simulates PostgreSQL database table)
const SERVER_POSTS: FeedPost[] = MOCK_ANNOUNCEMENTS.map((item, index) => ({
  ...item,
  publishedTimestamp: Date.now() - index * 86400000,
}));

const SERVER_DOCUMENT_REQUESTS: Record<string, unknown> = {};
const SERVER_INCIDENT_REPORTS: Record<string, unknown> = {};

/**
 * 1. getFeedPosts(category, limit, cursor)
 * Cached with Incremental Static Regeneration (ISR) and revalidation tags.
 */
export async function getFeedPosts(
  query: FeedPostsQuery = {}
): Promise<FeedPostsResponse> {
  const { category = "All", limit = 4, cursor = null } = query;

  // Next.js ISR cached fetcher with revalidation tags
  const getCachedPosts = unstable_cache(
    async (cat: string, pageLimit: number, currentCursor: string | null) => {
      let filtered = SERVER_POSTS;

      if (cat && cat !== "All") {
        filtered = filtered.filter(
          (p) => p.category.toLowerCase() === cat.toLowerCase()
        );
      }

      // Sort by newest publication timestamp
      filtered = [...filtered].sort(
        (a, b) => b.publishedTimestamp - a.publishedTimestamp
      );

      // Apply cursor pagination
      let startIndex = 0;
      if (currentCursor) {
        const cursorIndex = filtered.findIndex((p) => p.id === currentCursor);
        if (cursorIndex !== -1) {
          startIndex = cursorIndex + 1;
        }
      }

      const paginated = filtered.slice(startIndex, startIndex + pageLimit);
      const nextItem = filtered[startIndex + pageLimit];
      const nextCursor = nextItem ? nextItem.id : null;
      const hasMore = startIndex + pageLimit < filtered.length;

      return {
        posts: paginated,
        nextCursor,
        hasMore,
        totalCount: filtered.length,
        cachedAt: new Date().toISOString(),
      };
    },
    ["feed-posts-cache", category, String(limit), cursor || "start"],
    {
      revalidate: 60, // ISR: 60 seconds background revalidation
      tags: ["bulletins", `bulletins-${category.toLowerCase()}`],
    }
  );

  return getCachedPosts(category, limit, cursor);
}

/**
 * 2. submitDocumentRequest(data)
 * Server Action: Validates payload, saves document request,
 * triggers automated SMS notification template, and revalidates cache.
 */
export async function submitDocumentRequest(
  payload: DocumentRequestPayload
): Promise<DocumentRequestResponse> {
  // Validate basic required fields
  if (!payload.fullName || !payload.mobileNumber || !payload.purok) {
    throw new Error("Missing required resident details.");
  }

  // Generate standardized Philippine tracking reference code (e.g. BRGY-2026-X8K9)
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const trackingCode = `BRGY-2026-${randomSuffix}`;

  const pickupInfo = getDocumentPickupInfo(payload.documentType);

  // Trigger automated SMS template notification
  const smsResult = await sendApplicationReceivedSms(
    payload.mobileNumber,
    payload.fullName,
    pickupInfo.title,
    trackingCode
  );

  // Persist to database
  SERVER_DOCUMENT_REQUESTS[trackingCode] = {
    trackingCode,
    ...payload,
    fee: pickupInfo.fee,
    pickupRequirements: pickupInfo.requirements,
    status: "SUBMITTED",
    smsNotificationId: smsResult.messageId,
    createdAt: new Date().toISOString(),
  };

  // Invalidate any cached document queues
  revalidateTag("document-requests", "default");

  return {
    success: true,
    trackingCode,
    documentTitle: pickupInfo.title,
    fee: pickupInfo.fee,
    pickupRequirements: pickupInfo.requirements,
    smsNotification: smsResult,
    createdAt: new Date().toISOString(),
  };
}

/**
 * 3. submitIssueReport(data)
 * Server Action: Validates incident, uploads photo to cloud storage bucket,
 * dispatches notice to Barangay Tanod, and persists incident ticket.
 */
export async function submitIssueReport(
  payload: IssueReportPayload
): Promise<IssueReportResponse> {
  if (!payload.category || !payload.title || !payload.description || !payload.purok) {
    throw new Error("Missing required incident details.");
  }

  // 1. Upload photo to Cloud Storage if provided
  let uploadedImageUrl: string | undefined = undefined;
  if (payload.imageFile) {
    const uploadResult = await uploadIncidentProofToCloud(
      payload.imageFile,
      payload.category
    );
    uploadedImageUrl = uploadResult.fileUrl;
  }

  // 2. Generate incident reference code (e.g. RPT-2026-T48L)
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const trackingCode = `RPT-2026-${randomSuffix}`;

  // 3. Persist incident ticket
  SERVER_INCIDENT_REPORTS[trackingCode] = {
    trackingCode,
    category: payload.category,
    purok: payload.purok,
    landmark: payload.landmark,
    title: payload.title,
    description: payload.description,
    isAnonymous: payload.isAnonymous,
    reporterName: payload.isAnonymous ? "Anonymous Citizen" : payload.reporterName,
    reporterPhone: payload.isAnonymous ? undefined : payload.reporterPhone,
    uploadedImageUrl,
    tanodDispatchStatus: "DISPATCHED",
    createdAt: new Date().toISOString(),
  };

  console.log(`[TANOD DISPATCH ALERT] -> New ${payload.category} at ${payload.purok} logged (${trackingCode})`);

  // 4. Invalidate public feed cache
  revalidateTag("incident-reports", "default");

  return {
    success: true,
    trackingCode,
    category: payload.category,
    purok: payload.purok,
    uploadedImageUrl,
    tanodDispatchStatus: "DISPATCHED",
    createdAt: new Date().toISOString(),
  };
}
