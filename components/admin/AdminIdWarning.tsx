"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Lock,
  Zap,
  Lightbulb,
  XCircle,
  Search,
  Edit3,
} from "lucide-react";

interface AdminIdWarningProps {
  onActivate: (username: string) => void;
  onCancelOrder: (username: string) => void;
}

export default function AdminIdWarning({
  onActivate,
  onCancelOrder,
}: AdminIdWarningProps) {
  const [inputUsername, setInputUsername] = useState("");
  const [activeUsername, setActiveUsername] = useState("PinkQueen_23");
  const [isSearching, setIsSearching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCheckUsername = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUsername.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      setActiveUsername(inputUsername.trim().replace(/^@/, ""));
      setIsSearching(false);
      setIsEditing(false);
    }, 300);
  };

  const handleQuickSelect = (username: string) => {
    setActiveUsername(username);
    setIsEditing(false);
  };

  return (
    <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-r from-red-600 via-slate-800/40 to-blue-600 shadow-[0_0_25px_rgba(239,68,68,0.25),0_0_25px_rgba(59,130,246,0.2)] h-full group transition-all duration-300">
      {/* Inner Card Container */}
      <div className="h-full w-full rounded-[calc(1.5rem-1.5px)] bg-[#080C14] p-4 sm:p-4.5 flex flex-col justify-between overflow-hidden relative">
        {/* Left (Red) and Right (Blue) Ambient Glows */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2.5">
          {/* Header Section */}
          <div className="text-center space-y-0.5 pb-0.5">
            <div className="flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-500 fill-red-500/20 animate-pulse" />
              <h2 className="text-xs sm:text-sm font-black tracking-wider text-red-500 uppercase drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                PERINGATAN!
              </h2>
              <AlertTriangle className="w-4 h-4 text-red-500 fill-red-500/20 animate-pulse" />
            </div>
            <h3 className="text-sm sm:text-base font-black tracking-wide text-white uppercase drop-shadow-md">
              ID ROBLOX BELUM AKTIF
            </h3>
          </div>

          {/* Quick Target Username Pill Bar */}
          <div className="flex items-center justify-between gap-2 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">
                Target User:
              </span>
              <span className="font-extrabold text-[#FF1F3D] tracking-wide text-xs">
                @{activeUsername}
              </span>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 hover:text-white transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-2.5 h-2.5" />
              <span>{isEditing ? "Tutup" : "Ganti"}</span>
            </button>
          </div>

          {/* Inline Username Form (When "Ganti" is clicked) */}
          {isEditing && (
            <form
              onSubmit={handleCheckUsername}
              className="p-2.5 rounded-2xl bg-slate-900 border border-red-500/40 space-y-1.5 animate-in fade-in duration-150"
            >
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  placeholder="Input username Roblox (cth: GamerBoy_09)"
                  className="flex-1 bg-[#080C14] text-xs text-white px-2.5 py-1.5 rounded-xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Search className="w-3 h-3" />
                  <span>Cek</span>
                </button>
              </div>

              {/* Presets */}
              <div className="pt-0.5 flex items-center gap-1 flex-wrap">
                <span className="text-[9px] text-slate-400 font-medium">
                  Order Menunggu:
                </span>
                {["PinkQueen_23", "GamerBoy_09", "star_lucy08"].map((u) => (
                  <button
                    type="button"
                    key={u}
                    onClick={() => handleQuickSelect(u)}
                    className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-[9px] text-slate-300 font-semibold transition-colors"
                  >
                    @{u}
                  </button>
                ))}
              </div>
            </form>
          )}

          {/* Middle 2-Column Section (Notice Left, Price Right) */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-stretch">
            {/* Notice Box (7 cols) */}
            <div className="sm:col-span-7 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#13070B] to-slate-900/60 border border-red-900/40 flex items-start gap-2.5 justify-center flex-col">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-5 h-5 rounded-full bg-red-950 border border-red-500/60 text-red-400 flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                  <Lock className="w-3 h-3" />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-wide">
                  Aktivasi Diperlukan
                </span>
              </div>
              <p className="text-[11px] text-slate-200 font-medium leading-relaxed">
                ID Roblox pada order akun{" "}
                <strong className="text-[#FF1F3D] font-extrabold">
                  @{activeUsername}
                </strong>{" "}
                belum aktif. Silakan aktifkan ID terlebih dahulu untuk melanjutkan
                prosesnya.
              </p>
            </div>

            {/* Price Box (5 cols) */}
            <div className="sm:col-span-5 rounded-2xl bg-gradient-to-b from-[#18080C] to-[#0E070B] border border-red-600/50 p-2.5 flex flex-col items-center justify-center text-center shadow-inner">
              <div className="text-[9px] font-black tracking-widest text-red-400 uppercase mb-0.5">
                BIAYA PENGAKTIFAN ID
              </div>
              <div className="text-xl sm:text-2xl font-black text-red-500 tracking-tight drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                Rp 97.000
              </div>
            </div>
          </div>

          {/* Catatan Admin Hint Box */}
          <div className="rounded-xl bg-[#0C101B] border border-slate-800/80 p-2 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.2)]">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] sm:text-[11px] leading-snug text-slate-300">
              <span className="font-bold text-white">Catatan Admin: </span>
              <span className="text-slate-400">
                Setelah ID @{activeUsername} diaktifkan, order dapat langsung
                diproses seperti biasa.
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 pt-2.5 space-y-1.5 mt-1">
          {/* Solid Glowing Red Button */}
          <button
            onClick={() => onActivate(activeUsername)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs tracking-wide shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_22px_rgba(239,68,68,0.7)] transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-white text-white" />
            <span>Aktifkan ID @{activeUsername} Sekarang</span>
          </button>

          {/* Dark Outlined Button */}
          <button
            onClick={() => onCancelOrder(activeUsername)}
            className="w-full py-1.5 px-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-[11px] font-bold transition-all flex items-center justify-center gap-1 active:scale-98 cursor-pointer"
          >
            <XCircle className="w-3 h-3" />
            <span>Batalkan Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
