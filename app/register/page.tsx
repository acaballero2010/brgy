"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  Phone,
  Home,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  QrCode,
  FileText,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import BarangaySeal from "@/components/common/BarangaySeal";
import { useAuth } from "@/context/AuthContext";
import {
  PurokNumber,
  ResidentCategory,
  ValidIdType,
  ResidentProfile
} from "@/types/auth";

const PUROK_OPTIONS: { name: PurokNumber; desc: string }[] = [
  { name: "Purok 1", desc: "Riverside / North Zone" },
  { name: "Purok 2", desc: "St. Joseph / Lowland Area" },
  { name: "Purok 3", desc: "Centro / Barangay Hall Vicinity" },
  { name: "Purok 4", desc: "Doña Manuela Subd. / Commercial" },
  { name: "Purok 5", desc: "San Antonio / Lowland Sector" },
  { name: "Purok 6", desc: "Highway / Alabang-Zapote Outpost" },
  { name: "Purok 7", desc: "South / Boundary Zone" },
];

const RESIDENT_CATEGORIES: ResidentCategory[] = [
  "Regular Resident",
  "Senior Citizen",
  "Person with Disability (PWD)",
  "Solo Parent",
  "Youth / SK (15-30 yrs)",
  "TODA Tricycle Driver",
  "Local Market Vendor / Merchant",
];

const VALID_ID_TYPES: ValidIdType[] = [
  "PhilSys National ID",
  "Driver's License",
  "UMID",
  "Voter's ID / Certification",
  "Postal ID",
  "Senior Citizen ID",
  "PWD ID",
  "Passport",
  "Student ID",
];

