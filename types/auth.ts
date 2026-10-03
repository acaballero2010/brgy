/**
 * Types and interfaces for Resident Authentication and User Registration
 * Barangay Pamplona Uno, Las Piñas City, Metro Manila
 */

export type PurokNumber =
  | "Purok 1"
  | "Purok 2"
  | "Purok 3"
  | "Purok 4"
  | "Purok 5"
  | "Purok 6"
  | "Purok 7";

export type ResidentCategory =
  | "Regular Resident"
  | "Senior Citizen"
  | "Person with Disability (PWD)"
  | "Solo Parent"
  | "Youth / SK (15-30 yrs)"
  | "TODA Tricycle Driver"
  | "Local Market Vendor / Merchant";

export type ValidIdType =
  | "PhilSys National ID"
  | "Driver's License"
  | "UMID"
  | "Voter's ID / Certification"
  | "Postal ID"
  | "Senior Citizen ID"
  | "PWD ID"
  | "Passport"
  | "Student ID";

export interface ResidentProfile {
  uid: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  fullName: string;
  mobileNumber: string;
  birthDate?: string;
  gender?: "Male" | "Female" | "Prefer not to say";
  purok: PurokNumber;
  streetAddress: string;
  yearsOfResidency: number;
  voterStatus: "Registered in Pamplona Uno" | "Registered Elsewhere" | "Not Registered";
  residentCategory: ResidentCategory;
  idType: ValidIdType;
  idNumber: string;
  barangayIdNumber: string; // e.g. BPU-2026-8941
  isVerified: boolean;
  role: "resident" | "staff" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationInput {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  mobileNumber: string;
  birthDate?: string;
  gender?: "Male" | "Female" | "Prefer not to say";
  purok: PurokNumber;
  streetAddress: string;
  yearsOfResidency: number;
  voterStatus: "Registered in Pamplona Uno" | "Registered Elsewhere" | "Not Registered";
  residentCategory: ResidentCategory;
  idType: ValidIdType;
  idNumber: string;
  acceptedDataPrivacy: boolean;
}
