"use client";

import React, { useState, useSyncExternalStore } from "react";
import {
  WifiOff,
  PhoneCall,
  X,
  Database
} from "lucide-react";
import { getOfflineSnapshot, saveOfflineSnapshot } from "@/lib/offline-cache";
import { OfflineCacheSnapshot } from "@/types/portal";

function subscribeOnline(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineStatus() {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}

function getServerOnlineStatus() {
  return true;
}

export default function OfflineCacheSync() {
  const isOnline = useSyncExternalStore(subscribeOnline, getOnlineStatus, getServerOnlineStatus);
  const isOffline = !isOnline;
  const [isDismissed, setIsDismissed] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [snapshot, setSnapshot] = useState<OfflineCacheSnapshot | null>(() => getOfflineSnapshot());

  const handleOpenDrawer = () => {
    setSnapshot(getOfflineSnapshot() || saveOfflineSnapshot());
    setShowDrawer(true);
  };

  if ((!isOffline || isDismissed) && !showDrawer) {
    return null;
  }

  return (
    <>
      {/* Offline Alert Strip when disconnected */}
      {isOffline && !isDismissed && (
        <div
          role="status"
          aria-live="polite"
          className="sticky top-0 z-50 bg-slate-900 text-amber-300 border-b border-amber-500/40 px-3 py-1.5 sm:py-2 text-xs shadow-md transition-all animate-in slide-in-from-top-2"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/20 text-amber-400 shrink-0 animate-pulse">
                <WifiOff className="h-3 w-3" />
              </span>
              <p className="font-semibold text-slate-100 truncate text-[11px] sm:text-xs">
                Offline Mode: Network disconnected. Showing 10 cached bulletins & emergency hotlines.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleOpenDrawer}
                className="px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <PhoneCall className="h-3 w-3" />
                <span>Offline Hotlines</span>
              </button>

              <button
                onClick={() => setIsDismissed(true)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                aria-label="Dismiss offline banner"
                title="Dismiss banner"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Emergency Numbers Modal / Drawer */}
      {showDrawer && snapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    Offline Emergency Hotlines
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Cached locally • Callable without internet access
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Emergency Contacts List */}
            <div className="space-y-2">
              {snapshot.hotlines.map((contact, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{contact.title}</p>
                    <p className="text-red-700 font-mono font-extrabold text-xs">
                      {contact.number}
                    </p>
                    <p className="text-[10px] text-slate-400">{contact.available}</p>
                  </div>
                  <a
                    href={`tel:${contact.number.replace(/[^0-9+]/g, "")}`}
                    className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-700 shadow-2xs"
                  >
                    Dial Now
                  </a>
                </div>
              ))}
            </div>

            {/* Offline Cache Info */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3 text-slate-400" />
                {snapshot.latestBulletins.length} bulletins cached locally
              </span>
              <span>Updated: {new Date(snapshot.cachedAt).toLocaleDateString()}</span>
            </div>

            <button
              onClick={() => setShowDrawer(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
            >
              Close Offline View
            </button>
          </div>
        </div>
      )}
    </>
  );
}
