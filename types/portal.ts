/**
 * TypeScript Interfaces for Barangay Portal Data Fetching,
 * Server Actions, Payloads, and Offline Caching.
 */

export type AnnouncementCategory =
  | "All"
  | "Ordinances"
  | "Health"
  | "Utilities"
  | "Events"
  | "General";

export type PriorityLevel = "NORMAL" | "IMPORTANT" | "URGENT";

export interface FeedPost {
  id: string;
  title: string;
  slug: string;
  category: AnnouncementCategory;
  priority: PriorityLevel;
  excerpt: string;
  content: string[];
  coverImage?: string;
  publishedAt: string;
  publishedTimestamp: number;
  author: string;
  authorRole: string;
  readTime: string;
  tags: string[];
  attachments?: {
    name: string;
    size: string;
    type: string;
    url: string;
  }[];
}

export interface FeedPostsQuery {
  category?: string;
  limit?: number;
  cursor?: string | null; // ID or timestamp cursor for pagination
}

export interface FeedPostsResponse {
  posts: FeedPost[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount: number;
  cachedAt: string;
}

export interface DocumentRequestPayload {
  documentType: "clearance" | "indigency" | "residency" | "business";
  fullName: string;
  purok: string;
  streetAddress?: string;
  mobileNumber: string;
  yearsOfResidency: number;
  purpose: string;
  additionalNotes?: string;
  idPhotoBase64?: string;
}

export interface SmsNotificationTrigger {
  recipient: string;
  message: string;
  senderId: string;
  messageId: string;
  status: "QUEUED" | "SENT" | "DELIVERED";
  timestamp: string;
}

export interface DocumentRequestResponse {
  success: boolean;
  trackingCode: string;
  documentTitle: string;
  fee: string;
  pickupRequirements: string;
  smsNotification: SmsNotificationTrigger;
  createdAt: string;
}

export interface IssueReportPayload {
  category: "Busted Light" | "Noise" | "Drainage" | "Garbage" | "Road Hazard";
  purok: string;
  landmark: string;
  title: string;
  description: string;
  isAnonymous: boolean;
  reporterName?: string;
  reporterPhone?: string;
  imageFile?: File | string; // File or Base64
}

export interface CloudStorageUploadResult {
  fileUrl: string;
  storageProvider: "CloudStorage-S3" | "SupabaseStorage" | "FirebaseStorage";
  fileSizeKb: number;
  mimeType: string;
}

export interface IssueReportResponse {
  success: boolean;
  trackingCode: string;
  category: string;
  purok: string;
  uploadedImageUrl?: string;
  tanodDispatchStatus: "DISPATCHED" | "INVESTIGATING" | "RESOLVED";
  createdAt: string;
}

export interface EmergencyContact {
  title: string;
  number: string;
  available: string;
  category: string;
}

export interface OfflineCacheSnapshot {
  version: string;
  cachedAt: string;
  hotlines: EmergencyContact[];
  latestBulletins: FeedPost[];
}
