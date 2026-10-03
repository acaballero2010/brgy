import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Clock,
  User,
  ArrowLeft,
  FileDown,
  Download,
  AlertCircle,
  Tag,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { MOCK_ANNOUNCEMENTS } from "@/lib/data";
import ShareButtons from "@/components/news/ShareButtons";

interface NewsDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return MOCK_ANNOUNCEMENTS.map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = MOCK_ANNOUNCEMENTS.find((a) => a.id === id || a.slug === id);

  if (!item) {
    return {
      title: "Announcement Not Found | Barangay Pamplona Uno",
    };
  }

  return {
    title: `${item.title} | Barangay Pamplona Uno`,
    description: item.excerpt,
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  const announcement = MOCK_ANNOUNCEMENTS.find((a) => a.id === id || a.slug === id);

  if (!announcement) {
    notFound();
  }

  const isUrgent = announcement.priority === "URGENT";
  const isImportant = announcement.priority === "IMPORTANT";
  const otherAnnouncements = MOCK_ANNOUNCEMENTS.filter((a) => a.id !== announcement.id).slice(0, 3);

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-900 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Bulletins</span>
          </Link>
        </div>

        {/* Main Article Container */}
        <article className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-6">
          {/* Header Metadata */}
          <div className="space-y-3 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  announcement.category === "Ordinances"
                    ? "bg-purple-100 text-purple-800"
                    : announcement.category === "Health"
                    ? "bg-emerald-100 text-emerald-800"
                    : announcement.category === "Utilities"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                <Tag className="h-3 w-3" />
                {announcement.category}
              </span>

              {isUrgent && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-600 text-white animate-pulse">
                  <AlertCircle className="h-3 w-3" />
                  Urgent Priority
                </span>
              )}

              {isImportant && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                  Important Notice
                </span>
              )}

              <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                <Clock className="h-3.5 w-3.5" />
                {announcement.readTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {announcement.title}
            </h1>

            {/* Author & Date Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-sm shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    {announcement.author}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {announcement.authorRole} • Published {announcement.publishedAt}
                  </p>
                </div>
              </div>

              {/* Share & Print Buttons */}
              <ShareButtons title={announcement.title} />
            </div>
          </div>

          {/* Lead Excerpt Callout */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-100 text-blue-950 text-sm sm:text-base font-medium leading-relaxed">
            {announcement.excerpt}
          </div>

          {/* Rich Text Paragraphs */}
          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            {announcement.content.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          {announcement.tags && announcement.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Related Topics
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {announcement.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-medium transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Attached PDF Downloads */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <section className="pt-6 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <FileDown className="h-5 w-5 text-red-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Official Attachments & Downloadable PDFs ({announcement.attachments.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                You can download the certified copies of the enacted ordinance or advisory for your records.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {announcement.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-400 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="h-9 w-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                        <FileDown className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-900">
                          {file.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {file.type} • {file.size}
                        </p>
                      </div>
                    </div>

                    <a
                      href={file.url}
                      download
                      className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors shrink-0 shadow-2xs"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Official Verification Seal Banner */}
          <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <p>
              This is an authenticated bulletin issued under the authority of the Sangguniang Barangay of Pamplona Uno, Las Piñas City. For certified true hard copies, visit the Barangay Secretariat.
            </p>
          </div>
        </article>

        {/* Other Announcements Section */}
        {otherAnnouncements.length > 0 && (
          <div className="mt-10 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              More Community Announcements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherAnnouncements.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                      {item.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 mt-1">
                      {item.title}
                    </h4>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.publishedAt}</span>
                    <ArrowRight className="h-3 w-3 text-blue-700 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
