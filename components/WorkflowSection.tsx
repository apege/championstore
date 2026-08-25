"use client";

import React from "react";
import { Route, Gamepad2, Scan, PackageCheck, BadgeCheck } from "lucide-react";

export default function WorkflowSection() {
  const steps = [
    {
      step: "LANGKAH 1",
      icon: Gamepad2,
      title: "Hanya Butuh Username",
      description:
        "Cukup masukkan username Roblox kamu tanpa perlu password akun. Privasi & keamanan akun terjamin 100%.",
      iconColor: "text-red-400 bg-red-950/40 border-red-800/40",
    },
    {
      step: "LANGKAH 2",
      icon: Scan,
      title: "Proses 5 - 10 Menit",
      description:
        "Scan QRIS dari aplikasi e-wallet atau m-banking apa saja. Pembayaran terverifikasi secara otomatis.",
      iconColor: "text-rose-400 bg-rose-950/40 border-rose-800/40",
    },
    {
      step: "LANGKAH 3",
      icon: PackageCheck,
      title: "Tinggal Duduk Manis",
      description:
        "Robux otomatis masuk ke akun Anda dengan garansi 100% aman dan no tipu-tipu.",
      iconColor: "text-blue-400 bg-blue-950/40 border-blue-800/40",
    },
  ];

  return (
    <section id="section-workflow" className="w-full mb-8">
      <div className="bg-slate-900/95 rounded-3xl border border-slate-800/80 shadow-xl p-4 sm:p-7 md:p-8">
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/50 border border-red-800/50 text-red-400 text-xs font-black uppercase tracking-wider mb-3">
            <Route className="w-3.5 h-3.5" />
            Alur Transaksi Mudah & Cepat
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Top Up Robux Tanpa Ribet
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Hanya butuh 3 langkah singkat, Robux langsung mendarat ke akun kamu
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative bg-slate-950/60 hover:bg-slate-950/90 rounded-2xl p-6 border border-slate-800 text-center flex flex-col items-center group hover:border-slate-700 transition-all shadow-lg"
              >
                {/* Step pill */}
                <span className="text-[11px] font-black uppercase tracking-wider text-red-400 mb-4">
                  {item.step}
                </span>

                {/* Icon Circle */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center border mb-4 group-hover:scale-110 transition-transform ${item.iconColor}`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title and description */}
                <h3 className="text-base sm:text-lg font-black text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee and Slogan Banner */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-200">
            <BadgeCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Garansi 100% Uang Kembali Jika Pesanan Gagal</span>
          </div>

          <div className="text-xs sm:text-sm font-black uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-blue-400">
            MERDEKA TOP UP, BEBAS BELANJA!
          </div>
        </div>
      </div>
    </section>
  );
}
