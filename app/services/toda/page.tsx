"use client";

import React from "react";
import Link from "next/link";
import {
  Bike,
  Navigation,
  ArrowRight,
  Coins,
  ArrowLeft
} from "lucide-react";
import { TODA_FARES } from "@/lib/economy-data";

export default function TodaHubPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-900 transition-colors mb-3 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Services Catalog</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
              Community Mobility
            </span>
            <span className="text-xs text-slate-500">• Pamplona Uno TODA (PUTODA)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-1">
            PUTODA Tricycle Ride-Hailing
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Official digital dispatch platform connecting commuters with certified, franchised Pamplona Uno TODA drivers.
          </p>
        </div>

        {/* 2 Primary CTAs: Commuter vs Driver */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Passenger Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-400 hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Bike className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-extrabold uppercase text-amber-700 block">
                For Commuters
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Book a Tricycle Ride
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hail an accredited PUTODA tricycle from your house gate or purok outpost. Standard Sangguniang Bayan fares applied automatically with 20% Senior/Student discounts.
              </p>
            </div>

            <div className="pt-6">
              <Link
                href="/services/toda/book"
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <span>Book Tricycle Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Driver Console Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-sm flex flex-col justify-between hover:border-blue-500 transition-all">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Navigation className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-extrabold uppercase text-blue-400 block">
                For PUTODA Drivers
              </span>
              <h2 className="text-xl font-black text-white">
                Driver Dispatch Console
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Log on-duty, receive passenger pickup requests within your current terminal staging area, and record your daily shift earnings.
              </p>
            </div>

            <div className="pt-6">
              <Link
                href="/services/toda/driver"
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <span>Open Driver Dispatch Console</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Official Sangguniang Bayan Fare Matrix */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Official PUTODA Fare Matrix (City Ordinance)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Base Fare</span>
              <span className="text-xl font-mono font-black text-slate-900">₱{TODA_FARES.baseFareRegular}.00</span>
              <p className="text-[11px] text-slate-500 mt-0.5">First kilometer / within same Purok</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-700 uppercase font-bold block">Senior / Student / PWD</span>
              <span className="text-xl font-mono font-black text-emerald-800">₱{TODA_FARES.baseFareDiscounted}.00</span>
              <p className="text-[11px] text-emerald-700 mt-0.5">20% mandatory statutory deduction</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Succeeding Purok</span>
              <span className="text-xl font-mono font-black text-slate-900">+₱{TODA_FARES.perAdditionalPurok}.00</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Per additional Purok distance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
