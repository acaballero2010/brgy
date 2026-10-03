"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  Clock,
  FileCheck,
  AlertCircle,
  ArrowLeft,
  Building,
  Printer,
  RefreshCw
} from "lucide-react";
import {
  getRequestFromStorage,
  StoredDocumentRequest
} from "@/lib/document-store";

function TrackDocumentContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";

  const [searchCode, setSearchCode] = useState(initialCode);
  const [activeRecord, setActiveRecord] = useState<StoredDocumentRequest | null>(() => {
    return initialCode ? getRequestFromStorage(initialCode) : null;
  });
  const [hasSearched, setHasSearched] = useState(() => Boolean(initialCode));
  const [notFoundMessage, setNotFoundMessage] = useState<string | null>(null);

  const performLookup = React.useCallback(async (codeToSearch: string) => {
    const trimmed = codeToSearch.trim().toUpperCase();
    if (!trimmed) return;

    setHasSearched(true);
    let found = getRequestFromStorage(trimmed);

    try {
      const { getDocumentRequestFromFirestore } = await import("@/lib/firebase/firestore-service");
      const firestoreDoc = await getDocumentRequestFromFirestore(trimmed);
      if (firestoreDoc) {
        found = {
          ...found,
          ...firestoreDoc,
          timeline: firestoreDoc.timeline || found?.timeline || [
            {
              title: "Application Submitted",
              description: "Request logged in Cloud Firestore database.",
              timestamp: firestoreDoc.submittedAt || "Recently",
              completed: true,
              current: firestoreDoc.status === "SUBMITTED",
            },
            {
              title: "Staff & Records Verification",
              description: `Verification for ${firestoreDoc.purok} records.`,
              timestamp: firestoreDoc.status !== "SUBMITTED" ? firestoreDoc.lastUpdatedAt : "Pending",
              completed: firestoreDoc.status !== "SUBMITTED",
              current: firestoreDoc.status === "UNDER_REVIEW",
            },
            {
              title: "Captain Review & Signature",
              description: "Punong Barangay seal and endorsement.",
              timestamp: firestoreDoc.status === "READY_FOR_PICKUP" || firestoreDoc.status === "RELEASED" ? firestoreDoc.lastUpdatedAt : "Pending",
              completed: firestoreDoc.status === "READY_FOR_PICKUP" || firestoreDoc.status === "RELEASED",
              current: false,
            },
            {
              title: "Ready for Pickup",
              description: firestoreDoc.pickupRequirements || "Claim at Barangay Hall.",
              timestamp: firestoreDoc.status === "READY_FOR_PICKUP" || firestoreDoc.status === "RELEASED" ? firestoreDoc.lastUpdatedAt : "Pending",
              completed: firestoreDoc.status === "READY_FOR_PICKUP" || firestoreDoc.status === "RELEASED",
              current: firestoreDoc.status === "READY_FOR_PICKUP",
            },
          ],
        };
      }
    } catch (err) {
      console.warn("Firestore lookup fallback:", err);
    }

    if (found) {
      setActiveRecord(found);
      setNotFoundMessage(null);
    } else {
      setActiveRecord(null);
      setNotFoundMessage(
        `No document application was found matching reference "${trimmed}". Please double-check the tracking code on your voucher or SMS.`
      );
    }
  }, []);

  // Check live Firestore asynchronously if initialCode is provided
  useEffect(() => {
    if (!initialCode) return;
    let isCancelled = false;

    import("@/lib/firebase/firestore-service").then(({ getDocumentRequestFromFirestore }) => {
      getDocumentRequestFromFirestore(initialCode).then((firestoreDoc) => {
        if (!isCancelled && firestoreDoc) {
          setActiveRecord((prev) => ({
            ...prev,
            ...firestoreDoc,
            timeline: firestoreDoc.timeline || prev?.timeline || [],
          }));
        }
      });
    });

    return () => {
      isCancelled = true;
    };
  }, [initialCode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLookup(searchCode);
  };

  const handlePresetClick = (code: string) => {
    setSearchCode(code);
    performLookup(code);
  };

  // Determine stage progression for the 4-step visual timeline
  const getTimelineProgression = (status: StoredDocumentRequest["status"]) => {
    switch (status) {
      case "SUBMITTED":
        return 1;
      case "UNDER_REVIEW":
        return 2;
      case "READY_FOR_PICKUP":
        return 3;
      case "RELEASED":
        return 4;
      default:
        return 1;
    }
  };

  const currentStepNumber = activeRecord ? getTimelineProgression(activeRecord.status) : 1;

  const visualSteps = [
    {
      step: 1,
      title: "Submitted",
      desc: "Application received and queued online",
    },
    {
      step: 2,
      title: "Under Review",
      desc: "Residency & records verification by Clerk",
    },
    {
      step: 3,
      title: "Ready for Pickup",
      desc: "Signed by Captain, sealed & waiting at Hall",
    },
    {
      step: 4,
      title: "Released",
      desc: "Claimed & acknowledged by requestor",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Breadcrumb */}
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
              Live Tracker
            </span>
            <span className="text-xs text-slate-500">• Real-Time Queue Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Track Document Application
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Input your 14-character official tracking reference (e.g. <code>BRGY-2026-XXXX</code>) to view the live status and claiming instructions.
          </p>
        </div>

        {/* Search Input Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
              placeholder="e.g. BRGY-2026-PKUP or DOC-2026-X8K9M"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-mono tracking-wider text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white uppercase transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-transform active:scale-95 shrink-0 flex items-center justify-center gap-1.5"
          >
            <Search className="h-4 w-4" />
            <span>Track Status</span>
          </button>
        </form>

        {/* Demo Preset Quick Chips */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs px-1">
          <span className="text-slate-400 text-[11px] font-semibold">Try sample statuses:</span>
          <button
            type="button"
            onClick={() => handlePresetClick("BRGY-2026-SUBM")}
            className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-900 text-[11px]"
          >
            Submitted
          </button>
          <button
            type="button"
            onClick={() => handlePresetClick("BRGY-2026-REVW")}
            className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-900 text-[11px]"
          >
            Under Review
          </button>
          <button
            type="button"
            onClick={() => handlePresetClick("BRGY-2026-PKUP")}
            className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold hover:bg-emerald-100 text-[11px]"
          >
            Ready for Pickup
          </button>
          <button
            type="button"
            onClick={() => handlePresetClick("BRGY-2026-RELS")}
            className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-900 text-[11px]"
          >
            Released
          </button>
        </div>

        {/* Results View */}
        {activeRecord && (
          <div className="space-y-6 animate-in fade-in">
            {/* Main Status Header Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Official Reference Code
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h2 className="text-xl sm:text-2xl font-mono font-black text-blue-900 tracking-wider">
                      {activeRecord.trackingCode}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                    {activeRecord.documentTitle}
                  </p>
                  <p className="text-xs text-slate-500">
                    Applicant: <strong>{activeRecord.fullName}</strong> • {activeRecord.purok}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  {activeRecord.status === "SUBMITTED" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-extrabold">
                      <Clock className="h-4 w-4 text-blue-700 animate-spin" />
                      Queued for Review
                    </span>
                  )}
                  {activeRecord.status === "UNDER_REVIEW" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold">
                      <RefreshCw className="h-4 w-4 text-amber-700 animate-spin" />
                      Verification Ongoing
                    </span>
                  )}
                  {activeRecord.status === "READY_FOR_PICKUP" && (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black animate-pulse">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Approved & Ready for Pickup!
                    </span>
                  )}
                  {activeRecord.status === "RELEASED" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
                      <FileCheck className="h-4 w-4 text-slate-600" />
                      Released to Citizen
                    </span>
                  )}
                </div>
              </div>

              {/* 4-Step Visual Timeline */}
              <div className="py-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Visual Processing Progress
                </p>

                {/* Desktop Stepper Bar */}
                <div className="grid grid-cols-4 gap-2 relative">
                  {visualSteps.map((st) => {
                    const isDone = currentStepNumber >= st.step;
                    const isCurrent = currentStepNumber === st.step;

                    return (
                      <div key={st.step} className="flex flex-col items-center text-center">
                        <div
                          className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition-all z-10 ${
                            isCurrent
                              ? "bg-blue-900 text-white ring-4 ring-blue-100 shadow-sm"
                              : isDone
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {isDone && !isCurrent ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            st.step
                          )}
                        </div>
                        <h4
                          className={`text-xs mt-2 font-bold ${
                            isCurrent
                              ? "text-blue-900"
                              : isDone
                              ? "text-slate-900"
                              : "text-slate-400"
                          }`}
                        >
                          {st.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 hidden sm:block mt-0.5 leading-tight">
                          {st.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Activity Logs */}
              {activeRecord.timeline && activeRecord.timeline.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Administrative Action Logs
                  </p>
                  <div className="space-y-3">
                    {activeRecord.timeline.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <span className="flex h-5 w-5 rounded-full bg-slate-100 text-slate-600 items-center justify-center shrink-0 mt-0.5">
                          •
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{item.title}</span>
                            <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pickup Requirements & Instructions Card */}
            <div
              className={`rounded-3xl p-6 border shadow-sm space-y-3 ${
                activeRecord.status === "READY_FOR_PICKUP"
                  ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                  : "bg-amber-50/80 border-amber-300 text-amber-950"
              }`}
            >
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-amber-700 shrink-0" />
                <h3 className="font-extrabold text-sm sm:text-base">
                  Barangay Hall Claiming Instructions
                </h3>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed">
                <strong>Mandatory Requirement:</strong> {activeRecord.pickupRequirements}
              </p>

              <div className="pt-2 border-t border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span>
                  Office Hours: <strong>8:00 AM – 5:00 PM (Monday to Friday)</strong>
                </span>
                <span className="font-semibold">Fee: {activeRecord.fee}</span>
              </div>
            </div>

            {/* Print & Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href="/services"
                className="text-xs font-bold text-blue-900 hover:underline"
              >
                Apply for another document
              </Link>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs"
              >
                <Printer className="h-4 w-4" />
                <span>Print Status Slip</span>
              </button>
            </div>
          </div>
        )}

        {/* Not Found View */}
        {hasSearched && !activeRecord && notFoundMessage && (
          <div className="bg-white rounded-3xl border border-red-200 p-8 text-center space-y-4 animate-in fade-in shadow-xs">
            <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Tracking Reference Not Found</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mt-1">
                {notFoundMessage}
              </p>
            </div>

            {/* Quick Helper presets */}
            <div className="pt-2 max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">
                Looking for an example or demo record?
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePresetClick("BRGY-2026-PKUP")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 text-[11px] font-mono hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 font-bold transition-colors"
                >
                  BRGY-2026-PKUP (Pickup Ready)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetClick("BRGY-2026-SUBM")}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-800 text-[11px] font-mono hover:bg-blue-50 hover:border-blue-300 hover:text-blue-900 transition-colors"
                >
                  BRGY-2026-SUBM (Queued)
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/services/request/clearance"
                className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
              >
                Apply for New Barangay Clearance
              </Link>
              <Link
                href="/services"
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
              >
                Browse All Services
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackDocumentPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-500">
          Loading tracker interface...
        </div>
      }
    >
      <TrackDocumentContent />
    </Suspense>
  );
}
