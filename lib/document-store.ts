export type DocumentStatus = "SUBMITTED" | "UNDER_REVIEW" | "READY_FOR_PICKUP" | "RELEASED" | "REJECTED";

export interface StoredDocumentRequest {
  trackingCode: string;
  documentType: "clearance" | "indigency" | "residency" | "business";
  documentTitle: string;
  fullName: string;
  purok: string;
  streetAddress?: string;
  mobileNumber: string;
  yearsOfResidency: number;
  purpose: string;
  additionalNotes?: string;
  idPhotoName?: string;
  idPhotoPreview?: string;
  status: DocumentStatus;
  fee: string;
  pickupRequirements: string;
  submittedAt: string;
  lastUpdatedAt: string;
  timeline: {
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
    current?: boolean;
  }[];
}

export const PRESET_TRACKING_ITEMS: Record<string, StoredDocumentRequest> = {
  "BRGY-2026-SUBM": {
    trackingCode: "BRGY-2026-SUBM",
    documentType: "clearance",
    documentTitle: "Barangay Clearance",
    fullName: "Juan Dela Cruz",
    purok: "Purok 1 (Riverside)",
    mobileNumber: "0917-123-4567",
    yearsOfResidency: 5,
    purpose: "Local Job Employment Requirement",
    status: "SUBMITTED",
    fee: "₱50.00",
    pickupRequirements: "Bring 1 valid government ID and ₱50 documentary stamp fee at Window 2.",
    submittedAt: "Today, 10:15 AM",
    lastUpdatedAt: "Today, 10:15 AM",
    timeline: [
      {
        title: "Application Submitted",
        description: "Request received via citizen portal. Queued for desk clerk review.",
        timestamp: "Today, 10:15 AM",
        completed: true,
        current: true,
      },
      {
        title: "Staff & Records Verification",
        description: "Checking Purok residency records and blotter clearance.",
        timestamp: "Pending",
        completed: false,
      },
      {
        title: "Captain Review & Signature",
        description: "Affixing official dry seal and digital barcode.",
        timestamp: "Pending",
        completed: false,
      },
      {
        title: "Ready for Pickup",
        description: "Signed document ready at Barangay Hall Window 2.",
        timestamp: "Pending",
        completed: false,
      },
    ],
  },
  "BRGY-2026-REVW": {
    trackingCode: "BRGY-2026-REVW",
    documentType: "residency",
    documentTitle: "Certificate of Residency",
    fullName: "Elena Bautista",
    purok: "Purok 4 (Mabuhay)",
    mobileNumber: "0918-555-9012",
    yearsOfResidency: 8,
    purpose: "Public High School Enrollment Proof",
    status: "UNDER_REVIEW",
    fee: "₱30.00",
    pickupRequirements: "Bring 1 valid ID and ₱30 processing fee at Window 1.",
    submittedAt: "Today, 08:30 AM",
    lastUpdatedAt: "Today, 11:20 AM",
    timeline: [
      {
        title: "Application Submitted",
        description: "Request received via citizen portal.",
        timestamp: "Today, 08:30 AM",
        completed: true,
      },
      {
        title: "Staff & Records Verification",
        description: "Verified in Purok 4 Registry by Clerk Mary Jane.",
        timestamp: "Today, 11:20 AM",
        completed: true,
        current: true,
      },
      {
        title: "Captain Review & Signature",
        description: "Endorsed for Punong Barangay approval.",
        timestamp: "In progress",
        completed: false,
      },
      {
        title: "Ready for Pickup",
        description: "Signed document ready at Barangay Hall Window 1.",
        timestamp: "Pending",
        completed: false,
      },
    ],
  },
  "BRGY-2026-PKUP": {
    trackingCode: "BRGY-2026-PKUP",
    documentType: "indigency",
    documentTitle: "Certificate of Indigency",
    fullName: "Maria Teresa Ramos",
    purok: "Purok 2 (Sampaguita)",
    mobileNumber: "0920-888-2345",
    yearsOfResidency: 12,
    purpose: "DSWD Hospitalization Medical Assistance",
    status: "READY_FOR_PICKUP",
    fee: "FREE (Walang Bayad)",
    pickupRequirements: "FREE for Indigent residents. Present 1 valid ID or Barangay Voter ID at Window 3 (Social Welfare Desk).",
    submittedAt: "Yesterday, 2:00 PM",
    lastUpdatedAt: "Today, 09:00 AM",
    timeline: [
      {
        title: "Application Submitted",
        description: "Request received via citizen portal.",
        timestamp: "Yesterday, 2:00 PM",
        completed: true,
      },
      {
        title: "Staff & Records Verification",
        description: "Purok Indigency classification confirmed.",
        timestamp: "Yesterday, 3:30 PM",
        completed: true,
      },
      {
        title: "Captain Review & Signature",
        description: "Approved and sealed by Hon. Roberto Hernandez.",
        timestamp: "Yesterday, 4:45 PM",
        completed: true,
      },
      {
        title: "Ready for Pickup",
        description: "Ready at Window 3 (Social Welfare & Express Lane).",
        timestamp: "Today, 09:00 AM",
        completed: true,
        current: true,
      },
    ],
  },
  "BRGY-2026-RELS": {
    trackingCode: "BRGY-2026-RELS",
    documentType: "clearance",
    documentTitle: "Barangay Clearance",
    fullName: "Carlos Mendoza",
    purok: "Purok 5 (Central)",
    mobileNumber: "0922-333-8899",
    yearsOfResidency: 3,
    purpose: "Postal ID & Passport Renewal",
    status: "RELEASED",
    fee: "₱50.00 (PAID)",
    pickupRequirements: "Document has been released to requestor.",
    submittedAt: "April 01, 2026",
    lastUpdatedAt: "April 02, 2026, 03:15 PM",
    timeline: [
      {
        title: "Application Submitted",
        description: "Request received via citizen portal.",
        timestamp: "April 01, 2026, 09:10 AM",
        completed: true,
      },
      {
        title: "Staff & Records Verification",
        description: "Residency and records cleared.",
        timestamp: "April 01, 2026, 11:00 AM",
        completed: true,
      },
      {
        title: "Captain Review & Signature",
        description: "Signed and dry seal affixed.",
        timestamp: "April 01, 2026, 02:00 PM",
        completed: true,
      },
      {
        title: "Released to Requestor",
        description: "Claimed and signed in release logbook by Carlos Mendoza.",
        timestamp: "April 02, 2026, 03:15 PM",
        completed: true,
        current: true,
      },
    ],
  },
};

