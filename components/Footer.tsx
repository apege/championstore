"use client";

import React from "react";
import Image from "next/image";
import { STORE_CONFIG } from "@/data/pricelist";
import { ShieldCheck, Headphones, Flame, Trophy } from "lucide-react";

interface FooterProps {
  initialStoreInfo?: {
    storeName?: string;
    whatsappUrl?: string;
    logoImageUrl?: string;
  };
}

export default function Footer({ initialStoreInfo }: FooterProps) {
  const storeName = initialStoreInfo?.storeName || STORE_CONFIG.name;
  const logoImageUrl = initialStoreInfo?.logoImageUrl || "/logo.webp";
  const whatsappUrl = initialStoreInfo?.whatsappUrl || STORE_CONFIG.whatsappUrl;

  return (
    <footer className="w-full bg-[#05080E] text-slate-400 border-t border-slate-800/80 pb-28 sm:pb-24 pt-12 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-auto max-w-[65px] shrink-0 flex items-center justify-center">
                <Image
                  src={logoImageUrl}
                  alt={storeName}
                  width={60}
                  height={44}
                  className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                  sizes="60px"
                />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  {storeName.includes("_") ? (
                    <>
                      {storeName.split("_")[0]}
                      <span className="text-[#FF1F3D] font-black">
                        _{storeName.split("_")[1]}
                      </span>
                    </>
                  ) : (
                    storeName
                  )}
                </span>
                <p className="text-xs text-slate-400">{STORE_CONFIG.tagline}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Penyedia layanan top up Robux termurah, terpercaya, dan tercepat di Indonesia. Proses instan 1-5 menit hanya butuh username Roblox tanpa password.
            </p>

            {/* WhatsApp CS Badge */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-xs font-bold text-emerald-300 transition-colors"
            >
              <Headphones className="w-3.5 h-3.5 text-emerald-400" />
              <span>Customer Service WhatsApp</span>
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
                  <ShieldCheck className="w-3 h-3 text-blue-500" />
                  <span>Panduan Pembelian</span>
                </a>
              </li>
              <li>
                <a href="#section-testimonials" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Trophy className="w-3 h-3 text-amber-500" />
                  <span>Ulasan Pelanggan</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Keamanan */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Jaminan Keamanan</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>100% Legal &amp; Anti-Ban</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Metode Gamepass Resmi</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Garansi Uang Kembali</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <p className="text-[11px]">Roblox is a registered trademark of Roblox Corporation.</p>
        </div>
      </div>
    </footer>
  );
}
