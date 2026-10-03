"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bike,
  PhoneCall,
  Star,
  ArrowLeft
} from "lucide-react";
import {
  MOCK_PUTODA_DRIVERS,
  calculateTodaFare
} from "@/lib/economy-data";
import { Driver, FareDiscountType } from "@/types/economy";

export default function TodaRideBookingPage() {
  const [pickupPurok, setPickupPurok] = useState("Purok 1 (Riverside)");
  const [pickupLandmark, setPickupLandmark] = useState("");
  const [dropoffPurok, setDropoffPurok] = useState("Purok 5 (Central Market)");
  const [dropoffLandmark, setDropoffLandmark] = useState("");
  const [discountType, setDiscountType] = useState<FareDiscountType>("REGULAR");

  // Booking state machine: 'FORM' | 'SEARCHING' | 'ACCEPTED' | 'IN_TRANSIT' | 'COMPLETED'
  const [bookingState, setBookingState] = useState<"FORM" | "SEARCHING" | "ACCEPTED" | "IN_TRANSIT" | "COMPLETED">("FORM");
  const [assignedDriver, setAssignedDriver] = useState<Driver | null>(null);
  const [trackingCode, setTrackingCode] = useState("");

  const fareDetails = calculateTodaFare(pickupPurok, dropoffPurok, discountType);

  const handleStartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingState("SEARCHING");

    try {
      const { bookTodaRide, acceptTodaRide } = await import("@/app/actions/economy-actions");
      const bookRes = await bookTodaRide({
        passengerName: "Resident Commuter",
        passengerPhone: "0917-000-1122",
        pickupPurok,
        pickupLandmark: pickupLandmark || "Near Purok Waiting Shed",
        dropoffPurok,
        dropoffLandmark: dropoffLandmark || "Purok Entrance Gate",
        discountType,
        passengerCount: 1,
      });

      // Dispatch delay simulating driver acceptance
      setTimeout(async () => {
        const acceptRes = await acceptTodaRide(bookRes.ride.id, "drv-001");
        setAssignedDriver(acceptRes.ride?.driver || MOCK_PUTODA_DRIVERS[0]);
        setTrackingCode(bookRes.ride.trackingCode);
        setBookingState("ACCEPTED");
      }, 2500);
    } catch (err) {
      console.error("Booking error:", err);
      // Fallback
      setTimeout(() => {
        setAssignedDriver(MOCK_PUTODA_DRIVERS[0]);
        setTrackingCode(`PUTODA-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
        setBookingState("ACCEPTED");
      }, 2500);
    }
  };

  const handleCancel = () => {
    setBookingState("FORM");
    setAssignedDriver(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Header */}
        <div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-900 transition-colors mb-3 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Services Hub</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
              PUTODA Ride-Hailing
            </span>
            <span className="text-xs text-slate-500">• Pamplona Uno TODA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Book a Tricycle Ride
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            On-demand dispatch with official Pamplona Uno Sangguniang Bayan fare matrix. No overpricing.
          </p>
        </div>

        {/* 1. INITIAL BOOKING FORM */}
        {bookingState === "FORM" && (
          <form
            onSubmit={handleStartSearch}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in"
          >
            {/* Pickup & Dropoff */}
            <div className="space-y-4">
              {/* Pickup */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Pickup Location (Saan ka susunduin) *</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={pickupPurok}
                    onChange={(e) => setPickupPurok(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 font-semibold"
                  >
                    <option value="Purok 1 (Riverside)">Purok 1 (Riverside Terminal)</option>
                    <option value="Purok 2 (Sampaguita)">Purok 2 (Sampaguita)</option>
                    <option value="Purok 3 (Ilang-Ilang)">Purok 3 (Ilang-Ilang)</option>
                    <option value="Purok 4 (Mabuhay)">Purok 4 (Mabuhay)</option>
                    <option value="Purok 5 (Central Market)">Purok 5 (Central Market)</option>
                    <option value="Purok 6 (Highway)">Purok 6 (Highway Terminal)</option>
                    <option value="Purok 7 (Greenhills)">Purok 7 (Greenhills)</option>
                  </select>

                  <input
                    type="text"
                    required
                    value={pickupLandmark}
                    onChange={(e) => setPickupLandmark(e.target.value)}
                    placeholder="Specific house no., gate, or landmark"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Dropoff */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Dropoff Location (Saan ka bababa) *</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    value={dropoffPurok}
                    onChange={(e) => setDropoffPurok(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 font-semibold"
                  >
                    <option value="Purok 1 (Riverside)">Purok 1 (Riverside)</option>
                    <option value="Purok 2 (Sampaguita)">Purok 2 (Sampaguita)</option>
                    <option value="Purok 3 (Ilang-Ilang)">Purok 3 (Ilang-Ilang)</option>
                    <option value="Purok 4 (Mabuhay)">Purok 4 (Mabuhay)</option>
                    <option value="Purok 5 (Central Market)">Purok 5 (Central Market)</option>
                    <option value="Purok 6 (Highway)">Purok 6 (Highway Terminal)</option>
                    <option value="Purok 7 (Greenhills)">Purok 7 (Greenhills)</option>
                  </select>

                  <input
                    type="text"
                    required
                    value={dropoffLandmark}
                    onChange={(e) => setDropoffLandmark(e.target.value)}
                    placeholder="Dropoff street or landmark"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Discount selector */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Passenger Fare Discount (20% Statutory Deduction)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "REGULAR", label: "Regular" },
                  { id: "SENIOR_CITIZEN", label: "Senior (20%)" },
                  { id: "STUDENT", label: "Student (20%)" },
                  { id: "PWD", label: "PWD (20%)" },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDiscountType(d.id as FareDiscountType)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                      discountType === d.id
                        ? "bg-blue-900 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fare Estimate Card */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block">
                  Official TODA Metered Fare
                </span>
                <span className="text-xs text-slate-600">
                  {discountType !== "REGULAR" ? "Discounted fare (ID checked by driver)" : "Standard single trip fare"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-blue-950 font-mono">
                  ₱{fareDetails.fare}.00
                </span>
                {fareDetails.isDiscounted && (
                  <span className="block text-[11px] text-emerald-700 font-bold">
                    Saved ₱{fareDetails.discountSavings}.00
                  </span>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={!pickupLandmark || !dropoffLandmark}
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Bike className="h-5 w-5" />
              <span>Broadcast Ride to Pamplona Uno Drivers</span>
            </button>
          </form>
        )}

        {/* 2. SEARCHING / RADAR STATE */}
        {bookingState === "SEARCHING" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-5 animate-in fade-in">
            {/* Animated Radar Pulse */}
            <div className="relative h-24 w-24 mx-auto flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
              <span className="absolute inset-2 rounded-full bg-blue-400/20 animate-pulse" />
              <div className="relative h-14 w-14 rounded-full bg-blue-900 text-white flex items-center justify-center shadow-lg">
                <Bike className="h-7 w-7" />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                Broadcasting to {pickupPurok} Terminal
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Matching with Online PUTODA Drivers...
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Drivers within your purok are receiving your pickup alert. Please keep this screen open.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
            >
              Cancel Broadcast
            </button>
          </div>
        )}

        {/* 3. DRIVER ACCEPTED STATE */}
        {bookingState === "ACCEPTED" && assignedDriver && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                  Driver Dispatched & On the Way
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                {trackingCode}
              </span>
            </div>

            {/* Driver Profile Card */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-14 w-14 rounded-2xl bg-amber-400 text-slate-950 flex flex-col items-center justify-center font-black shrink-0 shadow-md">
                  <span className="text-[10px] uppercase tracking-tighter">BODY NO.</span>
                  <span className="text-lg leading-none">{assignedDriver.bodyNumber}</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {assignedDriver.fullName}
                  </h3>
                  <p className="text-xs text-amber-300 font-semibold">
                    {assignedDriver.todaAssociation}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                      <Star className="h-3 w-3 fill-current" />
                      {assignedDriver.ratingAverage}
                    </span>
                    <span>•</span>
                    <span>{assignedDriver.totalCompletedRides} trips</span>
                  </div>
                </div>
              </div>

              {/* 1-Tap Dial to Driver */}
              <a
                href={`tel:${assignedDriver.phone}`}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 shrink-0"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Call Driver ({assignedDriver.phone})</span>
              </a>
            </div>

            {/* Trip Progress Visual Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Pickup:</span>
                <span className="font-bold text-slate-900 text-right">
                  {pickupPurok} ({pickupLandmark})
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Dropoff:</span>
                <span className="font-bold text-slate-900 text-right">
                  {dropoffPurok} ({dropoffLandmark})
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-semibold">Fare to Pay Cash:</span>
                <span className="text-base font-black text-blue-900 font-mono">
                  ₱{fareDetails.fare}.00
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                Cancel Booking
              </button>
              <Link
                href="/services/toda/driver"
                className="text-xs font-bold text-blue-900 hover:underline"
              >
                Driver View Console →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
