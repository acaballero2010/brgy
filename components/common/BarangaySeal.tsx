import React from "react";

interface BarangaySealProps {
  size?: number;
  className?: string;
}

export default function BarangaySeal({ size = 44, className = "" }: BarangaySealProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full shadow-inner ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Ring - Gold */}
        <circle cx="50" cy="50" r="48" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
        {/* Inner Border - Navy Blue */}
        <circle cx="50" cy="50" r="43" fill="#1E3A8A" stroke="#FDE68A" strokeWidth="1.5" />
        
        {/* Inner Center Circle - White */}
        <circle cx="50" cy="50" r="32" fill="#FFFFFF" />

        {/* Central Sun */}
        <circle cx="50" cy="46" r="10" fill="#F59E0B" />
        
        {/* Sun Rays */}
        <path d="M50 32 L50 28 M50 60 L50 64 M36 46 L32 46 M64 46 L68 46" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <path d="M40 36 L37 33 M60 56 L63 59 M40 56 L37 59 M60 36 L63 33" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

        {/* 3 Stars representing Luzon, Visayas, Mindanao */}
        <polygon points="50,20 51.5,23.5 55,23.5 52,25.5 53.5,29 50,27 46.5,29 48,25.5 45,23.5 48.5,23.5" fill="#FBBF24" />
        <polygon points="25,56 26.5,59.5 30,59.5 27,61.5 28.5,65 25,63 21.5,65 23,61.5 20,59.5 23.5,59.5" fill="#FBBF24" />
        <polygon points="75,56 76.5,59.5 80,59.5 77,61.5 78.5,65 75,63 71.5,65 73,61.5 70,59.5 73.5,59.5" fill="#FBBF24" />

        {/* Lower Banner Ribbon */}
        <path d="M22 68 Q50 82 78 68 L74 79 Q50 89 26 79 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="0.8" />
        <text
          x="50"
          y="77"
          fill="#FFFFFF"
          fontSize="4.8"
          fontWeight="900"
          textAnchor="middle"
          letterSpacing="0.4"
          fontFamily="system-ui, sans-serif"
        >
          PAMPLONA UNO
        </text>

        {/* Circular text top */}
        <path id="curve" d="M 23 50 A 27 27 0 0 1 77 50" fill="transparent" />
        <text fill="#FFFFFF" fontSize="5.2" fontWeight="700" letterSpacing="0.8">
          <textPath href="#curve" startOffset="50%" textAnchor="middle">
            BARANGAY PORTAL
          </textPath>
        </text>
      </svg>
    </div>
  );
}
