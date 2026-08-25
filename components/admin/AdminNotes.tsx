"use client";

import React, { useState, useEffect } from "react";
import { Edit3, Crown } from "lucide-react";

interface AdminNotesProps {
  note?: string;
  onOpenEditModal?: () => void;
}

export default function AdminNotes({ note, onOpenEditModal }: AdminNotesProps) {
  const [noteContent, setNoteContent] = useState<string>(
    note || "Catatan penting untuk tim operasional toko."
  );

  useEffect(() => {
    if (note) {
      setNoteContent(note);
    } else {
      async function loadNote() {
        try {
          const res = await fetch("/api/store");
          const json = await res.json();
          if (json.success && json.data && json.data.adminNote) {
            setNoteContent(json.data.adminNote);
          }
        } catch (err) {
          console.warn("Failed to load note:", err);
        }
      }
      loadNote();
    }
  }, [note]);

  return (
    <div className="rounded-3xl bg-[#0B0F19] border border-slate-800/80 p-5 sm:p-6 shadow-lg relative flex flex-col justify-between overflow-hidden">
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
            {noteContent}
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
