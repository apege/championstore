"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Timer,
  Rocket,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from "lucide-react";

interface HeroBannerProps {
  onSelectPromo: () => void;
  initialPromoConfig?: {
    storeName?: string;
    logoImageUrl?: string;
    bannerImageUrl?: string;
    promoActive?: boolean;
    promoTag?: string;
    promoBadge?: string;
    promoTitle?: string;
    promoSubtitle?: string;
    promoRobuxAmount?: number;
    promoOriginalLabel?: string;
    promoDiscountPrice?: number;
    promoEndDate?: string;
  };
}

export default function HeroBanner({
  onSelectPromo,
  initialPromoConfig,
}: HeroBannerProps) {
  const [promoConfig, setPromoConfig] = useState({
    storeName: initialPromoConfig?.storeName || "ChampionStore",
    logoImageUrl: initialPromoConfig?.logoImageUrl || "/logo.png",
    bannerImageUrl: initialPromoConfig?.bannerImageUrl || "/roblox_hero.jpg",
    promoActive: initialPromoConfig?.promoActive ?? false,
    promoTag: initialPromoConfig?.promoTag || "PROMO SPESIAL BULAN INI",
    promoBadge: initialPromoConfig?.promoBadge || "LIMITED STOCK",
    promoTitle: initialPromoConfig?.promoTitle || "ROBUX BULAN INI",
    promoSubtitle:
      initialPromoConfig?.promoSubtitle ||
      "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!",
    promoRobuxAmount: Number(initialPromoConfig?.promoRobuxAmount) || 2200,
    promoOriginalLabel: initialPromoConfig?.promoOriginalLabel || "2.000 Robux",
    promoDiscountPrice: Number(initialPromoConfig?.promoDiscountPrice) || 45000,
    promoEndDate: initialPromoConfig?.promoEndDate,
  });

  useEffect(() => {
    if (initialPromoConfig) {
      setPromoConfig({
        storeName: initialPromoConfig.storeName || "ChampionStore",
        logoImageUrl: initialPromoConfig.logoImageUrl || "/logo.png",
        bannerImageUrl: initialPromoConfig.bannerImageUrl || "/roblox_hero.jpg",
        promoActive: initialPromoConfig.promoActive ?? false,
        promoTag: initialPromoConfig.promoTag || "PROMO SPESIAL BULAN INI",
        promoBadge: initialPromoConfig.promoBadge || "LIMITED STOCK",
        promoTitle: initialPromoConfig.promoTitle || "ROBUX BULAN INI",
        promoSubtitle:
          initialPromoConfig.promoSubtitle ||
          "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!",
        promoRobuxAmount: Number(initialPromoConfig.promoRobuxAmount) || 2200,
        promoOriginalLabel: initialPromoConfig.promoOriginalLabel || "2.000 Robux",
        promoDiscountPrice: Number(initialPromoConfig.promoDiscountPrice) || 45000,
        promoEndDate: initialPromoConfig.promoEndDate,
      });
    }
  }, [initialPromoConfig]);

  const [timeLeft, setTimeLeft] = useState({
    days: "08",
    hours: "12",
    minutes: "44",
    seconds: "03",
  });

  useEffect(() => {
    const updateCountdown = () => {
      let targetTime: number;
      if (promoConfig.promoEndDate) {
        targetTime = new Date(promoConfig.promoEndDate).getTime();
      } else {
        targetTime = Date.now() + (8 * 86400 + 12 * 3600 + 44 * 60 + 3) * 1000;
      }

      const diff = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
      const d = Math.floor(diff / 86400);
      const h = Math.floor((diff % 86400) / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = Math.floor(diff % 60);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [promoConfig.promoEndDate]);

  const scrollToPricelist = () => {
    const el = document.getElementById("section-pricelist");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isPromo = promoConfig.promoActive;

  return (
    <section className="relative w-full mb-8 pt-2 sm:pt-4">
      {/* Banner Container with sleek dark gaming gradient, glowing edges, and watermark */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0c1322] border border-blue-500/30 shadow-[0_0_35px_rgba(37,99,235,0.15)] p-4 sm:p-8 md:p-10 text-white">
        {/* Banner Background Image with subtle gaming opacity */}
        {promoConfig.bannerImageUrl && (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <Image
              src={promoConfig.bannerImageUrl}
              alt="Promo Banner Background"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Ambient Glow Effects (Red & Blue Cyberpunk Glow) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-5 text-center sm:text-left flex flex-col items-center sm:items-start">
            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {isPromo ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-red-600/30">
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                  <span>{promoConfig.promoBadge}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-500/50 text-blue-400 text-xs font-black uppercase tracking-wider shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>TOP UP ROBUX RESMI &amp; LEGAL</span>
                </span>
              )}
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {isPromo ? (
                  promoConfig.promoTitle === "ROBUX BULAN INI" ? (
                    <>
                      ROBUX BULAN{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-red-400">
                        INI
                      </span>
                    </>
                  ) : (
                    promoConfig.promoTitle
                  )
                ) : (
                  <>
                    TOP UP ROBUX{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-red-400">
                      CEPAT &amp; AMAN
                    </span>
                  </>
                )}
              </h1>
              <p className="mt-2 text-slate-300 text-sm sm:text-base font-medium max-w-xl mx-auto sm:mx-0">
                {promoConfig.promoSubtitle}
              </p>
            </div>

            {/* Highlighted Deal (Only if promo active) */}
            {isPromo && (
              <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-x-3 gap-y-1.5 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {promoConfig.promoRobuxAmount.toLocaleString("id-ID")}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold uppercase px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-400/30">
                    ROBUX
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xs sm:text-sm text-slate-500 line-through">
                    {promoConfig.promoOriginalLabel}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-red-500">
                    Rp {promoConfig.promoDiscountPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            )}

            {/* CTAs - Responsive on Mobile and Desktop */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-3 pt-2 w-full max-w-md sm:max-w-none">
              {isPromo ? (
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
              ) : (
                <button
                  onClick={scrollToPricelist}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-lg shadow-red-600/40 hover:shadow-red-600/60 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Rocket className="w-4 h-4 fill-white text-white" />
                  <span>Pilih Paket Robux</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

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

          {/* Right Card: Countdown Box (Promo Mode) OR BloxyLucy Style Highlights (Standard Mode) */}
          <div className="lg:col-span-5">
            {isPromo ? (
              /* PROMO COUNTDOWN BOX */
              <div className="rounded-2xl bg-slate-900/90 text-white p-5 sm:p-6 shadow-2xl border border-slate-800 backdrop-blur-xl">
                <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-red-400 pb-4 border-b border-slate-800">
                  <Timer className="w-4 h-4" />
                  <span>Promo Berakhir Dalam</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 my-4 text-center">
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 sm:p-2.5 shadow-inner">
                    <div className="text-lg sm:text-2xl font-black text-red-400">
                      {timeLeft.days}
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      HARI
                    </div>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 sm:p-2.5 shadow-inner">
                    <div className="text-lg sm:text-2xl font-black text-red-400">
                      {timeLeft.hours}
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      JAM
                    </div>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 sm:p-2.5 shadow-inner">
                    <div className="text-lg sm:text-2xl font-black text-red-400">
                      {timeLeft.minutes}
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      MENIT
                    </div>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 sm:p-2.5 shadow-inner">
                    <div className="text-lg sm:text-2xl font-black text-red-400">
                      {timeLeft.seconds}
                    </div>
                    <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      DETIK
                    </div>
                  </div>
                </div>

                {/* Bottom Garansi Proses Kilat Box */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-950/40 border border-blue-900/50">
                  <div className="h-10 w-auto max-w-[48px] shrink-0 flex items-center justify-center">
                    <Image
                      src={promoConfig.logoImageUrl || "/logo.png"}
                      alt="ChampionStore"
                      width={48}
                      height={36}
                      className="h-9 w-auto object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 text-left">
                    <h2 className="text-xs font-black text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 inline shrink-0" />
                      <span>Garansi Proses Kilat</span>
                    </h2>
                    <p className="text-[11px] text-slate-400 truncate">
                      Langsung otomatis masuk ke akun Roblox kamu
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* BLOXYLUCY STYLE STORE HIGHLIGHTS CARD (NON-PROMO) */
              <div className="max-w-md lg:ml-auto rounded-2xl bg-slate-900/90 text-white p-4 sm:p-5 shadow-2xl border border-slate-800 space-y-3 backdrop-blur-xl">
                {/* Header with Logo and 24/7 Service Status */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-red-500/30 shrink-0 bg-slate-950/80 flex items-center justify-center shadow-md">
                    <Image
                      src={promoConfig.logoImageUrl || "/logo.png"}
                      alt={promoConfig.storeName || "Store Logo"}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-sm sm:text-base text-white truncate">
                      {promoConfig.storeName}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[11px] font-bold text-emerald-400 tracking-wide">
                        Layanan Buka 24/7
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Clean BloxyLucy Style Feature Points */}
                <div className="space-y-2.5 pt-0.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center shrink-0">
                      <Zap className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-200">
                      Proses Cepat 1-5 Menit
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-200">
                      100% Robux Legal &amp; Aman
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-200">
                      Garansi Uang Kembali 100%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
