"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Star,
  Trophy,
  BadgeCheck,
  Lock,
  MessageSquare,
  Check,
  Image as ImageIcon,
  Send,
  Sparkles,
} from "lucide-react";
import { STORE_CONFIG } from "@/data/pricelist";

interface MemberReview {
  id: string;
  name: string;
  handle: string;
  timeAgo: string;
  rating: number;
  comment: string;
  robuxAmount: string;
  hasProofPhoto?: boolean;
  accent: "blue" | "red";
}

const MEMBER_REVIEWS: MemberReview[] = [
  {
    id: "rev-1",
    name: "Londoireng61",
    handle: "@Londolreng61",
    timeAgo: "Baru saja",
    rating: 5,
    comment: "Proses cepat banget gak sampe 5 menit Robux udah masuk. Overall semuanya aman no password!",
    robuxAmount: "4.200 Robux",
    hasProofPhoto: true,
    accent: "red",
  },
  {
    id: "rev-2",
    name: "Crasiel17",
    handle: "@Crasiel17",
    timeAgo: "15 menit yang lalu",
    rating: 5,
    comment: "Awalnya ragu karena baru pertama kali beli disini, ternyata beneran aman dan terpercaya 100%. Mantap min!",
    robuxAmount: "2.200 Robux",
    hasProofPhoto: true,
    accent: "blue",
  },
  {
    id: "rev-3",
    name: "Bima_Sultan",
    handle: "@bima_rbx",
    timeAgo: "1 jam yang lalu",
    rating: 5,
    comment: "Beli paket sultan 15.500 Robux via QRIS langsung beres otomatis. Adminnya fast respon!",
    robuxAmount: "15.500 Robux",
    hasProofPhoto: true,
    accent: "red",
  },
  {
    id: "rev-4",
    name: "Keisha_Gamer",
    handle: "@keisha_cute",
    timeAgo: "3 jam yang lalu",
    rating: 5,
    comment: "Harga paling murah dibanding olshop lain. Robux langsung mendarat buat beli gamepass. Thank you!",
    robuxAmount: "5.500 Robux",
    hasProofPhoto: true,
    accent: "blue",
  },
  {
    id: "rev-5",
    name: "Dimas_Speed",
    handle: "@dimas_rbx12",
    timeAgo: "5 jam yang lalu",
    rating: 5,
    comment: "Super puas! Pembayaran QRIS gampang banget, tinggal scan terus duduk manis robux masuk.",
    robuxAmount: "30.500 Robux",
    hasProofPhoto: true,
    accent: "red",
  },
];

export default function TestimonialsSection() {
  const [reviews] = useState<MemberReview[]>(MEMBER_REVIEWS);

  return (
    <section id="section-testimonials" className="w-full mb-12">
      <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800/80 shadow-xl p-4 sm:p-7 md:p-8">
        {/* Section Header matching reference */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-red-600/30 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Testimoni Member
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Apa kata mereka yang sudah top up Robux di ChampionStore_IDN
            </p>
          </div>
        </div>

        {/* 2 Columns Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Scrollable Member Testimonial Cards */}
          <div className="lg:col-span-7 space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {reviews.map((rev) => {
              const isBlue = rev.accent === "blue";
              return (
                <div
                  key={rev.id}
                  className="bg-slate-950/70 hover:bg-slate-950/90 rounded-2xl p-5 border border-slate-800/90 transition-all space-y-3.5 shadow-sm"
                >
                  {/* Top Bar: Avatar, Handle, Badge, Time & Stars */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-full font-black text-xs flex items-center justify-center border-2 shrink-0 ${
                          isBlue
                            ? "bg-blue-950/80 border-blue-500 text-blue-400"
                            : "bg-red-950/80 border-red-500 text-red-400"
                        }`}
                      >
                        {rev.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white">{rev.handle}</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-800/50 text-emerald-400 text-[10px] font-bold">
                            <BadgeCheck className="w-3 h-3" />
                            Terverifikasi
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{rev.timeAgo}</span>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  {/* Robux Package Badge & Proof Photo Tag */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200">
                      <div className="w-4 h-4 shrink-0">
                        <Image
                          src="/robux.webp"
                          alt="Robux"
                          width={16}
                          height={16}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span>{rev.robuxAmount}</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-0.5 ml-1 text-[11px]">
                        <Check className="w-3 h-3" />
                        Ada Foto Bukti
                      </span>
                    </div>
                  </div>

                  {/* Proof Photo Thumbnail */}
                  {rev.hasProofPhoto && (
                    <div className="pt-1">
                      <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 p-2 flex flex-col justify-between shadow-inner">
                        <div className="space-y-1">
                          <div className="h-1.5 w-16 bg-slate-700/80 rounded" />
                          <div className="h-1.5 w-20 bg-slate-800 rounded" />
                          <div className="h-1.5 w-12 bg-slate-800 rounded" />
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-bold text-emerald-400">
                          <span>+ {rev.robuxAmount}</span>
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Form Ulasan Khusus Pembeli (Matching Reference) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border-2 border-dashed border-red-500/30 bg-slate-950/60 p-6 sm:p-8 text-center space-y-5 shadow-lg">
              {/* Lock Icon Box */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/30">
                <Lock className="w-8 h-8" />
              </div>

              {/* Badge */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-400 text-xs font-black uppercase tracking-wider">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Ulasan Terverifikasi Pembeli
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Form Ulasan Khusus Pembeli
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                  Untuk menjaga ulasan 100% asli & bebas spam, formulir ini hanya dapat diisi melalui{" "}
                  <strong className="text-slate-200">Link Token Review</strong> yang dikirimkan Admin setelah pesanan Robux selesai diproses.
                </p>
              </div>

              {/* CTA Button to WhatsApp CS */}
              <div className="pt-2">
                <a
                  href={STORE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-2xl border border-red-500/40 bg-red-950/20 hover:bg-red-900/40 hover:border-red-500 text-red-400 hover:text-white font-bold text-xs sm:text-sm transition-all shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Hubungi CS / Minta Link Review</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
