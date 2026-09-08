"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RobuxItem } from "@/types";
import { ROBUX_PACKAGES, CATEGORIES } from "@/data/pricelist";
import {
  LayoutGrid,
  Flame,
  Zap,
  Crown,
  Check,
  Plus,
} from "lucide-react";

interface RobuxGridSectionProps {
  selectedItem: RobuxItem | null;
  onSelectItem: (item: RobuxItem) => void;
  onAddToCart: (item: RobuxItem) => void;
  packages?: RobuxItem[];
}

export default function RobuxGridSection({
  selectedItem,
  onSelectItem,
  onAddToCart,
  packages = ROBUX_PACKAGES,
}: RobuxGridSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredPackages = packages.filter((pkg) => {
    if (activeTab === "all") return true;
    if (activeTab === "popular") return pkg.category === "popular" || pkg.isBestSeller;
    if (activeTab === "promo") return pkg.isPromo;
    if (activeTab === "sultan") return pkg.isSultan;
    return true;
  });

  const getTabIcon = (id: string) => {
    switch (id) {
      case "all":
        return <LayoutGrid className="w-3.5 h-3.5" />;
      case "popular":
        return <Flame className="w-3.5 h-3.5 text-amber-500" />;
      case "promo":
        return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
      case "sultan":
        return <Crown className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return null;
    }
  };

  const categories = [
    { id: "all", label: "Semua", count: packages.length },
    {
      id: "popular",
      label: "Populer",
      count: packages.filter((p) => p.category === "popular" || p.isBestSeller).length,
    },
    {
      id: "promo",
      label: "Promo",
      count: packages.filter((p) => p.isPromo).length,
    },
    {
      id: "sultan",
      label: "Paket Sultan",
      count: packages.filter((p) => p.isSultan).length,
    },
  ];

  return (
    <section id="section-pricelist" className="w-full mb-8">
      <div className="bg-slate-900/95 rounded-3xl border border-slate-800/80 shadow-xl p-4 sm:p-7 md:p-8">
        {/* Section Header */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-red-600/30 shrink-0">
            2
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Pilih Robux
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Pilih paket nominal Robux yang ingin Anda beli
            </p>
          </div>
        </div>

        {/* Category Filter Pills (No Scrollbar, smooth mobile scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-2 mb-6">
          {categories.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 hover:scale-[1.03] active:scale-95 shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30"
                    : "bg-slate-950/80 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {getTabIcon(cat.id)}
                <span>
                  {cat.label} ({cat.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid of Robux Items (2 Columns Mobile, 2 Columns Tablet, 4 Columns Desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredPackages.map((item, idx) => {
            const isSelected = selectedItem?.id === item.id;
            const uniqueKey = item.id ? `${item.id}-${idx}` : `item-${idx}`;

            return (
              <div
                key={uniqueKey}
                onClick={() => onSelectItem(item)}
                className={`relative cursor-pointer rounded-2xl sm:rounded-3xl border-2 p-3 sm:p-4 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-red-950/20 active:scale-[0.98] flex flex-col justify-between select-none ${
                  isSelected
                    ? "border-red-500 bg-gradient-to-b from-red-950/30 to-slate-900/90 shadow-[0_0_20px_rgba(239,68,68,0.25)] ring-1 ring-red-500/40"
                    : "border-slate-800/90 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/80"
                }`}
              >
                {/* Card Top: Badge on Left + Plus Button on Right */}
                <div className="flex items-center justify-between min-h-[24px] mb-2">
                  <div>
                    {item.amount >= 10000 || item.badge === "SULTAN" || item.badge === "SUPER SULTAN" || item.isSultan ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-[0_0_8px_rgba(245,158,11,0.6)]">
                        <Crown className="w-2.5 h-2.5 fill-black text-black" />
                        <span>SULTAN</span>
                      </span>
                    ) : item.badge === "PROMO" || item.isPromo ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-red-600 via-[#FF1F3D] to-red-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-[0_0_8px_rgba(255,31,61,0.6)]">
                        <Zap className="w-2.5 h-2.5 fill-white text-white" />
                        <span>PROMO</span>
                      </span>
                    ) : item.badge === "POPULER" || item.isBestSeller ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-[0_0_8px_rgba(249,115,22,0.6)]">
                        <Flame className="w-2.5 h-2.5 fill-white text-white" />
                        <span>POPULER</span>
                      </span>
                    ) : (
                      <span />
                    )}
                  </div>

                  {/* Plus Button: Adds item to cart in navbar with spring rotation */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(item);
                    }}
                    title="Tambah ke Keranjang"
                    aria-label={`Tambah ${item.amount} Robux ke keranjang`}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border border-red-500/40 bg-red-950/30 hover:bg-red-600 text-red-400 hover:text-white transition-all duration-200 cursor-pointer hover:scale-115 active:scale-85 active:rotate-45 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  </button>
                </div>

                {/* Card Body: Coin on Left + Amount & Price on Right */}
                <div className="flex items-center gap-2.5 sm:gap-3 py-1">
                  {/* Round Coin Container */}
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-amber-950/30 border border-amber-600/30 p-1.5 flex items-center justify-center shrink-0">
                    <Image
                      src="/robux.webp"
                      alt="Robux Coin"
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                    />
                  </div>

                  {/* Robux Amount & Price */}
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <span className="text-sm sm:text-base font-black text-white">
                        {item.amount.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-red-500">
                        Robux
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-black text-red-500 mt-0.5">
                      Rp {item.price.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>

                {/* Card Bottom: INSTAN on Left + Status on Right */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-extrabold text-[10px] sm:text-[11px] text-emerald-400">
                    <Zap className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                    <span>INSTAN</span>
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold transition-colors ${
                      isSelected
                        ? "text-red-500 font-black"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Dipilih</span>
                      </>
                    ) : (
                      <span>Pilih</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
