"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  CheckCircle2,
  Send,
  Camera,
  MapPin,
  Eye,
  EyeOff,
  LightbulbOff,
  VolumeX,
  Waves,
  Trash2,
  Construction,
  Shield,
  Copy,
  Check
} from "lucide-react";
import { compressImage, CompressionResult } from "@/lib/image-compressor";
import { submitIssueReport } from "@/app/actions/portal-actions";

// Zod schema for incident reporting
const incidentReportSchema = z.object({
  category: z.enum(["Busted Light", "Noise", "Drainage", "Garbage", "Road Hazard"]),
  purok: z.string().min(1, "Please select the affected Purok"),
  landmark: z
    .string()
    .min(3, "Please provide a landmark or exact street address")
    .max(150, "Landmark is too long"),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title is too long"),
  description: z
    .string()
    .min(15, "Please provide more details (at least 15 characters) so Tanod can respond effectively")
    .max(1000, "Description is too long"),
  isAnonymous: z.boolean(),
  reporterName: z.string().optional(),
  reporterPhone: z.string().optional(),
});

type IncidentFormData = z.infer<typeof incidentReportSchema>;

const INCIDENT_CATEGORIES = [
  {
    id: "Busted Light",
    title: "Busted Light",
    desc: "Dark street, flickering post, or damaged wiring",
    icon: LightbulbOff,
    color: "amber",
  },
  {
    id: "Noise",
    title: "Noise Disturbance",
    desc: "Loud karaoke, midnight commotion, curfew violation",
    icon: VolumeX,
    color: "purple",
  },
  {
    id: "Drainage",
    title: "Drainage & Canal",
    desc: "Clogged waterway, stagnant water, flooding risk",
    icon: Waves,
    color: "blue",
  },
  {
    id: "Garbage",
    title: "Uncollected Garbage",
    desc: "Missed trash collection or illegal dumping site",
    icon: Trash2,
    color: "emerald",
  },
  {
    id: "Road Hazard",
    title: "Road Hazard",
    desc: "Pothole, fallen branch, or illegal road blockade",
    icon: Construction,
    color: "red",
  },
] as const;

