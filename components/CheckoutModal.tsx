"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CartItem, PaymentMethodId } from "@/types";
import { STORE_CONFIG } from "@/data/pricelist";
import { compressToWebP } from "@/lib/compressToWebP";
import {
  X,
  CheckCircle2,
  ScanBarcode,
  Copy,
  Check,
  ShieldCheck,
  MessageSquareCode,
  Zap,
  ArrowRight,
  Upload,
  Phone,
  FileText,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  username: string;
  paymentMethod: PaymentMethodId;
  initialStoreInfo?: {
    storeName?: string;
    whatsappUrl?: string;
    whatsappNumber?: string;
  };
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  username,
  paymentMethod,
  initialStoreInfo,
}: CheckoutModalProps) {
  const [mounted, setMounted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(
    `CS-${Date.now().toString().slice(-8)}`
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [storeInfo, setStoreInfo] = useState({
    storeName: initialStoreInfo?.storeName || STORE_CONFIG.name,
    whatsappUrl: initialStoreInfo?.whatsappUrl || STORE_CONFIG.whatsappUrl,
  });

  useEffect(() => {
    if (initialStoreInfo?.whatsappUrl) {
      setStoreInfo({
        storeName: initialStoreInfo.storeName || STORE_CONFIG.name,
        whatsappUrl: initialStoreInfo.whatsappUrl || STORE_CONFIG.whatsappUrl,
      });
    } else {
      fetch("/api/store")
        .then((r) => r.json())
        .then((j) => {
          if (j.success && j.data) {
            setStoreInfo({
              storeName: j.data.storeName || STORE_CONFIG.name,
              whatsappUrl: j.data.whatsappUrl || STORE_CONFIG.whatsappUrl,
            });
          }
        })
        .catch(() => {});
    }
  }, [initialStoreInfo]);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = "hidden";
      if (paymentMethod === "whatsapp") {
        setIsSuccess(true);
      }
    } else {
      const timer = setTimeout(() => {
        setMounted(false);
        setIsSuccess(false);
      }, 200);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen, paymentMethod]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted && !isOpen) return null;

  const totalRobux = cartItems.reduce(
    (acc, ci) => acc + ci.item.amount * ci.quantity,
    0
  );
  const totalPrice = cartItems.reduce(
    (acc, ci) => acc + ci.item.price * ci.quantity,
    0
  );
  const packagesSummary = cartItems
    .map(
      (ci) =>
        `${ci.item.amount.toLocaleString("id-ID")} Robux (x${ci.quantity})`
    )
    .join(", ");

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(invoiceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];
      try {
        const compressed = await compressToWebP(originalFile);
        setProofFile(compressed);
      } catch (err) {
        console.warn("WebP compression failed, using original file:", err);
        setProofFile(originalFile);
      }
    }
  };

  const handleSubmitWebsiteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      alert("Harap masukkan Username Roblox terlebih dahulu!");
      return;
    }
    if (!phoneNumber.trim()) {
      alert("Harap masukkan Nomor WhatsApp/Telepon!");
      return;
    }
    if (!proofFile) {
      alert("Harap upload foto bukti transfer / screenshot QRIS!");
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
        console.warn("Upload proof error:", uploadErr);
      }

      // 2. Submit order to Supabase API
      const itemsPayload = cartItems.map((ci) => ({
        id: ci.item.id,
        amount: ci.item.amount,
        price: ci.item.price,
        quantity: ci.quantity,
        name: `${ci.item.amount.toLocaleString("id-ID")} Robux`,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          phone: phoneNumber.trim(),
          items: itemsPayload,
          totalRobux,
          totalPrice,
          paymentMethod: "website",
          paymentProofUrl: proofUrl || null,
          customerNote: adminNote.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat pesanan.");
      }

      if (data.invoiceNumber) {
        setInvoiceNumber(data.invoiceNumber);
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses pesanan.";
      setErrorMessage(msg);
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const generateWhatsAppUrl = (inv: string = invoiceNumber) => {
    const targetStoreName = storeInfo.storeName || STORE_CONFIG.name;
    const targetWaUrl = storeInfo.whatsappUrl || STORE_CONFIG.whatsappUrl;
    const text = encodeURIComponent(
      `*Halo Admin ${targetStoreName}, saya ingin konfirmasi order Robux!*\n\n` +
        `• *No. Invoice:* ${inv}\n` +
        `• *Username Roblox:* ${username || "-"}\n` +
        `• *Paket Robux:* ${packagesSummary}\n` +
        `• *Total Robux:* ${totalRobux.toLocaleString("id-ID")} Robux\n` +
        `• *Total Bayar:* Rp ${totalPrice.toLocaleString("id-ID")}\n` +
        `• *No. WhatsApp:* ${phoneNumber || "-"}\n` +
        (adminNote ? `• *Catatan:* ${adminNote}\n` : "") +
        `• *Metode:* Pembayaran via WhatsApp\n\n` +
        `Mohon segera diproses ya min. Terima kasih!`
    );
    return `${targetWaUrl}?text=${text}`;
  };

  const handleWhatsAppCheckout = async () => {
    if (!username.trim()) {
      alert("Harap masukkan Username Roblox terlebih dahulu!");
      return;
    }

    try {
      // Create record in Supabase in background
      const itemsPayload = cartItems.map((ci) => ({
        id: ci.item.id,
        amount: ci.item.amount,
        price: ci.item.price,
        quantity: ci.quantity,
        name: `${ci.item.amount.toLocaleString("id-ID")} Robux`,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          phone: phoneNumber.trim() || "-",
          items: itemsPayload,
          totalRobux,
          totalPrice,
          paymentMethod: "whatsapp",
          customerNote: adminNote.trim() || null,
        }),
      });

      const data = await res.json();
      let inv = invoiceNumber;
      if (data && data.invoiceNumber) {
        inv = data.invoiceNumber;
        setInvoiceNumber(data.invoiceNumber);
      }

      window.open(generateWhatsAppUrl(inv), "_blank");
      setIsSuccess(true);
    } catch {
      window.open(generateWhatsAppUrl(invoiceNumber), "_blank");
      setIsSuccess(true);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setPhoneNumber("");
    setAdminNote("");
    setProofFile(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 transition-all duration-300 ${
        isOpen
          ? "bg-black/80 backdrop-blur-md opacity-100 animate-backdrop-in"
          : "bg-black/0 backdrop-blur-none opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`relative w-full max-w-lg bg-[#0D1321] text-white rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] border border-slate-800/90 overflow-hidden max-h-[92vh] flex flex-col transition-all duration-300 ${
          isOpen
            ? "animate-modal-pop"
            : "scale-90 translate-y-6 opacity-0"
        }`}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-950 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-auto max-w-[40px] shrink-0 flex items-center justify-center">
              <Image
                src="/logo.webp"
                alt="Logo"
                width={40}
                height={32}
                className="h-8 w-auto object-contain"
                sizes="40px"
              />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {isSuccess ? "Pesanan Berhasil" : "Konfirmasi Pembayaran"}
              </h3>
              <p className="text-[11px] text-slate-400">ChampionStore_IDN</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* ================= SUCCESS / DONE STATE ================= */}
          {isSuccess ? (
            <div className="space-y-5 text-center py-2 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-black text-white">
                  {paymentMethod === "website"
                    ? "Bukti Pembayaran Terkirim!"
                    : "Pesanan Diteruskan ke WhatsApp!"}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {paymentMethod === "website"
                    ? `Terima kasih! Pesanan sedang diverifikasi otomatis. Robux akan dikirim ke akun ${username} dalam 5-10 menit.`
                    : `Silakan kirim pesan yang sudah disiapkan di aplikasi WhatsApp untuk diproses langsung oleh admin 24 jam.`}
                </p>
              </div>

              {/* Order Summary Receipt */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2.5 text-xs">
                <div className="flex justify-between pb-2 border-b border-slate-800 text-slate-400">
                  <span>No. Invoice</span>
                  <span className="font-bold text-white">{invoiceNumber}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Username Roblox</span>
                  <span className="font-bold text-white">{username}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Daftar Paket</span>
                  <span className="font-bold text-white text-right max-w-[200px] truncate">
                    {packagesSummary}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Robux</span>
                  <span className="font-bold text-white">
                    {totalRobux.toLocaleString("id-ID")} Robux
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Bayar</span>
                  <span className="font-bold text-red-400 text-sm">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Metode</span>
                  <span className="font-bold text-white capitalize">
                    {paymentMethod === "website" ? "QRIS Website" : "WhatsApp Admin"}
                  </span>
                </div>
                {phoneNumber && (
                  <div className="flex justify-between text-slate-300">
                    <span>No. WhatsApp</span>
                    <span className="font-bold text-white">{phoneNumber}</span>
                  </div>
                )}
                {adminNote && (
                  <div className="pt-2 border-t border-slate-800 text-slate-400">
                    <span>Catatan:</span>
                    <p className="text-slate-200 font-medium italic mt-0.5">{adminNote}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {paymentMethod === "whatsapp" && (
                  <a
                    href={generateWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                  >
                    <MessageSquareCode className="w-4 h-4" />
                    <span>Buka WhatsApp Admin Lagi</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  Selesai & Tutup
                </button>
              </div>
            </div>
          ) : (
            /* ================= INPUT / CHECKOUT FORM ================= */
            <>
              {/* Order Quick Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-slate-800">
                  <span>No. Invoice</span>
                  <button
                    type="button"
                    onClick={handleCopyInvoice}
                    className="flex items-center gap-1 font-bold text-slate-200 hover:text-red-400 cursor-pointer"
                  >
                    <span>{invoiceNumber}</span>
                    {copied ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Username</span>
                  <span className="font-bold text-white">{username || "Belum diisi"}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Paket Robux ({cartItems.length} jenis)</span>
                  <span className="font-bold text-white text-right max-w-[200px] truncate">
                    {packagesSummary}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Total Robux</span>
                  <span className="font-bold text-white">
                    {totalRobux.toLocaleString("id-ID")} Robux
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Total Tagihan</span>
                  <span className="font-bold text-red-400 text-sm">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {!username && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Harap pastikan username Roblox sudah diisi di Langkah 1!</span>
                </div>
              )}

              {/* FLOW 1: WEBSITE QRIS */}
              {paymentMethod === "website" ? (
                <form onSubmit={handleSubmitWebsiteOrder} className="space-y-4">
                  {/* QRIS Code Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    <div className="w-44 h-44 bg-white p-2.5 rounded-xl border border-slate-700 flex flex-col items-center justify-center shadow-lg">
                      <ScanBarcode className="w-36 h-36 text-slate-950" />
                    </div>
                  </div>

                  {/* Input Phone Number */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-red-400" />
                      <span>Nomor WhatsApp / No. Telepon</span>
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      required
                      className="w-full h-11 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 font-medium focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  {/* Upload Bukti Pembayaran */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                      <Upload className="w-3.5 h-3.5 text-red-400" />
                      <span>Upload Bukti Transfer</span>
                    </label>
                    <label className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-slate-700 flex items-center justify-center gap-2 text-xs font-medium text-slate-400 cursor-pointer transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {proofFile ? (
                        <div className="flex items-center gap-2 text-emerald-400 font-bold">
                          <Check className="w-4 h-4" />
                          <span className="truncate max-w-xs">{proofFile.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-slate-500" />
                          <span>Klik untuk pilih screenshot bukti transfer</span>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Input Catatan untuk Admin (Opsional) */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Catatan untuk Admin (Opsional)</span>
                    </label>
                    <input
                      type="text"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Contoh: Tolong kirim segera ya min"
                      className="w-full h-10 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 font-medium focus:outline-none focus:border-slate-700 transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/40 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengirim Bukti...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-white" />
                        <span>Kirim Bukti Pembayaran</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* FLOW 2: WHATSAPP DIRECT */
                <div className="space-y-4">
                  {/* WhatsApp Instruction Box */}
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 space-y-2 text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center mx-auto">
                      <MessageSquareCode className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">
                      Pesanan Langsung ke WhatsApp Admin
                    </h4>
                    <p className="text-[11px] text-slate-300 max-w-xs mx-auto">
                      Format pesan sudah otomatis terbuat. Klik tombol di bawah untuk langsung terhubung dengan Admin 24 Jam.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">
                        Nomor WhatsApp Anda (Opsional)
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full h-10 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-300">
                        Catatan Tambahan (Opsional)
                      </label>
                      <input
                        type="text"
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Contoh: Mohon fast respon min"
                        className="w-full h-10 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-700"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleWhatsAppCheckout}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/40 cursor-pointer transition-all"
                  >
                    <MessageSquareCode className="w-4 h-4" />
                    <span>Lanjut ke WhatsApp Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Safety badge */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Transaksi 100% Aman, Cepat & Terpercaya</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
