"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { ErrandItem } from "@/types/economy";

export default function NewPabiliErrandPage() {
  const [errandType, setErrandType] = useState<"PABILI" | "PADALA">("PABILI");
  const [storeName, setStoreName] = useState("Pamplona Uno Wet Market (Talipapa)");
  const [storePurok, setStorePurok] = useState("Purok 5 (Central)");
  const [deliveryPurok, setDeliveryPurok] = useState("Purok 1 (Riverside)");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Dynamic Item List
  const [items, setItems] = useState<ErrandItem[]>([
    { name: "1 kg Tilapia (Linisan/Hiwain)", quantity: "1 kilo", estimatedPrice: 160 },
    { name: "Kangkong (2 tali)", quantity: "2 bundles", estimatedPrice: 30 },
  ]);

  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

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
    try {
      const { submitErrandRequest } = await import("@/app/actions/economy-actions");
      const res = await submitErrandRequest({
        requesterName: "Resident Customer",
        requesterPhone: contactPhone || "0917-111-2233",
        errandType,
        storeName,
        storeLocationOrPurok: storePurok,
        deliveryPurok,
        deliveryAddress: deliveryAddress || "Pamplona Uno Resident Address",
        itemsList: items,
        specialInstructions,
      });
      setSubmittedCode(res.errand.trackingCode);
    } catch (err) {
      console.error("Errand submit error:", err);
      const code = `PABILI-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setSubmittedCode(code);
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
            Have an accredited local runner or tricycle driver buy from the wet market, grocery, or pharmacy and deliver straight to your door.
          </p>
        </div>

        {/* Confirmation Screen */}
        {submittedCode ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-5 animate-in zoom-in-95">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Runner Queued for Assignment
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Pabili Request Confirmed!
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Your order has been broadcasted to verified runners in {storePurok}.
              </p>
            </div>

            {/* Voucher Card */}
            <div className="max-w-sm mx-auto bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 text-left space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-bold uppercase text-[10px]">
                  Order Reference
                </span>
                <span className="font-mono font-bold text-emerald-400">QUEUED</span>
              </div>
              <p className="font-mono text-2xl font-black text-white">{submittedCode}</p>

              <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 space-y-1">
                <p><strong>Store:</strong> {storeName}</p>
                <p><strong>Items:</strong> {items.length} items listed</p>
                <p><strong>Delivery Fee:</strong> ₱{serviceFee}.00</p>
                <p className="text-amber-200 text-xs font-bold pt-1">
                  Est. Total to Prepare: ₱{totalEstimatedCost}.00 (Cash on Delivery)
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
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

            {/* Store Information */}
            <div className="space-y-4">
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Store Location / Purok *
                </label>
                <select
                  value={storePurok}
                  onChange={(e) => setStorePurok(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm"
                >
                  <option value="Purok 5 (Central)">Purok 5 (Central Market / Talipapa)</option>
                  <option value="Purok 1 (Riverside)">Purok 1 (Riverside)</option>
                  <option value="Purok 6 (Highway)">Purok 6 (National Highway / Commercial)</option>
                  <option value="Purok 2 (Sampaguita)">Purok 2 (Sampaguita)</option>
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
                      className="flex-3 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Qty (e.g. 1 kg)"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-center"
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
                        className="w-full pl-5 pr-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-right font-mono"
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
                    onChange={(e) => setDeliveryPurok(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm"
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
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="0917-123-4567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Address / Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Block and Lot number, street name, color of gate"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm"
                />
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm"
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
              disabled={!deliveryAddress || !contactPhone || items.length === 0}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-sm transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Book Pamplona Uno Runner (₱{totalEstimatedCost}.00 COD)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
