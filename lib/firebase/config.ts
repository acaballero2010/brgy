/**
 * Official Firebase SDK Configuration for Barangay Pamplona Uno Portal
 * Project: pamplona-uno-portal (Las Piñas City, Metro Manila)
 */

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD8zQ4TwpFveC_itnHEZa38OcwCLAmmsL0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "pamplona-uno-portal.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "pamplona-uno-portal",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "pamplona-uno-portal.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "359664018180",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:359664018180:web:f00d088c23079de29c6651",
};