export default function NewIncidentReportPage() {
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionError, setCompressionError] = useState<string | null>(null);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IncidentFormData>({
    resolver: zodResolver(incidentReportSchema),
    defaultValues: {
      category: "Busted Light",
      purok: "Purok 1 (Riverside)",
      landmark: "",
      title: "",
      description: "",
      isAnonymous: false,
      reporterName: "",
      reporterPhone: "",
    },
  });

  const selectedCategory = watch("category");
  const isAnonymous = watch("isAnonymous");

  // Handle client-side image compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setCompressionError("Please upload a photo image.");
      return;
    }

    setIsCompressing(true);
    setCompressionError(null);

    try {
      const result = await compressImage(file, 1280, 1280, 0.7);
      setCompressionResult(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to compress incident photo.";
      setCompressionError(message);
    } finally {
      setIsCompressing(false);
    }
  };

  const onSubmit = async (data: IncidentFormData) => {
    try {
      // 1. Call Backend Server Action (Triggers cloud photo upload & Tanod dispatch alert)
      const serverResult = await submitIssueReport({
        category: data.category,
        purok: data.purok,
        landmark: data.landmark,
        title: data.title,
        description: data.description,
        isAnonymous: data.isAnonymous,
        reporterName: data.reporterName,
        reporterPhone: data.reporterPhone,
        imageFile: compressionResult?.dataUrl,
      });

      const generated = serverResult.trackingCode;

      // 2. Store in local state for instantaneous citizen review
      if (typeof window !== "undefined") {
        try {
          const storedReports = JSON.parse(localStorage.getItem("brgy_reports") || "[]");
          storedReports.unshift({
            trackingCode: generated,
            ...data,
            photoUrl: serverResult.uploadedImageUrl || compressionResult?.dataUrl,
            createdAt: new Date().toISOString(),
            status: "DISPATCHED",
          });
          localStorage.setItem("brgy_reports", JSON.stringify(storedReports));
        } catch {
          // Ignore quota
        }
      }

      setSubmittedCode(generated);
    } catch (err) {
      console.error("Failed to submit issue report via server action:", err);
    }
  };

  const handleCopyCode = () => {
    if (submittedCode && navigator?.clipboard) {
      navigator.clipboard.writeText(submittedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Breadcrumb */}
        <div>
          <Link
            href="/reports"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-900 transition-colors mb-3 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Sumbong Desk</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
              Community Incident Report
            </span>
            <span className="text-xs text-slate-500">• Fast Tanod Triage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            File an Incident / Community Sumbong
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Report public hazards, peace & order violations, or infrastructure issues directly to the Barangay Tanod Patrol Desk.
          </p>
        </div>

        {/* Confirmation Screen on Success */}
        {submittedCode ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-5 animate-in zoom-in-95">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Incident Queued for Dispatch
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Sumbong Successfully Logged!
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Your report has been transmitted to the Barangay Tanod Officer of the Day for immediate assessment.
              </p>
            </div>

            {/* Reference Card */}
            <div className="max-w-sm mx-auto bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-400">
                  Incident Reference Code
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                  ACTIVE DISPATCH
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-black text-white tracking-wider">
                  {submittedCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                >
                  {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span className="text-[10px]">{copiedCode ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Privacy: {isAnonymous ? "Anonymous Submission (Identity Protected)" : "Identified Resident"}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/reports"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-transform active:scale-95"
              >
                View Public Resolution Board
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          /* Incident Report Form */
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
          >
            {/* 1. Category Selection Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                1. Select Incident Category *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {INCIDENT_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setValue("category", cat.id as IncidentFormData["category"], { shouldValidate: true })}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all active:scale-[0.98] ${
                        isSelected
                          ? "border-blue-700 bg-blue-50/80 ring-2 ring-blue-600 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-blue-900 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{cat.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                          {cat.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.category && (
                <p className="text-[11px] text-red-600 mt-1 font-semibold">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* 2. Location & Landmark */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Purok / Sitio Location *
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nearby Landmark / Exact Street *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    {...register("landmark")}
                    placeholder="e.g. Near Daycare, In front of sari-sari store"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                </div>
                {errors.landmark && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold">
                    {errors.landmark.message}
                  </p>
                )}
              </div>
            </div>

            {/* 3. Title & Detailed Description */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. Subject / Summary *
                </label>
                <input
                  type="text"
                  {...register("title")}
                  placeholder="e.g. Broken post lamp causing pitch black corner at night"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
                {errors.title && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Detailed Explanation of Incident *
                </label>
                <textarea
                  rows={4}
                  {...register("description")}
                  placeholder="Describe the condition, how long the issue has persisted, potential danger to residents, and any vehicles or people involved."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all leading-relaxed"
                />
                {errors.description && (
                  <p className="text-[11px] text-red-600 mt-1 font-semibold">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* 4. Optional Photo Upload with Client-Side Compression */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                4. Attach Photo Proof (Optional — Client Compression Engine Active)
              </label>

              <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center bg-slate-50 hover:bg-amber-50/40 hover:border-amber-400 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isCompressing}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                  <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Camera className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {isCompressing ? "Compressing on Device..." : "Take a Photo or Select from Gallery"}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Compressed client-side to ensure smooth upload on mobile data
                  </p>
                </div>
              </div>

              {compressionError && (
                <p className="text-xs text-red-600 font-semibold mt-1">
                  {compressionError}
                </p>
              )}

              {compressionResult && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={compressionResult.dataUrl}
                      alt="Incident Thumbnail"
                      className="h-12 w-16 object-cover rounded-lg border border-emerald-300"
                    />
                    <div>
                      <p className="font-bold text-emerald-950 truncate max-w-xs">
                        {compressionResult.file.name}
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        {compressionResult.compressedSizeKb} KB (Reduced by {compressionResult.compressionRatio}%)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCompressionResult(null)}
                    className="text-red-600 hover:text-red-800 font-bold text-xs px-2"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* 5. Anonymous Submission Toggle */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                {isAnonymous ? (
                  <EyeOff className="h-5 w-5 text-purple-700 shrink-0 mt-0.5" />
                ) : (
                  <Eye className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
                )}
                <div>
                  <label htmlFor="anon-toggle" className="text-xs font-bold text-slate-900 cursor-pointer block">
                    Submit as Anonymous Citizen
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {isAnonymous
                      ? "Your name and contact number will be completely masked from the public resolution feed."
                      : "Providing your contact info allows the Tanod Patrol to verify details or send you direct updates."}
                  </p>
                </div>
              </div>

              <input
                id="anon-toggle"
                type="checkbox"
                {...register("isAnonymous")}
                className="h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-0.5 cursor-pointer"
              />
            </div>

            {/* If NOT anonymous, optional contact details */}
            {!isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    {...register("reporterName")}
                    placeholder="e.g. Maria Santos"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone (For Tanod Follow-up)
                  </label>
                  <input
                    type="tel"
                    {...register("reporterPhone")}
                    placeholder="0917-000-0000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Privacy notice */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Shield className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>
                Protected under RA 10173. False reports or malicious prank submissions are subject to local ordinance penalties.
              </span>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? "Transmitting Report..." : "Submit Incident Report to Tanod Patrol"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
