"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { CartItem } from "@/types";
import { ShoppingBag, X, Trash2, ArrowRight, Plus, Minus } from "lucide-react";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}: CartModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setMounted(false), 250);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  const totalItemCount = cartItems.reduce((acc, ci) => acc + ci.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, ci) => acc + ci.item.price * ci.quantity,
    0
  );

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen
          ? "bg-black/80 backdrop-blur-md opacity-100 animate-backdrop-in"
          : "bg-black/0 backdrop-blur-none opacity-0 pointer-events-none"
      }`}
    >
      {/* Modal Box with Silky Spring Bounce Animation */}
      <div
        className={`relative w-full max-w-md bg-[#0D1321] text-white rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] border border-slate-800/90 p-5 sm:p-7 space-y-5 max-h-[90vh] flex flex-col transition-all duration-300 ${
          isOpen
            ? "animate-modal-pop"
            : "scale-90 translate-y-6 opacity-0"
        }`}
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between pb-2 border-b border-slate-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-950/60 border border-red-800/50 text-red-400 flex items-center justify-center shadow-md shadow-red-950/40 animate-badge-pop">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Keranjang Belanja ChampionStore<span className="text-[#FF1F3D]">_IDN</span>
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Keranjang"
            className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:bg-slate-800 hover:scale-110 active:scale-95 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item List Header */}
        <div className="relative z-10 flex-1 overflow-y-auto space-y-3 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Daftar Paket ({totalItemCount} item):</span>
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-red-400 hover:text-red-300 text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Kosongkan Semua
              </button>
            )}
          </div>

          {/* Cart Items Loop */}
          {cartItems.length > 0 ? (
            <div className="space-y-2.5">
              {cartItems.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex items-center justify-between gap-3 shadow-inner hover:border-slate-700 transition-all hover:translate-y-[-1px]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-950/30 border border-amber-600/30 p-1 flex items-center justify-center shrink-0">
                      <Image
                        src="/robux.webp"
                        alt="Robux"
                        width={28}
                        height={28}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-xs sm:text-sm text-white truncate">
                        {item.amount.toLocaleString("id-ID")} Robux
                      </h4>
                      <div className="text-xs font-black text-red-500 mt-0.5">
                        Rp {(item.price * quantity).toLocaleString("id-ID")}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls & Delete */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 hover:scale-110 active:scale-90 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black text-white w-5 text-center select-none">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-red-950 hover:bg-red-900 hover:scale-110 active:scale-90 text-red-400 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 rounded-xl bg-red-950/30 hover:bg-red-950/70 border border-red-900/40 text-red-400 hover:text-red-300 hover:scale-110 active:scale-90 transition-all cursor-pointer"
                      title="Hapus item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 text-center space-y-1">
              <p className="text-xs text-slate-400">Keranjang belanja Anda masih kosong.</p>
              <p className="text-[11px] text-slate-500">
                Klik tombol (+) pada kartu Robux untuk memasukkan paket ke keranjang.
              </p>
            </div>
          )}
        </div>

        {/* Total Price */}
        <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between shrink-0">
          <span className="text-xs sm:text-sm font-bold text-slate-300">Total Pembayaran:</span>
          <span className="text-lg sm:text-xl font-black text-red-500">
            Rp {totalPrice.toLocaleString("id-ID")}
          </span>
        </div>

        {/* Action Button */}
        <div className="relative z-10 pt-1 shrink-0">
          <button
            type="button"
            disabled={cartItems.length === 0}
            onClick={() => {
              onClose();
              onProceedToCheckout();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-red-600/40 hover:shadow-red-600/60 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            <span>Lanjut ke Pembayaran</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
