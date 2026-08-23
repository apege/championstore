"use client";

import React from "react";
import { CartItem, RobuxItem } from "@/types";
import { Zap, ArrowRight } from "lucide-react";

interface FloatingBottomBarProps {
  selectedItem: RobuxItem | null;
  cartItems: CartItem[];
  onCheckout: () => void;
}

export default function FloatingBottomBar({
  selectedItem,
  cartItems,
  onCheckout,
}: FloatingBottomBarProps) {
  // If cart has items, use cart totals. If cart is empty but an item is selected, use selectedItem.
  const hasCartItems = cartItems.length > 0;
  
  if (!hasCartItems && !selectedItem) return null;

  const totalRobux = hasCartItems
    ? cartItems.reduce((acc, ci) => acc + ci.item.amount * ci.quantity, 0)
    : selectedItem?.amount || 0;

  const totalPrice = hasCartItems
    ? cartItems.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0)
    : selectedItem?.price || 0;

  const totalItemCount = hasCartItems
    ? cartItems.reduce((acc, ci) => acc + ci.quantity, 0)
    : 1;

  return (
    <aside
      aria-label="Ringkasan Pesanan"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#080C14]/95 backdrop-blur-xl border-t border-slate-800/90 shadow-[0_-10px_35px_rgba(0,0,0,0.9)] py-3 px-4 sm:px-8 animate-in slide-in-from-bottom-4 duration-300"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
        {/* Top / Left Row: Total Pesanan Info */}
        <div className="flex items-center justify-between sm:justify-start sm:gap-6 min-w-0">
          <div>
            <div className="text-[11px] font-semibold text-slate-400">Total Pesanan</div>
            <div className="text-sm sm:text-base font-black text-white whitespace-nowrap">
              {totalRobux.toLocaleString("id-ID")} Robux
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-lg sm:text-2xl font-black text-red-500 whitespace-nowrap">
              Rp {totalPrice.toLocaleString("id-ID")}
            </div>
            <div className="px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-800/50 text-red-400 text-[11px] font-bold whitespace-nowrap">
              {totalItemCount} Item
            </div>
          </div>
        </div>

        {/* Action Button: Bayar Sekarang */}
        <button
          type="button"
          onClick={onCheckout}
          className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 px-6 sm:px-10 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-lg shadow-red-600/40 hover:shadow-red-600/60 hover:scale-[1.01] active:scale-[0.99] transition-all whitespace-nowrap"
        >
          <Zap className="w-4 h-4 fill-white text-white" />
          <span>Bayar Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
