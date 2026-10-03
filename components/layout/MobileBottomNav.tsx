"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Newspaper,
  FileText,
  PhoneCall,
  UserCheck
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const tabs = [
    { label: "Home", href: "/", icon: Home },
    { label: "News", href: "/news", icon: Newspaper },
    { label: "Services", href: "/services", icon: FileText },
    { label: "Directory", href: "/directory", icon: PhoneCall },
    { label: "Portal", href: "/admin", icon: UserCheck },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.06)] pb-safe"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 relative transition-all active:scale-95 ${
                isActive
                  ? "text-blue-900 font-bold"
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}
            >
              {/* Active top pill indicator */}
              {isActive && (
                <span className="absolute -top-0.5 w-8 h-1 bg-blue-900 rounded-full" />
              )}
              <div
                className={`p-1 rounded-md transition-colors ${
                  isActive ? "bg-blue-50 text-blue-900" : ""
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              </div>
              <span className="text-[11px] leading-tight tracking-tight mt-0.5">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
