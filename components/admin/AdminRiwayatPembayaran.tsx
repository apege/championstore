"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  RefreshCw,
  Search,
  TrendingUp,
  Globe,
  MessageCircle,
  Loader2,
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
  robuxNum: number;
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

  const [mutations, setMutations] = useState<PaymentMutation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped: PaymentMutation[] = json.data.map((o: any) => ({
          id: String(o.id),
          orderCode: o.order_code || o.id,
          username: o.customer_username,
          source: (o.source || "WEBSITE") === "WHATSAPP" ? "WHATSAPP" : "WEBSITE",
          date: new Date(o.created_at || Date.now()).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          amount: `+Rp ${Number(o.total_price || 0).toLocaleString("id-ID")}`,
          amountNum: Number(o.total_price || 0),
          robux: `${Number(o.total_robux || 0).toLocaleString("id-ID")} Robux`,
          robuxNum: Number(o.total_robux || 0),
        }));
        setMutations(mapped);
      } else {
        setMutations([]);
      }
    } catch (e) {
      console.warn("Failed to fetch payments:", e);
      setMutations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPayments();
    setIsRefreshing(false);
    onToast("Riwayat pembayaran berhasil disinkronkan!", "success");
  };

  // Metrics Calculations (100% Dynamic)
  const totalDanaMasuk = mutations.reduce((sum, m) => sum + m.amountNum, 0);
  const totalTransactions = mutations.length;
  const totalRobuxTerjual = mutations.reduce((sum, m) => sum + m.robuxNum, 0);
  const avgOrderValue =
    totalTransactions > 0 ? Math.round(totalDanaMasuk / totalTransactions) : 0;

  // Channel Breakdown
  const websiteMutations = mutations.filter((m) => m.source === "WEBSITE");
  const waMutations = mutations.filter((m) => m.source === "WHATSAPP");

  const websiteCount = websiteMutations.length;
  const waCount = waMutations.length;

  const websiteOmset = websiteMutations.reduce((sum, m) => sum + m.amountNum, 0);
  const waOmset = waMutations.reduce((sum, m) => sum + m.amountNum, 0);

  const websitePct =
    totalDanaMasuk > 0 ? ((websiteOmset / totalDanaMasuk) * 100).toFixed(1) : "0.0";
  const waPct =
    totalDanaMasuk > 0 ? ((waOmset / totalDanaMasuk) * 100).toFixed(1) : "0.0";

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
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all self-start sm:self-auto active:scale-95 shadow-sm cursor-pointer disabled:opacity-50"
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
      {/* 1. TOP 3 METRIC CARDS (100% REALTIME FROM DATABASE) */}
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
              Rp {totalDanaMasuk.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Dari {totalTransactions} transaksi pembayaran
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
              <span>{totalRobuxTerjual.toLocaleString("id-ID")}</span>
              <span className="text-sm font-extrabold text-amber-500">R$</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Robux dipesan oleh pelanggan
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
              Rp {avgOrderValue.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-emerald-400/90 font-medium mt-1">
              Average Order Value per transaksi
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. OMSET PER METODE PEMBAYARAN (REALTIME FROM ORDERS) */}
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
                {websitePct}%
              </span>
            </div>

            <div className="flex items-end justify-between pt-1">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Total Omset
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#FF1F3D] tracking-tight">
                  Rp {websiteOmset.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Transaksi
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-white">
                  {websiteCount} transaksi
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-[#FF1F3D] rounded-full shadow-[0_0_8px_rgba(255,31,61,0.6)] transition-all duration-500"
                style={{ width: `${websitePct}%` }}
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
                {waPct}%
              </span>
            </div>

            <div className="flex items-end justify-between pt-1">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Total Omset
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#FF1F3D] tracking-tight">
                  Rp {waOmset.toLocaleString("id-ID")}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Transaksi
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-white">
                  {waCount} transaksi
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] transition-all duration-500"
                style={{ width: `${waPct}%` }}
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
              Riwayat penerimaan pembayaran yang valid dan sudah masuk sistem
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
          {loading ? (
            <div className="py-12 flex justify-center items-center gap-2 text-slate-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-[#FF1F3D]" />
              <span>Memuat riwayat pembayaran...</span>
            </div>
          ) : filteredMutations.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              {searchTerm
                ? "Tidak ada log pembayaran yang cocok dengan kata kunci."
                : "Belum ada transaksi pembayaran yang tercatat di database."}
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
