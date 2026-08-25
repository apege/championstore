"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Star,
  Trophy,
  BadgeCheck,
  Lock,
  MessageSquare,
  Check,
  Upload,
  Send,
  Sparkles,
  X,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Download,
  Reply,
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
  proofImageUrl?: string;
  adminReply?: string;
  accent: "blue" | "red";
}

const DEFAULT_REVIEWS: MemberReview[] = [
  {
    id: "rev-1",
    name: "Londoireng61",
    handle: "@Londolreng61",
    timeAgo: "Baru saja",
    rating: 5,
    comment:
      "Proses cepat banget gak sampe 5 menit Robux udah masuk. Overall semuanya aman no password!",
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
    comment:
      "Awalnya ragu karena baru pertama kali beli disini, ternyata beneran aman dan terpercaya 100%. Mantap min!",
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
    comment:
      "Beli paket sultan 15.500 Robux via QRIS langsung beres otomatis. Adminnya fast respon!",
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
    comment:
      "Harga paling murah dibanding olshop lain. Robux langsung mendarat buat beli gamepass. Thank you!",
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
    comment:
      "Super puas! Pembayaran QRIS gampang banget, tinggal scan terus duduk manis robux masuk.",
    robuxAmount: "30.500 Robux",
    hasProofPhoto: true,
    accent: "red",
  },
];

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<MemberReview[]>(DEFAULT_REVIEWS);

  // Review token verified state - LOCKED by default until token link is provided by Admin!
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [buyerName, setBuyerName] = useState<string>("");
  const [robuxAmount, setRobuxAmount] = useState<string>("");
  const [invoiceCode, setInvoiceCode] = useState<string>("");

  // Form input states
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState<boolean>(false);

  // Clean Robux amount label (ensure no invoice code like CS-123456 is displayed)
  const cleanRobuxLabel = (raw?: string | null): string => {
    if (!raw) return "2.200 Robux";
    const str = String(raw).trim();
    if (/^(CS|BLX|[A-Z]{2,4})-?\d+/i.test(str)) {
      return "2.200 Robux";
    }
    if (str.toLowerCase().includes("robux")) {
      return str;
    }
    const num = parseInt(str.replace(/[^0-9]/g, ""), 10);
    if (num > 0) {
      return `${num.toLocaleString("id-ID")} Robux`;
    }
    return "2.200 Robux";
  };

  // Load reviews from API
  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/testimonials?filter=active");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: MemberReview[] = json.data.map((t: any, idx: number) => {
            return {
              id: String(t.id),
              name: t.name,
              handle: `@${t.name}`,
              timeAgo: "Baru saja",
              rating: t.rating || 5,
              comment: t.message,
              robuxAmount: cleanRobuxLabel(t.order_code),
              hasProofPhoto: Boolean(t.image_path),
              proofImageUrl: t.image_path || undefined,
              adminReply: t.admin_reply || undefined,
              accent: idx % 2 === 0 ? "red" : "blue",
            };
          });
          setReviews([...mapped, ...DEFAULT_REVIEWS]);
        }
      } catch (err) {
        console.warn("Failed to load testimonials:", err);
      }
    }
    loadReviews();
  }, []);

  // Check URL parameters for review token and lookup order in database
  useEffect(() => {
    async function resolveReviewToken() {
      if (typeof window === "undefined") return;
      const urlParams = new URLSearchParams(window.location.search);
      const tokenParam =
        urlParams.get("token") ||
        urlParams.get("review") ||
        urlParams.get("order");
      const userParam = urlParams.get("user") || urlParams.get("username");
      const rbxParam = urlParams.get("robux");

      if (tokenParam) {
        setHasToken(true);
        const cleanCode = tokenParam.replace(/^#/, "").trim();
        setInvoiceCode(`#${cleanCode}`);
        if (userParam) setBuyerName(userParam);
        if (rbxParam) setRobuxAmount(`${rbxParam.replace(/robux/i, "").trim()} Robux`);

        // Check if this token has already been submitted in this browser
        try {
          if (localStorage.getItem(`champion_reviewed_${cleanCode}`) === "true") {
            setAlreadyReviewed(true);
          }
        } catch (e) {}

        // Fetch real order from database to get the exact Roblox username and Robux amount
        try {
          const res = await fetch(`/api/orders?search=${encodeURIComponent(cleanCode)}`);
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const foundOrder =
              json.data.find(
                (o: any) =>
                  o.order_code === cleanCode || o.id === cleanCode
              ) || json.data[0];

            if (foundOrder.customer_username) {
              setBuyerName(foundOrder.customer_username);
            }
            if (foundOrder.total_robux) {
              setRobuxAmount(`${Number(foundOrder.total_robux).toLocaleString("id-ID")} Robux`);
            }
            if (foundOrder.order_code || foundOrder.id) {
              setInvoiceCode(`#${foundOrder.order_code || foundOrder.id}`);
            }
          }
        } catch (err) {
          console.warn("Failed to fetch order details for review:", err);
        }
      }
    }

    resolveReviewToken();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveProof = () => {
    setProofFile(null);
    setProofPreview(null);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert("Harap tulis komentar ulasan Anda terlebih dahulu!");
      return;
    }

    try {
      setIsSubmitting(true);
      let uploadedUrl = "";

      if (proofFile) {
        try {
          const formData = new FormData();
          formData.append("file", proofFile);
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const uploadData = await uploadRes.json();
          if (uploadData.success && uploadData.url) {
            uploadedUrl = uploadData.url;
          }
        } catch (uploadErr) {
          console.warn("Upload proof error:", uploadErr);
        }
      }

      if (alreadyReviewed) {
        alert("Pesanan ini sudah pernah memberikan ulasan!");
        return;
      }

      const cleanNominal = cleanRobuxLabel(robuxAmount);

      // Save to Supabase
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode: cleanNominal,
          name: buyerName || "Pembeli",
          rating,
          message: comment.trim(),
          imagePath: uploadedUrl || null,
        }),
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        throw new Error(resJson.error || "Gagal mengirim ulasan");
      }

      // Mark this token/invoice as reviewed in localStorage
      const tokenKey = invoiceCode ? invoiceCode.replace(/^#/, "").trim() : "";
      if (tokenKey) {
        try {
          localStorage.setItem(`champion_reviewed_${tokenKey}`, "true");
        } catch (e) {}
      }

      const newReview: MemberReview = {
        id: `rev-${Date.now()}`,
        name: buyerName || "Pembeli",
        handle: `@${buyerName || "Pembeli"}`,
        timeAgo: "Baru saja",
        rating,
        comment,
        robuxAmount: cleanNominal,
        hasProofPhoto: Boolean(uploadedUrl || proofFile),
        proofImageUrl: uploadedUrl || proofPreview || undefined,
        accent: "red",
      };

      setReviews([newReview, ...reviews]);
      setIsSubmitted(true);
      setAlreadyReviewed(true);

      // Remove token query param from URL without page reload
      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Gagal mengirim ulasan";
      alert(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setComment("");
    setProofFile(null);
    setProofPreview(null);
    setIsSubmitted(false);
  };

  return (
    <section id="section-testimonials" className="w-full mb-12">
      <div className="bg-slate-900/95 rounded-3xl border border-slate-800/80 shadow-xl p-4 sm:p-7 md:p-8">
        {/* Section Header */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-red-600/30 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="flex-1">
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
          {/* LEFT COLUMN: Scrollable Verified Reviews Feed */}
          <div className="lg:col-span-7 space-y-4 max-h-[560px] overflow-y-auto pr-1 sm:pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {reviews.map((rev) => {
              const isRedAccent = rev.accent === "red";
              return (
                <div
                  key={rev.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-all space-y-3 shadow-md"
                >
                  {/* Review Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar Circle */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white shadow-md ${
                          isRedAccent
                            ? "bg-gradient-to-br from-red-600 to-rose-700 shadow-red-600/30"
                            : "bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-600/30"
                        }`}
                      >
                        {rev.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Name & Handle */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-white leading-tight">
                            {rev.name}
                          </h3>
                          <BadgeCheck className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {rev.handle} • {rev.timeAgo}
                        </span>
                      </div>
                    </div>

                    {/* Star Ratings */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? "fill-red-500 text-red-500"
                              : "text-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  {/* Direct Photo Display (Compact Size) */}
                  {rev.proofImageUrl && (
                    <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-slate-800/80 p-1 w-fit shadow-md my-1">
                      <img
                        src={rev.proofImageUrl}
                        alt="Foto Bukti Pembeli"
                        className="h-24 sm:h-28 w-auto max-w-[200px] object-cover rounded-xl"
                      />
                    </div>
                  )}

                  {/* Admin Reply Box (BloxyLucy-Style with Admin Profile & Left Accent) */}
                  {rev.adminReply && (
                    <div className="rounded-2xl border-l-[3.5px] border-l-[#FF1F3D] border border-red-500/25 bg-gradient-to-r from-red-950/20 via-slate-900/60 to-slate-950/80 p-3 sm:p-3.5 space-y-1.5 shadow-sm">
                      {/* Header with Admin PP & Official Title */}
                      <div className="flex items-center gap-2">
                        <div className="relative w-5 h-5 rounded-full overflow-hidden border border-red-500/40 bg-slate-900 shrink-0 shadow-[0_0_6px_rgba(255,31,61,0.4)]">
                          <Image
                            src="/logo.png"
                            alt="Admin Avatar"
                            fill
                            className="object-contain p-0.5"
                            unoptimized
                          />
                        </div>
                        <span className="text-xs font-extrabold text-[#FF1F3D] tracking-tight">
                          Admin ChampionStore Official
                        </span>
                      </div>

                      {/* Reply Text */}
                      <p className="text-xs text-slate-300 leading-relaxed pl-7">
                        {rev.adminReply}
                      </p>
                    </div>
                  )}

                  {/* Footer Info: Product Pill & Proof Photo Indicator */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    {/* Robux Pill Badge with /robux.webp Coin Icon */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-200 font-bold text-[11px]">
                      <div className="relative w-3.5 h-3.5 shrink-0">
                        <Image
                          src="/robux.webp"
                          alt="Robux Coin"
                          width={14}
                          height={14}
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <span>{rev.robuxAmount}</span>
                    </div>

                    {rev.hasProofPhoto && (
                      <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Ada Foto Bukti</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Interactive Form (Locked by default, Unlocked with Token) */}
          <div className="lg:col-span-5">
            {hasToken ? (
              /* ================= UNLOCKED REVIEW FORM ================= */
              <div className="rounded-3xl border border-red-500/40 bg-gradient-to-b from-slate-950 to-[#10070A] p-5 sm:p-6 space-y-4 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-950/80 border border-red-600/50 text-[#FF1F3D] flex items-center justify-center shadow-sm">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">
                        Tulis Ulasan Anda
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Ulasan terverifikasi pembeli
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setHasToken(false)}
                    className="p-1 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                    title="Kunci kembali formulir"
                  >
                    <Lock className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isSubmitted ? (
                  /* Success State */
                  <div className="py-8 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/60">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-base">
                        Terima Kasih Atas Ulasannya!
                      </h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                        Ulasan Anda telah berhasil diterbitkan dan sangat membantu member lain.
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                        <span>1 Token = 1 Ulasan Selesai</span>
                      </span>
                    </div>
                  </div>
                ) : alreadyReviewed ? (
                  /* Already Reviewed State */
                  <div className="py-8 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-14 h-14 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-950/60">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-base">
                        Token Ulasan Telah Digunakan
                      </h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                        Pesanan <strong className="text-slate-200">{invoiceCode}</strong> sudah pernah mengirimkan ulasan. Setiap transaksi pesanan hanya dapat memberikan 1 kali ulasan.
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>1 Token = 1 Ulasan Selesai</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Form Fields */
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* 1. Verified Buyer Banner */}
                    <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-emerald-900/60 text-emerald-300 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-white truncate">
                            Pembeli: <span className="text-emerald-300">@{buyerName || "Member"}</span>
                          </div>
                          <p className="text-[10px] text-slate-300 truncate">
                            {robuxAmount || "Robux"} • {invoiceCode || "#CS-ORDER"}
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider shrink-0 shadow-xs">
                        <span>Terverifikasi</span>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    </div>

                    {/* 2. Rating Kepuasan */}
                    <div className="space-y-2 pt-1">
                      <label className="flex items-center gap-1 text-xs font-bold text-slate-300">
                        <span>Rating Kepuasan</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((starIndex) => {
                            const isFilled =
                              (hoverRating || rating) >= starIndex;
                            return (
                              <button
                                key={starIndex}
                                type="button"
                                onClick={() => setRating(starIndex)}
                                onMouseEnter={() => setHoverRating(starIndex)}
                                onMouseLeave={() => setHoverRating(0)}
                                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 active:scale-90 ${
                                  isFilled
                                    ? "bg-red-950/50 border-red-500/60 text-red-500 shadow-md shadow-red-950/40"
                                    : "bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700"
                                }`}
                              >
                                <Star
                                  className={`w-5 h-5 transition-transform ${
                                    isFilled ? "fill-red-500 scale-110" : ""
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-xs font-bold text-red-400 ml-1.5">
                          ({rating} Bintang)
                        </span>
                      </div>
                    </div>

                    {/* 3. Komentar Ulasan */}
                    <div className="space-y-1.5 pt-1">
                      <label className="text-xs font-bold text-slate-300">
                        Komentar Ulasan
                      </label>
                      <textarea
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Ceritakan pengalamanmu top up di ChampionStore_IDN..."
                        required
                        className="w-full p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-white placeholder:text-slate-500 font-medium focus:outline-none focus:border-red-500 transition-colors resize-none leading-relaxed"
                      />
                    </div>

                    {/* 4. Upload Foto Bukti (Opsional) */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-bold text-slate-300">
                          Upload Foto Bukti
                        </label>
                        <span className="text-[11px] text-slate-500">Opsional</span>
                      </div>

                      {proofPreview ? (
                        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                              <Image
                                src={proofPreview}
                                alt="Foto Bukti"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate max-w-[180px]">
                                {proofFile?.name}
                              </p>
                              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                                Foto siap diunggah
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveProof}
                            className="p-1.5 rounded-xl bg-slate-900 hover:bg-red-950/60 border border-slate-800 hover:border-red-900/40 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-full py-4 px-4 rounded-2xl border-2 border-dashed border-slate-800 hover:border-red-500/40 bg-slate-950/60 hover:bg-slate-950 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all duration-200 group">
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <div className="w-9 h-9 rounded-xl bg-red-950/30 border border-red-900/40 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-slate-200">
                            Klik atau Drag & Drop foto bukti di sini
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            Format JPG, PNG (Maksimal 5MB)
                          </span>
                        </label>
                      )}
                    </div>

                    {/* 5. Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-red-600/40 hover:shadow-red-600/60 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        <span>
                          {isSubmitting ? "Mengirim..." : "Kirim Ulasan Terverifikasi"}
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* ================= EXACT LOCKED STATE (IMAGE 2) ================= */
              <div className="rounded-3xl border-2 border-dashed border-red-500/30 bg-slate-950/60 p-6 sm:p-8 text-center space-y-5 shadow-lg">
                {/* Pink/Red Glowing Lock Badge */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/30">
                  <Lock className="w-8 h-8" />
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-400 text-xs font-black uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    ULASAN TERVERIFIKASI PEMBELI
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Form Ulasan Khusus Pembeli
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Untuk menjaga ulasan 100% asli &amp; bebas spam, formulir ini hanya dapat diisi melalui{" "}
                    <strong className="text-slate-200">Link Token Review</strong> yang dikirimkan Admin setelah pesanan Robux selesai diproses.
                  </p>
                </div>

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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
