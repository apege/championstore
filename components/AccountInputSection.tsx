"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Gamepad2,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  Loader2,
  XCircle,
  User,
  Hash,
} from "lucide-react";

interface RobloxAccountData {
  id: number;
  name: string;
  displayName: string;
  avatarUrl: string;
}

interface AccountInputSectionProps {
  username: string;
  onUsernameChange: (val: string) => void;
}

export default function AccountInputSection({
  username,
  onUsernameChange,
}: AccountInputSectionProps) {
  const [checking, setChecking] = useState(false);
  const [robloxData, setRobloxData] = useState<RobloxAccountData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCheckAccount = async () => {
    if (!username.trim()) return;

    setChecking(true);
    setErrorMsg(null);
    setRobloxData(null);

    try {
      const res = await fetch(
        `/api/roblox?username=${encodeURIComponent(username.trim())}`
      );
      const data = await res.json();

      if (data.success && data.user) {
        setRobloxData(data.user);
        // Automatically sync with exact username casing from Roblox
        onUsernameChange(data.user.name);
      } else {
        setErrorMsg(
          data.message || "Akun Roblox tidak ditemukan. Periksa kembali username Anda."
        );
      }
    } catch {
      setErrorMsg("Gagal memeriksa akun Roblox. Silakan coba beberapa saat lagi.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <section id="section-account" className="w-full mb-8">
      <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800/80 shadow-xl p-4 sm:p-7 md:p-8">
        {/* Section Header */}
        <div className="flex items-start gap-3.5 mb-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-red-600/30 shrink-0">
            1
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Masukkan Data Akun
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Isi data username Roblox kamu untuk pengecekan ID & avatar otomatis
            </p>
          </div>
        </div>

        {/* Input Field Container */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300">
            <Gamepad2 className="w-4 h-4 text-red-500" />
            <span>Username Roblox</span>
          </label>

          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  onUsernameChange(e.target.value);
                  if (robloxData) setRobloxData(null);
                  if (errorMsg) setErrorMsg(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCheckAccount();
                  }
                }}
                placeholder="Contoh: RobloxGamer_ID"
                className="w-full h-12 sm:h-14 px-4 pl-11 rounded-2xl bg-slate-950/80 border border-slate-800 text-white placeholder:text-slate-500 font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all shadow-inner"
              />
              <Gamepad2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>

            <button
              type="button"
              onClick={handleCheckAccount}
              disabled={!username.trim() || checking}
              className={`cursor-pointer h-12 sm:h-14 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shrink-0 ${
                robloxData
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30"
                  : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none"
              }`}
            >
              {checking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memeriksa API...</span>
                </>
              ) : robloxData ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Akun Ditemukan</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Cek Akun</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message Notice */}
          {errorMsg && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-medium animate-in fade-in-50">
              <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Live Verified Roblox Profile Card */}
          {robloxData && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-emerald-500/40 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-emerald-950/30 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Avatar Headshot */}
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-500/60 shrink-0 shadow-md flex items-center justify-center">
                  {robloxData.avatarUrl ? (
                    <Image
                      src={robloxData.avatarUrl}
                      alt={robloxData.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="w-8 h-8 text-slate-500" />
                  )}
                </div>

                {/* Account Details */}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-base text-white">
                      {robloxData.displayName}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-black uppercase">
                      <CheckCircle2 className="w-3 h-3" />
                      Terverifikasi
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    @{robloxData.name}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono mt-1">
                    <Hash className="w-3 h-3 text-slate-400" />
                    <span>ID: {robloxData.id}</span>
                  </div>
                </div>
              </div>

              {/* Ready to Receive Robux Badge */}
              <div className="w-full sm:w-auto text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                <span className="text-xs text-emerald-400 font-bold block">
                  ✓ Akun Roblox Valid
                </span>
                <span className="text-[11px] text-slate-400">
                  Siap menerima pengiriman Robux
                </span>
              </div>
            </div>
          )}

          {/* Info Notice */}
          <div className="flex items-start gap-2 pt-1 text-xs text-slate-400 leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p>
              *Cukup masukkan username Roblox Anda. Sistem kami membaca User ID & Avatar secara resmi melalui API Roblox publik tanpa meminta password ataupun PIN akun Anda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
