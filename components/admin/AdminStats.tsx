"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
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
  const [dataStats, setDataStats] = useState({
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    totalProducts: 7,
    totalCustomers: 0,
  });

  const loadStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (json.success && json.data) {
        setDataStats((prev) => ({
          ...prev,
          pendingOrders: json.data.pendingOrders,
          processingOrders: json.data.processingOrders,
          completedOrders: json.data.completedOrders,
          totalCustomers: json.data.totalCustomers,
        }));
      }

      const prodRes = await fetch("/api/products");
      const prodJson = await prodRes.json();
      if (prodJson.success && prodJson.data) {
        setDataStats((prev) => ({
          ...prev,
          totalProducts: prodJson.data.length,
        }));
      }
    } catch (err) {
      console.warn("Failed to fetch admin stats:", err);
    }
  };

  useEffect(() => {
    loadStats();

    const channel = supabase
      .channel("admin-stats-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          loadStats();
        }
      )
      .subscribe();

    const handleCustomUpdate = () => {
      loadStats();
    };
    window.addEventListener("champion-orders-updated", handleCustomUpdate);
    window.addEventListener("focus", handleCustomUpdate);

    const interval = setInterval(loadStats, 3000);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("champion-orders-updated", handleCustomUpdate);
      window.removeEventListener("focus", handleCustomUpdate);
      clearInterval(interval);
    };
  }, []);

  const stats = [
    {
      id: "order-masuk",
      label: "Order Masuk",
      value: dataStats.pendingOrders.toString(),
      subtext: "Perlu konfirmasi segera",
      icon: ShoppingBag,
      color: "text-red-400",
      bgColor: "bg-red-950/40",
      borderColor: "border-red-800/40",
      badgeColor: "bg-red-900/60 text-red-300",
      badgeText: "Realtime",
    },
    {
      id: "order-diproses",
      label: "Order Diproses",
      value: dataStats.processingOrders.toString(),
      subtext: "Sedang dikirimkan",
      icon: Package,
      color: "text-blue-400",
      bgColor: "bg-blue-950/40",
      borderColor: "border-blue-800/40",
      badgeColor: "bg-blue-900/60 text-blue-300",
      badgeText: "Proses",
    },
    {
      id: "order-selesai",
      label: "Order Selesai",
      value: dataStats.completedOrders.toString(),
      subtext: "Transaksi sukses",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-950/40",
      borderColor: "border-emerald-800/40",
      badgeColor: "bg-emerald-900/60 text-emerald-300",
      badgeText: "Sukses",
    },
    {
      id: "pricelist",
      label: "Total Produk",
      value: `${dataStats.totalProducts} Paket`,
      subtext: "Nominal Robux aktif",
      icon: Boxes,
      color: "text-purple-400",
      bgColor: "bg-purple-950/40",
      borderColor: "border-purple-800/40",
      badgeColor: "bg-purple-900/60 text-purple-300",
      badgeText: "Pricelist",
    },
    {
      id: "daftar-pelanggan",
      label: "Total Pelanggan",
      value: dataStats.totalCustomers.toString(),
      subtext: "Pelanggan terdaftar",
      icon: Users2,
      color: "text-amber-400",
      bgColor: "bg-amber-950/40",
      borderColor: "border-amber-800/40",
      badgeColor: "bg-amber-900/60 text-amber-300",
      badgeText: "Database",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            onClick={() => onSelectCategory && onSelectCategory(item.id)}
            className="group relative rounded-2xl bg-[#090D17]/90 border border-slate-800/80 p-3 sm:p-4 transition-all duration-200 hover:border-slate-700 hover:bg-[#0B101D] hover:shadow-lg hover:shadow-red-950/10 cursor-pointer overflow-hidden flex flex-col justify-between last:col-span-2 sm:last:col-span-1"
          >
            {/* Top Row: Icon & Status Badge */}
            <div className="flex items-start justify-between gap-1.5 mb-2">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl ${item.bgColor} border ${item.borderColor} ${item.color} flex items-center justify-center transition-transform group-hover:scale-110 shrink-0`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>

              <span
                className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${item.badgeColor} shrink-0`}
              >
                {item.badgeText}
              </span>
            </div>

            {/* Middle Value & Label */}
            <div>
              <div className="text-lg sm:text-xl font-black text-white tracking-tight group-hover:text-[#FF1F3D] transition-colors">
                {item.value}
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-300 mt-0.5 truncate">
                {item.label}
              </div>
            </div>

            {/* Bottom Subtext */}
            <div className="mt-1 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
              <span className="truncate">{item.subtext}</span>
              <TrendingUp className="w-2.5 h-2.5 text-slate-400 shrink-0 group-hover:text-white transition-colors" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
