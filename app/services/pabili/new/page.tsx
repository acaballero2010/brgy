"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  UserCheck,
  ShieldCheck,
  Loader2,
  PhoneCall
} from "lucide-react";
import { ErrandItem, Errand } from "@/types/economy";
import { useAuth } from "@/context/AuthContext";
import {
  createFirestoreErrand,
  subscribeToErrand
} from "@/lib/firebase/errands";

export default function NewPabiliErrandPage() {
  const { profile } = useAuth();

  const [errandType, setErrandType] = useState<"PABILI" | "PADALA">("PABILI");
  const [storeName, setStoreName] = useState("Pamplona Uno Wet Market (Talipapa)");
  const [storePurok, setStorePurok] = useState("Purok 5 (Central)");
  const [customDeliveryPurok, setCustomDeliveryPurok] = useState<string | null>(null);
  const [customDeliveryAddress, setCustomDeliveryAddress] = useState<string | null>(null);
  const [customRequesterName, setCustomRequesterName] = useState<string | null>(null);
  const [customContactPhone, setCustomContactPhone] = useState<string | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requesterName = customRequesterName ?? (profile?.fullName || "");
  const contactPhone = customContactPhone ?? (profile?.mobileNumber || "");
  const deliveryPurok = customDeliveryPurok ?? (profile?.purok ? `${profile.purok}` : "Purok 1 (Riverside)");
  const deliveryAddress = customDeliveryAddress ?? (profile?.streetAddress || "");

  // Dynamic Item List
  const [items, setItems] = useState<ErrandItem[]>([
    { name: "1 kg Tilapia (Linisan/Hiwain)", quantity: "1 kilo", estimatedPrice: 160 },
    { name: "Kangkong (2 tali)", quantity: "2 bundles", estimatedPrice: 30 },
  ]);

  const [submittedErrand, setSubmittedErrand] = useState<Errand | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Clean up subscription on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const addItemRow = () => {
    setItems([...items, { name: "", quantity: "1 pc", estimatedPrice: 50 }]);
  };

  const removeItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ErrandItem, value: string | number | undefined) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  // Calculations
  const itemsSubtotal = items.reduce(
    (acc, curr) => acc + (Number(curr.estimatedPrice) || 0),
    0
  );
  const serviceFee = 40; // Standard Purok runner fee
  const totalEstimatedCost = itemsSubtotal + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const createdErrand = await createFirestoreErrand({
        requesterId: profile?.uid || "usr-anon",
        requesterName: requesterName.trim() || profile?.fullName || "Resident Customer",
        requesterPhone: contactPhone.trim() || profile?.mobileNumber || "0917-111-2233",
        errandType,
        storeName,
        storeLocationOrPurok: storePurok,
        deliveryPurok,
        deliveryAddress: deliveryAddress || "Pamplona Uno Address",
        itemsList: items.filter((item) => item.name.trim().length > 0),
        specialInstructions,
      });

      setSubmittedErrand(createdErrand);

      // Listen to real-time status updates via Firestore onSnapshot
      const unsub = subscribeToErrand(createdErrand.id, (updated: Errand) => {
        setSubmittedErrand(updated);
      });
      unsubscribeRef.current = unsub;

      // Simulated runner assignment after 4 seconds if testing single-screen
      setTimeout(() => {
        setSubmittedErrand((prev) => {
          if (prev && prev.status === "REQUESTED") {
            return {
              ...prev,
              status: "ASSIGNED",
              runnerId: "run-001",
              runnerName: "Kuya Jun (PUTODA Runner #12)",
              runnerPhone: "0918-333-9900",
              assignedAt: new Date().toISOString(),
            };
          }
          return prev;
        });
      }, 4000);

    } catch (err) {
      console.error("Errand submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Breadcrumb */}
        <div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-900 transition-colors mb-3 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Services Catalog</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
              Community Errand Service
            </span>
            <span className="text-xs text-slate-500">• Pamplona Uno Runners</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Pabili at Padala Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Have an accredited local runner or TODA driver buy from the wet market, grocery, or pharmacy and deliver straight to your door.
          </p>
        </div>

        {/* Confirmation Screen */}
        {submittedErrand ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-5 animate-in zoom-in-95">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div>
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                submittedErrand.status === "ASSIGNED" || submittedErrand.status === "OUT_FOR_DELIVERY"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-emerald-50 text-emerald-700"
              }`}>
                {submittedErrand.status === "REQUESTED" && "Runner Queued for Assignment"}
                {submittedErrand.status === "ASSIGNED" && "Runner Assigned to Order"}
                {submittedErrand.status === "PURCHASING" && "Runner Purchasing Items"}
                {submittedErrand.status === "OUT_FOR_DELIVERY" && "Out for Delivery"}
                {submittedErrand.status === "DELIVERED" && "Delivered Successfully"}
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Pabili Request Confirmed!
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Your order is synced with Firestore and broadcasted to verified runners in {storePurok}.
              </p>
            </div>

            {/* Voucher Card */}
            <div className="max-w-sm mx-auto bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 text-left space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-bold uppercase text-[10px]">
                  Order Reference
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {submittedErrand.status}
                </span>
              </div>
              <p className="font-mono text-2xl font-black text-white">{submittedErrand.trackingCode}</p>

              <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 space-y-1">
                <p><strong>Store:</strong> {submittedErrand.storeName}</p>
                <p><strong>Items:</strong> {submittedErrand.itemsList.length} items listed</p>
                <p><strong>Delivery Fee:</strong> ₱{submittedErrand.serviceFee}.00</p>
                <p className="text-amber-200 text-xs font-bold pt-1">
                  Est. Total to Prepare: ₱{submittedErrand.totalPayableAmount}.00 (Cash on Delivery)
                </p>
              </div>

              {submittedErrand.runnerName && (
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Assigned Runner</span>
                    <p className="text-xs font-bold text-white">{submittedErrand.runnerName}</p>
                  </div>
                  {submittedErrand.runnerPhone && (
                    <a
                      href={`tel:${submittedErrand.runnerPhone}`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1"
                    >
                      <PhoneCall className="h-3 w-3" />
                      <span>Call</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSubmittedErrand(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Book Another Errand
              </button>
              <Link
                href="/services"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs"
              >
                Return to Services
              </Link>
            </div>
          </div>
        ) : (
          /* Pabili Order Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
          >
            {profile ? (
              <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                <UserCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>
                  Booking as registered resident: <strong>{profile.fullName}</strong> ({profile.purok})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0" />
                <span>
                  <Link href="/login" className="underline font-bold text-blue-900">Sign in</Link> to auto-fill delivery address and phone number.
                </span>
              </div>
            )}

            {/* Errand Type Selector */}
            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100">
              <button
                type="button"
                onClick={() => setErrandType("PABILI")}
                className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  errandType === "PABILI"
                    ? "bg-white text-emerald-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Pabili (Shopping / Meds)</span>
              </button>

              <button
                type="button"
                onClick={() => setErrandType("PADALA")}
                className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  errandType === "PADALA"
                    ? "bg-white text-blue-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Package className="h-4 w-4" />
                <span>Padala (Intra-Purok Drop)</span>
              </button>
            </div>

            {/* Requester Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Requester Name *
                </label>
                <input
                  type="text"
                  required
                  value={requesterName}
                  onChange={(e) => setCustomRequesterName(e.target.value)}
                  placeholder="e.g. Maria Santos"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setCustomContactPhone(e.target.value)}
                  placeholder="0917-123-4567"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-mono text-slate-900"
                />
              </div>
            </div>

            {/* Store Information */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Store / Market Name *
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Pamplona Wet Market, Mercury Drug, Southstar, 7-Eleven"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Store Location / Purok *
                </label>
                <select
                  value={storePurok}
                  onChange={(e) => setStorePurok(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 font-semibold"
                >
                  <option value="Purok 5 (Central)">Purok 5 (Central Market / Talipapa)</option>
                  <option value="Purok 1 (Riverside)">Purok 1 (Riverside)</option>
                  <option value="Purok 6 (Highway)">Purok 6 (National Highway / Commercial)</option>
                  <option value="Purok 2 (Sampaguita)">Purok 2 (Sampaguita)</option>
                  <option value="Purok 3 (Ilang-Ilang)">Purok 3 (Ilang-Ilang)</option>
                  <option value="Purok 4 (Mabuhay)">Purok 4 (Mabuhay)</option>
                  <option value="Purok 7 (Greenhills)">Purok 7 (Greenhills)</option>
                </select>
              </div>
            </div>

            {/* Dynamic Items Checklist */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Shopping Checklist ({items.length} items)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Add specific items with estimated budget.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addItemRow}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Item name / brand"
                      value={item.name}
                      onChange={(e) => updateItem(idx, "name", e.target.value)}
                      className="flex-3 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-900"
                    />
                    <input
                      type="text"
                      placeholder="Qty (e.g. 1 kg)"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-center text-slate-900"
                    />
                    <div className="relative flex-1">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                        ₱
                      </span>
                      <input
                        type="number"
                        placeholder="Cost"
                        value={item.estimatedPrice || ""}
                        onChange={(e) =>
                          updateItem(idx, "estimatedPrice", parseFloat(e.target.value) || 0)
                        }
                        className="w-full pl-5 pr-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-right font-mono text-slate-900"
                      />
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItemRow(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address & Contact */}
            <div className="pt-2 border-t border-slate-100 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Purok *
                  </label>
                  <select
                    value={deliveryPurok}
                    onChange={(e) => setCustomDeliveryPurok(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 font-semibold"
                  >
                    <option value="Purok 1 (Riverside)">Purok 1 (Riverside)</option>
                    <option value="Purok 2 (Sampaguita)">Purok 2 (Sampaguita)</option>
                    <option value="Purok 3 (Ilang-Ilang)">Purok 3 (Ilang-Ilang)</option>
                    <option value="Purok 4 (Mabuhay)">Purok 4 (Mabuhay)</option>
                    <option value="Purok 5 (Central)">Purok 5 (Central)</option>
                    <option value="Purok 6 (Highway)">Purok 6 (Highway)</option>
                    <option value="Purok 7 (Greenhills)">Purok 7 (Greenhills)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Address / Street *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setCustomDeliveryAddress(e.target.value)}
                    placeholder="Block and Lot number, street name, color of gate"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instructions for Runner (Optional)
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Please bring official receipt, text before arriving at gate"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900"
                />
              </div>
            </div>

            {/* Total Summary Card */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Estimated Items Cost:</span>
                <span className="font-mono font-bold text-slate-900">₱{itemsSubtotal}.00</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Standard Purok Runner Fee:</span>
                <span className="font-mono font-bold text-slate-900">₱{serviceFee}.00</span>
              </div>
              <div className="pt-2 border-t border-emerald-200 flex items-center justify-between font-bold text-emerald-950 text-sm">
                <span>Total Estimated Payable:</span>
                <span className="font-mono text-base font-black text-emerald-700">
                  ₱{totalEstimatedCost}.00
                </span>
              </div>
              <p className="text-[10px] text-emerald-800 italic">
                * Actual item total will be adjusted based on the official store receipt handed to you upon delivery.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !deliveryAddress || !contactPhone || items.length === 0}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-sm transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting to Pamplona Uno Runners...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>Book Pamplona Uno Runner (₱{totalEstimatedCost}.00 COD)</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
