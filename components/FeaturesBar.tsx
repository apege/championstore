"use client";

import React from "react";
import { Gauge, Lock, AtSign, Clock4, BadgeCheck } from "lucide-react";

export default function FeaturesBar() {
  const features = [
    {
      icon: Gauge,
      title: "Proses Cepat",
      subtitle: "5 - 10 Menit Beres",
      colorClass: "bg-red-950/50 text-red-400 border-red-800/50",
    },
    {
      icon: Lock,
      title: "Pembayaran Aman",
      subtitle: "Legal & Terpercaya",
      colorClass: "bg-blue-950/50 text-blue-400 border-blue-800/50",
    },
    {
      icon: AtSign,
      title: "Hanya Username",
      subtitle: "Tanpa Password Akun",
      colorClass: "bg-indigo-950/50 text-indigo-400 border-indigo-800/50",
    },
    {
      icon: Clock4,
      title: "Fast Respon 24/7",
      subtitle: "Admin Ramah & Sigap",
      colorClass: "bg-rose-950/50 text-rose-400 border-rose-800/50",
    },
    {
      icon: BadgeCheck,
      title: "Garansi 100%",
      subtitle: "Uang Kembali Jika Gagal",
      colorClass: "bg-emerald-950/50 text-emerald-400 border-emerald-800/50",
    },
  ];

  // Duplicate for seamless mobile marquee
  const marqueeItems = [...features, ...features, ...features];

  return (
    <section id="section-features" className="w-full mb-8">
      {/* 1. DESKTOP VIEW: Static 5-Column Grid (Diam / Tidak Gerak) */}
      <div className="hidden md:grid md:grid-cols-5 gap-3 bg-slate-900/95 border border-slate-800/80 rounded-2xl p-4 shadow-lg">
        {features.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all select-none"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${feat.colorClass}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs lg:text-sm font-bold text-slate-200 truncate">
                  {feat.title}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium truncate">
                  {feat.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. MOBILE VIEW ONLY: Running Marquee Auto-Scroll (Hanya Gerak di Layar HP) */}
      <div className="block md:hidden relative overflow-hidden bg-slate-900/95 border border-slate-800/80 rounded-2xl py-3 shadow-lg">
        {/* Left and Right Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="animate-marquee gap-3.5 items-center px-3">
          {marqueeItems.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950/70 border border-slate-800/80 shrink-0 select-none shadow-xs"
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${feat.colorClass}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="whitespace-nowrap">
                  <h3 className="text-xs font-bold text-slate-200">{feat.title}</h3>
                  <p className="text-[10px] text-slate-400 font-medium">{feat.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
