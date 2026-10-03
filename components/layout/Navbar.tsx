"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Phone,
  Shield,
  FileSearch
} from "lucide-react";
import BarangaySeal from "@/components/common/BarangaySeal";
import MobileDrawer from "./MobileDrawer";

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "News", href: "/news" },
    { label: "Services", href: "/services" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Jobs", href: "/jobs" },
    { label: "Sumbong Desk", href: "/reports" },
    { label: "Directory", href: "/directory" },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Left: Barangay Seal & Portal Title */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-hidden focus:ring-2 focus:ring-blue-600 rounded-lg p-1 -ml-1 transition-opacity hover:opacity-95"
            >
              <BarangaySeal size={48} className="shadow-xs" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-blue-900 bg-blue-50 border border-blue-100 px-1.5 py-0.2 rounded">
                    Official Portal
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Hall Open
                  </span>
                </div>
                <span className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-blue-900 transition-colors">
                  Barangay Pamplona Uno
                </span>
                <span className="text-[11px] text-slate-500 -mt-0.5 hidden xs:block">
                  City of Las Piñas, Metro Manila • NCR
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-blue-900 text-white shadow-xs"
                        : "text-slate-700 hover:text-blue-900 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Quick Actions (Desktop + Tablet) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Track Document Button */}
              <Link
                href="/services/track"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-xs"
                title="Track Request Status"
              >
                <FileSearch className="h-3.5 w-3.5 text-blue-700" />
                <span>Track Request</span>
              </Link>

              {/* 1-Tap Emergency Hotline Call */}
              <a
                href="tel:09175558266"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all shadow-xs"
                title="24/7 Tanod Patrol Hotline"
              >
                <Phone className="h-3.5 w-3.5 fill-current animate-bounce" />
                <span className="hidden sm:inline">Tanod: 0917-555-8266</span>
                <span className="sm:hidden">Hotline</span>
              </a>

              {/* Staff / Admin portal link */}
              <Link
                href="/admin"
                className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                title="Barangay Staff Access"
              >
                <Shield className="h-3.5 w-3.5 text-slate-500" />
                <span>Staff</span>
              </Link>

              {/* Mobile Drawer Trigger (Sheet hamburger) */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
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
