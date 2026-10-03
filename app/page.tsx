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
  Activity
} from "lucide-react";
import {
  TODAY_OPERATING_STATUS,
  DISASTER_STATUS,
  MOCK_ANNOUNCEMENTS,
  QUICK_SERVICES
} from "@/lib/data";
import AnnouncementCarousel from "@/components/home/AnnouncementCarousel";
import BarangaySeal from "@/components/common/BarangaySeal";

export default function HomePage() {
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

      {/* 2. Quick Status Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Status Card 1: Current Disaster Alert Level */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200/80 shadow-md flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-0 pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
                  Disaster Preparedness Level
                </span>
                <span className="text-[11px] font-medium text-slate-500">
                  {DISASTER_STATUS.lastUpdated}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {DISASTER_STATUS.level}
                </h3>
                <span className="text-xs font-semibold text-amber-700">
                  ({DISASTER_STATUS.summary})
                </span>
              </div>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Active weather monitoring for localized flooding along{" "}
                <span className="font-semibold text-slate-800">
                  {DISASTER_STATUS.monitoredAreas}
                </span>
                . Barangay Disaster Risk Reduction team is on stand-by alert.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs relative z-10">
              <span className="text-slate-500">Center: Multi-Purpose Gym</span>
              <Link
                href="/news"
                className="font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
              >
                <span>Read PAGASA Advisory</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Status Card 2: Today's Barangay Hall Operating Status */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-200/80 shadow-md flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Operating Schedule
                </span>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Regular Operations
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {TODAY_OPERATING_STATUS.statusText}
                </h3>
              </div>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                <span>{TODAY_OPERATING_STATUS.officeHours}</span>
              </p>

              <p className="mt-1 text-xs text-slate-500 italic">
                {TODAY_OPERATING_STATUS.officerOnDuty}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs relative z-10">
              <span className="text-emerald-700 font-medium">
                {TODAY_OPERATING_STATUS.serviceAdvisory}
              </span>
              <Link
                href="/services"
                className="font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
              >
                <span>View Requirements</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Four-Card Quick Access Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Citizen Action Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fast, one-stop navigation to our most essential community services.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: /services */}
          <Link
            href="/services"
            className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FileText className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                Online Applications
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors mt-0.5">
                Barangay Services
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Apply online for Barangay Clearance, Certificate of Indigency, and Certificate of Residency in 3 easy steps.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>Apply Online</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 2: /reports */}
          <Link
            href="/reports"
            className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <AlertCircle className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                Community Feedback
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors mt-0.5">
                Sumbong Desk
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                File peace and order concerns, uncollected waste, streetlight issues, or noise complaints with anonymous option.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Report an Issue</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 3: /news */}
          <Link
            href="/news"
            className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-purple-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Newspaper className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                Public Bulletin
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors mt-0.5">
                News & Advisories
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Read official Barangay Ordinances, health immunization drives, utility maintenance, and SK community events.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>Browse News</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 4: /directory */}
          <Link
            href="/directory"
            className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-red-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between active:scale-[0.99]"
          >
            <div>
              <div className="h-12 w-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                <PhoneCall className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-700">
                Direct Contact
              </span>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-700 transition-colors mt-0.5">
                Public Directory
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                1-tap calling for Barangay Tanod Patrol, Health Center, PNP Substation, BFP Fire Station, and Purok Leaders.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-700">
              <span>View Contacts</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Latest Announcements Carousel Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full mb-1">
              <Activity className="h-3.5 w-3.5" />
              Official Barangay Bulletin
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Latest Announcements & Advisories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Verified updates enacted by the Sangguniang Barangay and local authorities.
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700 bg-white border border-slate-200 px-3.5 py-2 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors shrink-0"
          >
            <span>View All News ({MOCK_ANNOUNCEMENTS.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Carousel Component */}
        <AnnouncementCarousel announcements={MOCK_ANNOUNCEMENTS} />
      </section>

      {/* 5. Most Requested Services Fast-Track */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-br from-slate-900 to-blue-950 rounded-2xl p-6 sm:p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Quick Document Application
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Skip the lines. Submit your details online and claim your physical signed document at the Express Window.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors shrink-0"
            >
              <span>See All Requirements & Fees</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {QUICK_SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-colors"
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
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="h-10 w-10 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
              <PhoneCall className="h-5 w-5 fill-current animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-red-950">
                Experiencing a Community Emergency or Crime Incident?
              </h3>
              <p className="text-xs text-red-800">
                Call the Barangay Tanod Patrol Unit immediately for swift dispatch.
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
