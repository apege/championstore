"use client";

import React from "react";
import Image from "next/image";
import { STORE_CONFIG } from "@/data/pricelist";
import { ShieldCheck, Headphones, Flame, Award, Trophy } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#05080E] text-slate-400 border-t border-slate-800/80 pb-28 sm:pb-24 pt-12 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-auto max-w-[65px] shrink-0 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="ChampionStore_IDN"
                  width={60}
                  height={44}
                  className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                  unoptimized
                />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  ChampionStore<span className="text-[#FF1F3D] font-black">_IDN</span>
                </span>
                <p className="text-xs text-slate-400">{STORE_CONFIG.tagline}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Penyedia layanan top up Robux termurah, terpercaya, dan tercepat di Indonesia. Proses instan 5-10 menit hanya butuh username Roblox tanpa password.
            </p>

            {/* Instagram Social Badge */}
            <a
              href="https://instagram.com/championstore_idn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>{STORE_CONFIG.instagram}</span>
            </a>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Menu Cepat</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#section-pricelist" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Flame className="w-3 h-3 text-red-500" />
                  <span>Pricelist Robux</span>
                </a>
              </li>
              <li>
                <a href="#section-workflow" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Award className="w-3 h-3 text-blue-400" />
                  <span>Cara Order</span>
                </a>
              </li>
              <li>
                <a href="#section-testimonials" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Trophy className="w-3 h-3 text-amber-400" />
                  <span>Testimoni Pelanggan</span>
                </a>
              </li>
              <li>
                <a href="#section-features" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Keunggulan & Garansi</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Layanan Pelanggan</h4>
            <div className="space-y-2 text-xs">
              <p className="text-slate-400">Siap melayani 24 Jam Nonstop setiap hari.</p>
              <a
                href={STORE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-600/30"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Chat Admin WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Champion Store IDN. Hak cipta dilindungi.</p>
          <p>Champion Store beroperasi secara independen dan aman 100%.</p>
        </div>
      </div>
    </footer>
  );
}
