"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Zap,
  Crown,
} from "lucide-react";

export interface PricelistItem {
  id: string;
  robux: string;
  price: string;
  badge?: "PROMO" | "SULTAN" | "POPULER" | null;
  isActive: boolean;
}

interface AdminPricelistProps {
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function AdminPricelist({ onToast }: AdminPricelistProps) {
  const [items, setItems] = useState<PricelistItem[]>([
    {
      id: "1",
      robux: "1.800 Robux",
      price: "Rp 35.000",
      badge: null,
      isActive: true,
    },
    {
      id: "2",
      robux: "2.200 Robux",
      price: "Rp 45.000",
      badge: "PROMO",
      isActive: true,
    },
    {
      id: "3",
      robux: "2.700 Robux",
      price: "Rp 50.000",
      badge: null,
      isActive: true,
    },
    {
      id: "4",
      robux: "3.200 Robux",
      price: "Rp 60.000",
      badge: null,
      isActive: true,
    },
    {
      id: "5",
      robux: "3.700 Robux",
      price: "Rp 70.000",
      badge: null,
      isActive: true,
    },
    {
      id: "6",
      robux: "4.200 Robux",
      price: "Rp 80.000",
      badge: null,
      isActive: true,
    },
    {
      id: "7",
      robux: "4.700 Robux",
      price: "Rp 90.000",
      badge: null,
      isActive: true,
    },
    {
      id: "8",
      robux: "5.500 Robux",
      price: "Rp 100.000",
      badge: null,
      isActive: true,
    },
    {
      id: "9",
      robux: "10.500 Robux",
      price: "Rp 200.000",
      badge: "SULTAN",
      isActive: true,
    },
  ]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PricelistItem | null>(null);

  // Form states
  const [formRobux, setFormRobux] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Auto-detect badge based on nominal/price rules
  const getAutoBadge = (robuxStr: string, priceStr: string): "PROMO" | "SULTAN" | null => {
    const rNum = parseInt(robuxStr.replace(/[^0-9]/g, ""), 10) || 0;
    if (rNum >= 10000) return "SULTAN";
    if (rNum === 2200) return "PROMO";
    return null;
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormRobux("");
    setFormPrice("");
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: PricelistItem) => {
    setEditingItem(item);
    setFormRobux(item.robux.replace(/[^0-9.]/g, ""));
    setFormPrice(item.price.replace(/[^0-9.]/g, ""));
    setFormIsActive(item.isActive);
    setIsModalOpen(true);
  };

  const handleToggleActive = (id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const newStatus = !it.isActive;
          onToast(
            `Nominal ${it.robux} ${newStatus ? "diaktifkan" : "dinonaktifkan"}!`,
            newStatus ? "success" : "info"
          );
          return { ...it, isActive: newStatus };
        }
        return it;
      })
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingId) return;
    const target = items.find((i) => i.id === deletingId);
    setItems((prev) => prev.filter((i) => i.id !== deletingId));
    setDeletingId(null);
    onToast(`Nominal ${target?.robux || ""} berhasil dihapus!`, "success");
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRobux.trim() || !formPrice.trim()) {
      onToast("Mohon lengkapi nominal Robux dan harga jual!", "error");
      return;
    }

    const formattedRobux = formRobux.includes("Robux")
      ? formRobux
      : `${formRobux.trim()} Robux`;

    const formattedPrice = formPrice.startsWith("Rp")
      ? formPrice
      : `Rp ${formPrice.trim()}`;

    const autoBadge = getAutoBadge(formattedRobux, formattedPrice);

    if (editingItem) {
      // Edit existing
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingItem.id
            ? {
                ...it,
                robux: formattedRobux,
                price: formattedPrice,
                badge: autoBadge,
                isActive: formIsActive,
              }
            : it
        )
      );
      onToast(`Nominal ${formattedRobux} berhasil diperbarui!`, "success");
    } else {
      // Add new
      const newItem: PricelistItem = {
        id: Date.now().toString(),
        robux: formattedRobux,
        price: formattedPrice,
        badge: autoBadge,
        isActive: formIsActive,
      };
      setItems((prev) => [...prev, newItem]);
      onToast(`Nominal ${formattedRobux} berhasil ditambahkan!`, "success");
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

                  {/* Auto Badges (Promo / Sultan) */}
                  {item.badge === "PROMO" && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-0.5 rounded-md bg-gradient-to-r from-red-600 to-pink-600 text-white text-[9px] font-black tracking-wider uppercase shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                      <Zap className="w-2.5 h-2.5 fill-white" />
                      <span>PROMO</span>
                    </div>
                  )}
                  {item.badge === "SULTAN" && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-0.5 rounded-md bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-[9px] font-black tracking-wider uppercase shadow-[0_0_8px_rgba(245,158,11,0.6)]">
                      <Crown className="w-2.5 h-2.5 fill-black" />
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
      {/* MODAL: TAMBAH / EDIT NOMINAL ROBUX (Clean BloxyLucy Style) */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Dialog Container */}
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
