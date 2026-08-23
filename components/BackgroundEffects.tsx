"use client";

import React from "react";

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Dynamic Red and Blue Ambient Glows for Dark Mode */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-red-600/18 rounded-full blur-[120px]" />
      <div className="absolute top-2/3 -left-32 w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px]" />

      {/* Floating 3D Roblox Cubes */}
      <div
        className="absolute top-24 left-[4%] animate-bounce opacity-60 hover:opacity-100 transition-opacity"
        style={{ animationDuration: "6s" }}
      >
        <svg width="52" height="52" viewBox="0 0 100 100" fill="none" className="transform -rotate-12 drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          {/* Isometric Blue Roblox Cube */}
          <polygon points="50,5 95,25 50,45 5,25" fill="#3B82F6" />
          <polygon points="5,25 50,45 50,95 5,75" fill="#2563EB" />
          <polygon points="95,25 50,45 50,95 95,75" fill="#1D4ED8" />
          {/* Center Roblox Square */}
          <polygon points="50,20 65,28 50,36 35,28" fill="#FFFFFF" opacity="0.95" />
          <polygon points="50,24 58,28 50,32 42,28" fill="#1E3A8A" />
        </svg>
      </div>

      <div
        className="absolute top-[28%] right-[4%] animate-bounce opacity-65 hover:opacity-100 transition-opacity"
        style={{ animationDuration: "8s", animationDelay: "1s" }}
      >
        <svg width="58" height="58" viewBox="0 0 100 100" fill="none" className="transform rotate-12 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
          {/* Isometric Red Roblox Cube */}
          <polygon points="50,5 95,25 50,45 5,25" fill="#F87171" />
          <polygon points="5,25 50,45 50,95 5,75" fill="#EF4444" />
          <polygon points="95,25 50,45 50,95 95,75" fill="#DC2626" />
          {/* Center Roblox Square */}
          <polygon points="50,20 65,28 50,36 35,28" fill="#FFFFFF" opacity="0.95" />
          <polygon points="50,24 58,28 50,32 42,28" fill="#991B1B" />
        </svg>
      </div>

      <div
        className="absolute top-[62%] left-[3%] animate-bounce opacity-50"
        style={{ animationDuration: "7s", animationDelay: "2s" }}
      >
        <svg width="44" height="44" viewBox="0 0 100 100" fill="none" className="transform rotate-45 drop-shadow-[0_0_12px_rgba(37,99,235,0.4)]">
          <polygon points="50,5 95,25 50,45 5,25" fill="#60A5FA" />
          <polygon points="5,25 50,45 50,95 5,75" fill="#3B82F6" />
          <polygon points="95,25 50,45 50,95 95,75" fill="#DC2626" />
          <polygon points="50,20 65,28 50,36 35,28" fill="#FFFFFF" opacity="0.9" />
        </svg>
      </div>

      <div
        className="absolute top-[80%] right-[5%] animate-bounce opacity-55"
        style={{ animationDuration: "9s", animationDelay: "0.5s" }}
      >
        <svg width="48" height="48" viewBox="0 0 100 100" fill="none" className="transform -rotate-6 drop-shadow-[0_0_14px_rgba(239,68,68,0.4)]">
          <polygon points="50,5 95,25 50,45 5,25" fill="#F87171" />
          <polygon points="5,25 50,45 50,95 5,75" fill="#EF4444" />
          <polygon points="95,25 50,45 50,95 95,75" fill="#2563EB" />
          <polygon points="50,20 65,28 50,36 35,28" fill="#FFFFFF" opacity="0.95" />
        </svg>
      </div>

      {/* Floating Sparkle Stars (Red & Blue with bright glow) */}
      <div className="absolute top-16 left-[14%] animate-pulse" style={{ animationDuration: "3s" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
            fill="#60A5FA"
            className="drop-shadow-[0_0_12px_rgba(96,165,250,1)]"
          />
        </svg>
      </div>

      <div className="absolute top-28 right-[16%] animate-pulse" style={{ animationDuration: "2.5s", animationDelay: "1s" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
            fill="#F87171"
            className="drop-shadow-[0_0_12px_rgba(248,113,113,1)]"
          />
        </svg>
      </div>

      <div className="absolute top-[40%] left-[7%] animate-pulse" style={{ animationDuration: "4s", animationDelay: "1.5s" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
            fill="#3B82F6"
            className="drop-shadow-[0_0_10px_rgba(59,130,246,0.9)]"
          />
        </svg>
      </div>

      <div className="absolute top-[50%] right-[9%] animate-pulse" style={{ animationDuration: "3.2s", animationDelay: "0.7s" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
            fill="#EF4444"
            className="drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]"
          />
        </svg>
      </div>

      <div className="absolute top-[72%] left-[10%] animate-pulse" style={{ animationDuration: "3.8s", animationDelay: "2.2s" }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
            fill="#60A5FA"
            className="drop-shadow-[0_0_12px_rgba(96,165,250,1)]"
          />
        </svg>
      </div>

      <div className="absolute top-[88%] right-[14%] animate-pulse" style={{ animationDuration: "2.8s", animationDelay: "1.8s" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
            fill="#F87171"
            className="drop-shadow-[0_0_12px_rgba(248,113,113,1)]"
          />
        </svg>
      </div>
    </div>
  );
}
