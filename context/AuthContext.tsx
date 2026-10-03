"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile as updateFirebaseProfile
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { ResidentProfile, RegistrationInput } from "@/types/auth";

interface AuthContextType {
  user: FirebaseUser | null;
  profile: ResidentProfile | null;
  isLoading: boolean;
  registerResident: (data: RegistrationInput) => Promise<ResidentProfile>;
  loginResident: (email: string, password: string) => Promise<ResidentProfile | null>;
  logoutResident: () => Promise<void>;
  loginDemoResident: () => Promise<ResidentProfile>;
}

const LOCAL_STORAGE_PROFILE_KEY = "bpu_resident_profile";
const LOCAL_STORAGE_USERS_KEY = "bpu_registered_users";

const DEMO_PROFILE: ResidentProfile = {
  uid: "demo-resident-001",
  email: "maria.santos@gmail.com",
  firstName: "Maria",
  middleName: "Dela Cruz",
  lastName: "Santos",
  fullName: "Maria Dela Cruz Santos",
  mobileNumber: "0917-888-2345",
  birthDate: "1988-06-15",
  gender: "Female",
  purok: "Purok 4",
  streetAddress: "142 Alabang-Zapote Rd., Doña Manuela Subd.",
  yearsOfResidency: 12,
  voterStatus: "Registered in Pamplona Uno",
  residentCategory: "Regular Resident",
  idType: "PhilSys National ID",
  idNumber: "1234-5678-9012-3456",
  barangayIdNumber: "BPU-2026-7841",
  isVerified: true,
  role: "resident",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<ResidentProfile | null>(() => {
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
      if (savedProfile) {
        try {
          return JSON.parse(savedProfile);
        } catch {
          // ignore corrupted local storage
        }
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, "residents", fbUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const residentData = docSnap.data() as ResidentProfile;
            setProfile(residentData);
            if (typeof window !== "undefined") {
              localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(residentData));
            }
          }
        } catch {
          // Firestore may be offline or uninitialized; local storage remains intact
        }
      } else {
        // If not logged in via Firebase and no local profile, set null
        if (typeof window !== "undefined") {
          const savedProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
          if (!savedProfile) {
            setProfile(null);
          }
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper to generate official Barangay ID
  const generateBarangayId = (): string => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `BPU-2026-${randomNum}`;
  };

  // Register a new resident
  const registerResident = async (data: RegistrationInput): Promise<ResidentProfile> => {
    setIsLoading(true);
    const fullName = [data.firstName, data.middleName, data.lastName, data.suffix]
      .filter(Boolean)
      .join(" ");

    const barangayIdNumber = generateBarangayId();
    const now = new Date().toISOString();

    let createdUid = `res-${Date.now()}`;

    // Attempt Firebase Auth creation
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      createdUid = userCredential.user.uid;
      setUser(userCredential.user);

      await updateFirebaseProfile(userCredential.user, {
        displayName: fullName,
      });
    } catch {
      // Fallback: Continue with local UID if Firebase Auth is unreachable
      console.warn("Using offline fallback for resident registration");
    }

    const newProfile: ResidentProfile = {
      uid: createdUid,
      email: data.email,
      firstName: data.firstName,
      middleName: data.middleName || "",
      lastName: data.lastName,
      suffix: data.suffix || "",
      fullName,
      mobileNumber: data.mobileNumber,
      birthDate: data.birthDate,
      gender: data.gender,
      purok: data.purok,
      streetAddress: data.streetAddress,
      yearsOfResidency: data.yearsOfResidency,
      voterStatus: data.voterStatus,
      residentCategory: data.residentCategory,
      idType: data.idType,
      idNumber: data.idNumber,
      barangayIdNumber,
      isVerified: true,
      role: "resident",
      createdAt: now,
      updatedAt: now,
    };

    // Attempt Firestore persistence
    try {
      const userDocRef = doc(db, "residents", createdUid);
      await setDoc(userDocRef, newProfile);
    } catch {
      // Firestore offline fallback
    }

    // Always persist to localStorage for seamless UX
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(newProfile));

      // Save to registered accounts list for local login testing
      const existing = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      const usersList = existing ? JSON.parse(existing) : [];
      usersList.push({ email: data.email, password: data.password, profile: newProfile });
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(usersList));
    }

    setProfile(newProfile);
    setIsLoading(false);
    return newProfile;
  };

  // Login resident
  const loginResident = async (email: string, password: string): Promise<ResidentProfile | null> => {
    setIsLoading(true);

    // 1. Try Firebase Auth
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      const userDocRef = doc(db, "residents", userCredential.user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const residentData = docSnap.data() as ResidentProfile;
        setProfile(residentData);
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(residentData));
        }
        setIsLoading(false);
        return residentData;
      }
    } catch {
      // 2. Check local fallback registered users
      if (typeof window !== "undefined") {
        const existing = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
        if (existing) {
          try {
            const usersList = JSON.parse(existing);
            const found = usersList.find(
              (u: { email: string; password: string; profile: ResidentProfile }) =>
                u.email.toLowerCase() === email.toLowerCase() && u.password === password
            );
            if (found) {
              setProfile(found.profile);
              localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(found.profile));
              setIsLoading(false);
              return found.profile;
            }
          } catch {
            // ignore
          }
        }
      }
    }

    setIsLoading(false);
    throw new Error("Invalid email or password. Please verify your credentials or register.");
  };

  // Logout resident
  const logoutResident = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    setProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
    }
  };

  // 1-Click Demo Resident Login
  const loginDemoResident = async (): Promise<ResidentProfile> => {
    setProfile(DEMO_PROFILE);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(DEMO_PROFILE));
    }
    return DEMO_PROFILE;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        registerResident,
        loginResident,
        logoutResident,
        loginDemoResident,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
