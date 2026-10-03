import React from "react";
import Link from "next/link";
import { Mail, MapPin, ShieldCheck } from "lucide-react";
import BarangaySeal from "@/components/common/BarangaySeal";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 lg:pb-12 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Barangay Identity & Seal */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BarangaySeal size={50} />
              <div>
                <h3 className="text-white font-extrabold text-base tracking-tight">
                  Barangay Pamplona Uno
                </h3>
                <p className="text-xs text-slate-400">City of Las Piñas, Metro Manila</p>
                <p className="text-[11px] text-amber-400 font-medium">Republika ng Pilipinas</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official e-Governance digital portal dedicated to transparent, responsive, and accountable public service for every resident.
            </p>
            <div className="inline-flex items-center gap-2 text-xs bg-slate-800 px-3 py-1.5 rounded-md text-slate-300 border border-slate-700">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Full Compliance with RA 10173 (Data Privacy)</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Citizen e-Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services/request/clearance" className="hover:text-amber-400 transition-colors">
                  Barangay Clearance Application
                </Link>
              </li>
              <li>
                <Link href="/services/request/indigency" className="hover:text-amber-400 transition-colors">
                  Certificate of Indigency
                </Link>
              </li>
              <li>
                <Link href="/services/request/residency" className="hover:text-amber-400 transition-colors">
                  Certificate of Residency
                </Link>
              </li>
              <li>
                <Link href="/services/track" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                  Track Document Request Status
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-amber-400 transition-colors">
                  Sumbong Desk (Community Issues)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Hotlines */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Emergency Hotlines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between">
                <span className="text-slate-400">Barangay Tanod:</span>
                <a href="tel:09175558266" className="text-white font-bold hover:text-amber-400">
                  0917-555-8266
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-400">Health Station:</span>
                <a href="tel:0285551234" className="text-white font-semibold hover:text-amber-400">
                  (02) 8555-1234
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-400">PNP Substation:</span>
                <a href="tel:117" className="text-white font-semibold hover:text-amber-400">
                  117 / (02) 8922-3344
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-400">BFP Fire Station:</span>
                <a href="tel:160" className="text-white font-semibold hover:text-amber-400">
                  160 / 0922-888-3473
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Office Address & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Barangay Hall Office
            </h4>
            <div className="text-xs text-slate-400 space-y-2">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Barangay Hall Complex, Alabang-Zapote Road, Pamplona Uno, Las Piñas City, Metro Manila 1740</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <span>contact@barangaypamplonauno.gov.ph</span>
              </p>
              <div className="p-2.5 rounded bg-slate-800/80 border border-slate-700/60 mt-2">
                <p className="text-[11px] text-slate-300 font-semibold">Service Hours:</p>
                <p className="text-[11px] text-slate-400">Monday - Friday: 8:00 AM – 5:00 PM</p>
                <p className="text-[10px] text-emerald-400 mt-1">24/7 Tanod Patrol Desk Always On-Duty</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Philippine Standard Time */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Barangay Pamplona Uno, City of Las Piñas. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/news" className="hover:text-slate-300">Public Bulletins</Link>
            <span>•</span>
            <Link href="/directory" className="hover:text-slate-300">Officials Directory</Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-slate-300">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
