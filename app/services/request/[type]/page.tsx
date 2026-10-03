"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  User,
  Phone,
  Upload,
  Image as ImageIcon,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Printer,
  FileCheck2,
  Zap
} from "lucide-react";
import { compressImage, CompressionResult } from "@/lib/image-compressor";
import {
  saveRequestToStorage,
  getDocumentPickupInfo,
  StoredDocumentRequest
} from "@/lib/document-store";
import { submitDocumentRequest } from "@/app/actions/portal-actions";

// Form validation schema using Zod
const requestFormSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name is too long"),
  purok: z.string().min(1, "Please select your Purok / Sitio"),
  streetAddress: z.string().optional(),
  mobileNumber: z
    .string()
    .regex(
      /^(09|\+639)\d{9}$/,
      "Enter a valid 11-digit Philippine mobile number (e.g., 09171234567)"
    ),
  yearsOfResidency: z
    .number()
    .min(0, "Years cannot be negative")
    .max(100, "Enter realistic years"),
  purpose: z
    .string()
    .min(3, "Please provide the purpose for this document")
    .max(250, "Purpose must be under 250 characters"),
  additionalNotes: z.string().max(300).optional(),
});

type RequestFormData = z.infer<typeof requestFormSchema>;

export default function DocumentRequestWizard() {
  const params = useParams();
  const rawType = (params?.type as string) || "clearance";
  const docType = rawType.toLowerCase();

  const pickupInfo = getDocumentPickupInfo(docType);

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionError, setCompressionError] = useState<string | null>(null);
  const [trackingCode, setTrackingCode] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      fullName: "",
      purok: "Purok 1 (Riverside)",
      streetAddress: "",
      mobileNumber: "",
      yearsOfResidency: 3,
      purpose: "",
      additionalNotes: "",
    },
    mode: "onTouched",
  });

  const formData = watch();

  // Preset purpose choices based on document type
  const purposePresets: Record<string, string[]> = {
    clearance: [
      "Local Employment / Job Application",
      "Postal ID Application",
      "Bank Account Opening",
      "NBI / Police Clearance Requirement",
      "Driver's License Requirement",
    ],
    indigency: [
      "Medical Assistance / Hospitalization",
      "Public Scholarship / Tuition Subsidy",
      "DSWD AICS Financial Assistance",
      "Public Attorney's Office (PAO) Waiver",
      "Burial / Funeral Assistance",
    ],
    residency: [
      "School Enrollment Requirement",
      "Meralco / Water Utility Transfer",
      "Philippine Passport Renewal",
      "Affidavit / Legal Verification",
      "Barangay ID Application",
    ],
  };

  const currentPresets = purposePresets[docType] || purposePresets.clearance;

  // Handle client-side image compression
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setCompressionError("Please upload an image file (JPG, PNG, or WebP).");
      return;
    }

    setIsCompressing(true);
    setCompressionError(null);

    try {
      const result = await compressImage(file, 1280, 1280, 0.75);
      setCompressionResult(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to compress image.";
      setCompressionError(message);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleNextFromStep1 = async () => {
    const isValid = await trigger([
      "fullName",
      "purok",
      "mobileNumber",
      "yearsOfResidency",
    ]);
    if (isValid) setStep(2);
  };

  const handleNextFromStep2 = async () => {
    const isValid = await trigger(["purpose"]);
    if (isValid) setStep(3);
  };

  const handleNextFromStep3 = () => {
    // ID photo is optional but encouraged
    setStep(4);
  };

  const onFinalSubmit = (data: RequestFormData) => {
    startTransition(async () => {
      try {
        // 1. Call Backend Server Action (Triggers SMS notification & server persistence)
        const serverResult = await submitDocumentRequest({
          documentType: docType as StoredDocumentRequest["documentType"],
          fullName: data.fullName,
          purok: data.purok,
          streetAddress: data.streetAddress,
          mobileNumber: data.mobileNumber,
          yearsOfResidency: data.yearsOfResidency,
          purpose: data.purpose,
          additionalNotes: data.additionalNotes,
          idPhotoBase64: compressionResult?.dataUrl,
        });

        const code = serverResult.trackingCode;

        // 2. Synchronize to client storage for instantaneous local tracking
        const newRecord: StoredDocumentRequest = {
          trackingCode: code,
          documentType: docType as StoredDocumentRequest["documentType"],
          documentTitle: pickupInfo.title,
          fullName: data.fullName,
          purok: data.purok,
          streetAddress: data.streetAddress,
          mobileNumber: data.mobileNumber,
          yearsOfResidency: data.yearsOfResidency,
          purpose: data.purpose,
          additionalNotes: data.additionalNotes,
          idPhotoName: compressionResult?.file.name,
          idPhotoPreview: compressionResult?.dataUrl,
          status: "SUBMITTED",
          fee: pickupInfo.fee,
          pickupRequirements: pickupInfo.requirements,
          submittedAt: "Just now",
          lastUpdatedAt: "Just now",
          timeline: [
            {
              title: "Application Submitted",
              description: `Request logged. SMS confirmation queued to ${data.mobileNumber}.`,
              timestamp: "Just now",
              completed: true,
              current: true,
            },
            {
              title: "Staff & Records Verification",
              description: `Verification for ${data.purok} resident records.`,
              timestamp: "Pending",
              completed: false,
            },
            {
              title: "Captain Review & Signature",
              description: "Approval by Punong Barangay.",
              timestamp: "Pending",
              completed: false,
            },
            {
              title: "Ready for Pickup",
              description: pickupInfo.requirements,
              timestamp: "Pending",
              completed: false,
            },
          ],
        };

        saveRequestToStorage(newRecord);
        try {
          const { saveDocumentRequestToFirestore } = await import("@/lib/firebase/firestore-service");
          await saveDocumentRequestToFirestore(newRecord);
        } catch (e) {
          console.warn("[FIRESTORE] Sync skipped:", e);
        }

        setTrackingCode(code);
        setStep(5);
      } catch (err) {
        console.error("Failed to submit document request via server action:", err);
      }
    });
  };

  const handleCopyCode = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(trackingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-900 transition-colors mb-3 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Services Catalog</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
              Official e-Application
            </span>
            <span className="text-xs text-slate-500">• 15-30 Mins Processing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {pickupInfo.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Complete the 4-step wizard to apply. No physical queue needed until pickup.
          </p>
        </div>

        {/* Stepper Header (1 -> 2 -> 3 -> 4) */}
        {step < 5 && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { num: 1, label: "Resident Info" },
                { num: 2, label: "Purpose" },
                { num: 3, label: "Valid ID Upload" },
                { num: 4, label: "Review & File" },
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                      step === s.num
                        ? "bg-blue-900 text-white ring-4 ring-blue-100"
                        : step > s.num
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {step > s.num ? "✓" : s.num}
                  </div>
                  <span
                    className={`text-[11px] mt-1 hidden sm:block ${
                      step === s.num
                        ? "font-bold text-blue-900"
                        : step > s.num
                        ? "font-semibold text-slate-700"
                        : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            {/* Progress track line */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-blue-900 h-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {/* STEP 1: Resident Info */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-700" />
                  <span>Step 1: Resident Identification</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Provide your official resident profile details as they appear on your government records.
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Legal Name (Buong Pangalan) *
                </label>
                <input
                  type="text"
                  {...register("fullName")}
                  placeholder="e.g. Juan Carlos Dela Cruz Jr."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Mobile Phone & Purok */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone Number (Para sa SMS Updates) *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      {...register("mobileNumber")}
                      placeholder="09171234567"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-mono"
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="text-[11px] text-red-600 mt-1 font-semibold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.mobileNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Purok / Sitio Location *
                  </label>
                  <select
                    {...register("purok")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  >
                    <option value="Purok 1 (Riverside)">Purok 1 (Riverside)</option>
                    <option value="Purok 2 (Sampaguita)">Purok 2 (Sampaguita)</option>
                    <option value="Purok 3 (Ilang-Ilang)">Purok 3 (Ilang-Ilang)</option>
                    <option value="Purok 4 (Mabuhay)">Purok 4 (Mabuhay)</option>
                    <option value="Purok 5 (Central)">Purok 5 (Central)</option>
                    <option value="Purok 6 (Highway)">Purok 6 (Highway)</option>
                    <option value="Purok 7 (Greenhills)">Purok 7 (Greenhills)</option>
                  </select>
                </div>
              </div>

              {/* Street & Years Residing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    House No. / Street Address (Optional)
                  </label>
                  <input
                    type="text"
                    {...register("streetAddress")}
                    placeholder="Block 12 Lot 4, Mabuhay St."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Years of Residency *
                  </label>
                  <input
                    type="number"
                    {...register("yearsOfResidency", { valueAsNumber: true })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-mono"
                  />
                  {errors.yearsOfResidency && (
                    <p className="text-[11px] text-red-600 mt-1 font-semibold">
                      {errors.yearsOfResidency.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextFromStep1}
                  className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-xs transition-transform active:scale-95"
                >
                  <span>Next: Purpose & Details</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Purpose & Requirement Details */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-700" />
                  <span>Step 2: Purpose & Document Specifics</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select common requirements or specify your custom intent for official record indexing.
                </p>
              </div>

              {/* Purpose Chips Quick-Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Frequently Requested Purposes (Click to Auto-fill)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {currentPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setValue("purpose", preset, { shouldValidate: true })}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-slate-700 border border-slate-200 transition-colors text-left"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purpose Input / Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specific Purpose / Reason (Dahilan ng Pagkuha) *
                </label>
                <textarea
                  rows={3}
                  {...register("purpose")}
                  placeholder="e.g. Local employment application as Administrative Clerk, opening an account at BDO, or Postal ID application."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
                {errors.purpose && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.purpose.message}
                  </p>
                )}
              </div>

              {/* Additional Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Notes or Remarks (Optional)
                </label>
                <input
                  type="text"
                  {...register("additionalNotes")}
                  placeholder="e.g. First-time jobseeker beneficiary (RA 11261 waiver)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep2}
                  className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-xs transition-transform active:scale-95"
                >
                  <span>Next: Upload Valid ID</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Supporting Document / Valid ID with Client-side Compression */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-700" />
                  <span>Step 3: Valid ID Photo (Client-Side Compression)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Snap or upload a photo of your valid ID (National ID, Driver&apos;s License, Voter&apos;s ID, or Student ID). Our client engine automatically compresses high-res camera photos to ensure lightning-fast upload on 3G/4G connections.
                </p>
              </div>

              {/* Upload Drop Area */}
              <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 hover:bg-blue-50/50 hover:border-blue-400 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  disabled={isCompressing}
                />

                <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                  <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    {isCompressing ? "Compressing Image on Device..." : "Click or Tap to Snap / Select Valid ID"}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Supports JPG, PNG, WebP • Auto-optimized to &lt; 200 KB
                  </p>
                </div>
              </div>

              {compressionError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2 border border-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{compressionError}</span>
                </div>
              )}

              {/* Compression Metrics Card (Proof of Client-side Compression) */}
              {compressionResult && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-emerald-600 fill-current" />
                      Client Compression Succeeded!
                    </span>
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      Saved {compressionResult.compressionRatio}% Data
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                      <span className="text-[10px] text-slate-500 uppercase block">Original</span>
                      <strong className="text-slate-800 font-mono">
                        {compressionResult.originalSizeKb} KB
                      </strong>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                      <span className="text-[10px] text-slate-500 uppercase block">Compressed</span>
                      <strong className="text-emerald-700 font-mono">
                        {compressionResult.compressedSizeKb} KB
                      </strong>
                    </div>
                    <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                      <span className="text-[10px] text-slate-500 uppercase block">Dimensions</span>
                      <strong className="text-slate-800 font-mono">
                        {compressionResult.width}×{compressionResult.height}
                      </strong>
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="flex items-center gap-3 pt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={compressionResult.dataUrl}
                      alt="Valid ID Preview"
                      className="h-16 w-24 object-cover rounded-lg border border-emerald-300 shadow-2xs"
                    />
                    <div className="text-xs text-emerald-950 flex-1">
                      <p className="font-bold truncate">{compressionResult.file.name}</p>
                      <p className="text-[11px] text-emerald-700">Ready for instant upload</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCompressionResult(null)}
                      className="text-xs text-red-600 hover:text-red-800 font-bold px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-400 italic">
                * Note: If you don&apos;t have an ID photo on your device right now, you can proceed and present your physical ID at the Barangay Hall during pickup.
              </p>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep3}
                  className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-xs transition-transform active:scale-95"
                >
                  <span>Next: Review & Confirm</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review and Confirmation Screen */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-blue-700" />
                  <span>Step 4: Review Application Summary</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify your details before generating your certified reference code.
                </p>
              </div>

              {/* Summary Table Card */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 uppercase font-semibold">Document Type:</span>
                  <span className="font-extrabold text-slate-900 text-sm">{pickupInfo.title}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 uppercase font-semibold">Applicant Name:</span>
                  <span className="font-bold text-slate-900">{formData.fullName}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 uppercase font-semibold">Purok & Contact:</span>
                  <span className="font-medium text-slate-800">
                    {formData.purok} • {formData.mobileNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 uppercase font-semibold">Purpose:</span>
                  <span className="font-medium text-slate-800 max-w-xs text-right truncate">
                    {formData.purpose}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 uppercase font-semibold">Valid ID Attached:</span>
                  <span className="font-bold text-emerald-700">
                    {compressionResult ? `Yes (${compressionResult.compressedSizeKb} KB)` : "Physical Presentation at Hall"}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500 uppercase font-bold">Standard Statutory Fee:</span>
                  <span className="text-sm font-black text-blue-900">{pickupInfo.fee}</span>
                </div>
              </div>

              {/* Pickup Requirement Box */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Pickup Requirement Reminder:</p>
                  <p className="mt-0.5 leading-relaxed">{pickupInfo.requirements}</p>
                </div>
              </div>

              {/* Data privacy waiver */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2 text-[11px] text-slate-600">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  I hereby attest that the information provided is true and accurate in compliance with Republic Act No. 10173 (Data Privacy Act of 2012).
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onFinalSubmit)}
                  disabled={isPending}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm transition-transform active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isPending ? "Generating Reference..." : "Confirm & Submit Request"}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Final Confirmation & Claim Voucher */}
          {step === 5 && (
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95">
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Application Queued Successfully
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                  Official Tracking Voucher
                </h2>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Keep this tracking code safe. An automated confirmation text has been logged for {formData.mobileNumber}.
                </p>
              </div>

              {/* Certified Voucher Card */}
              <div className="max-w-md mx-auto bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 text-left space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-amber-400">Barangay Pamplona Uno, Las Piñas</p>
                    <p className="text-xs text-slate-300 font-semibold">{pickupInfo.title}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    QUEUED
                  </span>
                </div>

                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-medium">Tracking Reference</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono text-2xl font-black tracking-wider text-amber-400">
                      {trackingCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs inline-flex items-center gap-1"
                      title="Copy code"
                    >
                      {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      <span className="text-[10px]">{copiedCode ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <p><strong>Applicant:</strong> {formData.fullName}</p>
                  <p><strong>Purok:</strong> {formData.purok}</p>
                  <p><strong>Fee:</strong> {pickupInfo.fee}</p>
                  <p className="text-amber-200 text-[11px] pt-1 leading-snug">
                    📌 {pickupInfo.requirements}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={`/services/track?code=${trackingCode}`}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-transform active:scale-95"
                >
                  Track in Visual Timeline
                </Link>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5"
                >
                  <Printer className="h-4 w-4 text-slate-500" />
                  <span>Print Voucher</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
