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
  Building
} from "lucide-react";
import {
  TODAY_OPERATING_STATUS,
  DISASTER_STATUS,
  MOCK_ANNOUNCEMENTS,
  QUICK_SERVICES
} from "@/lib/data";
import BarangaySeal from "@/components/common/BarangaySeal";

export default function HomePage() {
  const latestThreeNews = MOCK_ANNOUNCEMENTS.slice(0, 3);

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      {/* 1. Hero Section */}
      <section className="relative bg-linear-to-b from-blue-900 via-blue-950 to-slate-900 text-white pt-8 pb-14 sm:pt-12 sm:pb-20 overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left Hero Text */}
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-xs font-semibold text-amber-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>e-Governance Portal • City of Las Piñas, Metro Manila</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
                Serbisyong Tapat at Maasahan para sa Bawat Mamamayan.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Welcome to the digital frontline of Barangay Pamplona Uno, Las Piñas City. Request official barangay clearances, submit community sumbong reports, monitor local disaster alerts, and access emergency hotlines anytime.
              </p>

              {/* Quick Document Track Input Strip */}
              <div className="pt-2">
                <form
                  action="/services/track"
                  method="GET"
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-lg bg-white/10 p-1.5 rounded-xl backdrop-blur-md border border-white/20"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      name="code"
                      placeholder="Enter Tracking Code (e.g. DOC-2026-X8K9M)"
                      className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-sm shrink-0 flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Track Status</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
                <p className="text-[11px] text-slate-400 mt-2">
                  Need an urgent document? Online applications processed within 30 minutes.
                </p>
              </div>
            </div>

            {/* Right Seal & Local Highlights Card */}
            <div className="hidden lg:flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-sm text-center">
              <BarangaySeal size={96} className="mb-4 drop-shadow-lg" />
              <h2 className="font-bold text-lg text-white">Barangay Pamplona Uno</h2>
              <p className="text-xs text-blue-200 mt-1">
                Lungsod ng Las Piñas • Kalakhang Maynila (NCR)
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 w-full text-left">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Total Puroks
                  </span>
                  <span className="text-base font-extrabold text-white">7 Puroks</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Tanod Response
                  </span>
                  <span className="text-base font-extrabold text-emerald-400">&lt; 10 Mins</span>
                </div>
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

      {/* 3. Dedicated Quick Community Services Grid (Relocated from Hero) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full mb-1">
              <Activity className="h-3.5 w-3.5" />
              Barangay Community Platform
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Quick Community Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              One-stop access to barangay clearances, commuter dispatch, neighborhood marketplace, and community resources.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tanod Response &lt; 10 Mins Across 7 Puroks</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Barangay Clearance & Indigency */}
          <Link
            href="/services"
            className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center mb-3.5 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Official Certifications
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors mt-0.5">
                Barangay Clearance & Indigency
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Apply online for Barangay Clearance, Indigency, and Residency with digital claim vouchers.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-900">
              <span>Apply for Certificate</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 2: TODA Trike Dispatch */}
          <Link
            href="/services/toda/book"
            className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3.5 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <Bike className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                PUTODA Commuter Dispatch
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors mt-0.5">
                Request Tricycle / TODA
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                On-demand tricycle booking with official Sangguniang Bayan metered fares and statutory discounts.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>Book a Trike Ride</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 3: Pabili Errand Runner & Market */}
          <Link
            href="/services/pabili/new"
            className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Talipapa & Errands
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mt-0.5">
                Pabili Errand Runner
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Order wet market produce, talipapa groceries, or hire a trusted barangay runner for medicine delivery.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>Request Errand Runner</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 4: Barangay Job Openings */}
          <Link
            href="/jobs"
            className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-purple-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center mb-3.5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                Local Livelihood
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors mt-0.5">
                Barangay Job Openings
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Discover verified community gigs, carpentry, helpers, and PESO-accredited hiring within Pamplona Uno.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-800">
              <span>Find Local Gigs</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 5: Evacuation Centers & Tanod Outpost */}
          <Link
            href="/directory"
            className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-red-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="h-11 w-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-3.5 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <Building className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Emergency & Shelters
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors mt-0.5">
                View Evacuation Centers
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Multi-Purpose Gymnasium, designated school shelters, and Alabang-Zapote Rd. Tanod Outpost locations.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
              <span>View Shelter Map & Directory</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 6: Sumbong Incident Board */}
          <Link
            href="/reports"
            className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3.5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <AlertCircle className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Citizen Watchdesk
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors mt-0.5">
                Sumbong Resolution Board
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Public incident tracker for reported streetlights, uncollected waste, drainage issues, and Tanod resolutions.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>View Resolution Feed</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
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
