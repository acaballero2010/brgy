export interface EmergencyAlert {
  id: string;
  isActive: boolean;
  level: "ADVISORY" | "WARNING" | "CRITICAL";
  title: string;
  message: string;
  issuedAt: string;
  source: string;
  actionRequired: string;
}

export interface OperatingStatus {
  isOpenToday: boolean;
  statusText: string;
  officeHours: string;
  serviceAdvisory?: string;
  officerOnDuty: string;
}

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  category: "Ordinances" | "Health" | "Utilities" | "Events" | "General";
  priority: "NORMAL" | "IMPORTANT" | "URGENT";
  excerpt: string;
  content: string[];
  coverImage?: string;
  publishedAt: string;
  author: string;
  authorRole: string;
  readTime: string;
  attachments?: {
    name: string;
    size: string;
    type: string;
    url: string;
  }[];
  tags: string[];
}

export const CURRENT_EMERGENCY_ALERT: EmergencyAlert = {
  id: "alert-2026-04",
  isActive: true,
  level: "WARNING",
  title: "Orange Rainfall Warning & Heavy Flooding Advisory",
  message: "PAGASA Alert: Severe localized thunderstorms expected. Low-lying areas in Purok 2, 4, and Riverside are advised to prepare for preemptive evacuation if waters rise.",
  issuedAt: "Today, 2:30 PM",
  source: "MDRRMO / PAGASA",
  actionRequired: "Evacuation Center open at Barangay Multi-Purpose Gymnasium. Hotline: 0917-555-4321",
};

export const TODAY_OPERATING_STATUS: OperatingStatus = {
  isOpenToday: true,
  statusText: "Barangay Hall Open Today",
  officeHours: "8:00 AM - 5:00 PM (Monday to Friday)",
  serviceAdvisory: "Express Lane for Senior Citizens & PWDs active at Desk 1.",
  officerOnDuty: "Hon. Kagawad Ramon Dela Cruz (Officer of the Day)",
};

