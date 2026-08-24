"use client";

import React from "react";
import {
  ShoppingBag,
  Package,
  CheckCircle2,
  Boxes,
  Users2,
  TrendingUp,
} from "lucide-react";

interface AdminStatsProps {
  onSelectCategory?: (category: string) => void;
}

export default function AdminStats({ onSelectCategory }: AdminStatsProps) {
  const stats = [
    {
      id: "order-masuk",
      label: "Order Masuk",
      value: "24",
      change: "+12 dari kemarin ↑",
      changePositive: true,
      icon: ShoppingBag,
      iconBg: "bg-red-950/60 text-red-400 border-red-800/60",
      cardBorder: "border-red-900/40 hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]",
      gradient: "from-red-950/20 via-slate-900/60 to-[#0A0E17]",
      accentGlow: "bg-red-500/10",
    },
    {
      id: "order-diproses",
      label: "Order Diproses",
      value: "8",
      change: "+3 dari kemarin ↑",
      changePositive: true,
      icon: Package,
      iconBg: "bg-blue-950/60 text-blue-400 border-blue-800/60",
      cardBorder: "border-blue-900/40 hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]",
      gradient: "from-blue-950/20 via-slate-900/60 to-[#0A0E17]",
      accentGlow: "bg-blue-500/10",
    },
    {
      id: "order-selesai",
      label: "Order Selesai",
      value: "156",
      change: "+28 dari kemarin ↑",
      changePositive: true,
      icon: CheckCircle2,
      iconBg: "bg-emerald-950/60 text-emerald-400 border-emerald-800/60",
      cardBorder: "border-emerald-900/40 hover:border-emerald-500/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]",
      gradient: "from-emerald-950/20 via-slate-900/60 to-[#0A0E17]",
      accentGlow: "bg-emerald-500/10",
    },
    {
      id: "pricelist",
      label: "Pricelist",
      value: "42",
      change: "Aktif",
      changePositive: true,
      icon: Boxes,
      iconBg: "bg-purple-950/60 text-purple-400 border-purple-800/60",
      cardBorder: "border-purple-900/40 hover:border-purple-500/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]",
      gradient: "from-purple-950/20 via-slate-900/60 to-[#0A0E17]",
      accentGlow: "bg-purple-500/10",
    },
    {
      id: "daftar-pelanggan",
      label: "Total Pelanggan",
      value: "1.289",
      change: "+37 pelanggan baru",
      changePositive: true,
      icon: Users2,
      iconBg: "bg-rose-950/60 text-rose-400 border-rose-800/60",
      cardBorder: "border-rose-900/40 hover:border-rose-500/60 hover:shadow-[0_0_20px_rgba(244,63,94,0.25)]",
      gradient: "from-rose-950/20 via-slate-900/60 to-[#0A0E17]",
      accentGlow: "bg-rose-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            onClick={() => onSelectCategory && onSelectCategory(item.id)}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${item.gradient} border ${item.cardBorder} p-3 sm:p-3.5 transition-all duration-300 cursor-pointer group flex flex-col justify-between`}
          >
            {/* Ambient glow */}
            <div
              className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-xl pointer-events-none ${item.accentGlow}`}
            />

            {/* Top row: Icon & Header */}
            <div className="flex items-center gap-2.5 mb-1.5">
              <div
                className={`w-8 h-8 shrink-0 rounded-xl border flex items-center justify-center shadow-md transition-transform group-hover:scale-105 ${item.iconBg}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-300 group-hover:text-white transition-colors line-clamp-1">
                {item.label}
              </span>
            </div>

            {/* Middle: Big Stat Number */}
            <div>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                {item.value}
              </div>
            </div>

            {/* Bottom: Trend Subtitle */}
            <div className="mt-1 flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-400">
              <TrendingUp className="w-3 h-3 shrink-0" />
              <span className="truncate">{item.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
