"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  LogOut,
  X,
  Package,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  Tag,
  Store,
  MessageSquare,
  Users,
  ShieldAlert,
  Wallet,
  LayoutDashboard,
  ArrowUpRight,
  Loader2,
  ChevronRight,
} from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

interface OrderSearchResult {
  id: string;
  order_code: string;
  customer_username: string;
  total_robux: number;
  total_price: number;
  order_status: string;
  payment_method?: string;
  created_at: string;
}

const ADMIN_PAGES = [
  {
    title: "Order Masuk (Pending)",
    keywords: ["order", "masuk", "pending", "baru", "pesanan", "antrean", "qris"],
    href: "/admin/orders?tab=pending",
    category: "Order Management",
    icon: Inbox,
    badgeColor: "bg-amber-950/60 text-amber-400 border-amber-800/50",
  },
  {
    title: "Order Diproses",
    keywords: ["proses", "processing", "antrian", "kirim", "diproses"],
    href: "/admin/orders?tab=processing",
    category: "Order Management",
    icon: Clock,
    badgeColor: "bg-blue-950/60 text-blue-400 border-blue-800/50",
  },
  {
    title: "Order Selesai",
    keywords: ["selesai", "sukses", "completed", "done", "berhasil", "terkirim"],
    href: "/admin/orders?tab=completed",
    category: "Order Management",
    icon: CheckCircle2,
    badgeColor: "bg-emerald-950/60 text-emerald-400 border-emerald-800/50",
  },
  {
    title: "Order Dibatalkan",
    keywords: ["batal", "cancel", "cancelled", "tolak", "refund"],
    href: "/admin/orders?tab=cancelled",
    category: "Order Management",
    icon: XCircle,
    badgeColor: "bg-rose-950/60 text-rose-400 border-rose-800/50",
  },
  {
    title: "Pricelist & Paket Robux",
    keywords: ["price", "pricelist", "harga", "robux", "paket", "nominal", "tambah paket"],
    href: "/admin/pricelist",
    category: "Master Data",
    icon: Tag,
    badgeColor: "bg-purple-950/60 text-purple-400 border-purple-800/50",
  },
  {
    title: "Pengaturan Toko & Banner Promo",
    keywords: ["setting", "pengaturan", "toko", "banner", "hero", "promo", "qris", "logo", "wa", "whatsapp", "countdown"],
    href: "/admin/settings",
    category: "Konfigurasi",
    icon: Store,
    badgeColor: "bg-red-950/60 text-[#FF1F3D] border-red-800/50",
  },
  {
    title: "Ulasan & Testimoni Pelanggan",
    keywords: ["testi", "testimoni", "ulasan", "review", "bintang", "rating", "komentar"],
    href: "/admin/testimonials",
    category: "Interaksi",
    icon: MessageSquare,
    badgeColor: "bg-yellow-950/60 text-yellow-400 border-yellow-800/50",
  },
  {
    title: "Database Pelanggan",
    keywords: ["customer", "pelanggan", "user", "member", "riwayat", "pembeli"],
    href: "/admin/customers",
    category: "Master Data",
    icon: Users,
    badgeColor: "bg-cyan-950/60 text-cyan-400 border-cyan-800/50",
  },
  {
    title: "Blacklist Pelanggan",
    keywords: ["blacklist", "blokir", "banned", "spam", "penipu"],
    href: "/admin/blacklist",
    category: "Keamanan",
    icon: ShieldAlert,
    badgeColor: "bg-rose-950/60 text-rose-400 border-rose-800/50",
  },
  {
    title: "Metode Pembayaran",
    keywords: ["payment", "bayar", "pembayaran", "qris", "rekening", "bank", "ewallet"],
    href: "/admin/payments",
    category: "Keuangan",
    icon: Wallet,
    badgeColor: "bg-indigo-950/60 text-indigo-400 border-indigo-800/50",
  },
  {
    title: "Dashboard & Statistik Utama",
    keywords: ["dashboard", "home", "utama", "statistik", "omzet", "rekap", "grafik"],
    href: "/admin",
    category: "Utama",
    icon: LayoutDashboard,
    badgeColor: "bg-slate-900 text-slate-300 border-slate-700",
  },
];

