"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import {
  RefreshCw,
  Search,
  ArrowLeft,
  ArrowRight,
  Receipt,
  User,
  FileText,
  Copy,
  ExternalLink,
  Check,
  MessageCircle,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
  Eye,
  Download,
  X,
} from "lucide-react";

export type OrderStatus =
  | "Menunggu Bayar"
  | "Diproses"
  | "Selesai"
  | "Dibatalkan";

const DB_TO_UI_STATUS: Record<string, OrderStatus> = {
  pending: "Menunggu Bayar",
  processing: "Diproses",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  "Menunggu Bayar": "Menunggu Bayar",
  Diproses: "Diproses",
  Selesai: "Selesai",
  Dibatalkan: "Dibatalkan",
};

const UI_TO_DB_STATUS: Record<string, string> = {
  "Menunggu Bayar": "pending",
  Diproses: "processing",
  Selesai: "completed",
  Dibatalkan: "cancelled",
};

export interface OrderItem {
  id: string;
  user: string;
  userIdRoblox: string;
  phone: string;
  item: string;
  price: string;
  status: OrderStatus;
  time: string;
  fullDate: string;
  source: "WEBSITE" | "WHATSAPP";
  hasProof: boolean;
  paymentProofUrl?: string | null;
  notes: string;
  customerNote: string;
}

interface AdminOrderMasukProps {
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
  selectedOrderId?: string | null;
  tabType?:
    | "order-masuk"
    | "order-diproses"
    | "order-selesai"
    | "order-dibatalkan";
}

