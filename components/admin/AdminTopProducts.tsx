"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Crown, ChevronRight, Loader2 } from "lucide-react";

interface TopProductItem {
  id: string | number;
  rank: number;
  rankBg: string;
  name: string;
  sold: number;
  price: string;
}

interface AdminTopProductsProps {
  onViewAll?: () => void;
}

export default function AdminTopProducts({
  onViewAll,
}: AdminTopProductsProps) {
  const [topProducts, setTopProducts] = useState<TopProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopProducts() {
      try {
        setLoading(true);
        // Fetch products and orders
        const [prodRes, ordRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/orders"),
        ]);

        const prodJson = await prodRes.json();
        const ordJson = await ordRes.json();

        const products: any[] = prodJson.success && prodJson.data ? prodJson.data : [];
        const orders: any[] = ordJson.success && ordJson.data ? ordJson.data : [];

        // Count sales per product/amount from completed or active orders
        const salesCount: Record<number, number> = {};
        orders.forEach((o: any) => {
          const amt = Number(o.total_robux) || 0;
          if (amt > 0) {
            salesCount[amt] = (salesCount[amt] || 0) + 1;
          }
        });

        // Map and sort products by real sold count
        const rankStyles = [
          "bg-gradient-to-br from-amber-400 to-amber-600 text-black border-amber-300 shadow-[0_0_8px_#f59e0b]",
          "bg-gradient-to-br from-slate-300 to-slate-400 text-black border-slate-200 shadow-[0_0_8px_#94a3b8]",
          "bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100 border-amber-600 shadow-[0_0_8px_#b45309]",
          "bg-gradient-to-br from-slate-700 to-slate-800 text-slate-300 border-slate-600",
        ];

        const mapped: TopProductItem[] = products
          .map((p: any) => {
            const amountNum = Number(p.amount) || Number(p.robux) || 0;
            return {
              id: p.id,
              name: `${amountNum.toLocaleString("id-ID")} Robux`,
              sold: salesCount[amountNum] || 0,
              price: `Rp ${Number(p.price || 0).toLocaleString("id-ID")}`,
              amountNum,
            };
          })
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 4)
          .map((item, idx) => ({
            id: item.id,
            rank: idx + 1,
            rankBg: rankStyles[idx] || rankStyles[3],
            name: item.name,
            sold: item.sold,
            price: item.price,
          }));

        setTopProducts(mapped);
      } catch (err) {
        console.warn("Failed to load top products:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTopProducts();
  }, []);

  return (
    <div className="rounded-3xl bg-[#0B0F19] border border-slate-800/80 p-5 sm:p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-950/50 border border-red-800/50 flex items-center justify-center text-red-500">
            <Crown className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm sm:text-base text-white tracking-wide">
            Produk Terlaris
          </h3>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Lihat Semua</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="py-8 flex justify-center items-center gap-2 text-slate-400 text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-[#FF1F3D]" />
          <span>Memuat data produk...</span>
        </div>
      ) : topProducts.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          Belum ada produk di database
        </div>
      ) : (
        /* 4 Product Cards Grid */
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {topProducts.map((product) => (
            <div
              key={product.id}
              className="relative rounded-2xl bg-gradient-to-b from-[#131926] to-[#0D121F] border border-slate-800 hover:border-red-500/50 p-3.5 flex flex-col items-center text-center group transition-all duration-200 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              {/* Robux Icon Image */}
              <div className="relative w-12 h-12 mb-2 group-hover:scale-110 transition-transform">
                <Image
                  src="/robux.webp"
                  alt="Robux Icon"
                  fill
                  className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                  unoptimized
                />
              </div>

              {/* Product Title */}
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">
                {product.name}
              </h4>

              {/* Sold Count */}
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Terjual:{" "}
                <span className="text-slate-200 font-semibold">{product.sold}</span>
              </p>

              {/* Price */}
              <p className="text-[10px] text-red-400 font-bold mt-0.5">
                {product.price}
              </p>

              {/* Rank Badge at Bottom */}
              <div className="mt-2.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${product.rankBg}`}
                >
                  #{product.rank}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
