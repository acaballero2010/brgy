import { Driver, MarketplaceItem, JobPosting } from "@/types/economy";

export const MOCK_PUTODA_DRIVERS: Driver[] = [
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
    franchiseExpiryDate: "2027-08-30",
    ratingAverage: 4.95,
    totalCompletedRides: 1420,
    isVerifiedByBarangay: true,
    createdAt: "2025-01-10",
    updatedAt: "2026-10-03",
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
    franchiseExpiryDate: "2027-04-15",
    ratingAverage: 4.88,
    totalCompletedRides: 890,
    isVerifiedByBarangay: true,
    createdAt: "2025-03-22",
    updatedAt: "2026-10-03",
  },
  {
    id: "drv-003",
    userId: "usr-drv-03",
    fullName: "Tito Edgardo 'Edgar' Mendoza",
    phone: "0920-555-9988",
    todaAssociation: "Pamplona Uno TODA (PUTODA)",
    bodyNumber: "T-105",
    licenseNo: "N03-12-099411",
    isOnline: true,
    currentPurok: "Purok 6 (Highway Terminal)",
    franchiseExpiryDate: "2026-12-10",
    ratingAverage: 4.92,
    totalCompletedRides: 2130,
    isVerifiedByBarangay: true,
    createdAt: "2024-11-01",
    updatedAt: "2026-10-03",
  },
];

export const MOCK_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: "mkt-001",
    sellerId: "usr-sel-01",
    sellerName: "Aling Teresa's Homemade Kitchen",
    sellerPurok: "Purok 2 (Sampaguita)",
    sellerPhone: "0917-234-5678",
    title: "Special Pork & Chicken Embutido (Freshly Steamed)",
    description: "Authentic family recipe with raisins, carrots, and cheddar cheese. Vacuum sealed, perfect for family dinners and baon. Ready to eat or fry.",
    price: 180,
    category: "FOOD",
    images: ["https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60"],
    availabilityStatus: "AVAILABLE",
    isFoodReadyToEat: true,
    prepTimeMinutes: 15,
    meetupOrDelivery: "PUROK_DELIVERY",
    viewsCount: 342,
    isVerifiedResidentSeller: true,
    createdAt: "Yesterday",
    updatedAt: "Today",
  },
  {
    id: "mkt-002",
    sellerId: "usr-sel-02",
    sellerName: "Nanay Rosie Kakanin & Snacks",
    sellerPurok: "Purok 3 (Ilang-Ilang)",
    sellerPhone: "0918-345-6789",
    title: "Pamplona Classic Kutsinta with Dulce de Leche Dip (Box of 20)",
    description: "Chewy, authentic brown sugar kutsinta topped with grated fresh coconut or sweet yema dip. Made fresh daily at 6:00 AM.",
    price: 120,
    category: "FOOD",
    images: ["https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60"],
    availabilityStatus: "AVAILABLE",
    isFoodReadyToEat: true,
    prepTimeMinutes: 5,
    meetupOrDelivery: "PUROK_DELIVERY",
    viewsCount: 512,
    isVerifiedResidentSeller: true,
    createdAt: "Today",
    updatedAt: "Today",
  },
  {
    id: "mkt-003",
    sellerId: "usr-sel-03",
    sellerName: "Pamplona Green Hydro Farm",
    sellerPurok: "Purok 7 (Greenhills)",
    sellerPhone: "0921-987-1234",
    title: "Organic Crispy Green Ice Lettuce (1 kg pack)",
    description: "Pesticide-free hydroponic lettuce harvested same morning. Crisp, fresh, and pre-washed. Direct from urban backyard farm.",
    price: 140,
    category: "GOODS",
    images: ["https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60"],
    availabilityStatus: "AVAILABLE",
    isFoodReadyToEat: false,
    prepTimeMinutes: 0,
    meetupOrDelivery: "PUROK_DELIVERY",
    viewsCount: 189,
    isVerifiedResidentSeller: true,
    createdAt: "2 days ago",
    updatedAt: "Today",
  },
  {
    id: "mkt-004",
    sellerId: "usr-sel-04",
    sellerName: "Mang Berto Shoe & Bag Repair",
    sellerPurok: "Purok 4 (Mabuhay)",
    sellerPhone: "0922-111-4455",
    title: "Heavy-Duty Leather Sole Stitching & Heel Restoration",
    description: "Experienced sapatero of 25 years. We stitch sneakers, dress shoes, boots, and school bags. Free pickup for Purok 4 residents.",
    price: 150,
    category: "SERVICES",
    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=60"],
    availabilityStatus: "AVAILABLE",
    isFoodReadyToEat: false,
    prepTimeMinutes: 0,
    meetupOrDelivery: "PICKUP_ONLY",
    viewsCount: 220,
    isVerifiedResidentSeller: true,
    createdAt: "3 days ago",
    updatedAt: "Yesterday",
  },
];

