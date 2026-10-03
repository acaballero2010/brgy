import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import EmergencyAlertBanner from "@/components/layout/EmergencyAlertBanner";
import Navbar from "@/components/layout/Navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import Footer from "@/components/layout/Footer";
import OfflineCacheSync from "@/components/common/OfflineCacheSync";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barangay Pamplona Uno Portal | Las Piñas City, Metro Manila",
  description: "Official public e-Services, emergency hotlines, barangay clearance requests, sumbong desk, and announcements for Barangay Pamplona Uno, Las Piñas City.",
  keywords: ["Barangay Pamplona Uno", "Pamplona Uno Las Pinas", "Las Pinas City", "Metro Manila", "Barangay Clearance", "Sumbong Desk", "Barangay Portal"],
};

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          {/* Offline Cache & Connectivity Monitor */}
          <OfflineCacheSync />

          {/* High-priority alert banner component displayed across all pages */}
          <EmergencyAlertBanner />

          {/* Responsive header with seal, nav links, and mobile drawer trigger */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1 w-full">{children}</main>

          {/* Official Philippine Government Footer */}
          <Footer />

          {/* Sticky bottom navigation bar for mobile users */}
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
