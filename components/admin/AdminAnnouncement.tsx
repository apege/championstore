"use client";

import React from "react";
import { Megaphone, AlertTriangle, BookOpen } from "lucide-react";

interface AdminAnnouncementProps {
  onReadGuide: () => void;
}

export default function AdminAnnouncement({
  onReadGuide,
}: AdminAnnouncementProps) {
  return (
    <div className="rounded-3xl bg-[#0B0F19] border border-slate-800/80 p-4 sm:p-4.5 flex flex-col justify-between shadow-lg h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/60 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-950/50 border border-red-800/50 flex items-center justify-center text-red-400">
              <Megaphone className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-xs sm:text-sm text-white tracking-wide">
              Pengumuman
            </h3>
          </div>
          <span className="text-[9px] font-bold text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/50 animate-pulse">
            Penting
          </span>
        </div>

        {/* Inner Announcement Card */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#150A10] to-[#0D121F] border border-red-900/40 p-3 space-y-2 overflow-hidden">
          {/* Subheader: UPDATE SISTEM */}
          <div className="flex items-center justify-center gap-1.5 text-center">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <h4 className="text-[11px] font-black tracking-wider text-red-500 uppercase">
              UPDATE SISTEM
            </h4>
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          </div>

          {/* Body Text */}
          <p className="text-[11px] text-slate-300 leading-relaxed text-center">
            Pastikan semua order diproses sesuai ketentuan toko ya! Jangan lupa
            cek stok & promo terbaru untuk customer!
          </p>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 space-y-0.5">
            <div className="flex items-center gap-1 text-slate-300 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Prioritas Order Hari Ini:</span>
            </div>
            <p className="pl-2.5">Selesaikan order masuk &lt; 10 menit untuk menjaga rating kepuasan.</p>
          </div>
        </div>
      </div>

      {/* Bottom Button: Baca Panduan Admin */}
      <div className="pt-3 border-t border-slate-800/60 mt-3">
        <button
          onClick={onReadGuide}
          className="w-full py-2 px-3 rounded-xl bg-blue-950/30 hover:bg-blue-900/40 border border-blue-800/60 hover:border-blue-500/80 text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(59,130,246,0.15)] active:scale-98 cursor-pointer"
        >
          <BookOpen className="w-3 h-3" />
          <span>Baca Panduan Admin</span>
        </button>
      </div>
    </div>
  );
}