export function getDocumentPickupInfo(type: string) {
  switch (type.toLowerCase()) {
    case "clearance":
      return {
        title: "Barangay Clearance",
        fee: "₱50.00",
        requirements: "Bring 1 valid government ID (or Student/Voter ID) and ₱50 documentary stamp fee at Window 2.",
      };
    case "indigency":
      return {
        title: "Certificate of Indigency",
        fee: "FREE (Walang Bayad)",
        requirements: "FREE for Indigent residents. Present 1 valid ID or Barangay Voter ID at Window 3 (Social Welfare Desk).",
      };
    case "residency":
      return {
        title: "Certificate of Residency",
        fee: "₱30.00",
        requirements: "Bring 1 valid ID and ₱30 processing fee at Window 1.",
      };
    default:
      return {
        title: "Barangay Certificate",
        fee: "₱50.00",
        requirements: "Bring 1 valid government-issued ID to the Barangay Secretariat.",
      };
  }
}

export function saveRequestToStorage(req: StoredDocumentRequest) {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(localStorage.getItem("brgy_requests") || "{}");
    existing[req.trackingCode] = req;
    localStorage.setItem("brgy_requests", JSON.stringify(existing));
  } catch {
    // Ignore storage quota
  }
}

export function getRequestFromStorage(code: string): StoredDocumentRequest | null {
  const normalized = code.trim().toUpperCase();
  if (PRESET_TRACKING_ITEMS[normalized]) {
    return PRESET_TRACKING_ITEMS[normalized];
  }
  if (typeof window === "undefined") return null;
  try {
    const existing = JSON.parse(localStorage.getItem("brgy_requests") || "{}");
    return existing[normalized] || null;
  } catch {
    return null;
  }
}