export default function AdminHeader({
  onToggleSidebar,
  searchQuery,
  setSearchQuery,
}: AdminHeaderProps) {
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<OrderSearchResult[]>([]);

  // Filter matching navigation shortcuts
  const qLower = searchQuery.toLowerCase().trim();
  const matchedPages = ADMIN_PAGES.filter((page) => {
    if (!qLower) return false;
    if (page.title.toLowerCase().includes(qLower)) return true;
    return page.keywords.some((k) => k.includes(qLower) || qLower.includes(k));
  });

  // Debounced API order search
  useEffect(() => {
    if (!qLower) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/orders?search=${encodeURIComponent(qLower)}&limit=5`);
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.data)) {
          setOrders(data.data);
        }
      } catch (err) {
        console.warn("Autocomplete search failed:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }, 220);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [qLower]);

  // Handle outside click to close autocomplete
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPage = (href: string) => {
    setIsOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  const handleSelectOrder = (order: OrderSearchResult) => {
    setIsOpen(false);
    setSearchQuery(order.order_code || order.customer_username);
    router.push(`/admin/orders?search=${encodeURIComponent(order.order_code)}`);
  };

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari Admin Panel?")) {
      try {
        await fetch("/api/admin/auth", { method: "DELETE" });
      } catch (e) {
        console.warn("Logout err:", e);
      }
      window.location.href = "/";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-950/60 text-amber-400 border border-amber-800/40">
            Pending
          </span>
        );
      case "processing":
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-950/60 text-blue-400 border border-blue-800/40">
            Diproses
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            Selesai
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-950/60 text-rose-400 border border-rose-800/40">
            Batal
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  const hasResults = matchedPages.length > 0 || orders.length > 0;

  return (
    <header className="sticky top-0 z-30 w-full bg-[#080B11]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Autocomplete Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors lg:hidden shrink-0 cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Input with Live Autocomplete Dropdown */}
          <div ref={searchContainerRef} className="relative w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 text-[#FF1F3D] animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </div>
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setIsOpen(false);
                }}
                placeholder="Cari order, username, email, status..."
                className="w-full bg-[#0E131F]/90 text-sm text-slate-200 placeholder-slate-400 pl-10 pr-9 py-2 rounded-xl border border-slate-800 focus:border-[#FF1F3D]/80 focus:ring-1 focus:ring-[#FF1F3D]/50 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsOpen(false);
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* AUTOCOMPLETE DROPDOWN */}
            {isOpen && qLower && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#0B0F19]/98 border border-slate-800 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/60 no-scrollbar p-1.5 space-y-2">
                  {/* 1. Navigasi / Menu Pages Matching */}
                  {matchedPages.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-black tracking-wider uppercase text-slate-400 flex items-center justify-between">
                        <span>⚡ Menu &amp; Navigasi Cepat</span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          {matchedPages.length} ditemukan
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {matchedPages.map((page) => {
                          const IconComp = page.icon;
                          return (
                            <button
                              key={page.href}
                              type="button"
                              onClick={() => handleSelectPage(page.href)}
                              className="w-full px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 group-hover:text-[#FF1F3D] group-hover:border-red-500/40 transition-colors">
                                  <IconComp className="w-3.5 h-3.5" />
                                </div>
                                <div className="truncate">
                                  <div className="text-xs font-bold text-slate-200 group-hover:text-white">
                                    {page.title}
                                  </div>
                                  <div className="text-[10px] text-slate-500 truncate">
                                    {page.category} • Buka Halaman
                                  </div>
                                </div>
                              </div>
                              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#FF1F3D] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Order Transaksi Matching */}
                  {orders.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-black tracking-wider uppercase text-slate-400 flex items-center justify-between">
                        <span>📦 Data Order &amp; Transaksi</span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          {orders.length} order cocok
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {orders.map((ord) => (
                          <button
                            key={ord.order_code}
                            type="button"
                            onClick={() => handleSelectOrder(ord)}
                            className="w-full px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-800/80 transition-colors text-left group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/40 text-[#FF1F3D]">
                                <Package className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-black text-white group-hover:text-[#FF1F3D] transition-colors">
                                    {ord.order_code}
                                  </span>
                                  <span className="text-xs font-extrabold text-slate-300 truncate">
                                    @{ord.customer_username}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {Number(ord.total_robux).toLocaleString("id-ID")} Robux •{" "}
                                  <span className="text-slate-300 font-bold">
                                    Rp {Number(ord.total_price).toLocaleString("id-ID")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {getStatusBadge(ord.order_status)}
                              <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Empty State */}
                  {!hasResults && !isLoading && (
                    <div className="py-6 px-4 text-center">
                      <p className="text-xs font-bold text-slate-300">
                        Tidak ditemukan hasil untuk &quot;{searchQuery}&quot;
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Coba cari kode invoice (CS-...), username Roblox (@...), atau nama menu
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Tip */}
                <div className="px-3 py-2 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Tekan item untuk melihat detail transaksi</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[9px]">
                    ESC tutup
                  </kbd>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Admin Profile & Logout Button */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Admin Profile Details */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full overflow-hidden border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.3)] bg-slate-900">
              <Image
                src="/logo.png"
                alt="Admin Avatar"
                fill
                className="object-contain p-1"
                unoptimized
              />
            </div>

            <div className="text-left leading-tight hidden md:block">
              <div className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
                Admin ChampionStore
              </div>
              <div className="text-[11px] font-bold text-[#FF1F3D]">
                Super Admin
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="h-6 sm:h-7 w-px bg-slate-800 hidden sm:block" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl bg-red-950/20 hover:bg-red-950/50 border border-red-800/40 hover:border-red-600/60 text-[#FF1F3D] hover:text-red-400 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Keluar dari Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