export default function RegisterPage() {
  const { registerResident } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registeredProfile, setRegisteredProfile] = useState<ResidentProfile | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Account
    email: "",
    password: "",
    confirmPassword: "",
    // Step 2: Personal
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    mobileNumber: "09",
    birthDate: "",
    gender: "Prefer not to say" as "Male" | "Female" | "Prefer not to say",
    // Step 3: Residency & Verification
    purok: "Purok 3" as PurokNumber,
    streetAddress: "",
    yearsOfResidency: 5,
    voterStatus: "Registered in Pamplona Uno" as "Registered in Pamplona Uno" | "Registered Elsewhere" | "Not Registered",
    residentCategory: "Regular Resident" as ResidentCategory,
    idType: "PhilSys National ID" as ValidIdType,
    idNumber: "",
    acceptedDataPrivacy: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Step 1 Validation
  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setStep(2);
  };

  // Step 2 Validation
  const handleNextFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.firstName.trim()) {
      setErrorMessage("First name is required.");
      return;
    }
    if (!formData.lastName.trim()) {
      setErrorMessage("Last name is required.");
      return;
    }
    if (!/^09\d{9}$/.test(formData.mobileNumber.replace(/[^0-9]/g, ""))) {
      setErrorMessage("Enter a valid 11-digit Philippine mobile number starting with 09.");
      return;
    }

    setStep(3);
  };

  // Final Registration Submission
  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.streetAddress.trim()) {
      setErrorMessage("Please provide your street or house address in Pamplona Uno.");
      return;
    }
    if (!formData.idNumber.trim()) {
      setErrorMessage("Please enter your Valid ID reference number.");
      return;
    }
    if (!formData.acceptedDataPrivacy) {
      setErrorMessage("You must accept the Data Privacy Act terms to register.");
      return;
    }

    try {
      setIsSubmitting(true);
      const profile = await registerResident(formData);
      setRegisteredProfile(profile);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-14">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header Header Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center group">
            <BarangaySeal size={64} className="mb-3 drop-shadow-md group-hover:scale-105 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Barangay Pamplona Uno • Las Piñas City
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Resident Citizen Registration
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
              Create your official digital citizen account to request clearances, access community services, and obtain your digital Barangay Resident ID.
            </p>
          </Link>
        </div>

        {/* Success Modal / Screen */}
        {registeredProfile ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-200 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Registration Successful!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Welcome to the digital frontline of Barangay Pamplona Uno,{" "}
                <span className="font-bold text-slate-900">{registeredProfile.firstName}</span>.
              </p>
            </div>

            {/* Official Digital Barangay Resident Card Preview */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-950 via-slate-900 to-blue-900 text-white p-5 sm:p-6 shadow-xl border border-amber-400/40">
              {/* Decorative background glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/15 relative z-10">
                <div className="flex items-center gap-2.5">
                  <BarangaySeal size={38} className="shadow-xs shrink-0" />
                  <div>
                    <h3 className="text-xs font-black tracking-tight uppercase leading-tight">
                      Barangay Pamplona Uno
                    </h3>
                    <p className="text-[10px] text-blue-200">
                      City of Las Piñas • Metro Manila
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-xs">
                  Official Resident ID
                </span>
              </div>

              {/* Card Body */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Registered Resident Name
                  </p>
                  <p className="text-base sm:text-lg font-black text-white leading-snug">
                    {registeredProfile.fullName}
                  </p>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-800/80 px-2 py-0.5 rounded text-blue-100 border border-blue-700">
                      <Home className="h-3 w-3" />
                      {registeredProfile.purok}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-300 border border-emerald-700/60">
                      <ShieldCheck className="h-3 w-3" />
                      {registeredProfile.residentCategory}
                    </span>
                  </div>
                </div>

                <div className="sm:text-right space-y-1 shrink-0 bg-white/5 p-3 rounded-xl border border-white/10 w-full sm:w-auto">
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">
                      Barangay ID No.
                    </span>
                    <span className="font-mono text-sm sm:text-base font-black text-amber-300">
                      {registeredProfile.barangayIdNumber}
                    </span>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <span className="text-[9px] text-slate-400">Issued On</span>
                    <span className="text-[10px] text-slate-200">
                      {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 relative z-10">
                <span className="flex items-center gap-1">
                  <QrCode className="h-3.5 w-3.5 text-amber-300" />
                  Validated via Pamplona Uno Portal
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Citizen Status
                </span>
              </div>
            </div>

            {/* Quick Next Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href="/services"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
              >
                <FileText className="h-4 w-4" />
                <span>Request Clearance Now</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Go to Resident Profile</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Multi-Step Registration Form Card */
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
            {/* Step Progress Tracker */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 1 ? "bg-blue-900 text-white" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  1
                </div>
                <span className={`text-xs font-bold ${step === 1 ? "text-slate-900" : "text-slate-400"}`}>
                  Account
                </span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-100 mx-2" />
              <div className="flex items-center gap-2">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 2 ? "bg-blue-900 text-white" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  2
                </div>
                <span className={`text-xs font-bold ${step === 2 ? "text-slate-900" : "text-slate-400"}`}>
                  Personal
                </span>
              </div>
              <div className="flex-1 h-0.5 bg-slate-100 mx-2" />
              <div className="flex items-center gap-2">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 3 ? "bg-blue-900 text-white" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  3
                </div>
                <span className={`text-xs font-bold ${step === 3 ? "text-slate-900" : "text-slate-400"}`}>
                  Residency & ID
                </span>
              </div>
            </div>

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800 animate-in fade-in">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: Account Credentials */}
            {step === 1 && (
              <form onSubmit={handleNextFromStep1} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. resident.pamplonauno@gmail.com"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Used for application status updates and document pickup notifications.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>Continue to Personal Information</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Personal Information */}
            {step === 2 && (
              <form onSubmit={handleNextFromStep2} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="e.g. Maria"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      placeholder="e.g. Dela Cruz"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="e.g. Santos"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Suffix
                    </label>
                    <input
                      type="text"
                      name="suffix"
                      value={formData.suffix}
                      onChange={handleChange}
                      placeholder="Jr., III"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Mobile Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="09171234567"
                      maxLength={11}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Receives real-time SMS notifications for clearance claim stubs and Tanod dispatch.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Birthdate
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>Continue to Residency & ID</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Pamplona Uno Residency & ID Verification */}
            {step === 3 && (
              <form onSubmit={handleSubmitRegistration} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Pamplona Uno Purok / Sector <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="purok"
                    value={formData.purok}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-semibold"
                  >
                    {PUROK_OPTIONS.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name} — {p.desc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    House No., Street & Subdivision <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    placeholder="e.g. Block 4 Lot 12, Doña Manuela Subd., Alabang-Zapote Rd."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Years Residing in Pamplona Uno
                    </label>
                    <input
                      type="number"
                      name="yearsOfResidency"
                      min={0}
                      max={99}
                      value={formData.yearsOfResidency}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Resident Category
                    </label>
                    <select
                      name="residentCategory"
                      value={formData.residentCategory}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    >
                      {RESIDENT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Valid ID Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="idType"
                      value={formData.idType}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    >
                      {VALID_ID_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      ID Reference Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleChange}
                        placeholder="e.g. 1234-5678-9012"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Voter Registration Status
                  </label>
                  <select
                    name="voterStatus"
                    value={formData.voterStatus}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Registered in Pamplona Uno">Registered in Pamplona Uno (Las Piñas)</option>
                    <option value="Registered Elsewhere">Registered in Another Barangay / City</option>
                    <option value="Not Registered">Not Yet Registered as Voter</option>
                  </select>
                </div>

                {/* Consent & Data Privacy */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptedDataPrivacy"
                      checked={formData.acceptedDataPrivacy}
                      onChange={handleChange}
                      required
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I certify that I am a bona fide resident of Barangay Pamplona Uno, Las Piñas City. I consent to the processing of my personal data under the <strong>Data Privacy Act of 2012 (R.A. 10173)</strong> for official barangay e-governance records and clearance issuance.
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={isSubmitting}
                    className="w-1/3 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Creating Resident Account...</span>
                    ) : (
                      <>
                        <span>Submit Registration</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Bottom Sign-In Redirect */}
            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              Already registered your residency?{" "}
              <Link
                href="/login"
                className="font-bold text-blue-900 hover:underline inline-flex items-center gap-1"
              >
                <span>Sign in here</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
