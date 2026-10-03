import React from "react";
import Link from "next/link";
import {
  FileText,
  AlertCircle,
  Newspaper,
  PhoneCall,
  Clock,
  ArrowRight,
  AlertTriangle,
  Search,
  Sparkles,
  ChevronRight,
  Activity,
  Bike,
  ShoppingBag,
  Briefcase,
  MapPin,
  Building,
  ShieldCheck
} from "lucide-react";
import {
  TODAY_OPERATING_STATUS,
  DISASTER_STATUS,
  MOCK_ANNOUNCEMENTS,
  QUICK_SERVICES
} from "@/lib/data";

export default function HomePage() {
  const latestThreeNews = MOCK_ANNOUNCEMENTS.slice(0, 3);

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      {/* 1. Hero Section */}
      <section className="relative bg-linear-to-b from-blue-950 via-slate-900 to-blue-900 text-white pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden">
        {/* Soft Ambient Radial Glows (No harsh screen dot patterns) */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            {/* Left Hero Core Content */}
            <div className="max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-xs font-semibold text-amber-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>e-Governance Portal • City of Las Piñas, Metro Manila</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
                Serbisyong Tapat at Maasahan para sa Bawat Mamamayan.
              </h1>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
                Welcome to the digital frontline of Barangay Pamplona Uno, Las Piñas City. Request official clearances, file community sumbong reports, book local tricycles, and access emergency services 24/7.
              </p>

              {/* Primary Action Buttons (2-Column Prominent Layout) */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/services"
                  className="flex-1 inline-flex items-center justify-between p-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-lg transition-transform active:scale-95 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-950/10 shrink-0">
                      <FileText className="h-6 w-6 text-slate-950" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm sm:text-base block leading-tight font-black">
                        Request Document
                      </span>
                      <span className="text-[11px] font-bold text-slate-800 block mt-0.5">
                        Clearance • Indigency • Residency
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 shrink-0 ml-2" />
                </Link>

                <Link
                  href="/reports/new"
                  className="flex-1 inline-flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold backdrop-blur-md shadow-lg transition-transform active:scale-95 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/10 shrink-0">
                      <AlertCircle className="h-6 w-6 text-amber-400" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm sm:text-base block leading-tight font-black text-white">
                        Report Concern
                      </span>
                      <span className="text-[11px] font-medium text-slate-300 block mt-0.5">
                        Sumbong Desk • Tanod Patrol
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 shrink-0 ml-2" />
                </Link>
              </div>

              {/* Secondary Utility: Quick Tracking Input Strip */}
              <div className="pt-2">
                <p className="text-xs text-slate-300 font-medium mb-1.5">
                  Already transacted? Track your document application or incident reference:
                </p>
                <form
                  action="/services/track"
                  method="GET"
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-lg bg-white/10 p-1.5 rounded-2xl backdrop-blur-md border border-white/20"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="code"
                      placeholder="Enter Tracking Reference (e.g. DOC-2026-X8K9M)"
                      className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-sm shrink-0 flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Track Status</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Live Dispatch & Quick Shortcuts Widget */}
            <div className="hidden lg:flex flex-col p-6 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-md w-full max-w-md text-left shadow-2xl space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black tracking-wider uppercase text-emerald-300">
                    Live Dispatch Desk
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/15 text-slate-200">
                  24/7 Operations
                </span>
              </div>

              {/* Duty Officer & Outpost Information */}
              <div className="space-y-1.5">
                <p className="text-xs font-extrabold text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{TODAY_OPERATING_STATUS.officerOnDuty}</span>
                </p>
                <p className="text-[11px] text-slate-300 flex items-center gap-2 pl-6">
                  <MapPin className="h-3.5 w-3.5 text-blue-300 shrink-0" />
                  <span>Main Desk: Alabang-Zapote Rd. Tanod Outpost</span>
                </p>
              </div>

              {/* 3 Direct Shortcut Action Buttons */}
              <div className="space-y-2">
                <Link
                  href="/services/toda/book"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold shrink-0">
                      <Bike className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black block group-hover:text-amber-300 transition-colors">
                        Request Tricycle / TODA
                      </span>
                      <span className="text-[11px] text-slate-300 block">
                        Pamplona Uno Trike Dispatch • Fixed Fare
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/services/pabili/new"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-400 text-slate-950 font-bold shrink-0">
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black block group-hover:text-emerald-300 transition-colors">
                        Pabili Errand Runner
                      </span>
                      <span className="text-[11px] text-slate-300 block">
                        Talipapa market, grocery & medicine
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/directory"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-400 text-slate-950 font-bold shrink-0">
                      <Building className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black block group-hover:text-blue-300 transition-colors">
                        View Evacuation Centers
                      </span>
                      <span className="text-[11px] text-slate-300 block">
                        Multi-Purpose Gym & School Shelters
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>

              {/* Footer Benchmark */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                <span>⚡ Tanod Response Time:</span>
                <span className="font-extrabold text-emerald-400">&lt; 10 Mins (7 Puroks)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Status Cards Section (Interactive & Baseline-Aligned) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Status Card 1: Disaster Preparedness Level (Dual PAGASA Axes: Rainfall + Wind) */}
          <Link
            href="/news"
            className="bg-white rounded-3xl p-6 border border-amber-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-0 pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
                  Disaster Preparedness Alert
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {DISASTER_STATUS.lastUpdated}
                </span>
              </div>

              {/* Dual PAGASA Axes Explicit Visual Distinction */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-xs font-black text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg">
                    🌧️ Rainfall Alert: ORANGE (Flooding Threat)
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg">
                    💨 Wind: SIGNAL NO. 1 (Tropical Depression)
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-1">
                  {DISASTER_STATUS.level}
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Active flood monitoring across{" "}
                <span className="font-bold text-slate-900">
                  {DISASTER_STATUS.monitoredAreas}
                </span>
                . BDRRMC emergency rescue crews & evacuation shelters are prepared.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs relative z-10">
              <span className="text-slate-500 font-medium">Shelter: {DISASTER_STATUS.evacuationCenter}</span>
              <span className="font-black text-blue-700 group-hover:text-blue-900 inline-flex items-center gap-1">
                <span>Read PAGASA Advisory</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>

          {/* Status Card 2: Today's Barangay Hall Operating Schedule */}
          <Link
            href="/services"
            className="bg-white rounded-3xl p-6 border border-emerald-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Barangay Hall Open Today
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Regular Operations
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {TODAY_OPERATING_STATUS.statusText}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-700 font-semibold flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{TODAY_OPERATING_STATUS.officeHours}</span>
                </p>
                <p className="mt-1 text-xs text-slate-500 italic">
                  {TODAY_OPERATING_STATUS.officerOnDuty}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-emerald-800 font-medium bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                {TODAY_OPERATING_STATUS.serviceAdvisory}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs relative z-10">
              <span className="text-slate-500 font-medium">Digital vouchers accepted</span>
              <span className="font-black text-blue-700 group-hover:text-blue-900 inline-flex items-center gap-1">
                <span>View Requirements</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Lower Fold: Quick Services Grid (4 Essential Community Features) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full mb-1">
            <Activity className="h-3.5 w-3.5" />
            Barangay Community Platform
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Key Services & Citizen Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Access document clearances, local commuter dispatch, neighborhood marketplace, and community job openings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Service 1: Barangay Clearance & Indigency */}
          <Link
            href="/services"
            className="group relative bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-2xs">
                <FileText className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Official Certifications
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors mt-0.5">
                Barangay Clearance & Indigency
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Apply online for Barangay Clearance, Certificate of Indigency, and Residency with digital claim vouchers.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>Apply for Certificate</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Service 2: TODA Trike Dispatch */}
          <Link
            href="/services/toda"
            className="group relative bg-white rounded-3xl p-6 border border-slate-200 hover:border-amber-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shadow-2xs">
                <Bike className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                Commuter Mobility
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-700 transition-colors mt-0.5">
                TODA Trike Dispatch
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Regulated tricycle booking with official Sangguniang Bayan metered fares and 20% senior/student discount.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Book a Trike Ride</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Service 3: Pabili & Community Market */}
          <Link
            href="/marketplace"
            className="group relative bg-white rounded-3xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-2xs">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                Talipapa & Errands
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors mt-0.5">
                Pabili & Community Market
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Order wet market produce, neighborhood food, or request a trusted barangay runner for medicine and grocery.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Explore Marketplace</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Service 4: Barangay Job Openings */}
          <Link
            href="/jobs"
            className="group relative bg-white rounded-3xl p-6 border border-slate-200 hover:border-purple-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-2xs">
                <Briefcase className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                Local Livelihood
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-purple-700 transition-colors mt-0.5">
                Barangay Job Openings
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Discover verified community gigs, carpentry, helper roles, and PESO-accredited local employment vacancies.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>Find Local Gigs</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Latest Announcements (3-Card Grid with View All News CTA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full mb-1">
              <Newspaper className="h-3.5 w-3.5" />
              Public Information Desk
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Latest Announcements & Public Bulletins
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Verified advisories, health drives, and municipal ordinances enacted by the Sangguniang Barangay.
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-black text-xs sm:text-sm transition-all shadow-xs shrink-0 self-start sm:self-auto"
          >
            <span>View All News ({MOCK_ANNOUNCEMENTS.length})</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 3-Card Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {latestThreeNews.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold uppercase tracking-wider text-[10px] text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.readTime}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {item.excerpt}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium text-[11px]">
                  {item.publishedAt}
                </span>
                <span className="font-bold text-blue-700 group-hover:text-blue-900 inline-flex items-center gap-1">
                  <span>Read Bulletin</span>
                  <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Most Requested Services Fast-Track */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-br from-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Quick Document Application
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Skip the physical lines. Submit your details online and claim your physical signed document at the Express Window.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors shrink-0"
            >
              <span>See All Requirements & Fees</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                      {srv.badge}
                    </span>
                    <span className="text-xs font-bold text-emerald-300">
                      {srv.fee}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">
                    {srv.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    ⏱️ {srv.processingTime}
                  </span>
                  <Link
                    href={srv.href}
                    className="text-xs font-bold text-amber-300 hover:text-amber-200 inline-flex items-center gap-1"
                  >
                    <span>Apply</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Emergency 1-Tap Dial Quick Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="h-11 w-11 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <PhoneCall className="h-5 w-5 fill-current animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-red-950">
                Experiencing a Community Emergency or Crime Incident?
              </h3>
              <p className="text-xs text-red-800">
                Call the Barangay Tanod Patrol Unit immediately for swift intra-purok dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 w-full md:w-auto">
            <a
              href="tel:09175558266"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Call Tanod: 0917-555-8266</span>
            </a>
            <Link
              href="/directory"
              className="flex-1 md:flex-initial inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white border border-red-300 text-red-900 hover:bg-red-100 font-bold text-xs sm:text-sm transition-colors"
            >
              <span>All Hotlines</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
