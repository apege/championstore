"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  Search,
  LogOut,
  X,
} from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function AdminHeader({
  onToggleSidebar,
  searchQuery,
  setSearchQuery,
}: AdminHeaderProps) {
  const handleLogout = () => {
    // Redirect or confirm logout
    if (confirm("Apakah Anda yakin ingin keluar dari Admin Panel?")) {
      window.location.href = "/";
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#080B11]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors lg:hidden shrink-0 cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Input Box */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari order, username, email, status..."
              className="w-full bg-[#0E131F]/90 text-sm text-slate-200 placeholder-slate-400 pl-10 pr-9 py-2 rounded-xl border border-slate-800 focus:border-[#FF1F3D]/80 focus:ring-1 focus:ring-[#FF1F3D]/50 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: BloxyLucy-Style Admin Profile & Logout Button */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Admin Profile Details */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full overflow-hidden border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.3)] bg-slate-900">
              <Image
                src="/logo.png"
                alt="Admin Avatar"
                fill
                className="object-contain p-1"
                unoptimized
              />
            </div>

            <div className="text-left leading-tight">
              <div className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
                Admin ChampionStore
              </div>
              <div className="text-[11px] font-bold text-[#FF1F3D]">
                Super Admin
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="h-7 w-px bg-slate-800 hidden sm:block" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-red-950/20 hover:bg-red-950/50 border border-red-800/40 hover:border-red-600/60 text-[#FF1F3D] hover:text-red-400 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
