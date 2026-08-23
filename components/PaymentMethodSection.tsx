"use client";

import React from "react";
import { PaymentMethodId } from "@/types";
import { ScanBarcode, MessageSquareCode, Check } from "lucide-react";

interface PaymentMethodSectionProps {
  selectedMethod: PaymentMethodId;
  onSelectMethod: (id: PaymentMethodId) => void;
}

export default function PaymentMethodSection({
  selectedMethod,
  onSelectMethod,
}: PaymentMethodSectionProps) {
  return (
    <section id="section-payment" className="w-full mb-8">
      <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800/80 shadow-xl p-4 sm:p-7 md:p-8">
        {/* Section Header */}
        <div className="flex items-start gap-3.5 mb-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-red-600/30 shrink-0">
            3
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Pilih Pembayaran
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Pilih metode pembayaran yang paling nyaman untuk Anda
            </p>
          </div>
        </div>

        {/* Payment Methods Grid - Clean & Minimal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Method 1: Website QRIS */}
          <div
            onClick={() => onSelectMethod("website")}
            className={`cursor-pointer relative rounded-2xl border-2 p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between select-none ${
              selectedMethod === "website"
                ? "border-red-500 bg-gradient-to-b from-red-950/30 to-slate-900 shadow-[0_0_25px_rgba(239,68,68,0.2)] ring-2 ring-red-500/30"
                : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/80"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-red-950/50 border border-red-800/50 text-red-400 flex items-center justify-center shrink-0">
                    <ScanBarcode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">
                      Pembayaran via Website
                    </h3>
                    <p className="text-xs text-red-400 font-medium mt-0.5">
                      Scan QRIS & Upload Bukti
                    </p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    selectedMethod === "website"
                      ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-600/50"
                      : "border-slate-700 bg-slate-900 text-transparent"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Scan barcode QRIS dari seluruh e-wallet & m-banking, upload bukti transfer di website untuk proses otomatis.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Verifikasi Otomatis</span>
              <span
                className={`font-bold ${
                  selectedMethod === "website" ? "text-red-400" : "text-slate-500"
                }`}
              >
                {selectedMethod === "website" ? "Dipilih" : "Pilih"}
              </span>
            </div>
          </div>

          {/* Method 2: WhatsApp Admin */}
          <div
            onClick={() => onSelectMethod("whatsapp")}
            className={`cursor-pointer relative rounded-2xl border-2 p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between select-none ${
              selectedMethod === "whatsapp"
                ? "border-emerald-500 bg-gradient-to-b from-emerald-950/30 to-slate-900 shadow-[0_0_25px_rgba(16,185,129,0.2)] ring-2 ring-emerald-500/30"
                : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/80"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-950/50 border border-emerald-800/50 text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageSquareCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">
                      Pembayaran via WhatsApp
                    </h3>
                    <p className="text-xs text-emerald-400 font-medium mt-0.5">
                      Chat Langsung dengan Admin
                    </p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    selectedMethod === "whatsapp"
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/50"
                      : "border-slate-700 bg-slate-900 text-transparent"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Pesan langsung dengan template chat otomatis ke WhatsApp admin resmi ChampionStore_IDN untuk dibantu sampai selesai.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Fast Respon 24 Jam</span>
              <span
                className={`font-bold ${
                  selectedMethod === "whatsapp" ? "text-emerald-400" : "text-slate-500"
                }`}
              >
                {selectedMethod === "whatsapp" ? "Dipilih" : "Pilih"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
