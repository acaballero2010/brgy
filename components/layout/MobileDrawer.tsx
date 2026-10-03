"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Home,
  Newspaper,
  FileText,
  AlertCircle,
  PhoneCall,
  Shield,
  Clock,
  ExternalLink,
  ChevronRight,
  MapPin,
  Store,
  Briefcase,
  Bike,
  ShoppingBag
} from "lucide-react";
import BarangaySeal from "@/components/common/BarangaySeal";
import { EMERGENCY_CONTACTS, TODAY_OPERATING_STATUS } from "@/lib/data";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const navLinks = [
    { label: "Home", href: "/", icon: Home, desc: "Portal overview & urgent notices" },
    { label: "Community News", href: "/news", icon: Newspaper, desc: "Ordinances, health & bulletins" },
    { label: "Barangay Services", href: "/services", icon: FileText, desc: "Clearance, Indigency, Residency" },
    { label: "Sumbong Desk", href: "/reports", icon: AlertCircle, desc: "File community reports & issues" },
    { label: "Directory & Hotlines", href: "/directory", icon: PhoneCall, desc: "Tanod, PNP, BFP, Health Center" },
  ];

  const economyLinks = [
    { label: "Talipapa Marketplace", href: "/marketplace", icon: Store, desc: "Home-cooked food, crafts & fresh produce" },
    { label: "Barangay Job Board", href: "/jobs", icon: Briefcase, desc: "PESO-accredited gigs & local hiring" },
    { label: "PUTODA Ride Booking", href: "/services/toda/book", icon: Bike, desc: "Fixed-fare tricycle dispatch" },
    { label: "Pabili / Padala Runner", href: "/services/pabili/new", icon: ShoppingBag, desc: "Intra-purok errands & medicine" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
        {/* Drawer Header */}
        <div className="p-4 bg-linear-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarangaySeal size={40} />
            <div>
              <h2 className="font-bold text-sm tracking-wide leading-tight">Barangay Pamplona Uno</h2>
              <p className="text-[11px] text-blue-200 flex items-center gap-1">
                <MapPin className="h-3 w-3 inline" /> City of Las Piñas, Metro Manila
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Operating Status Pill */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 text-xs flex items-center justify-between text-emerald-900">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">{TODAY_OPERATING_STATUS.statusText}</span>
          </div>
          <span className="text-[11px] text-emerald-700">8AM - 5PM</span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
            Main Navigation
          </p>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors group ${
                  isActive
                    ? "bg-blue-50 text-blue-900 font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div
                  className={`p-2 rounded-md shrink-0 mt-0.5 ${
                    isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{link.label}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-xs text-slate-500 truncate">{link.desc}</p>
                </div>
              </Link>
            );
          })}

          {/* Economic & Livelihood Services Section */}
          <div className="pt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 mb-2 px-2 flex items-center justify-between">
              <span>Talipapa, Gigs & TODA</span>
              <span className="text-[10px] text-amber-700 bg-amber-100 font-bold px-1.5 py-0.2 rounded-full">Active</span>
            </p>
            {economyLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors group ${
                    isActive
                      ? "bg-amber-50 text-amber-950 font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div
                    className={`p-2 rounded-md shrink-0 mt-0.5 ${
                      isActive ? "bg-amber-600 text-white" : "bg-amber-100 text-amber-800 group-hover:bg-amber-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.label}</span>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-amber-700 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-xs text-slate-500 truncate">{item.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Track link */}
          <div className="pt-3">
            <Link
              href="/services/track"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors"
            >
              <span>Track Document Request</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Quick Emergency Contacts */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-red-600 mb-2 px-2 flex items-center justify-between">
              <span>One-Tap Hotlines</span>
              <span className="text-[10px] text-slate-400 font-normal">24/7 Available</span>
            </p>
            <div className="grid grid-cols-1 gap-2">
              {EMERGENCY_CONTACTS.slice(0, 2).map((contact, idx) => (
                <a
                  key={idx}
                  href={`tel:${contact.number.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-red-50 hover:border-red-200 border border-slate-200 transition-colors text-xs text-slate-800"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{contact.title}</p>
                    <p className="text-red-700 font-bold">{contact.number}</p>
                  </div>
                  <span className="px-2 py-1 bg-red-600 text-white rounded text-[11px] font-bold shrink-0">
                    Call
                  </span>
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer info & Admin login */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1 text-[11px]">
              <Clock className="h-3 w-3 text-slate-400" /> Mon - Fri: 8:00 AM - 5:00 PM
            </span>
            <Link
              href="/admin"
              onClick={onClose}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
            >
              <Shield className="h-3.5 w-3.5" />
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
