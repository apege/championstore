"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Timer, BadgeCheck, Rocket, ArrowRight } from "lucide-react";

interface HeroBannerProps {
  onSelectPromo: () => void;
}

export default function HeroBanner({ onSelectPromo }: HeroBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: "08",
    hours: "12",
    minutes: "44",
    seconds: "03",
  });

  useEffect(() => {
    let totalSecs = 8 * 86400 + 12 * 3600 + 44 * 60 + 3;
    const interval = setInterval(() => {
      totalSecs = totalSecs > 0 ? totalSecs - 1 : 86400;
      const d = Math.floor(totalSecs / 86400);
      const h = Math.floor((totalSecs % 86400) / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const s = Math.floor(totalSecs % 60);
      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToPricelist = () => {
    const el = document.getElementById("section-pricelist");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full mb-8 pt-2 sm:pt-4">
      {/* Banner Container with sleek dark gaming gradient, glowing edges, and watermark */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0c1322] border border-blue-500/30 shadow-[0_0_35px_rgba(37,99,235,0.15)] p-4 sm:p-8 md:p-10 text-white">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-5 text-center sm:text-left flex flex-col items-center sm:items-start">
            {/* Promo Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-red-600/30">
                LIMITED STOCK
              </span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                ROBUX BULAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-red-400">INI</span>
              </h1>
              <p className="mt-2 text-slate-300 text-sm sm:text-base font-medium max-w-xl mx-auto sm:mx-0">
                Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!
              </p>
            </div>

            {/* Highlighted Deal */}
            <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-x-3 gap-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white">2.200</span>
                <span className="text-xs sm:text-sm font-extrabold uppercase px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-400/30">
                  ROBUX
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs sm:text-sm text-slate-500 line-through">2.000 Robux</span>
                <span className="text-2xl sm:text-3xl font-black text-red-500">Rp 45.000</span>
              </div>
            </div>

            {/* CTAs - Responsive on Mobile and Desktop */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-3 pt-2 w-full max-w-md sm:max-w-none">
              <button
                onClick={() => {
                  onSelectPromo();
                  scrollToPricelist();
                }}
                className="cursor-pointer inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-lg shadow-red-600/40 hover:shadow-red-600/60 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Rocket className="w-4 h-4 fill-white text-white" />
                <span>Beli Robux Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById("section-testimonials");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="cursor-pointer inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md border border-slate-700 text-white font-bold text-sm transition-all hover:scale-[1.02]"
              >
                <span>Lihat Testimoni</span>
              </button>
            </div>
          </div>

          {/* Right Card: Countdown Box & Instant Guarantee */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-slate-900/90 text-white p-5 sm:p-6 shadow-2xl border border-slate-800 backdrop-blur-xl">
              {/* Countdown Header */}
              <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-red-400 pb-4 border-b border-slate-800">
                <Timer className="w-4 h-4" />
                <span>Promo Berakhir Dalam</span>
              </div>

              {/* 4 Digit Boxes */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 my-4 text-center">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 sm:p-2.5 shadow-inner">
                  <div className="text-lg sm:text-2xl font-black text-red-400">{timeLeft.days}</div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">HARI</div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 sm:p-2.5 shadow-inner">
                  <div className="text-lg sm:text-2xl font-black text-red-400">{timeLeft.hours}</div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">JAM</div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 sm:p-2.5 shadow-inner">
                  <div className="text-lg sm:text-2xl font-black text-red-400">{timeLeft.minutes}</div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">MENIT</div>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 sm:p-2.5 shadow-inner">
                  <div className="text-lg sm:text-2xl font-black text-red-400">{timeLeft.seconds}</div>
                  <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">DETIK</div>
                </div>
              </div>

              {/* Bottom Guarantee Banner */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-950/40 border border-blue-900/50">
                <div className="h-10 w-auto max-w-[48px] shrink-0 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={48}
                    height={36}
                    className="h-9 w-auto object-contain"
                    unoptimized
                  />
                </div>
                <div>
                  <h2 className="text-xs font-black text-white flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-blue-400 inline" />
                    Garansi Proses Kilat
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Langsung otomatis masuk ke akun Roblox kamu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
