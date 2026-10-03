import React from "react";
import Link from "next/link";
import {
  Clock,
  ArrowRight,
  Search,
  CheckCircle2
} from "lucide-react";
import { QUICK_SERVICES } from "@/lib/data";

export default function ServicesCatalogPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
            <span>Barangay e-Services Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Official Services & Certificates
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Apply online for official certificates, clearances, and permits issued by Barangay Pamplona Uno, Las Piñas City. You can pick up the signed hard copy or download the digital claim voucher.
          </p>
        </div>

        {/* Quick Tracker Banner */}
        <div className="bg-linear-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h2 className="text-base sm:text-lg font-bold">Already applied for a document?</h2>
            <p className="text-xs text-blue-200 mt-0.5">
              Check real-time processing status with your reference code.
            </p>
          </div>
          <Link
            href="/services/track"
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-transform active:scale-95 shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <Search className="h-4 w-4" />
            <span>Track Reference Code</span>
          </Link>
        </div>

        {/* Hyper-Local Economic Services: TODA & Pabili */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/services/toda/book"
            className="p-5 rounded-2xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-xs flex flex-col justify-between group active:scale-[0.98]"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 text-white px-2 py-0.5 rounded">
                PUTODA On-Demand
              </span>
              <h3 className="text-base font-black mt-2">Book a Tricycle</h3>
              <p className="text-xs text-slate-900 mt-1 leading-snug">
                Metered pickup from your gate across all 7 Puroks.
              </p>
            </div>
            <span className="text-xs font-bold mt-4 inline-flex items-center gap-1">
              <span>Book Ride</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/services/pabili/new"
            className="p-5 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xs flex flex-col justify-between group active:scale-[0.98]"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                Local Runner
              </span>
              <h3 className="text-base font-black mt-2">Pabili at Padala</h3>
              <p className="text-xs text-emerald-100 mt-1 leading-snug">
                Market shopping and pharmacy grocery errand runs.
              </p>
            </div>
            <span className="text-xs font-bold mt-4 inline-flex items-center gap-1">
              <span>Request Errand</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/marketplace"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 text-slate-900 transition-all shadow-xs flex flex-col justify-between group active:scale-[0.98]"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                Talipapa
              </span>
              <h3 className="text-base font-black mt-2">Community Market</h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                Buy home cooked meals, fresh goods, and local crafts.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 mt-4 inline-flex items-center gap-1">
              <span>Browse Items</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            href="/jobs"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 text-slate-900 transition-all shadow-xs flex flex-col justify-between group active:scale-[0.98]"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                PESO Desk
              </span>
              <h3 className="text-base font-black mt-2">Barangay Job Board</h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                One-time handyman gigs and local neighborhood hiring.
              </p>
            </div>
            <span className="text-xs font-bold text-blue-900 mt-4 inline-flex items-center gap-1">
              <span>Find Gigs</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUICK_SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                    {srv.badge}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-700 block">
                      {srv.fee}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Processing: {srv.processingTime}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                  {srv.title}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {srv.description}
                </p>

                {/* Common Requirements checklist */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Basic Requirements:
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Valid Government-issued ID or School ID</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Proof of residency (Purok verification or utility bill)</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  Same-day processing
                </span>
                <Link
                  href={srv.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
                >
                  <span>Start Online Request</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
