"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  Search,
  Plus,
  ShieldAlert,
  Unlock,
  X,
  AlertTriangle,
  Check,
} from "lucide-react";

export interface BlacklistItem {
  id: string;
  username: string;
  robloxId: string;
  wa: string;
  reason: string;
  totalOrders: number;
  totalSpent: string;
}

interface AdminBlacklistProps {
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function AdminBlacklist({ onToast }: AdminBlacklistProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [blacklist, setBlacklist] = useState<BlacklistItem[]>([
    {
      id: "1",
      username: "Perusuh",
      robloxId: "Belum terdata",
      wa: "081234566789",
      reason: "Indikasi penipuan atau penyalahgunaan",
      totalOrders: 0,
      totalSpent: "Rp 0",
    },
    {
      id: "2",
      username: "FakeBuyer_99",
      robloxId: "4810293847",
      wa: "085719283746",
      reason: "Spam bukti transfer palsu",
      totalOrders: 0,
      totalSpent: "Rp 0",
    },
  ]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formUsername, setFormUsername] = useState("");
  const [formWa, setFormWa] = useState("");
  const [formRobloxId, setFormRobloxId] = useState("");
  const [formReason, setFormReason] = useState(
    "Indikasi penipuan atau penyalahgunaan"
  );

  // Unblock confirmation state
  const [unblockingItem, setUnblockingItem] = useState<BlacklistItem | null>(
    null
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      onToast("Data daftar blacklist berhasil diperbarui!", "success");
    }, 500);
  };

  const handleAddBlacklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim()) {
      onToast("Mohon masukkan username Roblox!", "error");
      return;
    }

    const cleanUsername = formUsername.trim().replace(/^@/, "");

    const newItem: BlacklistItem = {
      id: Date.now().toString(),
      username: cleanUsername,
      robloxId: formRobloxId.trim() || "Belum terdata",
      wa: formWa.trim() || "Belum terdata",
      reason: formReason.trim() || "Indikasi penipuan atau penyalahgunaan",
      totalOrders: 0,
      totalSpent: "Rp 0",
    };

    setBlacklist((prev) => [newItem, ...prev]);
    onToast(`Akun @${cleanUsername} berhasil diblokir!`, "success");

    // Reset & close
    setFormUsername("");
    setFormWa("");
    setFormRobloxId("");
    setFormReason("Indikasi penipuan atau penyalahgunaan");
    setIsModalOpen(false);
  };

  const handleUnblockConfirm = () => {
    if (!unblockingItem) return;
    setBlacklist((prev) => prev.filter((b) => b.id !== unblockingItem.id));
    onToast(
      `Blokir akun @${unblockingItem.username} berhasil dibuka!`,
      "success"
    );
    setUnblockingItem(null);
  };

  const filteredBlacklist = blacklist.filter(
    (b) =>
      b.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.robloxId.includes(searchTerm) ||
      b.wa.includes(searchTerm)
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Title & Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Daftar Blacklist
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Daftar akun pelanggan yang diblokir karena indikasi penipuan atau
            penyalahgunaan
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* + Tambah Blacklist Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-[#FF1F3D] to-red-600 hover:from-red-500 hover:to-[#FF1F3D] text-white text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(255,31,61,0.5)] transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Blacklist</span>
          </button>

          {/* Refresh Data Button */}
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-[#FF1F3D] ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Main Blacklist Container */}
      <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-4 sm:p-6 space-y-4 shadow-xl">
        {/* Search & Counter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari akun blacklist..."
              className="w-full bg-[#080C14] text-xs text-slate-200 pl-10 pr-4 py-2.5 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none focus:ring-1 focus:ring-[#FF1F3D] transition-all"
            />
          </div>

          <span className="text-xs font-semibold text-slate-400">
            Menampilkan {filteredBlacklist.length} akun blacklist
          </span>
        </div>

        {/* Blacklist Items List */}
        <div className="space-y-3">
          {filteredBlacklist.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Tidak ada akun blacklist yang ditemukan.
            </div>
          ) : (
            filteredBlacklist.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-[#080C14] border border-red-950/40 hover:border-red-900/60 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 hover:shadow-lg"
              >
                {/* Left Side: Username + BLACKLISTED Pill + Meta */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-extrabold text-sm sm:text-base text-[#FF1F3D] tracking-tight">
                      @{item.username}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-red-950/60 text-red-400 border border-red-800/40">
                      BLACKLISTED
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 font-medium">
                    <span>
                      ID:{" "}
                      <span
                        className={
                          item.robloxId !== "Belum terdata"
                            ? "text-slate-200 font-semibold"
                            : "italic text-slate-500"
                        }
                      >
                        {item.robloxId}
                      </span>
                    </span>
                    <span>•</span>
                    <span>
                      WA:{" "}
                      <span
                        className={
                          item.wa !== "Belum terdata"
                            ? "text-emerald-400 font-semibold"
                            : "italic text-slate-500"
                        }
                      >
                        {item.wa}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Right Side: Stats & Buka Blokir Button */}
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                  <div className="text-left md:text-right leading-tight">
                    <div className="text-xs font-bold text-white">
                      {item.totalOrders} Pesanan
                    </div>
                    <div className="text-xs font-extrabold text-[#FF1F3D] mt-0.5">
                      Total: {item.totalSpent}
                    </div>
                  </div>

                  {/* Buka Blokir Button (Green pill) */}
                  <button
                    onClick={() => setUnblockingItem(item)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-600/40 hover:border-emerald-500/70 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-all active:scale-95 shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer"
                  >
                    Buka Blokir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: TAMBAH AKUN KE BLACKLIST (BloxyLucy Style) */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Dialog Box */}
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0D121F] border border-slate-800 shadow-2xl p-6 sm:p-7 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-950/80 border border-red-600/50 text-red-500 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.3)]">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  Tambah Akun ke Blacklist
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddBlacklist} className="space-y-4">
              {/* Field 1: Username Roblox */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Username Roblox
                </label>
                <input
                  type="text"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  placeholder="Contoh: APG_Channel11"
                  className="w-full bg-[#080C14] text-white font-medium text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none transition-all shadow-inner"
                  autoFocus
                />
              </div>

              {/* Field 2: Nomor WhatsApp (Opsional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Nomor WhatsApp (Opsional)
                </label>
                <input
                  type="text"
                  value={formWa}
                  onChange={(e) => setFormWa(e.target.value)}
                  placeholder="Contoh: 087816959979 atau 628..."
                  className="w-full bg-[#080C14] text-white font-medium text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none transition-all shadow-inner"
                />
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Nomor WhatsApp ini juga akan langsung diblokir saat checkout.
                </p>
              </div>

              {/* Field 3: ID Roblox (Opsional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  ID Roblox (Opsional)
                </label>
                <input
                  type="text"
                  value={formRobloxId}
                  onChange={(e) => setFormRobloxId(e.target.value)}
                  placeholder="Contoh: 1350738735 (jika diketahui)"
                  className="w-full bg-[#080C14] text-white font-medium text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none transition-all shadow-inner"
                />
              </div>

              {/* Field 4: Alasan Pemblokiran */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Alasan Pemblokiran
                </label>
                <input
                  type="text"
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="Indikasi penipuan atau penyalahgunaan"
                  className="w-full bg-[#080C14] text-white font-medium text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none transition-all shadow-inner"
                />
              </div>

              {/* Buttons Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-[#FF1F3D] hover:from-red-500 hover:to-red-600 text-white text-xs font-extrabold shadow-[0_0_15px_rgba(255,31,61,0.5)] active:scale-95 transition-all cursor-pointer"
                >
                  Blokir Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: KONFIRMASI BUKA BLOKIR */}
      {/* ======================================================== */}
      {unblockingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setUnblockingItem(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-sm rounded-3xl bg-[#0D121F] border border-slate-800 shadow-2xl p-6 text-center space-y-4 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-600/60 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Unlock className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-white">
                Buka Blokir @{unblockingItem.username}?
              </h3>
              <p className="text-xs text-slate-400">
                Akun ini akan kembali diizinkan untuk membuat pesanan baru di
                ChampionStore.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setUnblockingItem(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                Batal
              </button>

              <button
                onClick={handleUnblockConfirm}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
              >
                Ya, Buka Blokir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
