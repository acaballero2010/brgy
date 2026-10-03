"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, X, ShieldAlert } from "lucide-react";
import { CURRENT_EMERGENCY_ALERT } from "@/lib/data";

export default function EmergencyAlertBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(() => {
    if (typeof window !== "undefined") {
      const cachedState = localStorage.getItem("emergency_alert_active");
      if (cachedState !== null) {
        return cachedState === "true";
      }
    }
    return CURRENT_EMERGENCY_ALERT.isActive;
  });

  useEffect(() => {
    const handleAlertChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isActive: boolean }>;
      if (customEvent.detail !== undefined) {
        setIsActive(customEvent.detail.isActive);
        setIsDismissed(false); // Reset dismissal on new alert activation
      }
    };

    window.addEventListener("emergency-alert-updated", handleAlertChange);
    return () => window.removeEventListener("emergency-alert-updated", handleAlertChange);
  }, []);

  const alert = CURRENT_EMERGENCY_ALERT;

  if (!isActive || isDismissed) {
    return null;
  }

  const isCritical = alert.level === "CRITICAL";

  return (
    <aside
      aria-label="Barangay Emergency Advisory"
      className={`relative z-40 transition-colors border-b ${
        isCritical
          ? "bg-red-700 text-white border-red-800"
          : "bg-amber-600 text-white border-amber-700 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left badge & Alert summary */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 animate-pulse text-white">
              {isCritical ? <ShieldAlert className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center rounded-sm bg-black/25 px-1.5 py-0.5 text-[11px] font-bold tracking-wider uppercase">
                  {alert.level}
                </span>
                <span className="text-xs sm:text-sm font-bold truncate">
                  {alert.title}
                </span>
              </div>
              <span className="hidden md:inline text-white/80 text-xs truncate max-w-xl">
                — {alert.message}
              </span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-black/20 hover:bg-black/30 text-[11px] sm:text-xs font-semibold text-white transition-colors"
              aria-expanded={isExpanded}
            >
              <span>{isExpanded ? "Less Details" : "Details"}</span>
              {isExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            <button
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss Emergency Banner"
              className="p-1 rounded text-white/80 hover:text-white hover:bg-black/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Collapsible detail drawer */}
        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t border-white/20 text-xs sm:text-sm grid grid-cols-1 md:grid-cols-3 gap-2 bg-black/15 p-3 rounded-md animate-in fade-in duration-150">
            <div className="md:col-span-2 space-y-1">
              <p className="font-semibold text-white/95">Situation Advisory:</p>
              <p className="text-white/90 leading-relaxed">{alert.message}</p>
              <p className="text-amber-200 text-xs font-medium pt-1">
                Issued by: {alert.source} • {alert.issuedAt}
              </p>
            </div>
            <div className="bg-white/10 p-2.5 rounded border border-white/15 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200 block">
                  Action Required
                </span>
                <p className="text-xs text-white/95 mt-0.5 leading-snug">
                  {alert.actionRequired}
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-white/80">Evacuation Center: Open</span>
                <span className="font-semibold underline">Gymnasium</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
