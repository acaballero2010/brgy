"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  FileText,
  AlertTriangle,
  Users,
  TrendingUp,
  Radio
} from "lucide-react";
import { CURRENT_EMERGENCY_ALERT } from "@/lib/data";

export default function AdminSuitePage() {
  const [alertActive, setAlertActive] = useState(() => {
    if (typeof window !== "undefined") {
      const cachedState = localStorage.getItem("emergency_alert_active");
      if (cachedState !== null) {
        return cachedState === "true";
      }
    }
    return CURRENT_EMERGENCY_ALERT.isActive;
  });

  const handleToggleAlert = () => {
    const nextState = !alertActive;
    setAlertActive(nextState);
    CURRENT_EMERGENCY_ALERT.isActive = nextState;
    localStorage.setItem("emergency_alert_active", String(nextState));
    window.dispatchEvent(
      new CustomEvent("emergency-alert-updated", { detail: { isActive: nextState } })
    );
  };

  return (
    <div className="bg-slate-100 min-h-screen py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded">
                  Staff & Admin Mode
                </span>
                <span className="text-xs text-slate-500">Barangay Pamplona Uno Portal, Las Piñas</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Administrative Control Suite
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Public View
            </Link>
          </div>
        </div>

        {/* Emergency Broadcast Toggle Card */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-amber-900">
                  Global Emergency Alert Banner
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${alertActive ? "bg-red-600 text-white" : "bg-slate-200 text-slate-700"}`}>
                  {alertActive ? "BROADCASTING LIVE" : "INACTIVE"}
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-1">
                When active, all visitors across every portal page will see the high-priority weather and evacuation banner.
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleAlert}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors shrink-0 ${
              alertActive
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {alertActive ? "Deactivate Broadcast" : "Broadcast Emergency"}
          </button>
        </div>

        {/* KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Clearances</span>
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">14</span>
              <span className="text-xs text-amber-600 font-bold">Needs Review</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Average turnaround: 22 mins</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Active Sumbong Tickets</span>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">3</span>
              <span className="text-xs text-blue-600 font-bold">Tanod Dispatched</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Latest report from Purok 2</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Verified Residents</span>
              <Users className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">4,892</span>
              <span className="text-xs text-emerald-600 font-bold">+18 today</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">7 Puroks fully onboarded</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Published Bulletins</span>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">38</span>
              <span className="text-xs text-slate-500 font-bold">This Month</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">1 active urgent notice</p>
          </div>
        </div>

        {/* Live Processing Queue Demo */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Frontline Document Request Processing Queue
              </h2>
              <p className="text-xs text-slate-500">
                Action pending applications submitted by citizens online.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="py-3 px-3 font-bold">Tracking Code</th>
                  <th className="py-3 px-3 font-bold">Applicant Name</th>
                  <th className="py-3 px-3 font-bold">Document Type</th>
                  <th className="py-3 px-3 font-bold">Purok</th>
                  <th className="py-3 px-3 font-bold">Status</th>
                  <th className="py-3 px-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-blue-900">DOC-2026-X8K9M</td>
                  <td className="py-3 px-3 font-bold text-slate-800">Juan Dela Cruz Jr.</td>
                  <td className="py-3 px-3">Barangay Clearance</td>
                  <td className="py-3 px-3">Purok 1</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Under Review
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="px-2.5 py-1 rounded bg-blue-900 text-white font-bold hover:bg-blue-800">
                      Approve & Print
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-blue-900">DOC-2026-A410N</td>
                  <td className="py-3 px-3 font-bold text-slate-800">Maria Teresa Ramos</td>
                  <td className="py-3 px-3">Certificate of Indigency</td>
                  <td className="py-3 px-3">Purok 4</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Ready for Pickup
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700">
                      Release
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