export default function AdminOrderMasuk({
  onToast,
  selectedOrderId = null,
  tabType = "order-masuk",
}: AdminOrderMasukProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<OrderItem[]>([]);

  // Fetch orders from Supabase backend
  const fetchOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch("/api/orders");
      const json = await res.json();
      if (json.success && json.data) {
        // Map Supabase rows to OrderItem format
        const formatted: OrderItem[] = json.data.map((row: any) => {
          const createdAt = new Date(row.created_at || Date.now());
          const dateStr = createdAt.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          });
          const timeStr = createdAt.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          });

          let itemName = `${Number(row.total_robux || 0).toLocaleString("id-ID")} Robux`;
          if (row.items && Array.isArray(row.items) && row.items.length > 0) {
            itemName = row.items.map((i: any) => i.name || `${i.amount} Robux`).join(", ");
          }

          const rawStatus = row.status || row.order_status || "pending";
          const uiStatus = DB_TO_UI_STATUS[rawStatus] || "Menunggu Bayar";

          return {
            id: row.order_code || row.id,
            user: row.customer_username || row.roblox_username || "-",
            userIdRoblox: row.roblox_user_id || row.customer_roblox_id || "-",
            phone: row.customer_phone || "-",
            item: itemName,
            price: `Rp ${Number(row.total_price || row.price || 0).toLocaleString("id-ID")}`,
            status: uiStatus,
            time: `${dateStr}, ${timeStr}`,
            fullDate: createdAt.toLocaleString("id-ID"),
            source: row.source || (row.payment_method === "WhatsApp" ? "WHATSAPP" : "WEBSITE"),
            hasProof: Boolean(row.payment_proof_url || row.payment_proof_path),
            paymentProofUrl: row.payment_proof_url || row.payment_proof_path,
            notes: row.admin_notes || "",
            customerNote: row.customer_notes || row.customer_note || "-",
          };
        });
        setOrders(formatted);
      }
    } catch (err) {
      console.warn("Failed to fetch orders:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("admin-orders-table-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchOrders(true);
        }
      )
      .subscribe();

    const interval = setInterval(() => {
      fetchOrders(true);
    }, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const [activeDetailOrder, setActiveDetailOrder] = useState<OrderItem | null>(
    selectedOrderId
      ? orders.find((o) => o.id === selectedOrderId) || null
      : null
  );

  const [currentAdminNote, setCurrentAdminNote] = useState<string>("" );
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);

  // Tab Header configurations
  const tabConfig = {
    "order-masuk": {
      title: "Order Masuk",
      desc: "Kelola dan proses seluruh pesanan Robux baru yang masuk ke ChampionStore",
      filterStatus: "Menunggu Bayar" as OrderStatus,
    },
    "order-diproses": {
      title: "Order Diproses",
      desc: "Pantau dan kelola pesanan Robux yang sedang dalam proses pengiriman",
      filterStatus: "Diproses" as OrderStatus,
    },
    "order-selesai": {
      title: "Order Selesai",
      desc: "Riwayat seluruh pesanan Robux yang telah sukses dikirim ke customer",
      filterStatus: "Selesai" as OrderStatus,
    },
    "order-dibatalkan": {
      title: "Order Dibatalkan",
      desc: "Daftar pesanan yang dibatalkan karena kendala ID, pembayaran, atau permintaan customer",
      filterStatus: "Dibatalkan" as OrderStatus,
    },
  };

  const currentTab = tabConfig[tabType] || tabConfig["order-masuk"];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders(true);
    setIsRefreshing(false);
    onToast(`Data ${currentTab.title} berhasil disinkronkan dengan database!`, "success");
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    onToast(`${fieldName} disalin ke clipboard!`, "info");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderItem["status"]
  ) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, status: newStatus } : ord
      )
    );
    if (activeDetailOrder && activeDetailOrder.id === orderId) {
      setActiveDetailOrder((prev) =>
        prev ? { ...prev, status: newStatus } : null
      );
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("champion-orders-updated"));
    }

    try {
      const dbStatus = UI_TO_DB_STATUS[newStatus] || newStatus;
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: dbStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal update status");
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("champion-orders-updated"));
      }
      onToast(`Status order #${orderId} diubah menjadi "${newStatus}"`, "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui status order";
      onToast(msg, "error");
    }
  };

  const handleSaveNote = async () => {
    if (!activeDetailOrder) return;
    const orderId = activeDetailOrder.id;

    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? { ...ord, notes: currentAdminNote }
          : ord
      )
    );
    setActiveDetailOrder((prev) =>
      prev ? { ...prev, notes: currentAdminNote } : null
    );

    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, adminNotes: currentAdminNote }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan catatan");
      }
      onToast("Catatan order berhasil disimpan ke database!", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan catatan";
      onToast(msg, "error");
    }
  };

  const handleSendReviewLink = (ord: OrderItem) => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://championstore.id";
    const cleanRobux = ord.item.replace(/[^0-9.]/g, "");
    const reviewLink = `${origin}/review?order=${ord.id}&user=${encodeURIComponent(ord.user)}&robux=${encodeURIComponent(cleanRobux)}`;

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(reviewLink);
    }

    const cleanPhone = ord.phone.replace(/[^0-9]/g, "");
    const waText = encodeURIComponent(
      `Halo kak @${ord.user}!\n\n` +
        `Pesanan Robux #${ord.id} (${ord.item}) telah selesai kami kirim.\n\n` +
        `Mohon luangkan waktu sebentar untuk memberikan ulasan / testimoni melalui link berikut ya:\n` +
        `${reviewLink}\n\n` +
        `Terima kasih banyak sudah berbelanja di ChampionStore!`
    );

    if (cleanPhone) {
      window.open(`https://wa.me/${cleanPhone}?text=${waText}`, "_blank");
    }
    onToast(
      `Link review #${ord.id} disalin ke clipboard & WhatsApp dibuka!`,
      "success"
    );
  };

  // Filter orders by tab category and search term
  const categoryOrders = orders.filter((ord) => {
    if (tabType === "order-masuk") return ord.status === "Menunggu Bayar";
    if (tabType === "order-diproses") return ord.status === "Diproses";
    if (tabType === "order-selesai") return ord.status === "Selesai";
    if (tabType === "order-dibatalkan") return ord.status === "Dibatalkan";
    return true;
  });

  const filteredOrders = categoryOrders.filter(
    (ord) =>
      ord.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.phone.includes(searchTerm)
  );

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Menunggu Bayar":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Menunggu Bayar
          </span>
        );
      case "Diproses":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            Diproses
          </span>
        );
      case "Selesai":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Selesai
          </span>
        );
      case "Dibatalkan":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950/60 text-red-400 border border-red-800/60">
            Dibatalkan
          </span>
        );
      default:
        return null;
    }
  };

  // ==========================================
  // VIEW: DETAIL ORDER
  // ==========================================
  if (activeDetailOrder) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
        {/* Back Link */}
        <button
          onClick={() => setActiveDetailOrder(null)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke {currentTab.title}</span>
        </button>

        {/* Order Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-[#FF1F3D] tracking-tight">
                ORDER #{activeDetailOrder.id}
              </h1>
              {getStatusBadge(activeDetailOrder.status)}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {activeDetailOrder.fullDate}
            </p>
          </div>
        </div>

        {/* UBAH STATUS CEPAT BAR */}
        <div className="rounded-2xl bg-[#0C101C] border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            UBAH STATUS CEPAT:
          </span>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() =>
                handleUpdateStatus(activeDetailOrder.id, "Diproses")
              }
              className="px-4 py-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-600/60 text-blue-400 hover:text-blue-300 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-[0_0_10px_rgba(59,130,246,0.2)]"
            >
              Proses Pesanan
            </button>

            <button
              onClick={() =>
                handleUpdateStatus(activeDetailOrder.id, "Selesai")
              }
              className="px-4 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-600/60 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            >
              Selesaikan Order
            </button>

            <button
              onClick={() =>
                handleUpdateStatus(activeDetailOrder.id, "Dibatalkan")
              }
              className="px-4 py-2 rounded-xl bg-red-950/30 hover:bg-red-900/50 border border-red-800/60 text-red-400 hover:text-red-300 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              Batalkan
            </button>

            {activeDetailOrder.status === "Selesai" && (
              <button
                onClick={() => handleSendReviewLink(activeDetailOrder)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-950/30 hover:bg-amber-900/50 border border-amber-500/60 text-amber-400 hover:text-amber-300 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.2)]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Kirim Link Review</span>
              </button>
            )}

            <a
              href={`https://wa.me/${activeDetailOrder.phone.replace(
                /[^0-9]/g,
                ""
              )}?text=Halo%20kak%20@${activeDetailOrder.user},%20konfirmasi%20order%20Robux%20#${activeDetailOrder.id}%20di%20ChampionStore`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/60 text-emerald-400 text-xs font-bold transition-all active:scale-95 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-transparent" />
              <span>Chat Pelanggan</span>
            </a>
          </div>
        </div>

        {/* CARD 1: DETAIL PESANAN */}
        <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-[#FF1F3D] font-black text-sm tracking-wide">
            <div className="w-6 h-6 rounded-lg bg-red-950/80 border border-red-600/50 flex items-center justify-center">
              <Receipt className="w-3.5 h-3.5 text-red-400" />
            </div>
            <span className="uppercase text-slate-200">DETAIL PESANAN</span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-2">
              <span>PRODUK</span>
              <span>HARGA</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 shrink-0">
                  <Image
                    src="/robux.webp"
                    alt="Robux"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <span className="font-extrabold text-sm sm:text-base text-white">
                  {activeDetailOrder.item}
                </span>
              </div>
              <span className="font-extrabold text-sm sm:text-base text-slate-100">
                {activeDetailOrder.price}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-t border-slate-800/60">
              <span className="text-xs font-semibold text-slate-400">
                Metode Pembayaran
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider text-white bg-[#FF1F3D]/20 border border-[#FF1F3D]/50">
                {activeDetailOrder.source}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-slate-800/60">
              <span className="text-sm font-black text-white uppercase">
                TOTAL PEMBAYARAN
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#FF1F3D] tracking-tight drop-shadow-[0_0_10px_rgba(255,31,61,0.6)]">
                {activeDetailOrder.price}
              </span>
            </div>

            {/* Button: Lihat Bukti Transfer Pelanggan (BloxyLucy Style) */}
            {activeDetailOrder.hasProof || activeDetailOrder.paymentProofUrl ? (
              <button
                type="button"
                onClick={() => setIsProofModalOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-red-950/20 hover:bg-red-950/40 border border-red-800/40 hover:border-red-600/60 text-[#FF1F3D] hover:text-red-400 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer shadow-sm"
              >
                <Eye className="w-4 h-4" />
                <span>Lihat Bukti Transfer Pelanggan</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-500 text-center">
                Metode pembayaran WhatsApp / bukti belum diunggah.
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: INFORMASI PELANGGAN */}
        <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-[#FF1F3D] font-black text-sm tracking-wide">
            <div className="w-6 h-6 rounded-lg bg-red-950/80 border border-red-600/50 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-red-400" />
            </div>
            <span className="uppercase text-slate-200">INFORMASI PELANGGAN</span>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs sm:text-sm">
            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-400 font-medium">Username</span>
              <a
                href={`https://www.roblox.com/users/profile?username=${activeDetailOrder.user}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#FF1F3D] hover:underline flex items-center gap-1.5"
              >
                <span>@{activeDetailOrder.user}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-400 font-medium">User ID Roblox</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white">
                  {activeDetailOrder.userIdRoblox}
                </span>
                <button
                  onClick={() =>
                    handleCopy(activeDetailOrder.userIdRoblox, "User ID Roblox")
                  }
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white text-slate-400 transition-colors"
                  title="Salin User ID"
                >
                  {copiedField === "User ID Roblox" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-400 font-medium">No. WhatsApp</span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-600/40 text-emerald-400 font-bold flex items-center gap-1.5">
                  <MessageCircle className="w-3 h-3 fill-emerald-400 text-transparent" />
                  <span>{activeDetailOrder.phone}</span>
                </span>
                <button
                  onClick={() =>
                    handleCopy(activeDetailOrder.phone, "Nomor WhatsApp")
                  }
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white text-slate-400 transition-colors"
                  title="Salin Nomor WhatsApp"
                >
                  {copiedField === "Nomor WhatsApp" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-400 font-medium">
                Catatan Pelanggan
              </span>
              <span className="text-slate-300 font-medium">
                {activeDetailOrder.customerNote}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 3: CATATAN ADMIN */}
        <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-[#FF1F3D] font-black text-sm tracking-wide">
            <div className="w-6 h-6 rounded-lg bg-red-950/80 border border-red-600/50 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-red-400" />
            </div>
            <span className="uppercase text-slate-200">CATATAN ADMIN</span>
          </div>

          <div className="space-y-3 pt-1">
            <textarea
              rows={4}
              value={currentAdminNote}
              onChange={(e) => setCurrentAdminNote(e.target.value)}
              placeholder="Tulis catatan untuk order ini (hanya admin)..."
              className="w-full bg-[#080C14] text-xs sm:text-sm text-slate-200 p-4 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none focus:ring-1 focus:ring-[#FF1F3D] leading-relaxed placeholder-slate-500 shadow-inner"
            />

            <button
              onClick={handleSaveNote}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-[#FF1F3D] hover:from-red-500 hover:to-red-600 text-white font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(255,31,61,0.5)] active:scale-95 transition-all cursor-pointer"
            >
              Simpan Catatan
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODAL: BUKTI TRANSFER PELANGGAN (BloxyLucy Style) */}
        {/* ======================================================== */}
        {isProofModalOpen && activeDetailOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
              onClick={() => setIsProofModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            />

            <div className="relative w-full max-w-lg rounded-3xl bg-[#0D121F] border border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4 z-10 animate-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  Bukti Transfer Pelanggan
                </h3>
                <button
                  onClick={() => setIsProofModalOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Proof Image Box */}
              <div className="relative w-full h-72 sm:h-80 rounded-2xl bg-[#080C14] border border-slate-800 overflow-hidden flex items-center justify-center p-3">
                <img
                  src={activeDetailOrder.paymentProofUrl || "/logo.png"}
                  alt="Bukti Transfer Pelanggan"
                  className="max-h-full max-w-full object-contain rounded-xl shadow-lg"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="text-xs font-bold text-slate-400">
                  #{activeDetailOrder.id} • @{activeDetailOrder.user}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProofModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>

                  <a
                    href={activeDetailOrder.paymentProofUrl || "/logo.png"}
                    download={`bukti-transfer-${activeDetailOrder.id}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-[#FF1F3D] hover:from-red-500 hover:to-red-600 text-white text-xs font-extrabold shadow-[0_0_12px_rgba(255,31,61,0.5)] active:scale-95 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW: LIST ORDERS
  // ==========================================
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title & Refresh Button Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {currentTab.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {currentTab.desc}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all self-start sm:self-auto active:scale-95 shadow-sm cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-[#FF1F3D] ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Main Filter & Order List Box */}
      <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-4 sm:p-6 space-y-4 shadow-xl">
        {/* Search & Count Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter order atau username..."
              className="w-full bg-[#080C14] text-xs text-slate-200 pl-10 pr-4 py-2.5 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none focus:ring-1 focus:ring-[#FF1F3D] transition-all"
            />
          </div>

          <span className="text-xs font-semibold text-slate-400">
            Menampilkan {filteredOrders.length} pesanan
          </span>
        </div>

        {/* Order Cards List */}
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Tidak ada pesanan di kategori ini yang cocok dengan filter pencarian.
            </div>
          ) : (
            filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="group relative rounded-2xl bg-[#080C14] border border-slate-800/80 hover:border-slate-700 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 hover:shadow-lg"
              >
                {/* Left Side: Order ID, Status, User & Timestamp */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-extrabold text-sm sm:text-base text-[#FF1F3D] tracking-tight">
                      #{ord.id}
                    </span>
                    {getStatusBadge(ord.status)}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">
                      @{ord.user}
                    </span>
                    <span>•</span>
                    <span>{ord.time}</span>
                    <span>•</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.source === "WEBSITE"
                          ? "bg-purple-950/60 text-purple-400 border border-purple-800/40"
                          : "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                      }`}
                    >
                      {ord.source}
                    </span>
                    <span>
                      {ord.hasProof ? "(Ada Bukti)" : "(Tanpa foto)"}
                    </span>
                  </div>
                </div>

                {/* Right Side: Robux Item, Price & Action Buttons */}
                <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                  {/* Robux & Price */}
                  <div className="flex items-center gap-2.5 text-right">
                    <div className="relative w-6 h-6 shrink-0">
                      <Image
                        src="/robux.webp"
                        alt="Robux"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {ord.item}
                      </div>
                      <div className="text-xs font-extrabold text-[#FF1F3D]">
                        {ord.price}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {ord.status === "Menunggu Bayar" && (
                      <button
                        onClick={() => handleUpdateStatus(ord.id, "Diproses")}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-600/50 text-blue-400 hover:text-blue-300 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                      >
                        Proses
                      </button>
                    )}

                    {ord.status === "Diproses" && (
                      <button
                        onClick={() => handleUpdateStatus(ord.id, "Selesai")}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-600/50 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                      >
                        Selesai
                      </button>
                    )}

                    {ord.status === "Selesai" && (
                      <button
                        onClick={() => handleSendReviewLink(ord)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/50 hover:border-amber-400 text-amber-400 hover:text-amber-300 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                        title="Kirim Link Review Testimoni ke Pelanggan"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        <span>Link Review</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveDetailOrder(ord);
                        setCurrentAdminNote(ord.notes);
                      }}
                      className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-[#FF1F3D] hover:from-red-500 hover:to-red-600 text-white text-xs font-bold shadow-[0_0_12px_rgba(255,31,61,0.4)] active:scale-95 transition-all cursor-pointer"
                    >
                      <span>Detail</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