export const DISASTER_STATUS = {
  level: "SIGNAL NO. 1",
  color: "amber",
  summary: "Tropical Depression Preparedness Mode",
  monitoredAreas: "Riverside Purok 2 & Lowland Purok 5",
  lastUpdated: "Updated 35 mins ago",
};

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-001",
    title: "Barangay Ordinance No. 2026-03: Proper Solid Waste Segregation & Penalties",
    slug: "proper-solid-waste-segregation-ordinance-2026-03",
    category: "Ordinances",
    priority: "IMPORTANT",
    excerpt: "Strict implementation of the 'No Segregation, No Collection' policy across all 7 Puroks starting next Monday. Violation fines and community service guidelines detailed.",
    content: [
      "In compliance with Republic Act 9003 (Ecological Solid Waste Management Act of 2000), the Sangguniang Barangay of Pamplona Uno unanimously enacted Ordinance No. 2026-03 during its regular session on March 15, 2026.",
      "Effective next Monday, garbage collectors will strictly reject unsegregated waste bins. Households and commercial establishments must segregate their garbage into: (1) Biodegradable / Nabubulok, (2) Recyclable / Nareresiklo, (3) Residual / Di-nabubulok, and (4) Special Household Hazardous Waste.",
      "First offense warrants a written notice and required attendance at the Barangay Ecological Seminar. Subsequent violations will incur administrative fines starting at ₱500 up to ₱2,500, or 8 hours of community environmental service.",
      "For questions regarding color-coded collection schedules per Purok, please refer to the attached schedule PDF or consult your respective Purok Leaders."
    ],
    publishedAt: "March 28, 2026",
    author: "Hon. Maria Santos",
    authorRole: "Committee on Environmental Protection",
    readTime: "4 min read",
    attachments: [
      {
        name: "Barangay_Ordinance_No_2026_03_Full_Text.pdf",
        size: "1.4 MB",
        type: "PDF Document",
        url: "#"
      },
      {
        name: "Purok_Garbage_Collection_Schedule_2026.pdf",
        size: "420 KB",
        type: "PDF Document",
        url: "#"
      }
    ],
    tags: ["Waste Management", "Ordinance", "Environment", "Purok Guidelines"]
  },
  {
    id: "ann-002",
    title: "Free Measles, Rubella & Polio Catch-Up Vaccination for Children Aged 0-59 Months",
    slug: "free-measles-rubella-polio-catchup-vaccination",
    category: "Health",
    priority: "URGENT",
    excerpt: "The Barangay Health Center in partnership with the City Health Department conducts house-to-house and clinic-based supplemental immunization for all toddlers and infants.",
    content: [
      "Protect your children against life-threatening preventable diseases. The Barangay Health Station is holding a comprehensive Immunization Caravan starting Wednesday, April 1 to April 10, 2026.",
      "Parents and guardians are encouraged to bring their child's Baby Book / Immunization Card (ECCD). Children without existing cards will be registered and provided an official record on site.",
      "Barangay Health Workers (BHWs) will also visit Purok 3, 5, and 6 for house-to-house inoculations for families unable to visit the central clinic.",
      "Vitamin A supplements and deworming tablets will also be administered free of charge to eligible children."
    ],
    publishedAt: "April 01, 2026",
    author: "Dra. Carmen Mendoza, MD",
    authorRole: "Municipal Health Officer & BHW Supervisor",
    readTime: "3 min read",
    attachments: [
      {
        name: "Childhood_Vaccination_Caravan_Flyer.pdf",
        size: "890 KB",
        type: "PDF Document",
        url: "#"
      }
    ],
    tags: ["Health Center", "Vaccination", "Children Health", "BHW"]
  },
  {
    id: "ann-003",
    title: "Meralco Scheduled Power Interruption for Facility Upgrades & Tree Trimming",
    slug: "meralco-scheduled-power-interruption-notice-april",
    category: "Utilities",
    priority: "IMPORTANT",
    excerpt: "Temporary power service interruption on Thursday from 9:00 AM to 3:00 PM affecting Purok 1, Purok 2, and parts of the National Highway for pole replacement.",
    content: [
      "Please be advised that the Manila Electric Company (MERALCO) has notified the Barangay Council of a scheduled maintenance operation on Thursday, April 9, 2026, from 9:00 AM to 3:00 PM.",
      "The scheduled work involves the replacement of aging wooden poles with reinforced concrete poles, insulation improvements, and hazardous tree branch clearing near primary 34.5kV distribution lines.",
      "Affected Areas: Entire Purok 1 (Riverside Lane), Purok 2 (Sampaguita Street), and Commercial Establishments along National Highway (Km 42 to Km 44).",
      "Residents are advised to charge essential devices, unplug sensitive electrical appliances, and ensure sufficient water supply as booster pumps may be temporarily offline during maintenance."
    ],
    publishedAt: "April 02, 2026",
    author: "Barangay Public Information Office",
    authorRole: "PIO Pamplona Uno",
    readTime: "2 min read",
    attachments: [
      {
        name: "Meralco_Official_Maintenance_Advisory.pdf",
        size: "540 KB",
        type: "PDF Document",
        url: "#"
      }
    ],
    tags: ["Power Advisory", "Utilities", "Maintenance"]
  },
  {
    id: "ann-004",
    title: "Annual Pamplona Uno Youth Inter-Purok Basketball & Volleyball League 2026",
    slug: "annual-inter-purok-sports-league-registration-open",
    category: "Events",
    priority: "NORMAL",
    excerpt: "Registration is now open for the Sangguniang Kabataan (SK) Inter-Purok Summer Sports Tournament. Men's Basketball (15-21) and Women's Volleyball (15-24).",
    content: [
      "The Sangguniang Kabataan of Barangay Pamplona Uno proudly invites all resident youth to participate in the upcoming 2026 Inter-Purok Sports Tournament aimed at fostering camaraderie and healthy living.",
      "Categories include Men's Junior Division (Ages 15-18), Men's Senior Division (Ages 19-24), and Women's Open Volleyball (Ages 15-24).",
      "Registration forms are available at the SK Office (2nd Floor, Barangay Hall) or can be submitted through your respective Purok SK Representatives until April 15, 2026.",
      "Opening ceremonies and parade will be held on Saturday, April 18, 2026, 3:00 PM at the Barangay Gymnasium with special guest sports ambassadors."
    ],
    publishedAt: "March 25, 2026",
    author: "Hon. Joshua Bautista",
    authorRole: "SK Chairperson",
    readTime: "3 min read",
    attachments: [
      {
        name: "SK_League_Rules_and_Team_Roster_Form.pdf",
        size: "720 KB",
        type: "PDF Document",
        url: "#"
      }
    ],
    tags: ["SK", "Sports", "Youth", "Events"]
  },
  {
    id: "ann-005",
    title: "TUPAD Livelihood Assistance Payout Schedule for Displaced & Seasonal Workers",
    slug: "tupad-livelihood-assistance-payout-schedule",
    category: "General",
    priority: "IMPORTANT",
    excerpt: "DOLE-TUPAD beneficiaries for Batch 1 are requested to present valid government IDs and DTI/Barangay enrollment stubs for the payroll disbursement this Friday.",
    content: [
      "In coordination with the Department of Labor and Employment (DOLE) and the Office of the Representative, the first tranche of the Tulong Panghanapbuhay sa Ating Disadvantaged/Displaced Workers (TUPAD) payout will proceed this Friday, April 10, 2026.",
      "Venue: Barangay Pamplona Uno Covered Court. Time: 8:30 AM to 1:00 PM.",
      "Requirements: Original Government-issued Photo ID (or Barangay ID), signed timesheets / accomplishment forms, and your personal beneficiary slip with QR reference.",
      "Beneficiaries who completed the 10-day community sanitation and drainage declogging program will receive the mandated statutory allowance of ₱5,350 directly from the authorized payment disbursing officers."
    ],
    publishedAt: "April 03, 2026",
    author: "Barangay Social Welfare Desk",
    authorRole: "Community Development Office",
    readTime: "3 min read",
    attachments: [
      {
        name: "TUPAD_Batch_1_Masterlist_PamplonaUno.pdf",
        size: "1.1 MB",
        type: "PDF Document",
        url: "#"
      }
    ],
    tags: ["DOLE", "TUPAD", "Livelihood", "Financial Assistance"]
  },
  {
    id: "ann-006",
    title: "Senior Citizens Pension Verification & Biometrics Updating at Hall Annex",
    slug: "senior-citizens-pension-verification-schedule",
    category: "Health",
    priority: "NORMAL",
    excerpt: "Office of Senior Citizens Affairs (OSCA) is conducting the mandatory validation of local and national social pension beneficiaries.",
    content: [
      "All registered Senior Citizens residing in Barangay Pamplona Uno are reminded of the annual biometrics and life verification process for the National Social Pension for Indigent Senior Citizens (SPISC).",
      "Seniors or authorized relatives with representative authorizations may visit the Senior Citizen Hall Annex from April 14 to April 20, 2026, 9:00 AM to 3:00 PM.",
      "Bedridden senior citizens will be visited by the Barangay Home-Care Verification Team. Relatives should coordinate with their Purok Leader to book home verification."
    ],
    publishedAt: "March 20, 2026",
    author: "Nanay Remedios Ramos",
    authorRole: "OSCA Barangay Representative",
    readTime: "2 min read",
    tags: ["Senior Citizens", "OSCA", "Social Welfare"]
  }
];

