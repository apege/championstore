"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Upload,
  ScanBarcode,
  ShieldCheck,
  Loader2,
  X,
  Copy,
  MessageSquareCode,
  Sparkles,
} from "lucide-react";
import { STORE_CONFIG } from "@/data/pricelist";
import BackgroundEffects from "@/components/BackgroundEffects";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const username = searchParams.get("username") || "Guest_Roblox";
  const userId = searchParams.get("userId") || "-";
  const amountStr = searchParams.get("amount") || "2200";
  const priceStr = searchParams.get("price") || "45000";

  const amount = parseInt(amountStr, 10) || 2200;
  const price = parseInt(priceStr, 10) || 45000;

  const [phoneNumber, setPhoneNumber] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState(
    `CS-${Date.now().toString().slice(-8)}`
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [storeSettings, setStoreSettings] = useState({
    storeName: STORE_CONFIG.name,
    whatsappUrl: STORE_CONFIG.whatsappUrl,
    qrisImageUrl: "/qris.webp",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/store");
        const json = await res.json();
        if (json.success && json.data) {
          setStoreSettings({
            storeName: json.data.storeName || STORE_CONFIG.name,
            whatsappUrl: json.data.whatsappUrl || STORE_CONFIG.whatsappUrl,
            qrisImageUrl: json.data.qrisImageUrl || "/qris.webp",
          });
        }
      } catch (err) {
        console.warn("Failed to load store settings in checkout:", err);
      }
    }
    loadSettings();
  }, []);

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(invoiceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const generateWhatsAppUrl = (inv: string = invoiceNumber) => {
    const text = encodeURIComponent(
      `*Halo Admin ${storeSettings.storeName}, saya sudah konfirmasi pembayaran QRIS!*\n\n` +
        `• *No. Invoice:* ${inv}\n` +
        `• *Username Roblox:* ${username}\n` +
        (userId && userId !== "-" ? `• *Roblox ID:* ${userId}\n` : "") +
        `• *Paket Robux:* ${amount.toLocaleString("id-ID")} Robux\n` +
        `• *Total Bayar:* Rp ${price.toLocaleString("id-ID")}\n` +
        `• *No. WhatsApp:* +62 ${phoneNumber || "-"}\n` +
        (adminNote ? `• *Catatan:* ${adminNote}\n` : "") +
        `\nBukti transfer sudah saya upload. Mohon segera diproses ya min. Terima kasih!`
    );
    return `${storeSettings.whatsappUrl}?text=${text}`;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!phoneNumber.trim()) {
      alert("Harap masukkan Nomor WhatsApp Anda!");
      return;
    }
    if (!proofFile) {
      alert("Harap upload foto bukti pembayaran / screenshot QRIS!");
      return;
    }

    try {
      setSubmitting(true);

      // 1. Upload proof file to Supabase Storage
      let proofUrl = "";
      try {
        const formData = new FormData();
        formData.append("file", proofFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.url) {
          proofUrl = uploadData.url;
        }
      } catch (uploadErr) {
        console.warn("Upload proof warning:", uploadErr);
      }

      // 2. Submit order to Supabase API
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          robloxId: userId && userId !== "-" ? String(userId) : null,
          phone: phoneNumber.trim(),
          items: [
            {
              id: `rbx-${amount}`,
              amount: amount,
              price: price,
              quantity: 1,
              name: `${amount.toLocaleString("id-ID")} Robux`,
            },
          ],
          totalRobux: amount,
          totalPrice: price,
          paymentMethod: "website",
          paymentProofUrl: proofUrl || null,
          customerNote: adminNote.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan pesanan ke sistem.");
      }

      let finalInv = invoiceNumber;
      if (data.invoiceNumber) {
        finalInv = data.invoiceNumber;
        setInvoiceNumber(data.invoiceNumber);
      }

      // Direct redirect to WhatsApp Admin
      const waUrl = generateWhatsAppUrl(finalInv);
      window.open(waUrl, "_blank");

      // Display success receipt on the web
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal memproses pesanan.";
      setErrorMessage(msg);
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#080C14] text-slate-100 font-sans selection:bg-red-600 selection:text-white flex flex-col items-center py-6 px-4 sm:px-6">
      <BackgroundEffects />

      {/* Top Header Navigation Bar matching reference */}
      <header className="relative z-20 w-full max-w-lg flex items-center justify-between pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="relative h-8 w-auto flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="ChampionStore_IDN Logo"
              width={36}
              height={28}
              className="h-8 w-auto object-contain"
              unoptimized
            />
          </div>
          <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
            ChampionStore<span className="text-[#FF1F3D]">_IDN</span>
          </span>
        </div>
      </header>

      {/* Main Checkout Card matching reference */}
      <main className="relative z-20 w-full max-w-lg">
        <div className="rounded-3xl bg-[#0D1321]/95 backdrop-blur-xl border border-slate-800/90 shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-5 sm:p-8 space-y-6">
          {isSuccess ? (
            /* ================= SUCCESS STATE ================= */
            <div className="text-center space-y-6 py-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Pembayaran Terkirim!
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                  Terima kasih! Bukti transfer Anda sedang diverifikasi. Robux akan segera dikirimkan ke akun Roblox Anda dalam 5-10 menit.
                </p>
              </div>

              {/* Order Receipt */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                  <span>No. Invoice</span>
                  <button
                    type="button"
                    onClick={handleCopyInvoice}
                    className="flex items-center gap-1 font-bold text-white hover:text-red-400 cursor-pointer"
                  >
                    <span>{invoiceNumber}</span>
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Username Roblox</span>
                  <span className="font-bold text-white">@{username}</span>
                </div>
                {userId !== "-" && (
                  <div className="flex justify-between text-slate-300">
                    <span>Roblox User ID</span>
                    <span className="font-bold text-white">{userId}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span>Paket Robux</span>
                  <span className="font-bold text-white">
                    {amount.toLocaleString("id-ID")} Robux
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Bayar</span>
                  <span className="font-bold text-red-400 text-base">
                    Rp {price.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>No. WhatsApp</span>
                  <span className="font-bold text-white">+62 {phoneNumber}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <MessageSquareCode className="w-4 h-4" />
                  <span>Hubungi Admin di WhatsApp</span>
                </a>

                <Link
                  href="/"
                  className="block w-full py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold text-xs transition-colors text-center"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          ) : (
            /* ================= ACTIVE CHECKOUT FORM ================= */
            <>
              {/* 1. Header: Menunggu Pembayaran */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-md shadow-emerald-950/50">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Menunggu Pembayaran
                </h1>
                <p className="text-xs sm:text-sm font-bold text-red-400">
                  {amount.toLocaleString("id-ID")} Robux (@{username})
                </p>
                {userId !== "-" && (
                  <p className="text-[11px] text-slate-400 font-medium">
                    Roblox ID: {userId}
                  </p>
                )}
              </div>

              {/* 2. Total Pembayaran */}
              <div className="text-center py-1">
                <span className="text-xs text-slate-400 font-semibold block">
                  Total Pembayaran:
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5 inline-block">
                  Rp {price.toLocaleString("id-ID")}
                </span>
              </div>

              {/* 3. QRIS Code Box */}
              <div className="space-y-2">
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 border-2 border-dashed border-red-500/30 flex items-center justify-center shadow-inner">
                  {/* QRIS / Pricelist Image without white background */}
                  <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden flex flex-col items-center justify-center">
                    <Image
                      src={storeSettings.qrisImageUrl || "/qris.webp"}
                      alt="QRIS Barcode Pembayaran"
                      fill
                      priority
                      className="object-contain rounded-xl"
                      unoptimized
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  Scan QRIS di atas via BCA, GoPay, OVO, Dana, ShopeePay, LinkAja, Mobile Banking, dll.
                </p>
              </div>

              {/* 4. Form Fields */}
              <form onSubmit={handleSubmitOrder} className="space-y-4 pt-1">
                {/* Upload Bukti Bayar */}
                <div className="space-y-2">
                  {proofPreview ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                          <Image
                            src={proofPreview}
                            alt="Bukti Transfer"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate max-w-[200px]">
                            {proofFile?.name}
                          </p>
                          <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                            Bukti bayar siap dikonfirmasi
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
                      <div className="w-10 h-10 rounded-full bg-red-950/30 border border-red-900/40 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-200">
                        Klik untuk upload bukti bayar
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Format JPG, PNG (Maksimal 5MB)
                      </span>
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[10px] font-bold mt-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Dilindungi OCR Anti-Fraud</span>
                      </div>
                    </label>
                  )}
                </div>

                {/* Input Nomor WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 block">
                    Nomor WhatsApp Anda <span className="text-red-500">*</span>
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-slate-800 focus-within:border-red-500 transition-colors bg-slate-950/90">
                    <span className="inline-flex items-center px-3 text-xs font-bold text-slate-400 bg-slate-900 border-r border-slate-800 select-none">
                      +62
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/^0+/, ""))}
                      placeholder="81234567890"
                      required
                      className="w-full h-11 px-3 bg-transparent text-xs text-white placeholder:text-slate-500 font-medium focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight">
                    Nomor ini digunakan admin untuk konfirmasi pesanan & mengirimkan link review otomatis setelah selesai.
                  </p>
                </div>

                {/* Input Catatan Pesanan */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-200">
                      Catatan Pesanan
                    </label>
                    <span className="text-[10px] text-slate-500">Opsional</span>
                  </div>
                  <textarea
                    rows={2}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Contoh: Tolong kirim ke Gamepass / catatan tambahan..."
                    className="w-full p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-white placeholder:text-slate-500 font-medium focus:outline-none focus:border-red-500 transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengirim Konfirmasi...</span>
                      </>
                    ) : (
                      <>
                        <MessageSquareCode className="w-4 h-4" />
                        <span>Konfirmasi Pembayaran</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Back Link */}
                <div className="text-center pt-1">
                  <Link
                    href="/"
                    className="text-xs text-slate-400 hover:text-white font-semibold transition-colors inline-flex items-center gap-1"
                  >
                    <span>Kembali ke Beranda</span>
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080C14] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
