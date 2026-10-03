"use client";

import React, { useState } from "react";
import {
  PhoneCall,
  Search,
  Clock,
  MapPin
} from "lucide-react";

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const contacts = [
    {
      category: "EMERGENCY",
      name: "Barangay Tanod Patrol Command Desk",
      designation: "Peace and Order Dispatcher",
      phone: "0917-555-8266",
      hours: "24/7 Always Active",
      location: "Ground Floor, Barangay Hall",
      isEmergency: true,
    },
    {
      category: "HEALTH",
      name: "Barangay Health Station & Maternity Clinic",
      designation: "Dr. Carmen Mendoza / Head Nurse",
      phone: "(02) 8555-1234",
      hours: "8:00 AM – 5:00 PM Daily",
      location: "Health Center Annex Building",
      isEmergency: false,
    },
    {
      category: "POLICE_FIRE",
      name: "PNP Las Piñas Substation 2 (Pamplona)",
      designation: "Station Commander",
      phone: "117 / (02) 8808-7962",
      hours: "24/7 Emergency Dispatch",
      location: "Alabang-Zapote Rd, Pamplona, Las Piñas",
      isEmergency: true,
    },
    {
      category: "POLICE_FIRE",
      name: "BFP Las Piñas City Central Fire Station",
      designation: "City Fire Marshall",
      phone: "160 / (02) 8871-0814",
      hours: "24/7 Fire & Rescue",
      location: "Alabang-Zapote Rd, Las Piñas City",
      isEmergency: true,
    },
    {
      category: "OFFICIALS",
      name: "Hon. Roberto Hernandez",
      designation: "Punong Barangay (Barangay Captain)",
      phone: "0918-123-4567",
      hours: "Mon-Fri: 8:00 AM – 5:00 PM",
      location: "Office of the Punong Barangay",
      isEmergency: false,
    },
    {
      category: "OFFICIALS",
      name: "Hon. Joshua Bautista",
      designation: "SK Chairperson (Youth Affairs)",
      phone: "0919-987-6543",
      hours: "Tue-Sat: 1:00 PM – 6:00 PM",
      location: "SK Youth Office, 2nd Floor",
      isEmergency: false,
    },
    {
      category: "PUROK",
      name: "Tatay Jose Mercado",
      designation: "Purok 1 Leader (Riverside)",
      phone: "0920-333-1122",
      hours: "On-Call Resident Contact",
      location: "Purok 1 Outpost",
      isEmergency: false,
    },
    {
      category: "PUROK",
      name: "Nanay Elena Santos",
      designation: "Purok 2 Leader (Sampaguita)",
      phone: "0921-444-2233",
      hours: "On-Call Resident Contact",
      location: "Purok 2 Community Center",
      isEmergency: false,
    },
  ];

  const filtered = contacts.filter((c) => {
    const matchesCat = selectedCategory === "ALL" || c.category === selectedCategory;
    const q = search.toLowerCase();
    const matchesQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.designation.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q);

    return matchesCat && matchesQuery;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-900 bg-red-100 px-2.5 py-0.5 rounded-full">
            <PhoneCall className="h-3.5 w-3.5 text-red-700" />
            <span>Public Information & Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Barangay Directory & Hotlines
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Direct contact numbers for Barangay Officials, Tanod Patrol, Health Center, Police, Fire Station, and Purok Leaders. Tap on any number to dial immediately.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, designation, purok, or phone number..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: "ALL", label: "All Contacts" },
              { id: "EMERGENCY", label: "Tanod & Emergency" },
              { id: "HEALTH", label: "Health Center" },
              { id: "POLICE_FIRE", label: "PNP & BFP Fire" },
              { id: "OFFICIALS", label: "Barangay Officials" },
              { id: "PUROK", label: "Purok Leaders" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${
                item.isEmergency
                  ? "border-red-200 hover:border-red-400"
                  : "border-slate-200 hover:border-blue-400"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      item.isEmergency
                        ? "bg-red-100 text-red-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.category.replace("_", " ")}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    {item.hours}
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900 mt-1">
                  {item.name}
                </h2>
                <p className="text-xs text-blue-900 font-semibold">{item.designation}</p>

                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{item.location}</span>
                </p>
              </div>

              {/* 1-Tap Dialing CTA */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <a
                  href={`tel:${item.phone.replace(/[^0-9+]/g, "")}`}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xs ${
                    item.isEmergency
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-blue-900 text-white hover:bg-blue-800"
                  }`}
                >
                  <PhoneCall className="h-3.5 w-3.5 fill-current" />
                  <span>Call {item.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
