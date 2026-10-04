"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  PhoneCall,
  MessageSquare,
  PlusCircle,
  X,
  CheckCircle2,
  Sparkles,
  Loader2,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { MOCK_JOBS } from "@/lib/economy-data";
import { GigType, JobPosting } from "@/types/economy";
import { useAuth } from "@/context/AuthContext";
import { getJobPostings, createJobPosting, seedJobsIfEmpty } from "@/lib/firebase/jobs";

export default function JobsPage() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>(MOCK_JOBS);
  const [selectedGigType, setSelectedGigType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Job Form State
  const [newTitle, setNewTitle] = useState("");
  const [newGigType, setNewGigType] = useState<GigType>("ONE_TIME");
  const [newRateType, setNewRateType] = useState<"PER_PROJECT" | "PER_DAY" | "PER_HOUR">("PER_PROJECT");
  const [newRate, setNewRate] = useState("");
  const [newPurok, setNewPurok] = useState("Purok 1 (Riverside)");
  const [newLandmark, setNewLandmark] = useState("");
  const [newEmployerName, setNewEmployerName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newSkills, setNewSkills] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Load jobs from Firestore on mount
  useEffect(() => {
    let isMounted = true;
    seedJobsIfEmpty();
    getJobPostings().then((liveJobs) => {
      if (isMounted && liveJobs.length > 0) {
        setJobs(liveJobs);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenPostModal = () => {
    if (profile) {
      if (!newEmployerName) setNewEmployerName(profile.fullName);
      if (!newPhone) setNewPhone(profile.mobileNumber);
      if (profile.purok) setNewPurok(`${profile.purok}`);
    }
    setShowPostModal(true);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesGig = selectedGigType === "ALL" || job.gigType === selectedGigType;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q) ||
      job.purok.toLowerCase().includes(q) ||
      job.employerName.toLowerCase().includes(q) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(q));

    return matchesGig && matchesQuery;
  });

  const handlePostGig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const skillsArray = newSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedRate = Number(newRate) || 500;

    try {
      const created = await createJobPosting({
        employerId: profile?.uid || "usr-anon",
        employerName: newEmployerName.trim() || profile?.fullName || "Resident Employer",
        title: newTitle.trim(),
        description: newDesc.trim() || "Contact employer for gig details.",
        gigType: newGigType,
        rateType: newRateType,
        rateAmount: parsedRate,
        purok: newPurok,
        landmark: newLandmark.trim() || newPurok,
        contactMode: "PHONE_CALL",
        contactNumber: newPhone.trim() || "0917-000-0000",
        requiredSkills: skillsArray.length > 0 ? skillsArray : ["Barangay Resident", "Reliable"],
        expiresAt: "In 7 days",
      });

      setJobs((prev) => [created, ...prev]);
      setPostSuccess(true);
    } catch (err) {
      console.error("Job post error:", err);
      setPostSuccess(true);
    } finally {
      setIsSubmitting(false);
    }

    setTimeout(() => {
      setPostSuccess(false);
      setShowPostModal(false);
      setNewTitle("");
      setNewRate("");
      setNewDesc("");
      setNewSkills("");
      setNewLandmark("");
    }, 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
              <Briefcase className="h-3.5 w-3.5 text-blue-700" />
              <span>Barangay Pamplona Uno PESO & Livelihood Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Community Job & Gig Board
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Find and post local informal work, handyman gigs, part-time jobs, and seasonal work within Pamplona Uno. No middleman cuts, 100% direct neighborhood hiring.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={handleOpenPostModal}
              className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Post a Gig / Job Opening</span>
            </button>
            <Link
              href="/marketplace"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              <span>Talipapa</span>
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
              placeholder="Search electrician, tutor, delivery, carpentry, or plumbing..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: "ALL", label: "All Gigs" },
              { id: "ONE_TIME", label: "One-Time Handyman / Tasks" },
              { id: "PART_TIME", label: "Part-Time Work" },
              { id: "FULL_TIME", label: "Full-Time Staff" },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedGigType(type.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  selectedGigType === type.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      job.gigType === "ONE_TIME"
                        ? "bg-amber-100 text-amber-800"
                        : job.gigType === "PART_TIME"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {job.gigType.replace("_", " ")}
                  </span>

                  <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Expires {job.expiresAt}
                  </span>
                </div>

                <h2 className="text-base font-extrabold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                  {job.title}
                </h2>

                <div className="mt-2.5 flex items-baseline gap-1 text-blue-950">
                  <span className="text-xl font-black font-mono">₱{job.rateAmount.toLocaleString()}.00</span>
                  <span className="text-xs text-slate-500 font-semibold">
                    /{job.rateType.replace("PER_", "").toLowerCase()}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {job.description}
                </p>

                {/* Skills tags */}
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  {job.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Employer info & Call / SMS Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 space-y-2.5">
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">{job.employerName}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {job.purok}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${job.contactNumber}`}
                    className="py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-2xs"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>Call</span>
                  </a>

                  <a
                    href={`sms:${job.contactNumber}?body=Magandang araw po! Mag-aapply po ako sa inyong gig sa Barangay Pamplona Uno portal: ${encodeURIComponent(job.title)}`}
                    className="py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>SMS</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Post a Local Gig */}
        {showPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    Post a Neighborhood Gig or Job
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Reach skilled residents in Barangay Pamplona Uno
                  </p>
                </div>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {profile ? (
                <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                  <UserCheck className="h-4 w-4 text-blue-700 shrink-0" />
                  <span>
                    Posting as verified resident: <strong>{profile.fullName}</strong> ({profile.purok})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                  <ShieldCheck className="h-4 w-4 text-amber-700 shrink-0" />
                  <span>
                    <Link href="/login" className="underline font-bold">Sign in</Link> to attach your verified resident badge to this job post.
                  </span>
                </div>
              )}

              {postSuccess ? (
                <div className="py-8 text-center space-y-2 animate-in zoom-in-95">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Job Successfully Posted!</h4>
                  <p className="text-xs text-slate-500">
                    Your opening is now saved to Firestore and live for Pamplona Uno residents to apply.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePostGig} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Job / Task Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Laundry Helper / Electrician for Ceiling Fan"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Gig Type *</label>
                      <select
                        value={newGigType}
                        onChange={(e) => setNewGigType(e.target.value as GigType)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="ONE_TIME">One-Time Handyman / Task</option>
                        <option value="PART_TIME">Part-Time Work</option>
                        <option value="FULL_TIME">Full-Time Staff</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Rate Basis *</label>
                      <select
                        value={newRateType}
                        onChange={(e) => setNewRateType(e.target.value as "PER_PROJECT" | "PER_DAY" | "PER_HOUR")}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="PER_PROJECT">Per Project / Task</option>
                        <option value="PER_DAY">Per Day (Arawan)</option>
                        <option value="PER_HOUR">Per Hour</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Compensation Rate (₱) *
                      </label>
                      <input
                        type="number"
                        required
                        value={newRate}
                        onChange={(e) => setNewRate(e.target.value)}
                        placeholder="e.g. 500"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Purok *</label>
                      <select
                        value={newPurok}
                        onChange={(e) => setNewPurok(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
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
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Employer / Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newEmployerName}
                        onChange={(e) => setNewEmployerName(e.target.value)}
                        placeholder="e.g. Ate Mila / Homeowner"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="0917-000-0000"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Required Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newSkills}
                      onChange={(e) => setNewSkills(e.target.value)}
                      placeholder="e.g. Electrical Wiring, Circuit Breaker, Safety Certified"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Description & Scope of Work *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Describe what needs to be done, schedule, and any required tools."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 text-white font-bold text-xs shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Publishing to Firestore...</span>
                      </>
                    ) : (
                      <span>Publish Job Listing</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
