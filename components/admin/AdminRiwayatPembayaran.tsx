"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  RefreshCw,
  Search,
  TrendingUp,
  Globe,
  MessageCircle,
  Coins,
  ArrowUpRight,
} from "lucide-react";

export interface PaymentMutation {
  id: string;
  orderCode: string;
  username: string;
  source: "WEBSITE" | "WHATSAPP";
  date: string;
  amount: string;
  amountNum: number;
  robux: string;
}

interface AdminRiwayatPembayaranProps {
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function AdminRiwayatPembayaran({
  onToast,
}: AdminRiwayatPembayaranProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeChannelFilter, setActiveChannelFilter] = useState<
    "ALL" | "WEBSITE" | "WHATSAPP"
  >("ALL");

  const [mutations] = useState<PaymentMutation[]>([
    {
      id: "1",
      orderCode: "BLX56315343",
      username: "antooomeny",
      source: "WEBSITE",
      date: "24 Agu 2026",
      amount: "+Rp 45.000",
      amountNum: 45000,
      robux: "2.200 Robux",
    },
    {
      id: "2",
      orderCode: "BLX76338364",
      username: "antooomeny",
      source: "WEBSITE",
      date: "24 Agu 2026",
      amount: "+Rp 45.000",
      amountNum: 45000,
      robux: "2.200 Robux",
    },
    {
      id: "3",
      orderCode: "BLX71185022",
      username: "jejesyl",
      source: "WEBSITE",
      date: "24 Agu 2026",
      amount: "+Rp 35.000",
      amountNum: 35000,
      robux: "1.800 Robux",
    },
    {
      id: "4",
      orderCode: "BLX86838059",
      username: "antooomeny",
      source: "WEBSITE",
      date: "24 Agu 2026",
      amount: "+Rp 45.000",
      amountNum: 45000,
      robux: "2.200 Robux",
    },
    {
      id: "5",
      orderCode: "BLX30276780",
      username: "ayyzuyu09",
      source: "WEBSITE",
      date: "24 Agu 2026",
      amount: "+Rp 35.000",
      amountNum: 35000,
      robux: "1.800 Robux",
    },
    {
      id: "6",
      orderCode: "BLX29841029",
      username: "dragon_slayer",
      source: "WHATSAPP",
      date: "24 Agu 2026",
      amount: "+Rp 275.000",
      amountNum: 275000,
      robux: "2.200 Robux",
    },
    {
      id: "7",
      orderCode: "BLX19283741",
      username: "rbx_master",
      source: "WHATSAPP",
      date: "23 Agu 2026",
      amount: "+Rp 260.000",
      amountNum: 260000,
      robux: "2.200 Robux",
    },
    {
      id: "8",
      orderCode: "BLX19283740",
      username: "PinkQueen_23",
      source: "WEBSITE",
      date: "23 Agu 2026",
      amount: "+Rp 275.000",
      amountNum: 275000,
      robux: "2.200 Robux",
    },
    {
      id: "9",
      orderCode: "BLX19283739",
      username: "gaming_pro21",
      source: "WEBSITE",
      date: "23 Agu 2026",
      amount: "+Rp 215.000",
      amountNum: 215000,
      robux: "1.700 Robux",
    },
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onToast("Riwayat pembayaran berhasil diperbarui!", "success");
    }, 500);
  };

  const websiteCount = mutations.filter((m) => m.source === "WEBSITE").length;
  const waCount = mutations.filter((m) => m.source === "WHATSAPP").length;

  const filteredMutations = mutations.filter((m) => {
    const matchChannel =
      activeChannelFilter === "ALL" || m.source === activeChannelFilter;
    const matchSearch =
      m.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchChannel && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Title & Refresh Button Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Riwayat Pembayaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Log mutasi kas masuk dan ringkasan pembayaran pesanan Robux yang
            berhasil
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all self-start sm:self-auto active:scale-95 shadow-sm cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-[#FF1F3D] ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. TOP 3 METRIC CARDS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: TOTAL DANA MASUK */}
        <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-5 sm:p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400">
              TOTAL DANA MASUK
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-950/60 border border-red-800/40 text-[#FF1F3D] flex items-center justify-center shadow-[0_0_8px_rgba(255,31,61,0.2)]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-[#FF1F3D] tracking-tight drop-shadow-[0_0_10px_rgba(255,31,61,0.5)]">
              Rp 1.820.000
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Dari 27 transaksi pembayaran lunas
            </p>
          </div>
        </div>

        {/* Card 2: TOTAL ROBUX TERJUAL */}
        <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-5 sm:p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400">
              TOTAL ROBUX TERJUAL
            </span>
            <div className="relative w-8 h-8 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.2)]">
              <Image
                src="/robux.webp"
                alt="Robux"
                width={20}
                height={20}
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight flex items-baseline gap-1.5">
              <span>97.800</span>
              <span className="text-sm font-extrabold text-amber-500">R$</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Robux terkirim ke akun pelanggan
            </p>
          </div>
        </div>

        {/* Card 3: RATA-RATA ORDER */}
        <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-5 sm:p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400">
              RATA-RATA ORDER
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              AOV
            </span>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Rp 67.407
            </div>
            <p className="text-xs text-emerald-400/90 font-medium mt-1">
              Average Order Value per transaksi
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. OMSET PER METODE PEMBAYARAN */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
            OMSET PER METODE PEMBAYARAN
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ringkasan total pemasukan berdasarkan metode pembayaran
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Card: WEBSITE */}
          <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-5 sm:p-6 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-400">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                  WEBSITE
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-950/60 text-red-400 border border-red-800/40">
                70.6%
              </span>
            </div>

            <div className="flex items-end justify-between pt-1">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Total Omset
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#FF1F3D] tracking-tight">
                  Rp 1.285.000
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Transaksi
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-white">
                  25 transaksi
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-[#FF1F3D] rounded-full shadow-[0_0_8px_rgba(255,31,61,0.6)]"
                style={{ width: "70.6%" }}
              />
            </div>
          </div>

          {/* Card: WHATSAPP */}
          <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-5 sm:p-6 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                  WHATSAPP
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                29.4%
              </span>
            </div>

            <div className="flex items-end justify-between pt-1">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Total Omset
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#FF1F3D] tracking-tight">
                  Rp 535.000
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Transaksi
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-white">
                  2 transaksi
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                style={{ width: "29.4%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. LOG MUTASI PEMBAYARAN MASUK */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-4 sm:p-6 space-y-4 shadow-xl">
        {/* Header & Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              Log Mutasi Pembayaran Masuk
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Riwayat penerimaan pembayaran yang valid dan sudah lunas
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#080C14] border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveChannelFilter("ALL")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeChannelFilter === "ALL"
                  ? "bg-gradient-to-r from-red-600 to-[#FF1F3D] text-white shadow-[0_0_10px_rgba(255,31,61,0.5)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Semua ({mutations.length})
            </button>

            <button
              onClick={() => setActiveChannelFilter("WEBSITE")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeChannelFilter === "WEBSITE"
                  ? "bg-gradient-to-r from-red-600 to-[#FF1F3D] text-white shadow-[0_0_10px_rgba(255,31,61,0.5)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Website ({websiteCount})
            </button>

            <button
              onClick={() => setActiveChannelFilter("WHATSAPP")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeChannelFilter === "WHATSAPP"
                  ? "bg-gradient-to-r from-red-600 to-[#FF1F3D] text-white shadow-[0_0_10px_rgba(255,31,61,0.5)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              WhatsApp ({waCount})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kode order atau username..."
            className="w-full bg-[#080C14] text-xs text-slate-200 pl-10 pr-4 py-2.5 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none focus:ring-1 focus:ring-[#FF1F3D] transition-all"
          />
        </div>

        {/* Mutations Rows */}
        <div className="space-y-3">
          {filteredMutations.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Tidak ada log pembayaran yang cocok dengan filter pencarian.
            </div>
          ) : (
            filteredMutations.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-[#080C14] border border-slate-800/80 hover:border-slate-700 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all duration-200 hover:shadow-lg"
              >
                {/* Left Side: Order Code + Username + LUNAS + Source */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                      #{item.orderCode}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-[#FF1F3D]">
                      @{item.username}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      LUNAS
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        item.source === "WEBSITE"
                          ? "bg-purple-950/60 text-purple-400 border border-purple-800/40"
                          : "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                      }`}
                    >
                      {item.source}
                    </span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>

                {/* Right Side: +Amount & Robux nominal */}
                <div className="text-left md:text-right leading-tight shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                  <div className="text-base sm:text-lg font-black text-emerald-400 tracking-tight">
                    {item.amount}
                  </div>
                  <div className="text-xs font-bold text-slate-300 mt-0.5 flex items-center md:justify-end gap-1.5">
                    <div className="relative w-3.5 h-3.5">
                      <Image
                        src="/robux.webp"
                        alt="Robux"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <span>{item.robux}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