export const QUICK_SERVICES = [
  {
    id: "clearance",
    title: "Barangay Clearance",
    description: "For employment, postal ID, bank requirements, and general administrative clearance.",
    processingTime: "15-30 Mins (Express)",
    fee: "₱50.00",
    href: "/services/request/clearance",
    icon: "FileCheck",
    badge: "Most Requested"
  },
  {
    id: "indigency",
    title: "Certificate of Indigency",
    description: "For medical assistance, scholarship applications, DSWD AID, and court waivers.",
    processingTime: "Same Day",
    fee: "FREE (Walang Bayad)",
    href: "/services/request/indigency",
    icon: "HeartHandshake",
    badge: "100% Free"
  },
  {
    id: "residency",
    title: "Certificate of Residency",
    description: "Proof of residence for passport, school enrollment, utility transfers, and NBI clearance.",
    processingTime: "15 Mins",
    fee: "₱30.00",
    href: "/services/request/residency",
    icon: "Home",
    badge: "Standard"
  },
  {
    id: "business",
    title: "Barangay Business Clearance",
    description: "Initial permit or renewal for sari-sari stores, commercial spaces, and home enterprises.",
    processingTime: "1-2 Business Days",
    fee: "From ₱200.00",
    href: "/services/request/business",
    icon: "Briefcase",
    badge: "Commercial"
  }
];

export const EMERGENCY_CONTACTS = [
  {
    title: "Barangay Tanod Emergency Patrol",
    number: "0917-555-8266",
    available: "24/7 Patrol",
    category: "tanod"
  },
  {
    title: "Barangay Health Center Clinic",
    number: "(02) 8555-1234",
    available: "8AM - 5PM Daily",
    category: "health"
  },
  {
    title: "PNP Community Precinct Substation",
    number: "117 / (02) 8922-3344",
    available: "24/7 Emergency",
    category: "police"
  },
  {
    title: "BFP Fire Protection Station",
    number: "160 / 0922-888-3473",
    available: "24/7 Dispatch",
    category: "fire"
  }
];
