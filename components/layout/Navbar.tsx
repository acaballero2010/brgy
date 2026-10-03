"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Phone,
  Shield,
  FileSearch,
  ChevronDown,
  Bike,
  ShoppingBag,
  Briefcase,
  AlertCircle,
  PhoneCall
} from "lucide-react";
import BarangaySeal from "@/components/common/BarangaySeal";
import MobileDrawer from "./MobileDrawer";

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const communityRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (communityRef.current && !communityRef.current.contains(event.target as Node)) {
        setIsCommunityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const communityItems = [
    {
      title: "TODA Ride-Hailing",
      desc: "Regulated tricycle booking & fare matrix",
      href: "/services/toda",
      icon: Bike,
      iconColor: "text-amber-600 bg-amber-50",
    },
    {
      title: "Pabili & Talipapa Marketplace",
      desc: "Local food, fresh produce & errand runners",
      href: "/marketplace",
      icon: ShoppingBag,
      iconColor: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Barangay Job Board",
      desc: "Community gig listings & local hiring",
      href: "/jobs",
      icon: Briefcase,
      iconColor: "text-blue-600 bg-blue-50",
    },
    {
      title: "Sumbong Incident Desk",
      desc: "File complaints & check resolution board",
      href: "/reports",
      icon: AlertCircle,
      iconColor: "text-purple-600 bg-purple-50",
    },
    {
      title: "Emergency Directory",
      desc: "Direct hotlines for Tanod, Health, BFP & PNP",
      href: "/directory",
      icon: PhoneCall,
      iconColor: "text-red-600 bg-red-50",
    },
  ];

  const isCommunityActive =
    pathname.startsWith("/marketplace") ||
    pathname.startsWith("/jobs") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/directory") ||
    pathname.startsWith("/services/toda");

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow duration-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 xl:gap-4">
            {/* Left: Clean Official Seal & Portal Identity */}
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-hidden focus:ring-2 focus:ring-blue-600 rounded-xl p-1 -ml-1 transition-opacity hover:opacity-95 shrink-0"
            >
              <BarangaySeal size={44} className="shadow-xs shrink-0" />
              <div className="flex flex-col justify-center">
                <span className="text-sm sm:text-base lg:text-lg font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-900 transition-colors whitespace-nowrap">
                  Barangay Pamplona Uno
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Hall Open
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 font-medium">Closes 5:00 PM</span>
                  <span className="hidden 2xl:inline text-slate-300">•</span>
                  <span className="hidden 2xl:inline text-slate-400">Las Piñas City</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 shrink-0">
              <Link
                href="/"
                className={`px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap ${
                  pathname === "/"
                    ? "bg-blue-900 text-white shadow-xs"
                    : "text-slate-700 hover:text-blue-900 hover:bg-slate-100"
                }`}
              >
                Home
              </Link>
              <Link
                href="/services"
                className={`px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap ${
                  pathname === "/services" || (pathname.startsWith("/services") && !pathname.startsWith("/services/toda") && !pathname.startsWith("/services/track"))
                    ? "bg-blue-900 text-white shadow-xs"
                    : "text-slate-700 hover:text-blue-900 hover:bg-slate-100"
                }`}
              >
                E-Services
              </Link>
              <Link
                href="/news"
                className={`px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap ${
                  pathname.startsWith("/news")
                    ? "bg-blue-900 text-white shadow-xs"
                    : "text-slate-700 hover:text-blue-900 hover:bg-slate-100"
                }`}
              >
                News
              </Link>

              {/* Community & Commerce Dropdown */}
              <div className="relative" ref={communityRef}>
                <button
                  type="button"
                  onClick={() => setIsCommunityOpen(!isCommunityOpen)}
                  onMouseEnter={() => setIsCommunityOpen(true)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isCommunityActive || isCommunityOpen
                      ? "bg-blue-50 text-blue-900 font-bold"
                      : "text-slate-700 hover:text-blue-900 hover:bg-slate-100"
                  }`}
                  aria-expanded={isCommunityOpen}
                >
                  <span>Community Hub</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      isCommunityOpen ? "rotate-180 text-blue-900" : "text-slate-400"
                    }`}
                  />
                </button>

                {isCommunityOpen && (
                  <div
                    onMouseLeave={() => setIsCommunityOpen(false)}
                    className="absolute left-0 mt-1.5 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Community Hub & Citizen Services
                    </div>
                    <div className="space-y-1 mt-1">
                      {communityItems.map((item) => {
                        const Icon = item.icon;
                        const isSubActive = pathname.startsWith(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsCommunityOpen(false)}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors ${
                              isSubActive
                                ? "bg-blue-50 text-blue-950 font-semibold"
                                : "hover:bg-slate-50 text-slate-800"
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${item.iconColor} shrink-0 mt-0.5`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold leading-snug">{item.title}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Track Document Button */}
              <Link
                href="/services/track"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 xl:py-2 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs whitespace-nowrap shrink-0"
                title="Track Request Status"
              >
                <FileSearch className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                <span className="hidden xl:inline">Track Request</span>
                <span className="xl:hidden">Track</span>
              </Link>

              {/* Primary Emergency Dialer */}
              <a
                href="tel:09175558266"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3.5 xl:py-2 text-xs font-black rounded-xl bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all shadow-xs whitespace-nowrap shrink-0"
                title="24/7 Tanod Patrol Emergency Hotline"
              >
                <Phone className="h-3.5 w-3.5 fill-current animate-pulse shrink-0" />
                <span className="hidden 2xl:inline">Emergency: 0917-555-8266</span>
                <span className="hidden sm:inline 2xl:hidden">Tanod: 0917-555-8266</span>
                <span className="sm:hidden">Tanod</span>
              </a>

              {/* Staff / Admin portal link */}
              <Link
                href="/admin"
                className="hidden lg:inline-flex items-center gap-1 px-2 py-1.5 xl:px-2.5 xl:py-2 text-xs font-medium rounded-xl text-slate-600 hover:text-blue-900 hover:bg-blue-50 transition-colors whitespace-nowrap shrink-0"
                title="Barangay Staff Access"
              >
                <Shield className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span>Staff</span>
              </Link>

              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-600 shrink-0 cursor-pointer"
                aria-label="Open mobile navigation"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Sheet */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