export const MOCK_JOBS: JobPosting[] = [
  {
    id: "job-001",
    employerId: "usr-emp-01",
    employerName: "Aling Gloria (Homeowner)",
    title: "Home Electrician for Circuit Breaker & Lighting Repair",
    description: "Need an accredited electrician to inspect a tripping 20A breaker and install two ceiling fans in the living room.",
    gigType: "ONE_TIME",
    rateType: "PER_PROJECT",
    rateAmount: 850,
    purok: "Purok 2 (Sampaguita)",
    landmark: "Near Sampaguita Chapel",
    contactMode: "PHONE_CALL",
    contactNumber: "0917-555-1928",
    requiredSkills: ["Electrical Wiring", "Circuit Breaker", "Safety Certified"],
    status: "OPEN",
    applicantsCount: 3,
    expiresAt: "In 3 days",
    createdAt: "Today",
  },
  {
    id: "job-002",
    employerId: "usr-emp-02",
    employerName: "Pamplona Water Refilling Station",
    title: "Delivery Assistant & Bottle Stacker (Part-Time)",
    description: "Looking for an energetic resident to assist in loading and delivering 5-gallon water containers within Purok 1 and 3. Motorcycle provided.",
    gigType: "PART_TIME",
    rateType: "PER_DAY",
    rateAmount: 500,
    purok: "Purok 1 (Riverside)",
    landmark: "Beside Purok 1 Outpost",
    contactMode: "PHONE_CALL",
    contactNumber: "0918-222-7711",
    requiredSkills: ["Valid Motorcycle License", "Heavy Lifting", "Purok Familiarity"],
    status: "OPEN",
    applicantsCount: 5,
    expiresAt: "In 5 days",
    createdAt: "Yesterday",
  },
  {
    id: "job-003",
    employerId: "usr-emp-03",
    employerName: "Teacher Michelle (Private Tutor)",
    title: "Grade 4 & 5 Elementary Math & English After-School Tutor",
    description: "Looking for an education or college student resident to tutor two children on weekdays from 4:30 PM to 6:30 PM. Snacks provided.",
    gigType: "PART_TIME",
    rateType: "PER_HOUR",
    rateAmount: 250,
    purok: "Purok 4 (Mabuhay)",
    landmark: "Mabuhay Subdivision Block 4",
    contactMode: "SMS_TEXT",
    contactNumber: "0920-333-8822",
    requiredSkills: ["Elementary Math", "Patient", "College/Education Student"],
    status: "OPEN",
    applicantsCount: 2,
    expiresAt: "In 7 days",
    createdAt: "2 days ago",
  },
];

export const TODA_FARES = {
  baseFareRegular: 30, // Within same Purok or adjacent Purok
  baseFareDiscounted: 24, // 20% statutory discount for Senior/Student/PWD
  perAdditionalPurok: 10,
  specialTripPerimeter: 50,
};

export function calculateTodaFare(
  pickupPurok: string,
  dropoffPurok: string,
  discountType: string = "REGULAR"
): { fare: number; discountSavings: number; isDiscounted: boolean } {
  const p1 = parseInt(pickupPurok.replace(/\D/g, "") || "1", 10);
  const p2 = parseInt(dropoffPurok.replace(/\D/g, "") || "1", 10);
  const purokDistance = Math.abs(p1 - p2);

  const rawFare = TODA_FARES.baseFareRegular + purokDistance * TODA_FARES.perAdditionalPurok;

  const isDiscounted = discountType !== "REGULAR";
  let finalFare = rawFare;
  let savings = 0;

  if (isDiscounted) {
    finalFare = Math.round(rawFare * 0.8);
    savings = rawFare - finalFare;
  }

  return {
    fare: finalFare,
    discountSavings: savings,
    isDiscounted,
  };
}
