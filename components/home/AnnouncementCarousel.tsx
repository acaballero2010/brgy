"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  AlertCircle
} from "lucide-react";
import { Announcement } from "@/lib/data";

interface AnnouncementCarouselProps {
  announcements: Announcement[];
}

export default function AnnouncementCarousel({ announcements }: AnnouncementCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Show up to 4 announcements in carousel
  const items = announcements.slice(0, 5);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative">
      {/* Desktop & Tablet Carousel view */}
      <div className="overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item) => {
            const isUrgent = item.priority === "URGENT";
            const isImportant = item.priority === "IMPORTANT";

            return (
              <div
                key={item.id}
                className="w-full shrink-0 p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  {/* Category Pill & Priority Badge */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.category === "Ordinances"
                          ? "bg-purple-100 text-purple-800"
                          : item.category === "Health"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.category === "Utilities"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      <Tag className="h-3 w-3" />
                      {item.category}
                    </span>

                    {isUrgent && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-extrabold bg-red-600 text-white animate-pulse">
                        <AlertCircle className="h-3 w-3" />
                        Urgent Action
                      </span>
                    )}

                    {isImportant && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500 text-white">
                        Important
                      </span>
                    )}

                    <span className="text-xs text-slate-500 flex items-center gap-1 ml-auto">
                      <Clock className="h-3 w-3" />
                      {item.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <Link
                    href={`/news/${item.id}`}
                    className="group block"
                  >
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>

                {/* Footer of card */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {item.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-slate-700">{item.author}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/news/${item.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 group"
                    >
                      <span>Read Full Notice</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-4 flex items-center justify-between px-1">
        {/* Indicator dots */}
        <div className="flex items-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx
                  ? "w-6 bg-blue-900"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
          <span className="text-xs text-slate-500 font-medium ml-1">
            {currentIndex + 1} of {items.length}
          </span>
        </div>

        {/* Prev / Next buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            aria-label="Previous announcement"
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next announcement"
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <Link
            href="/news"
            className="ml-2 text-xs font-bold text-blue-900 hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
