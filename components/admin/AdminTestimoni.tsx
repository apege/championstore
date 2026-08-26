"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  RefreshCw,
  Search,
  Star,
  CheckCircle2,
  Eye,
  EyeOff,
  Pencil,
  Reply,
  Trash2,
  X,
  Upload,
  ChevronDown,
  ChevronUp,
  Download,
  MessageSquare,
  Sparkles,
  Check,
} from "lucide-react";
import { ROBUX_PACKAGES } from "@/data/pricelist";
import { compressToWebP } from "@/lib/compressToWebP";

export interface TestimonialItem {
  id: number;
  name: string;
  rating: number;
  message: string;
  image_path?: string | null;
  order_code?: string | null;
  status: "approved" | "pending" | "rejected";
  created_at: string;
  admin_reply?: string | null;
}

interface AdminTestimoniProps {
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function AdminTestimoni({ onToast }: AdminTestimoniProps) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters & Search
  const [activeTab, setActiveTab] = useState<"all" | "active" | "hidden" | "need_reply">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);

  // Form states
  const [formUsername, setFormUsername] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formMessage, setFormMessage] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formOrderPackage, setFormOrderPackage] = useState("");
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  const [formUploading, setFormUploading] = useState(false);

  // Reply modal state
  const [replyingItem, setReplyingItem] = useState<TestimonialItem | null>(null);
  const [replyText, setReplyText] = useState("");

  // Preview Image Modal state
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    username: string;
    orderCode?: string | null;
  } | null>(null);

  // Delete modal state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Fetch testimonials from API
  const fetchTestimonials = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch("/api/testimonials");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTestimonials(json.data);
      }
    } catch (err) {
      console.warn("Failed to fetch testimonials:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTestimonials(true);
    setIsRefreshing(false);
    onToast("Daftar testimoni berhasil disinkronkan!", "success");
  };

  // Metrics calculation
  const totalCount = testimonials.length;
  const activeCount = testimonials.filter((t) => t.status === "approved").length;
  const hiddenCount = testimonials.filter((t) => t.status === "rejected").length;
  const needReplyCount = testimonials.filter((t) => !t.admin_reply).length;
  const avgRating = totalCount > 0
    ? (testimonials.reduce((sum, t) => sum + (t.rating || 5), 0) / totalCount).toFixed(1)
    : "5.0";

  // Filtered list
  const filteredList = testimonials.filter((item) => {
    if (activeTab === "active" && item.status !== "approved") return false;
    if (activeTab === "hidden" && item.status !== "rejected") return false;
    if (activeTab === "need_reply" && Boolean(item.admin_reply)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchMsg = item.message.toLowerCase().includes(q);
      const matchOrder = item.order_code?.toLowerCase().includes(q);
      return matchName || matchMsg || matchOrder;
    }
    return true;
  });

  // Toggle Tampil / Sembunyikan
  const handleToggleStatus = async (item: TestimonialItem) => {
    const newStatus = item.status === "approved" ? "rejected" : "approved";
    setTestimonials((prev) =>
      prev.map((t) => (t.id === item.id ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await fetch("/api/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal update status");
      onToast(
        `Testimoni @${item.name} berhasil ${newStatus === "approved" ? "ditampilkan di web" : "disembunyikan"}!`,
        "success"
      );
    } catch {
      onToast("Gagal memperbarui status testimoni", "error");
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingItem(null);
    setFormUsername("");
    setFormRating(5);
    setFormMessage("");
    setFormImage("");
    setFormOrderPackage("");
    setIsPackageDropdownOpen(false);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item: TestimonialItem) => {
    setEditingItem(item);
    setFormUsername(item.name);
    setFormRating(item.rating);
    setFormMessage(item.message);
    setFormImage(item.image_path || "");
    setFormOrderPackage(item.order_code || "");
    setIsPackageDropdownOpen(false);
    setIsFormModalOpen(true);
  };

  // Save Add/Edit Testimonial Form
  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formMessage.trim()) {
      onToast("Username Roblox dan Isi Testimoni wajib diisi!", "error");
      return;
    }

    try {
      const payload: Record<string, any> = {
        name: formUsername.trim(),
        rating: formRating,
        message: formMessage.trim(),
        imagePath: formImage.trim() || null,
        orderCode: formOrderPackage.trim() || null,
        status: "approved",
      };
      if (editingItem) {
        payload.id = editingItem.id;
      }

      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal menyimpan testimoni");

      await fetchTestimonials(true);
      setIsFormModalOpen(false);
      onToast(
        editingItem
          ? `Testimoni @${formUsername} berhasil diperbarui!`
          : `Testimoni baru untuk @${formUsername} berhasil ditambahkan!`,
        "success"
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan testimoni";
      onToast(msg, "error");
    }
  };

  // Handle Photo Upload in form
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;

    if (originalFile.size > 5 * 1024 * 1024) {
      onToast("Ukuran foto maksimal 5MB!", "error");
      return;
    }

    try {
      setFormUploading(true);
      let fileToUpload = originalFile;
      try {
        fileToUpload = await compressToWebP(originalFile);
      } catch (cErr) {
        console.warn("WebP compression failed, using original file:", cErr);
      }

      const formData = new FormData();
      formData.append("file", fileToUpload);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal upload foto");

      setFormImage(json.url);
      onToast("Foto bukti berhasil diunggah (WebP)!", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal upload foto";
      onToast(msg, "error");
    } finally {
      setFormUploading(false);
    }
  };

  // Open Reply Modal
  const openReplyModal = (item: TestimonialItem) => {
    setReplyingItem(item);
    setReplyText(item.admin_reply || "");
  };

  // Save Reply
  const handleSaveReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingItem) return;

    try {
      const res = await fetch("/api/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: replyingItem.id,
          adminReply: replyText.trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal menyimpan balasan");

      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === replyingItem.id ? { ...t, admin_reply: replyText.trim() || null } : t
        )
      );
      setReplyingItem(null);
      onToast(`Balasan untuk @${replyingItem.name} berhasil disimpan!`, "success");
    } catch {
      onToast("Gagal menyimpan balasan testimoni", "error");
    }
  };

  // Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/testimonials?id=${deletingId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal menghapus testimoni");

      setTestimonials((prev) => prev.filter((t) => t.id !== deletingId));
      onToast("Testimoni berhasil dihapus dari database!", "success");
    } catch {
      onToast("Gagal menghapus testimoni", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // Format relative date
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMin = Math.floor(diffMs / (1000 * 60));
      const diffHour = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffMin < 5) return "Baru saja";
      if (diffMin < 60) return `${diffMin} menit yang lalu`;
      if (diffHour < 24) return `${diffHour} jam yang lalu`;

      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Baru saja";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Kelola Testimoni &amp; Ulasan
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Moderasi ulasan pembeli, tambah ulasan manual, balas testimoni, dan kontrol publikasi di website
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-[#FF1F3D] to-red-600 hover:from-red-500 hover:to-[#FF1F3D] text-white text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(255,31,61,0.5)] transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Testimoni</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#090D17] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#FF1F3D]" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Four Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Ulasan */}
        <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-5 space-y-1 shadow-lg">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            TOTAL ULASAN
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {totalCount}
          </div>
        </div>

        {/* Metric 2: Rating Rata-rata */}
        <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-5 space-y-1 shadow-lg">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            RATING RATA-RATA
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center gap-1.5">
            <span>{avgRating}</span>
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
        </div>

        {/* Metric 3: Aktif (Tampil) */}
        <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-5 space-y-1 shadow-lg">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            AKTIF (TAMPIL)
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {activeCount}
          </div>
        </div>

        {/* Metric 4: Perlu Balasan */}
        <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-5 space-y-1 shadow-lg">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            PERLU BALASAN
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#FF1F3D]">
            {needReplyCount}
          </div>
        </div>
      </div>

      {/* 3. Filter Tabs & Search Row */}
      <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        {/* Tabs Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "all"
                ? "bg-gradient-to-r from-red-600 via-[#FF1F3D] to-red-600 text-white shadow-[0_0_12px_rgba(255,31,61,0.4)]"
                : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            Semua ({totalCount})
          </button>

          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "active"
                ? "bg-gradient-to-r from-red-600 via-[#FF1F3D] to-red-600 text-white shadow-[0_0_12px_rgba(255,31,61,0.4)]"
                : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            Aktif ({activeCount})
          </button>

          <button
            onClick={() => setActiveTab("hidden")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "hidden"
                ? "bg-gradient-to-r from-red-600 via-[#FF1F3D] to-red-600 text-white shadow-[0_0_12px_rgba(255,31,61,0.4)]"
                : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            Disembunyikan ({hiddenCount})
          </button>

          <button
            onClick={() => setActiveTab("need_reply")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "need_reply"
                ? "bg-gradient-to-r from-red-600 via-[#FF1F3D] to-red-600 text-white shadow-[0_0_12px_rgba(255,31,61,0.4)]"
                : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            Perlu Balasan ({needReplyCount})
          </button>
        </div>

        {/* Search Bar on Right */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari username atau ulasan..."
            className="w-full bg-[#080C14] text-xs text-white pl-10 pr-4 py-2.5 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* 4. Testimonials List Container */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            Memuat ulasan testimoni...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-white">
              Tidak ada testimoni ditemukan
            </div>
            <p className="text-xs text-slate-400">
              Belum ada ulasan yang sesuai dengan filter atau pencarian Anda.
            </p>
          </div>
        ) : (
          filteredList.map((item) => {
            const isApproved = item.status === "approved";
            const initial = item.name ? item.name.charAt(0).toUpperCase() : "U";

            return (
              <div
                key={item.id}
                className={`rounded-3xl bg-[#0B0F1A] border ${
                  isApproved ? "border-slate-800/80 hover:border-slate-700" : "border-slate-800/40 opacity-75"
                } p-5 sm:p-6 space-y-4 shadow-xl transition-all hover:shadow-2xl`}
              >
                {/* Row 1: Header (Avatar, Username, Badges, Stars, Date) & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Circle Avatar with Initial */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 via-[#FF1F3D] to-red-950 border border-red-500/40 text-white font-black text-sm flex items-center justify-center shadow-[0_0_10px_rgba(255,31,61,0.5)] shrink-0">
                      {initial}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Username */}
                        <span className="text-sm font-extrabold text-white">
                          @{item.name}
                        </span>

                        {/* Verified Badge */}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Terverifikasi</span>
                        </span>

                        {/* Robux Package Badge */}
                        {item.order_code && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-200 text-[10px] font-bold">
                            <div className="relative w-3 h-3 shrink-0">
                              <Image
                                src="/robux.webp"
                                alt="Robux Coin"
                                width={12}
                                height={12}
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                            <span>
                              {(() => {
                                const str = String(item.order_code).trim();
                                if (/^(CS|BLX|[A-Z]{2,4})-?\d+/i.test(str)) return "2.200 Robux";
                                if (str.toLowerCase().includes("robux")) return str;
                                const num = parseInt(str.replace(/[^0-9]/g, ""), 10);
                                if (num > 0) return `${num.toLocaleString("id-ID")} Robux`;
                                return "2.200 Robux";
                              })()}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Stars & Relative Date */}
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= (item.rating || 5)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-700"
                              }`}
                            />
                          ))}
                        </div>
                        <span>•</span>
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Top-Right Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    {/* Toggle Tampil/Sembunyikan */}
                    <button
                      onClick={() => handleToggleStatus(item)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isApproved
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {isApproved ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{isApproved ? "Tampil" : "Disembunyikan"}</span>
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Balas */}
                    <button
                      onClick={() => openReplyModal(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-800/40 text-xs font-bold text-[#FF1F3D] hover:text-red-400 transition-all cursor-pointer"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>Balas</span>
                    </button>

                    {/* Hapus */}
                    <button
                      onClick={() => setDeletingId(item.id)}
                      className="p-1.5 rounded-xl bg-slate-900 hover:bg-red-950/50 border border-slate-800 hover:border-red-900/60 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                      title="Hapus Testimoni"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Review Message Body */}
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1">
                  &ldquo;{item.message}&rdquo;
                </div>

                {/* Photo Proof Box (If Available) */}
                {item.image_path && (
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewImage({
                          url: item.image_path!,
                          username: item.name,
                          orderCode: item.order_code,
                        })
                      }
                      className="inline-flex items-center gap-3 p-2.5 rounded-2xl bg-[#080C14] border border-slate-800 hover:border-slate-700 transition-all group cursor-pointer text-left"
                    >
                      <div className="relative w-12 h-12 rounded-xl bg-black/40 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                        <img
                          src={item.image_path}
                          alt="Bukti Pembeli"
                          className="max-h-full max-w-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="space-y-0.5 pr-3">
                        <div className="text-xs font-bold text-white group-hover:text-[#FF1F3D] transition-colors">
                          Lihat Foto Bukti Pembeli
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Klik untuk memperbesar
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Admin Reply Box (BloxyLucy-Style with Admin Profile & Left Accent) */}
                {item.admin_reply && (
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
                      {item.admin_reply}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL: TAMBAH / EDIT TESTIMONI */}
      {/* ======================================================== */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsFormModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-lg rounded-3xl bg-[#0D121F] border border-slate-800 shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                {editingItem ? "Edit Testimoni" : "Tambah Testimoni Baru"}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              {/* Field 1: Username Roblox */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Username Roblox <span className="text-[#FF1F3D]">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-xs font-bold text-[#FF1F3D] pointer-events-none">
                    @
                  </div>
                  <input
                    type="text"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="Contoh: APG_Channel11"
                    required
                    className="w-full bg-[#080C14] text-white font-bold text-xs pl-9 pr-4 py-3 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Field 2: Rating Kepuasan (1 - 5 Bintang) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Rating Kepuasan (1 - 5 Bintang)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-[#080C14] p-2 rounded-2xl border border-slate-800">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        className="p-1 text-slate-600 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= formRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-700"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-400">
                    {formRating} Bintang
                  </span>
                </div>
              </div>

              {/* Field 3: Isi Ulasan Testimoni */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Isi Ulasan Testimoni <span className="text-[#FF1F3D]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Tuliskan pengalaman / ulasan kepuasan pembeli..."
                  required
                  className="w-full bg-[#080C14] text-xs text-white p-3.5 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none leading-relaxed transition-all shadow-inner"
                />
              </div>

              {/* Field 4: Foto Bukti Transfer / Landing (Opsional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Foto Bukti Transfer / Landing (Opsional)
                </label>

                {formImage ? (
                  <div className="relative rounded-2xl bg-[#080C14] border border-slate-800 p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-black overflow-hidden flex items-center justify-center">
                        <img
                          src={formImage}
                          alt="Bukti Preview"
                          className="max-h-full max-w-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-300 truncate max-w-[200px]">
                        Foto bukti berhasil diunggah
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormImage("")}
                      className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="relative border-2 border-dashed border-slate-800 hover:border-red-600/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 bg-[#080C14] hover:bg-slate-900/40 transition-all cursor-pointer group">
                    <Upload className="w-5 h-5 text-slate-500 group-hover:text-[#FF1F3D] transition-colors" />
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white">
                      {formUploading ? "Mengunggah foto..." : "Klik untuk upload foto bukti"}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Format JPG, PNG, WEBP (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={formUploading}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Field 5: Paket Robux / Kode Order (Opsional) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    Paket Robux / Kode Order (Opsional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPackageDropdownOpen(!isPackageDropdownOpen)}
                    className="text-[11px] font-bold text-[#FF1F3D] hover:underline flex items-center gap-1"
                  >
                    <span>{isPackageDropdownOpen ? "Tutup Pilihan" : "Pilih dari List atau Ketik"}</span>
                    {isPackageDropdownOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* Collapsible Package Grid */}
                {isPackageDropdownOpen && (
                  <div className="p-3 rounded-2xl bg-[#080C14] border border-slate-800 space-y-2.5 animate-in fade-in duration-150">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      PILIH PAKET NOMINAL ROBUX:
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto scrollbar-thin">
                      {ROBUX_PACKAGES.map((pkg) => (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => {
                            setFormOrderPackage(`${pkg.amount.toLocaleString("id-ID")} Robux`);
                            setIsPackageDropdownOpen(false);
                          }}
                          className={`p-2 rounded-xl text-left border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                            formOrderPackage.includes(pkg.amount.toLocaleString("id-ID"))
                              ? "bg-red-950/60 border-red-600 text-white"
                              : "bg-slate-900/70 border-slate-800 text-slate-300 hover:bg-slate-800"
                          }`}
                        >
                          <span className="text-[#FF1F3D]">{pkg.amount.toLocaleString("id-ID")} Robux</span>
                          <span className="text-[10px] text-slate-400">Rp {pkg.price.toLocaleString("id-ID")}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input manual */}
                <input
                  type="text"
                  value={formOrderPackage}
                  onChange={(e) => setFormOrderPackage(e.target.value)}
                  placeholder="Contoh: BLX28749973 atau 15.000 Robux"
                  className="w-full bg-[#080C14] text-xs text-white px-4 py-3 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none transition-all shadow-inner"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-600 to-[#FF1F3D] hover:from-red-500 hover:to-red-600 text-white text-xs font-extrabold shadow-[0_0_15px_rgba(255,31,61,0.5)] active:scale-95 transition-all"
                >
                  {editingItem ? "Simpan Perubahan" : "Tambah Testimoni"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: BALAS TESTIMONI */}
      {/* ======================================================== */}
      {replyingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setReplyingItem(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-md rounded-3xl bg-[#0D121F] border border-slate-800 shadow-2xl p-6 space-y-4 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h3 className="font-extrabold text-base text-white tracking-tight">
                Balas Testimoni @{replyingItem.name}
              </h3>
              <button
                onClick={() => setReplyingItem(null)}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Testimonial Quote */}
            <div className="p-3 rounded-2xl bg-[#080C14] border border-slate-800 text-xs text-slate-300 italic">
              &ldquo;{replyingItem.message}&rdquo;
            </div>

            <form onSubmit={handleSaveReply} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Tuliskan Balasan Admin
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Terima kasih banyak kak sudah order di ChampionStore! Ditunggu next ordernya yaa kak..."
                  className="w-full bg-[#080C14] text-xs text-white p-3.5 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none leading-relaxed shadow-inner"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-[#FF1F3D] hover:from-red-500 hover:to-red-600 text-white text-xs font-extrabold shadow-[0_0_12px_rgba(255,31,61,0.5)] active:scale-95"
                >
                  Kirim Balasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PREVIEW FOTO BUKTI PEMBELI */}
      {/* ======================================================== */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-lg rounded-3xl bg-[#0D121F] border border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4 z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <h3 className="font-extrabold text-base text-white tracking-tight">
                Foto Bukti Pembeli (@{previewImage.username})
              </h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative w-full h-72 sm:h-80 rounded-2xl bg-[#080C14] border border-slate-800 overflow-hidden flex items-center justify-center p-2">
              <img
                src={previewImage.url}
                alt="Bukti Foto"
                className="max-h-full max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-xs font-bold text-slate-400">
                {previewImage.orderCode || `@${previewImage.username}`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewImage(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300"
                >
                  Tutup
                </button>
                <a
                  href={previewImage.url}
                  download={`bukti-testimoni-${previewImage.username}.png`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-[#FF1F3D] text-white text-xs font-extrabold shadow-[0_0_12px_rgba(255,31,61,0.5)]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ======================================================== */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setDeletingId(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-sm rounded-3xl bg-[#0D121F] border border-slate-800 shadow-2xl p-6 text-center space-y-4 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-600/60 text-red-500 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-white">
                Hapus Testimoni?
              </h3>
              <p className="text-xs text-slate-400">
                Ulasan ini akan dihapus permanen dari database dan web ChampionStore.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                Batal
              </button>

              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-[0_0_12px_rgba(239,68,68,0.5)] transition-all"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
