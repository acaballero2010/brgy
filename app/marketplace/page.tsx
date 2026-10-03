"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Store,
  Search,
  PhoneCall,
  Clock,
  MapPin,
  CheckCircle2,
  PlusCircle,
  MessageSquare,
  X,
  ShoppingBag,
  ShieldCheck
} from "lucide-react";
import { MOCK_MARKETPLACE_ITEMS } from "@/lib/economy-data";
import { MarketplaceCategory, MarketplaceItem } from "@/types/economy";
import { useAuth } from "@/context/AuthContext";
import {
  getMarketplaceItems,
  createMarketplaceItem,
  seedMarketplaceIfEmpty
} from "@/lib/firebase/marketplace";

export default function MarketplacePage() {
  const { profile } = useAuth();
  const [items, setItems] = useState<MarketplaceItem[]>(MOCK_MARKETPLACE_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeItem, setActiveItem] = useState<MarketplaceItem | null>(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellSuccess, setSellSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Listing Form State
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState<MarketplaceCategory>("FOOD");
  const [newSellerName, setNewSellerName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPurok, setNewPurok] = useState("Purok 3");
  const [newDesc, setNewDesc] = useState("");

  // Load items from Firestore on mount
  useEffect(() => {
    let isMounted = true;
    seedMarketplaceIfEmpty();
    getMarketplaceItems().then((liveItems) => {
      if (isMounted && liveItems.length > 0) {
        setItems(liveItems);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Open modal and pre-fill seller info from resident profile
  const handleOpenSellModal = () => {
    if (profile) {
      if (!newSellerName) setNewSellerName(profile.fullName);
      if (!newPhone) setNewPhone(profile.mobileNumber);
      if (profile.purok) setNewPurok(profile.purok);
    }
    setShowSellModal(true);
  };

  const categories = [
    { id: "ALL", label: "All Items" },
    { id: "FOOD", label: "Home Cooked & Food" },
    { id: "GOODS", label: "Fresh Goods & Produce" },
    { id: "SERVICES", label: "Local Services & Crafts" },
  ];

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.sellerName.toLowerCase().includes(q) ||
      item.sellerPurok.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
              <Store className="h-3.5 w-3.5 text-amber-700" />
              <span>Barangay Pamplona Uno Community Talipapa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Local Resident Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Support home-based micro-entrepreneurs, home cooks, and backyard growers within Pamplona Uno. Buy directly from your neighbors with intra-purok delivery.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={handleOpenSellModal}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Sell / Post Item</span>
            </button>
            <Link
              href="/services/pabili/new"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Pabili Runner</span>
            </Link>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search embutido, kutsinta, lettuce, shoe repair, or seller..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Header Tag Bar */}
                <div className="p-4 pb-2 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      item.category === "FOOD"
                        ? "bg-amber-100 text-amber-800"
                        : item.category === "GOODS"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.category}
                  </span>

                  {item.isVerifiedResidentSeller && (
                    <span className="text-[10px] text-blue-700 font-bold flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified Resident
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="px-4 py-2 space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-900 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 flex items-baseline justify-between">
                    <span className="text-xl font-black font-mono text-slate-950">
                      ₱{item.price}.00
                    </span>
                    {item.isFoodReadyToEat && (
                      <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        ~{item.prepTimeMinutes} mins
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Seller Info & Contact CTA */}
              <div className="p-4 pt-3 border-t border-slate-100 space-y-2.5 bg-slate-50/60">
                <div className="text-[11px] text-slate-600">
                  <p className="font-bold text-slate-800 truncate">{item.sellerName}</p>
                  <p className="text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{item.sellerPurok}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className="w-full py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-2xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>Contact Seller / Order</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Direct Contact / Order from Seller */}
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    Community Seller Contact
                  </span>
                  <h3 className="font-black text-slate-900 text-lg">{activeItem.title}</h3>
                </div>
                <button
                  onClick={() => setActiveItem(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Seller:</span>
                  <span className="font-bold text-slate-900">{activeItem.sellerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Location:</span>
                  <span className="font-semibold text-slate-900">{activeItem.sellerPurok}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Price:</span>
                  <span className="font-mono text-base font-black text-blue-900">
                    ₱{activeItem.price}.00
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href={`tel:${activeItem.sellerPhone}`}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Call Seller ({activeItem.sellerPhone})</span>
                </a>

                <a
                  href={`sms:${activeItem.sellerPhone}?body=Magandang araw po! Nag-inquire po ako sa inyong paninda sa Barangay Pamplona Uno portal: ${activeItem.title}`}
                  className="w-full py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Send SMS Inquiry</span>
                </a>

                <Link
                  href="/services/pabili/new"
                  className="w-full py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Book a Pabili Runner to Pickup This Item</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Sell / Post Item Modal */}
        {showSellModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl relative">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    Resident Seller
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">Post Item for Sale</h3>
                  {profile && (
                    <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="h-3 w-3" />
                      Posting as Verified Resident: {profile.fullName} ({profile.purok})
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowSellModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {sellSuccess ? (
                <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-950">Item Successfully Listed to Firestore!</h4>
                  <p className="text-xs text-emerald-800">
                    Your listing is now live on the Pamplona Uno Talipapa marketplace. Neighbors can call or text you directly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    try {
                      const newItem = await createMarketplaceItem({
                        sellerId: profile?.uid || `usr-${Date.now().toString(36)}`,
                        sellerName: newSellerName || profile?.fullName || "Pamplona Uno Resident",
                        sellerPurok: newPurok || profile?.purok || "Purok 3",
                        sellerPhone: newPhone || profile?.mobileNumber || "0917-000-0000",
                        title: newTitle,
                        description: newDesc || "Fresh local item from Pamplona Uno resident.",
                        price: Number(newPrice) || 100,
                        category: newCategory,
                        images: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"],
                        availabilityStatus: "AVAILABLE",
                        meetupOrDelivery: "PUROK_DELIVERY",
                        isVerifiedResidentSeller: !!profile?.isVerified,
                      });

                      setItems((prev) => [newItem, ...prev]);
                      setSellSuccess(true);
                      setTimeout(() => {
                        setSellSuccess(false);
                        setShowSellModal(false);
                        setNewTitle("");
                        setNewPrice("");
                        setNewDesc("");
                      }, 2000);
                    } catch (err) {
                      console.error("Listing error:", err);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Item Title / Paninda</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Special Pork Embutido or Hydro Lettuce"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as MarketplaceCategory)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white"
                      >
                        <option value="FOOD">Food & Cooking</option>
                        <option value="GOODS">Fresh Goods</option>
                        <option value="SERVICES">Services / Repair</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Price (₱ PHP)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="150"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Your Name / Store</label>
                      <input
                        type="text"
                        required
                        value={newSellerName}
                        onChange={(e) => setNewSellerName(e.target.value)}
                        placeholder="e.g. Aling Susan"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="0917-xxx-xxxx"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Purok Location</label>
                    <select
                      value={newPurok}
                      onChange={(e) => setNewPurok(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-white"
                    >
                      <option value="Purok 1 (Riverside)">Purok 1 (Riverside)</option>
                      <option value="Purok 2 (Sampaguita)">Purok 2 (Sampaguita)</option>
                      <option value="Purok 3 (Ilang-Ilang)">Purok 3 (Ilang-Ilang)</option>
                      <option value="Purok 4 (Mabuhay)">Purok 4 (Mabuhay)</option>
                      <option value="Purok 5 (Central Market)">Purok 5 (Central Market)</option>
                      <option value="Purok 6 (Highway)">Purok 6 (Highway)</option>
                      <option value="Purok 7 (Greenhills)">Purok 7 (Greenhills)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Description / Details</label>
                    <textarea
                      rows={2}
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Ingredients, preparation time, pickup or delivery options..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSellModal(false)}
                      className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? "Publishing to Firestore..." : "Publish Listing"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
