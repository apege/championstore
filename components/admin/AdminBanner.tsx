"use client";

import React from "react";
import { Flame } from "lucide-react";

export default function AdminBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1C0609] via-[#160A10] to-[#0D1222] border border-red-500/30 p-4 sm:p-5 shadow-[0_0_25px_rgba(239,68,68,0.15)] group">
      {/* Background Neon Aura & Glow Effects */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 group-hover:bg-red-600/25 transition-all duration-700" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Cyberpunk Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef444408_1px,transparent_1px),linear-gradient(to_bottom,#ef444408_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between gap-2">
        {/* Welcome Text */}
        <div className="space-y-1.5 max-w-2xl text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/60 border border-red-500/40 text-[10px] sm:text-[11px] font-bold text-red-400 backdrop-blur-sm">
            <Flame className="w-3 h-3 text-red-500 animate-pulse" />
            <span>Pusat Kendali ChampionStore IDN</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Halo Admin</span>
            <span className="inline-block animate-wave origin-[70%_70%] text-xl sm:text-2xl">
              👋
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Semangat hari ini! Yuk, selesaikan semua order dan buat customer happy!
          </p>
        </div>
      </div>
    </div>
  );
}
