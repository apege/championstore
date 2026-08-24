"use client";

import React from "react";
import Image from "next/image";
import { Crown, ChevronRight } from "lucide-react";

interface AdminTopProductsProps {
  onViewAll?: () => void;
}

export default function AdminTopProducts({
  onViewAll,
}: AdminTopProductsProps) {
  const topProducts = [
    {
      id: 1,
      rank: 1,
      rankBg: "bg-gradient-to-br from-amber-400 to-amber-600 text-black border-amber-300 shadow-[0_0_8px_#f59e0b]",
      name: "2200 Robux",
      sold: 312,
      price: "Rp 275.000",
    },
    {
      id: 2,
      rank: 2,
      rankBg: "bg-gradient-to-br from-slate-300 to-slate-400 text-black border-slate-200 shadow-[0_0_8px_#94a3b8]",
      name: "3200 Robux",
      sold: 289,
      price: "Rp 395.000",
    },
    {
      id: 3,
      rank: 3,
      rankBg: "bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 border-amber-600 shadow-[0_0_8px_#b45309]",
      name: "1700 Robux",
      sold: 241,
      price: "Rp 215.000",
    },
    {
      id: 4,
      rank: 4,
      rankBg: "bg-gradient-to-br from-slate-700 to-slate-800 text-slate-300 border-slate-600",
      name: "1200 Robux",
      sold: 198,
      price: "Rp 155.000",
    },
  ];

  return (
    <div className="rounded-3xl bg-[#0B0F19] border border-slate-800/80 p-5 sm:p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-950/50 border border-red-800/50 flex items-center justify-center text-red-500">
            <Crown className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-white tracking-wide">
            Produk Terlaris
          </h3>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
        >
          <span>Lihat Semua</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Product Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {topProducts.map((product) => (
          <div
            key={product.id}
            className="relative rounded-2xl bg-gradient-to-b from-[#131926] to-[#0D121F] border border-slate-800 hover:border-red-500/50 p-3.5 flex flex-col items-center text-center group transition-all duration-200 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
          >
            {/* Robux Icon Image */}
            <div className="relative w-12 h-12 mb-2 group-hover:scale-110 transition-transform">
              <Image
                src="/robux.webp"
                alt="Robux Icon"
                fill
                className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                unoptimized
              />
            </div>

            {/* Product Title */}
            <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">
              {product.name}
            </h4>

            {/* Sold Count */}
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Terjual: <span className="text-slate-200 font-semibold">{product.sold}</span>
            </p>

            {/* Rank Badge at Bottom */}
            <div className="mt-2.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${product.rankBg}`}
              >
                {product.rank}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
