"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShieldCheck,
  Home,
  QrCode,
  FileText,
  AlertCircle,
  Bike,
  ShoppingBag,
  LogOut,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import BarangaySeal from "@/components/common/BarangaySeal";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { profile, logoutResident } = useAuth();

  const handleSignOut = async () => {
    await logoutResident();
    router.push("/");
  };

  // If not logged in
  if (!profile) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center space-y-5">
          <div className="h-16 w-16 rounded-full bg-blue-50 text-blue-900 mx-auto flex items-center justify-center">
            <User className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Resident Access Required
            </h1>
            <p className="text-xs text-slate-500">
              Sign in or register your Pamplona Uno residency to view your official digital resident card and saved records.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/login"
              className="w-full py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Sign In to Your Account</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Register as New Resident</span>
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Profile Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center text-xl font-black shadow-sm">
              {profile.firstName[0]}
              {profile.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-slate-900">
                  {profile.fullName}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  Verified Resident
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {profile.purok} • {profile.streetAddress}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Official Digital Barangay Resident Card */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Official Digital Resident ID
            </h2>
            <span className="text-xs text-blue-900 font-semibold">
              Valid for all Barangay Transactions
            </span>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-950 via-slate-900 to-blue-900 text-white p-6 sm:p-8 shadow-xl border border-amber-400/40">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header of ID Card */}
            <div className="flex items-center justify-between pb-4 border-b border-white/15 relative z-10">
              <div className="flex items-center gap-3">
                <BarangaySeal size={48} className="shadow-xs shrink-0" />
                <div>
                  <h3 className="text-sm sm:text-base font-black tracking-tight uppercase leading-tight">
                    Barangay Pamplona Uno
                  </h3>
                  <p className="text-xs text-blue-200">
                    City of Las Piñas • Kalakhang Maynila (NCR)
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-3 py-1 rounded-full shadow-xs">
                Resident Citizen ID
              </span>
            </div>

            {/* Resident Details Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                    Full Resident Name
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {profile.fullName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                      Assigned Purok
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 mt-0.5">
                      <Home className="h-3.5 w-3.5" />
                      {profile.purok}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                      Resident Category
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 mt-0.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {profile.residentCategory}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                      Registered Address
                    </span>
                    <p className="text-slate-200 mt-0.5 font-medium leading-snug">
                      {profile.streetAddress}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                      Voter Record
                    </span>
                    <p className="text-slate-200 mt-0.5 font-medium leading-snug">
                      {profile.voterStatus}
                    </p>
                  </div>
                </div>
              </div>

              {/* ID Barcode / Meta Block */}
              <div className="flex flex-col justify-between bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                    Official Reference No.
                  </span>
                  <p className="font-mono text-lg font-black text-amber-300">
                    {profile.barangayIdNumber}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                    ID on File ({profile.idType})
                  </span>
                  <p className="font-mono text-xs text-slate-300">
                    {profile.idNumber}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <QrCode className="h-4 w-4 text-amber-300" />
                    BPU-CERT
                  </span>
                  <span className="text-emerald-400 font-semibold">Active & Valid</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Resident Actions */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Resident Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/services"
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center mb-3 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Request Clearance</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Apply for Barangay Clearance, Indigency, or Residency.
                </p>
              </div>
              <span className="text-xs font-bold text-blue-900 mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Apply Online</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <Link
              href="/reports/new"
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Sumbong Desk</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Report street issues, drainage, or community concerns.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-800 mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>File Report</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <Link
              href="/services/toda/book"
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Bike className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Book TODA Trike</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fixed fare Pamplona Uno tricycle commuter dispatch.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Book Ride</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <Link
              href="/services/pabili/new"
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-purple-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Pabili Runner</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Hire a trusted barangay runner for groceries & medicine.
                </p>
              </div>
              <span className="text-xs font-bold text-purple-800 mt-4 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Request Errand</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
