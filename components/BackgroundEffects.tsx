"use client";

import React from "react";

export default function BackgroundEffects() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none transform-gpu"
      style={{ willChange: "transform" }}
    >
      {/* High-Performance Radial Gradient Ambient Glows (0 Filter Overhead, 60+ FPS Smooth) */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(37,99,235,0.3) 0%, rgba(37,99,235,0.05) 50%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/4 -right-32 w-[600px] h-[600px] pointer-events-none opacity-35"
        style={{
          background: "radial-gradient(circle, rgba(239,68,68,0.25) 0%, rgba(239,68,68,0.04) 50%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-2/3 -left-32 w-[600px] h-[600px] pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(239,68,68,0.22) 0%, rgba(239,68,68,0.03) 50%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-10 right-1/4 w-[700px] h-[700px] pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(37,99,235,0.22) 0%, rgba(37,99,235,0.03) 50%, transparent 70%)",
        }}
      />

      {/* Floating 3D Roblox Cubes with GPU transform acceleration */}
      <div
        className="absolute top-24 left-[4%] animate-bounce opacity-60 transform-gpu"
        style={{ animationDuration: "7s" }}
      >
        <svg width="48" height="48" viewBox="0 0 100 100" fill="none" className="transform -rotate-12">
          <polygon points="50,5 95,25 50,45 5,25" fill="#3B82F6" />
          <polygon points="5,25 50,45 50,95 5,75" fill="#2563EB" />
          <polygon points="95,25 50,45 50,95 95,75" fill="#1D4ED8" />
          <polygon points="50,20 65,28 50,36 35,28" fill="#FFFFFF" opacity="0.95" />
          <polygon points="50,24 58,28 50,32 42,28" fill="#1E3A8A" />
        </svg>
      </div>

      <div
        className="absolute top-[28%] right-[4%] animate-bounce opacity-60 transform-gpu"
        style={{ animationDuration: "8s", animationDelay: "1s" }}
      >
        <svg width="52" height="52" viewBox="0 0 100 100" fill="none" className="transform rotate-12">
          <polygon points="50,5 95,25 50,45 5,25" fill="#F87171" />
          <polygon points="5,25 50,45 50,95 5,75" fill="#EF4444" />
          <polygon points="95,25 50,45 50,95 95,75" fill="#DC2626" />
          <polygon points="50,20 65,28 50,36 35,28" fill="#FFFFFF" opacity="0.95" />
          <polygon points="50,24 58,28 50,32 42,28" fill="#991B1B" />
        </svg>
      </div>

      <div
        className="absolute top-[62%] left-[3%] animate-bounce opacity-50 transform-gpu"
        style={{ animationDuration: "9s", animationDelay: "2s" }}
      >
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" className="transform rotate-45">
          <polygon points="50,5 95,25 50,45 5,25" fill="#60A5FA" />
          <polygon points="5,25 50,45 50,95 5,75" fill="#3B82F6" />
          <polygon points="95,25 50,45 50,95 95,75" fill="#DC2626" />
          <polygon points="50,20 65,28 50,36 35,28" fill="#FFFFFF" opacity="0.9" />
        </svg>
      </div>

      <div
        className="absolute top-[80%] right-[5%] animate-bounce opacity-50 transform-gpu"
        style={{ animationDuration: "10s", animationDelay: "0.5s" }}
      >
        <svg width="44" height="44" viewBox="0 0 100 100" fill="none" className="transform -rotate-6">
          <polygon points="50,5 95,25 50,45 5,25" fill="#F87171" />
          <polygon points="5,25 50,45 50,95 5,75" fill="#EF4444" />
          <polygon points="95,25 50,45 50,95 95,75" fill="#2563EB" />
          <polygon points="50,20 65,28 50,36 35,28" fill="#FFFFFF" opacity="0.95" />
        </svg>
      </div>

      {/* Floating Sparkle Stars (Red & Blue lightweight) */}
      <div className="absolute top-16 left-[14%] animate-pulse opacity-70 transform-gpu" style={{ animationDuration: "3s" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
            fill="#60A5FA"
          />
        </svg>
      </div>

      <div className="absolute top-28 right-[16%] animate-pulse opacity-70 transform-gpu" style={{ animationDuration: "2.5s", animationDelay: "1s" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
            fill="#F87171"
          />
        </svg>
      </div>

      <div className="absolute top-[40%] left-[7%] animate-pulse opacity-60 transform-gpu" style={{ animationDuration: "4s", animationDelay: "1.5s" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
            fill="#3B82F6"
          />
        </svg>
      </div>

      <div className="absolute top-[50%] right-[9%] animate-pulse opacity-60 transform-gpu" style={{ animationDuration: "3.2s", animationDelay: "0.7s" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
            fill="#EF4444"
          />
        </svg>
      </div>

      <div className="absolute top-[72%] left-[10%] animate-pulse opacity-65 transform-gpu" style={{ animationDuration: "3.8s", animationDelay: "2.2s" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
            fill="#60A5FA"
          />
        </svg>
      </div>

      <div className="absolute top-[88%] right-[14%] animate-pulse opacity-65 transform-gpu" style={{ animationDuration: "2.8s", animationDelay: "1.8s" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
            fill="#F87171"
          />
        </svg>
      </div>
    </div>
  );
}
