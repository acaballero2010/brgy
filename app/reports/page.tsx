"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  PlusCircle,
  Filter
} from "lucide-react";

interface LocalReport {
  id?: string;
  trackingCode?: string;
  category: string;
  purok: string;
  title: string;
  status?: string;
  statusColor?: string;
  reportedAt?: string;
  resolution?: string;
  landmark?: string;
}

export default function SumbongDeskHubPage() {
  const [filterPurok, setFilterPurok] = useState("ALL");
  const [localReports] = useState<LocalReport[]>(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("brgy_reports") || "[]");
      } catch {
        return [];
      }
    }
    return [];
  });

  const sampleFeed = [
    {
      id: "RPT-2026-992",
      category: "Busted Light",
      purok: "Purok 3 (Ilang-Ilang)",
      title: "Broken streetlight near Day Care Center causing dark street",
      status: "RESOLVED",
      statusColor: "emerald",
      reportedAt: "Yesterday, 6:30 PM",
      resolution: "Tanod maintenance crew replaced the 50W LED bulb and restored illumination.",
    },
    {
      id: "RPT-2026-987",
      category: "Garbage",
      purok: "Purok 2 (Sampaguita)",
      title: "Uncollected commercial cardboard boxes along sidewalk",
      status: "DISPATCHED",
      statusColor: "blue",
      reportedAt: "2 days ago",
      resolution: "Clean and Green team scheduled for cleanup this morning.",
    },
    {
      id: "RPT-2026-981",
      category: "Noise",
      purok: "Purok 5 (Central)",
      title: "Loud karaoke past 10:00 PM curfew",
      status: "RESOLVED",
      statusColor: "emerald",
      reportedAt: "3 days ago",
      resolution: "Tanod Patrol responded and advised homeowner of Barangay Curfew Ordinance. Homeowner complied.",
    },
    {
      id: "RPT-2026-976",
      category: "Drainage",
      purok: "Purok 1 (Riverside)",
      title: "Clogged canal drainage causing street overflow after rain",
      status: "UNDER_REVIEW",
      statusColor: "amber",
      reportedAt: "4 days ago",
      resolution: "Engineering team scheduled for canal dredging this Saturday.",
    },
  ];

  // Combine local and sample feed
  const combinedFeed = [
    ...localReports.map((r) => ({
      id: r.trackingCode || r.id || "RPT-LOCAL",
      category: r.category,
      purok: r.purok,
      title: r.title,
      status: r.status || "DISPATCHED",
      statusColor: "blue",
      reportedAt: "Recent Submission",
      resolution: "Queued for Tanod inspection and site dispatch.",
    })),
    ...sampleFeed,
  ];

  const filteredFeed = combinedFeed.filter(
    (item) => filterPurok === "ALL" || item.purok.includes(filterPurok)
  );

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Quick Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
              <AlertCircle className="h-3.5 w-3.5 text-amber-700" />
              <span>Barangay Sumbong Desk & Citizen Action</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Community Incident & Resolution Board
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Report public hazards, peace & order violations, or infrastructure issues directly to the Barangay Tanod. Review live status updates on community resolutions.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/reports/new"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span>File a New Community Sumbong</span>
            </Link>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="font-bold">Filter by Purok:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {["ALL", "Purok 1", "Purok 2", "Purok 3", "Purok 4", "Purok 5"].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPurok(p)}
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-colors ${
                  filterPurok === p
                    ? "bg-blue-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p === "ALL" ? "All Puroks" : p}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredFeed.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-amber-400 transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-900 text-[11px] bg-blue-50 px-2 py-0.5 rounded">
                      {report.id}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {report.purok}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      report.status === "RESOLVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : report.status === "DISPATCHED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
                  {report.category}
                </span>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                  {report.title}
                </h3>

                {/* Tanod Action Box */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-0.5">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Barangay Action / Resolution:</span>
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {report.resolution}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Logged: {report.reportedAt}</span>
                <span className="text-blue-900 font-semibold">Desk Officer on Duty</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
