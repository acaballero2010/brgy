"use client";

import React, { useState, useEffect } from "react";
import {
  Bike,
  Power,
  Navigation,
  CheckCircle2,
  PhoneCall,
  Coins,
  TrendingUp
} from "lucide-react";
import { MOCK_PUTODA_DRIVERS } from "@/lib/economy-data";

export default function TodaDriverConsolePage() {
  const driver = MOCK_PUTODA_DRIVERS[0]; // Danny Ramos, T-042

  const [isOnline, setIsOnline] = useState(true);
  const [currentTerminal, setCurrentTerminal] = useState("Purok 1 (Riverside Terminal)");

  // State: 'IDLE' | 'INCOMING_REQUEST' | 'ACCEPTED' | 'AT_PICKUP' | 'IN_TRANSIT' | 'COMPLETED'
  const [tripState, setTripState] = useState<
    "IDLE" | "INCOMING_REQUEST" | "ACCEPTED" | "AT_PICKUP" | "IN_TRANSIT" | "COMPLETED"
  >("IDLE");

  const [countdown, setCountdown] = useState(15);
  const [dailyEarnings, setDailyEarnings] = useState(480);
  const [dailyTrips, setDailyTrips] = useState(12);

  // Incoming simulated passenger request
  const incomingPassenger = {
    rideId: "RIDE-2026-X8K9",
    passengerName: "Maricar Mendoza",
    phone: "0917-444-8899",
    pickup: "Purok 1, Block 3 Lot 8, Riverside Lane",
    dropoff: "Purok 5 (Central Market, Talipapa Gate 1)",
    fare: 40,
    distanceKm: 1.2,
  };

  // Timer countdown for incoming ride
  useEffect(() => {
    if (tripState !== "INCOMING_REQUEST") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setTripState("IDLE");
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tripState]);

  const handleSimulateIncoming = () => {
    setCountdown(15);
    setTripState("INCOMING_REQUEST");
  };

  const handleAcceptRide = () => {
    // Simulated atomic DB lock
    setTripState("ACCEPTED");
  };

  const handleArrivedAtPickup = () => {
    setTripState("AT_PICKUP");
  };

  const handleStartTrip = () => {
    setTripState("IN_TRANSIT");
  };

  const handleCompleteTrip = () => {
    setDailyEarnings((prev) => prev + incomingPassenger.fare);
    setDailyTrips((prev) => prev + 1);
    setTripState("COMPLETED");
  };

  const handleReset = () => {
    setTripState("IDLE");
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen py-6 sm:py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header Card */}
        <div className="bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-700 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="h-14 w-14 rounded-2xl bg-amber-400 text-slate-950 flex flex-col items-center justify-center font-black shrink-0">
              <span className="text-[10px] uppercase">BODY</span>
              <span className="text-xl leading-none">{driver.bodyNumber}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400">
                  {driver.todaAssociation}
                </span>
                <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded font-semibold">
                  Driver Console
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white mt-0.5">
                {driver.fullName}
              </h1>
              <p className="text-xs text-slate-400">
                Franchise valid until {driver.franchiseExpiryDate}
              </p>
            </div>
          </div>

          {/* Online Toggle Button */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`p-3 rounded-2xl flex flex-col items-center justify-center font-bold text-xs transition-all active:scale-95 shadow-md ${
              isOnline
                ? "bg-emerald-500 hover:bg-emerald-600 text-slate-950"
                : "bg-slate-700 hover:bg-slate-600 text-slate-300"
            }`}
          >
            <Power className="h-6 w-6 mb-0.5" />
            <span>{isOnline ? "ONLINE" : "OFFLINE"}</span>
          </button>
        </div>

        {/* Shift KPI Metrics Strip */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
            <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
              <Coins className="h-4 w-4 text-amber-400" /> Today&apos;s Fares
            </span>
            <span className="text-2xl font-black font-mono text-white block mt-1">
              ₱{dailyEarnings}.00
            </span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
            <span className="text-xs text-slate-400 uppercase font-semibold flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-400" /> Completed Trips
            </span>
            <span className="text-2xl font-black font-mono text-white block mt-1">
              {dailyTrips} rides
            </span>
          </div>
        </div>

        {/* Current Staging Terminal Selector */}
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5">
            <Navigation className="h-4 w-4 text-blue-400" />
            <span>Current Terminal:</span>
          </span>
          <select
            value={currentTerminal}
            onChange={(e) => setCurrentTerminal(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
          >
            <option value="Purok 1 (Riverside Terminal)">Purok 1 (Riverside Terminal)</option>
            <option value="Purok 5 (Central Market)">Purok 5 (Central Market)</option>
            <option value="Purok 6 (Highway Terminal)">Purok 6 (Highway Terminal)</option>
          </select>
        </div>

        {/* TRIP STATE 1: IDLE / WAITING */}
        {tripState === "IDLE" && (
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
              <Bike className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isOnline ? "Waiting for Passenger Requests..." : "You are currently OFFLINE"}
              </h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                {isOnline
                  ? `Staged at ${currentTerminal}. New pickup requests within this purok will alert your screen with a 15-second timer.`
                  : "Tap the power button at the top to go online and receive ride bookings."}
              </p>
            </div>

            {isOnline && (
              <button
                type="button"
                onClick={handleSimulateIncoming}
                className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
              >
                Simulate Incoming Ride Request
              </button>
            )}
          </div>
        )}

        {/* TRIP STATE 2: INCOMING BROADCAST REQUEST */}
        {tripState === "INCOMING_REQUEST" && (
          <div className="bg-amber-500 text-slate-950 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider bg-black/20 px-2.5 py-1 rounded-full text-white">
                ⚡ New Ride Alert ({countdown}s)
              </span>
              <span className="font-mono text-xl font-black">₱{incomingPassenger.fare}.00</span>
            </div>

            <div>
              <h3 className="text-lg font-black">{incomingPassenger.passengerName}</h3>
              <p className="text-xs font-semibold text-slate-800">
                Distance: ~{incomingPassenger.distanceKm} km
              </p>
            </div>

            <div className="bg-white/30 p-3 rounded-2xl space-y-2 text-xs">
              <div>
                <span className="font-bold block text-[11px] uppercase">Pickup:</span>
                <p className="font-semibold">{incomingPassenger.pickup}</p>
              </div>
              <div className="pt-1 border-t border-black/10">
                <span className="font-bold block text-[11px] uppercase">Dropoff:</span>
                <p className="font-semibold">{incomingPassenger.dropoff}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTripState("IDLE")}
                className="flex-1 py-3 rounded-xl bg-black/20 hover:bg-black/30 font-bold text-xs text-white"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={handleAcceptRide}
                className="flex-2 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-sm shadow-md active:scale-95 transition-transform"
              >
                Accept Ride (₱{incomingPassenger.fare}.00)
              </button>
            </div>
          </div>
        )}

        {/* TRIP STATE 3, 4, 5: ACCEPTED -> AT PICKUP -> IN TRANSIT */}
        {["ACCEPTED", "AT_PICKUP", "IN_TRANSIT"].includes(tripState) && (
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {tripState === "ACCEPTED" && "Proceeding to Passenger Pickup"}
                  {tripState === "AT_PICKUP" && "At Passenger Gate / Waiting"}
                  {tripState === "IN_TRANSIT" && "Trip in Progress to Dropoff"}
                </span>
              </span>
              <span className="text-sm font-black font-mono text-amber-400">
                ₱{incomingPassenger.fare}.00
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-extrabold text-base text-white">
                  {incomingPassenger.passengerName}
                </p>
                <p className="text-xs text-slate-400">Pickup: {incomingPassenger.pickup}</p>
              </div>
              <a
                href={`tel:${incomingPassenger.phone}`}
                className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 font-bold text-xs flex items-center gap-1"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Call</span>
              </a>
            </div>

            {/* Step Controls */}
            <div className="pt-3">
              {tripState === "ACCEPTED" && (
                <button
                  type="button"
                  onClick={handleArrivedAtPickup}
                  className="w-full py-3.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm hover:bg-amber-300"
                >
                  I Have Arrived at Pickup Gate
                </button>
              )}
              {tripState === "AT_PICKUP" && (
                <button
                  type="button"
                  onClick={handleStartTrip}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-500"
                >
                  Passenger Onboard — Start Trip
                </button>
              )}
              {tripState === "IN_TRANSIT" && (
                <button
                  type="button"
                  onClick={handleCompleteTrip}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm hover:bg-emerald-400"
                >
                  Arrived at Dropoff — Complete & Collect ₱{incomingPassenger.fare}.00
                </button>
              )}
            </div>
          </div>
        )}

        {/* TRIP STATE 6: COMPLETED FARE RECEIPT */}
        {tripState === "COMPLETED" && (
          <div className="bg-slate-800 rounded-3xl border border-emerald-500/40 p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="h-14 w-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Trip Completed!</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Collect <strong>₱{incomingPassenger.fare}.00</strong> cash from passenger.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
            >
              Ready for Next Passenger
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
