import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./client";
import { JobPosting } from "@/types/economy";
import { MOCK_JOBS } from "@/lib/economy-data";

const COLLECTION_NAME = "jobs";

/**
 * Fetch all active barangay job and gig listings from Firestore.
 * Automatically falls back to mock postings if Firestore is empty or offline.
 */
export async function getJobPostings(): Promise<JobPosting[]> {
  try {
    const jobsRef = collection(db, COLLECTION_NAME);
    const q = query(jobsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          employerId: data.employerId || "usr-anon",
          employerName: data.employerName || "Resident Employer",
          title: data.title,
          description: data.description,
          gigType: data.gigType || "ONE_TIME",
          rateType: data.rateType || "PER_PROJECT",
          rateAmount: Number(data.rateAmount) || 0,
          purok: data.purok || "Purok 1 (Riverside)",
          landmark: data.landmark || "Pamplona Uno",
          contactMode: data.contactMode || "PHONE_CALL",
          contactNumber: data.contactNumber || "0917-000-0000",
          requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills : ["Barangay Resident"],
          status: data.status || "OPEN",
          applicantsCount: data.applicantsCount || 0,
          expiresAt: data.expiresAt || "In 7 days",
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
        } as JobPosting;
      });
    }
  } catch (error) {
    console.warn("Firestore jobs fetch error (using fallback):", error);
  }

  // Fallback to local default job postings
  return MOCK_JOBS;
}

/**
 * Post a new resident job or gig opening to Firestore.
 */
export async function createJobPosting(
  input: Omit<JobPosting, "id" | "createdAt" | "applicantsCount" | "status">
): Promise<JobPosting> {
  const customId = `job-${Date.now()}`;
  const now = new Date().toISOString();

  const newJob: JobPosting = {
    ...input,
    id: customId,
    status: "OPEN",
    applicantsCount: 0,
    createdAt: now,
  };

  try {
    const docRef = doc(db, COLLECTION_NAME, customId);
    await setDoc(docRef, {
      ...input,
      status: "OPEN",
      applicantsCount: 0,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Failed to write job to Firestore, saved locally:", error);
  }

  return newJob;
}

/**
 * Seeds default verified Pamplona Uno PESO job postings to Firestore if not yet populated.
 */
export async function seedJobsIfEmpty(): Promise<boolean> {
  try {
    const jobsRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(jobsRef);
    if (snapshot.empty) {
      for (const job of MOCK_JOBS) {
        const docRef = doc(db, COLLECTION_NAME, job.id);
        await setDoc(docRef, {
          ...job,
          createdAt: serverTimestamp(),
        });
      }
      return true;
    }
  } catch (err) {
    console.warn("Could not seed jobs:", err);
  }
  return false;
}
