"use client";

import React from "react";

import { Edit3, Crown } from "lucide-react";
import { useAdmin } from "./AdminContext";

interface AdminNotesProps {
  onOpenEditModal?: () => void;
}

export default function AdminNotes({ onOpenEditModal }: AdminNotesProps) {
  const { adminNote } = useAdmin();

  return (
    <div className="rounded-3xl bg-[#0B0F19] border border-slate-800/80 p-5 sm:p-6 shadow-lg relative flex flex-col justify-between overflow-hidden h-full">
      {/* Decorative Top-Right Sticky Pin & Crown Card */}
      <div className="absolute top-4 right-4 flex items-center justify-center">
        <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-red-950/80 to-slate-900 border border-red-500/40 p-2 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.3)] rotate-6">
          <Crown className="w-5 h-5 text-red-500" />
          <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border border-white shadow-sm" />
        </div>
      </div>

      <div>
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800/60 mb-4 pr-14">
          <div className="w-8 h-8 rounded-lg bg-red-950/50 border border-red-800/50 flex items-center justify-center text-red-400">
            <Edit3 className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-white tracking-wide">
            Catatan Admin
          </h3>
        </div>

        {/* Note Body Box */}
        <div className="p-3.5 rounded-2xl bg-[#0E1422] border border-slate-800/80 space-y-2">
          <p className="text-xs text-slate-300 font-medium leading-relaxed whitespace-pre-line">
            {adminNote || "Catatan penting untuk tim operasional toko."}
          </p>
        </div>
      </div>

      {/* Action Button: Edit Catatan */}
      <div className="pt-4 border-t border-slate-800/60 mt-4">
        <button
          onClick={onOpenEditModal}
          className="w-full py-2.5 px-4 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-800/60 hover:border-red-500/80 text-xs font-bold text-red-400 hover:text-red-300 transition-all flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(239,68,68,0.15)] active:scale-98 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Catatan</span>
        </button>
      </div>
    </div>
  );
}
