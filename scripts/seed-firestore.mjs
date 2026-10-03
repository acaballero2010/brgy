import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8zQ4TwpFveC_itnHEZa38OcwCLAmmsL0",
  authDomain: "pamplona-uno-portal.firebaseapp.com",
  projectId: "pamplona-uno-portal",
  storageBucket: "pamplona-uno-portal.firebasestorage.app",
  messagingSenderId: "359664018180",
  appId: "1:359664018180:web:f00d088c23079de29c6651",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("Seeding Firestore for Barangay Pamplona Uno Portal...");

  // 1. Preset Document Requests
  const documentRequests = [
    {
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
      pickupRequirements: "FREE for Indigent residents. Present 1 valid ID or Barangay Voter ID at Window 3.",
      submittedAt: "Yesterday, 2:00 PM",
      lastUpdatedAt: "Today, 09:00 AM",
    },
    {
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
    },
    {
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
    },
    {
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
    }
  ];

  for (const docReq of documentRequests) {
    await setDoc(doc(db, "document_requests", docReq.trackingCode), docReq);
    console.log(`✓ Seeded document request: ${docReq.trackingCode}`);
  }

  // 2. PUTODA Drivers
  const drivers = [
    {
      id: "drv-001",
      userId: "usr-drv-01",
      fullName: "Mang Danilo 'Danny' Ramos",
      phone: "0917-888-4421",
      todaAssociation: "Pamplona Uno TODA (PUTODA)",
      bodyNumber: "T-042",
      licenseNo: "N02-14-089241",
      isOnline: true,
      currentPurok: "Purok 1 (Riverside Terminal)",
      ratingAverage: 4.95,
      totalCompletedRides: 1420,
      isVerifiedByBarangay: true,
    },
    {
      id: "drv-002",
      userId: "usr-drv-02",
      fullName: "Kuya Reynaldo 'Rey' Santos",
      phone: "0918-777-3312",
      todaAssociation: "Pamplona Uno TODA (PUTODA)",
      bodyNumber: "T-018",
      licenseNo: "N01-18-043912",
      isOnline: true,
      currentPurok: "Purok 5 (Central Market)",
      ratingAverage: 4.88,
      totalCompletedRides: 890,
      isVerifiedByBarangay: true,
    }
  ];

  for (const drv of drivers) {
    await setDoc(doc(db, "drivers", drv.id), drv);
    console.log(`✓ Seeded PUTODA driver: ${drv.fullName} (${drv.bodyNumber})`);
  }

  // 3. System Config (Emergency Alert)
  await setDoc(doc(db, "system_config", "emergency_alert"), {
    id: "alert-2026-04",
    isActive: true,
    level: "WARNING",
    title: "Orange Rainfall Warning & Heavy Flooding Advisory",
    message: "PAGASA Alert: Severe localized thunderstorms expected. Low-lying areas in Purok 2, 4, and Riverside are advised to prepare for preemptive evacuation if waters rise.",
    issuedAt: "Today, 2:30 PM",
    source: "MDRRMO / PAGASA",
    actionRequired: "Evacuation Center open at Barangay Multi-Purpose Gymnasium. Hotline: 0917-555-4321",
  });
  console.log("✓ Seeded emergency alert config.");

  console.log("🎉 Firestore successfully seeded for Barangay Pamplona Uno!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
