"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Zap,
  Crown,
  Flame,
} from "lucide-react";

export interface PricelistItem {
  id: string;
  amount: number;
  robux: string;
  price: string;
  priceNum: number;
  badge?: "PROMO" | "SULTAN" | "POPULER" | null;
  isActive: boolean;
}

interface AdminPricelistProps {
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function AdminPricelist({ onToast }: AdminPricelistProps) {
  const [items, setItems] = useState<PricelistItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch products, store settings (for promo), and orders (for most popular)
  const fetchProducts = async () => {
    try {
      setLoading(true);

      // 1. Fetch products
      const res = await fetch("/api/products");
      const json = await res.json();
      const rawProducts: any[] = json.success && json.data ? json.data : [];

      // 2. Fetch promo config from store settings
      let promoRobuxAmount = 2200;
      let isPromoActive = true;
      try {
        const storeRes = await fetch("/api/store");
        const storeJson = await storeRes.json();
        if (storeJson.success && storeJson.data) {
          promoRobuxAmount = Number(storeJson.data.promoRobuxAmount) || 2200;
          isPromoActive = storeJson.data.promoActive !== false;
        }
      } catch (err) {
        console.warn("Could not fetch store promo settings:", err);
      }

      // 3. Fetch orders to calculate most popular (most ordered) package
      let mostOrderedAmount = 800; // default popular
      try {
        const ordersRes = await fetch("/api/orders");
        const ordersJson = await ordersRes.json();
        if (ordersJson.success && Array.isArray(ordersJson.data) && ordersJson.data.length > 0) {
          const countMap: Record<number, number> = {};
          ordersJson.data.forEach((o: any) => {
            const amt = Number(o.total_robux) || 0;
            if (amt > 0) {
              countMap[amt] = (countMap[amt] || 0) + 1;
            }
          });
          let maxCount = 0;
          Object.entries(countMap).forEach(([amtStr, count]) => {
            const amt = Number(amtStr);
            // Ignore if it's already a sultan (> 10000) or promo package
            if (count > maxCount && amt < 10000 && amt !== promoRobuxAmount) {
              maxCount = count;
              mostOrderedAmount = amt;
            }
          });
        }
      } catch (err) {
        console.warn("Could not calculate popular orders:", err);
      }

      // 4. Map badges accurately according to the 3 rules:
      // - Sultan: amount >= 10.000 Robux
      // - Promo: amount matches store settings promo
      // - Populer: highest order count
      const formatted: PricelistItem[] = rawProducts.map((p: any) => {
        const amt = Number(p.amount) || 0;
        let badge: "PROMO" | "SULTAN" | "POPULER" | null = null;

        if (amt >= 10000) {
          badge = "SULTAN";
        } else if (isPromoActive && amt === promoRobuxAmount) {
          badge = "PROMO";
        } else if (amt === mostOrderedAmount || p.isBestSeller) {
          badge = "POPULER";
        }

        return {
          id: p.id,
          amount: amt,
          robux: `${amt.toLocaleString("id-ID")} Robux`,
          price: `Rp ${Number(p.price).toLocaleString("id-ID")}`,
          priceNum: Number(p.price) || 0,
          badge,
          isActive: p.isActive !== undefined ? p.isActive : true,
        };
      });

      // If no popular badge was assigned yet, assign to the lowest entry package (e.g. 800 Robux)
      const hasPopular = formatted.some((it) => it.badge === "POPULER");
      if (!hasPopular && formatted.length > 0) {
        const nonPromoNonSultan = formatted.find(
          (it) => it.badge !== "PROMO" && it.badge !== "SULTAN"
        );
        if (nonPromoNonSultan) {
          nonPromoNonSultan.badge = "POPULER";
        }
      }

      setItems(formatted);
    } catch (err) {
      console.warn("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PricelistItem | null>(null);

  // Form states
  const [formRobux, setFormRobux] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingItem(null);
    setFormRobux("");
    setFormPrice("");
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: PricelistItem) => {
    setEditingItem(item);
    setFormRobux(item.robux.replace(/[^0-9]/g, ""));
    setFormPrice(item.price.replace(/[^0-9]/g, ""));
    setFormIsActive(item.isActive);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (id: string) => {
    const target = items.find((it) => it.id === id);
    if (!target) return;
    const newStatus = !target.isActive;

    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isActive: newStatus } : it))
    );

    const robuxNum = target.amount;
    const priceNum = target.priceNum;

    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: robuxNum,
          price: priceNum,
          isActive: newStatus,
        }),
      });
      onToast(
        `Nominal ${target.robux} ${newStatus ? "diaktifkan" : "dinonaktifkan"}!`,
        newStatus ? "success" : "info"
      );
    } catch {
      onToast("Gagal memperbarui status produk", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    const target = items.find((i) => i.id === deletingId);
    setItems((prev) => prev.filter((i) => i.id !== deletingId));

    try {
      await fetch(`/api/products?id=${deletingId}`, {
        method: "DELETE",
      });
      onToast(`Nominal ${target?.robux || ""} berhasil dihapus!`, "success");
    } catch {
      onToast("Gagal menghapus produk dari database", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRobux.trim() || !formPrice.trim()) {
      onToast("Mohon lengkapi nominal Robux dan harga jual!", "error");
      return;
    }

    const robuxNum = parseInt(formRobux.replace(/[^0-9]/g, ""), 10) || 0;
    const priceNum = parseInt(formPrice.replace(/[^0-9]/g, ""), 10) || 0;

    const formattedRobux = `${robuxNum.toLocaleString("id-ID")} Robux`;

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: robuxNum,
          price: priceNum,
          isActive: formIsActive,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan paket");
      }

      await fetchProducts();
      onToast(`Nominal ${formattedRobux} berhasil disimpan ke database!`, "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan produk";
      onToast(msg, "error");
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Title & Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Pricelist Robux
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kelola daftar nominal Robux, harga jual, dan status ketersediaan
          </p>
        </div>

        {/* Solid Red/Pink Button: + Tambah Nominal Baru */}
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-[#FF1F3D] to-red-600 hover:from-red-500 hover:to-[#FF1F3D] text-white text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(255,31,61,0.5)] transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Nominal Baru</span>
        </button>
      </div>

      {/* 3-Column Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className={`rounded-3xl bg-[#0B0F1A] border ${
              item.isActive
                ? "border-slate-800/80 hover:border-slate-700"
                : "border-slate-800/40 opacity-60"
            } p-5 flex flex-col justify-between shadow-xl transition-all hover:shadow-2xl group`}
          >
            {/* Top Row: Coin Icon, Info, & Active Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                {/* Gold Robux Coin Frame */}
                <div className="relative w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-950/40 border border-amber-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.15)] group-hover:scale-105 transition-transform">
                  <Image
                    src="/robux.webp"
                    alt="Robux"
                    width={32}
                    height={32}
                    className="object-contain drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
                    unoptimized
                  />
                </div>

                {/* Nominal & Price */}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                      {item.robux}
                    </h3>
                  </div>

                  {/* Dynamic Badges: POPULER / PROMO / SULTAN */}
                  {item.badge === "POPULER" && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-0.5 rounded-md bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-white text-[9px] font-black tracking-wider uppercase shadow-[0_0_8px_rgba(249,115,22,0.6)]">
                      <Flame className="w-2.5 h-2.5 fill-white text-white" />
                      <span>POPULER</span>
                    </div>
                  )}

                  {item.badge === "PROMO" && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-0.5 rounded-md bg-gradient-to-r from-red-600 via-[#FF1F3D] to-red-600 text-white text-[9px] font-black tracking-wider uppercase shadow-[0_0_8px_rgba(255,31,61,0.6)]">
                      <Zap className="w-2.5 h-2.5 fill-white text-white" />
                      <span>PROMO</span>
                    </div>
                  )}

                  {item.badge === "SULTAN" && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-0.5 rounded-md bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black text-[9px] font-black tracking-wider uppercase shadow-[0_0_8px_rgba(245,158,11,0.6)]">
                      <Crown className="w-2.5 h-2.5 fill-black text-black" />
                      <span>SULTAN</span>
                    </div>
                  )}

                  <div className="text-sm sm:text-base font-extrabold text-[#FF1F3D] tracking-tight mt-0.5">
                    {item.price}
                  </div>
                </div>
              </div>

              {/* Status Pill Badge */}
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                  item.isActive
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : "bg-slate-800/80 text-slate-400 border-slate-700"
                }`}
              >
                {item.isActive ? "Aktif" : "Nonaktif"}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-800/60 my-4" />

            {/* Bottom Row: Toggle Status & Action Icons */}
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => handleToggleActive(item.id)}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {item.isActive ? "Nonaktifkan" : "Aktifkan"}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                  title="Edit Nominal"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setDeletingId(item.id)}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-red-950/50 border border-slate-800 hover:border-red-900/60 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                  title="Hapus Nominal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ======================================================== */}
      {/* MODAL: TAMBAH / EDIT NOMINAL ROBUX */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-md rounded-3xl bg-[#0D121F] border border-slate-800 shadow-2xl p-6 sm:p-7 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
              <h3 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                {editingItem ? "Edit Nominal Robux" : "Tambah Nominal Robux"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveForm} className="space-y-4">
              {/* Field 1: Nominal Robux */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>Nominal Robux</span>
                  <div className="relative w-3.5 h-3.5">
                    <Image
                      src="/robux.webp"
                      alt="Coin"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={formRobux}
                    onChange={(e) => setFormRobux(e.target.value)}
                    placeholder="1.000"
                    className="w-full bg-[#080C14] text-white font-extrabold text-sm px-4 py-3 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none pr-12 transition-all shadow-inner"
                    autoFocus
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-500">
                    R$
                  </span>
                </div>
              </div>

              {/* Field 2: Harga Jual (Rp) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Harga Jual (Rp)
                </label>

                <div className="relative flex items-center">
                  <div className="absolute left-4 text-xs font-extrabold text-[#FF1F3D] pointer-events-none">
                    Rp
                  </div>
                  <input
                    type="text"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="20.000"
                    className="w-full bg-[#080C14] text-white font-extrabold text-sm pl-12 pr-4 py-3 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Field 3: Checkbox Aktif */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <div
                    onClick={() => setFormIsActive(!formIsActive)}
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                      formIsActive
                        ? "bg-[#FF1F3D] border-[#FF1F3D] shadow-[0_0_8px_rgba(255,31,61,0.6)]"
                        : "bg-slate-900 border-slate-700"
                    }`}
                  >
                    {formIsActive && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                    Nominal Aktif &amp; Ditampilkan di Web
                  </span>
                </label>
              </div>

              {/* Buttons Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-[#FF1F3D] hover:from-red-500 hover:to-red-600 text-white text-xs font-extrabold shadow-[0_0_15px_rgba(255,31,61,0.5)] active:scale-95 transition-all cursor-pointer"
                >
                  Simpan Nominal
                </button>
              </div>
            </form>
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
                Hapus Nominal Robux?
              </h3>
              <p className="text-xs text-slate-400">
                Nominal ini akan dihapus dari daftar pricelist web ChampionStore.
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
