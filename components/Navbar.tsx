"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Coins,
  Compass,
  Trophy,
  MessageSquareHeart,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { STORE_CONFIG } from "@/data/pricelist";

interface NavbarProps {
  selectedCount?: number;
  onOpenCart?: () => void;
  initialStoreInfo?: {
    storeName?: string;
    whatsappUrl?: string;
    logoImageUrl?: string;
  };
}

export default function Navbar({
  selectedCount = 0,
  onOpenCart,
  initialStoreInfo,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeInfo, setStoreInfo] = useState({
    storeName: initialStoreInfo?.storeName || STORE_CONFIG.name,
    whatsappUrl: initialStoreInfo?.whatsappUrl || STORE_CONFIG.whatsappUrl,
    logoImageUrl: initialStoreInfo?.logoImageUrl || "/logo.png",
  });

  useEffect(() => {
    if (initialStoreInfo) {
      setStoreInfo({
        storeName: initialStoreInfo.storeName || STORE_CONFIG.name,
        whatsappUrl: initialStoreInfo.whatsappUrl || STORE_CONFIG.whatsappUrl,
        logoImageUrl: initialStoreInfo.logoImageUrl || "/logo.png",
      });
    }
  }, [initialStoreInfo]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#080C14]/85 border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="relative h-10 sm:h-11 w-auto shrink-0 flex items-center justify-center">
            <Image
              src={storeInfo.logoImageUrl || "/logo.png"}
              alt={`${storeInfo.storeName} Logo`}
              width={54}
              height={40}
              className="h-10 sm:h-11 w-auto object-contain drop-shadow-[0_0_10px_rgba(37,99,235,0.4)]"
              priority
              unoptimized
            />
          </div>
          <div>
            <div className="flex items-center">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                {storeInfo.storeName.includes("_") ? (
                  <>
                    {storeInfo.storeName.split("_")[0]}
                    <span className="text-[#FF1F3D] font-black">
                      _{storeInfo.storeName.split("_")[1]}
                    </span>
                  </>
                ) : (
                  storeInfo.storeName
                )}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-tight mt-0.5">
              Top Up Robux Resmi & Legal
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          <button
            onClick={() => scrollToSection("section-pricelist")}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Pricelist Robux</span>
          </button>

          <button
            onClick={() => scrollToSection("section-workflow")}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Cara Order</span>
          </button>

          <button
            onClick={() => scrollToSection("section-testimonials")}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span>Testimoni</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Contact CS WhatsApp */}
          <a
            href={storeInfo.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/40 hover:border-emerald-500/50 text-xs font-semibold transition-all"
          >
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>Hubungi CS</span>
          </a>

          {/* Cart / Selected item trigger */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Keranjang Pesanan"
            className="relative p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            {selectedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white border-2 border-[#080C14] shadow-md animate-badge-pop">
                {selectedCount}
              </span>
            )}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white md:hidden transition-colors cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#080C14]/98 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => scrollToSection("section-pricelist")}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200 text-sm font-semibold cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Pricelist Robux</span>
            </div>
            <span className="text-xs text-slate-400">Pilih Paket →</span>
          </button>

          <button
            onClick={() => scrollToSection("section-workflow")}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200 text-sm font-semibold cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Cara Order</span>
            </div>
            <span className="text-xs text-slate-400">Panduan →</span>
          </button>

          <button
            onClick={() => scrollToSection("section-testimonials")}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200 text-sm font-semibold cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Testimoni</span>
            </div>
            <span className="text-xs text-slate-400">Ulasan →</span>
          </button>

          <a
            href={storeInfo.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-md transition-colors"
          >
            <MessageSquareHeart className="w-4 h-4" />
            <span>Chat Admin WhatsApp</span>
          </a>
        </div>
      )}
    </header>
  );
}
