import React from "react";
import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { MOCK_ANNOUNCEMENTS, Announcement } from "@/lib/data";
import { getFeedPosts } from "@/app/actions/portal-actions";
import NewsListingClient from "@/components/news/NewsListingClient";

export const metadata: Metadata = {
  title: "News & Community Bulletins | Barangay Pamplona Uno, Las Piñas",
  description: "Read official ordinances, health clinic advisories, Meralco power schedules, and Sangguniang Barangay announcements for Barangay Pamplona Uno, Las Piñas City.",
};

export default async function NewsHubPage() {
  // Fetch via cached ISR Server Action with revalidation tags
  const feedResult = await getFeedPosts({ category: "All", limit: 20 });
  const initialAnnouncements = feedResult.posts.length > 0 ? (feedResult.posts as unknown as Announcement[]) : MOCK_ANNOUNCEMENTS;
  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Banner */}
        <div className="mb-6 sm:mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
            <Newspaper className="h-3.5 w-3.5" />
            <span>Public Information Office</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Community Bulletins & Ordinances
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Official announcements, municipal circulars, public health advisories, and community event notices for all residents of Barangay Pamplona Uno, Las Piñas City.
          </p>
        </div>

        {/* Client Listing with Search, Category Filter, and Pagination */}
        <NewsListingClient initialAnnouncements={initialAnnouncements} />
      </div>
    </div>
  );
}
