"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  PlusCircle,
  Tag,
  Users,
  ShieldAlert,
  Wallet,
  BarChart3,
  Store,
  UserCog,
  MessageCircle,
  MessageSquare,
  X,
  ExternalLink,
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const [stats, setStats] = useState({
    pendingOrders: 0,
    processingOrders: 0,
  });

  const loadBadgeStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (json.success && json.data) {
        setStats({
          pendingOrders: Number(json.data.pendingOrders) || 0,
          processingOrders: Number(json.data.processingOrders) || 0,
        });
      }
    } catch (err) {
      console.warn("Failed to load badge stats:", err);
    }
  };

  useEffect(() => {
    // 1. Initial Load
    loadBadgeStats();

    // 2. Real-time Supabase Table Subscription
    const channel = supabase
      .channel("admin-sidebar-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          loadBadgeStats();
        }
      )
      .subscribe();

    // 3. Custom Window Event (fires instantly on status changes)
    const handleCustomUpdate = () => {
      loadBadgeStats();
    };
    window.addEventListener("champion-orders-updated", handleCustomUpdate);

    // 4. Window Focus / Visibility Change (instant refresh on tab return)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        loadBadgeStats();
      }
    };
    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleCustomUpdate);

    // 5. Fast background polling fallback (2.5s)
    const interval = setInterval(loadBadgeStats, 2500);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("champion-orders-updated", handleCustomUpdate);
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleCustomUpdate);
      clearInterval(interval);
    };
  }, []);

  const menuSections = [
    {
      title: null,
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          badge: null,
          badgeColor: "",
        },
      ],
    },
    {
      title: "ORDER MANAGEMENT",
      items: [
        {
          id: "order-masuk",
          label: "Order Masuk",
          icon: Inbox,
          badge: stats.pendingOrders > 0 ? String(stats.pendingOrders) : null,
          badgeColor: "bg-[#FF1F3D] text-white shadow-[0_0_10px_rgba(255,31,61,0.6)]",
        },
        {
          id: "order-diproses",
          label: "Order Diproses",
          icon: Clock,
          badge: stats.processingOrders > 0 ? String(stats.processingOrders) : null,
          badgeColor: "bg-[#2563EB] text-white shadow-[0_0_10px_rgba(37,99,235,0.6)]",
        },
        {
          id: "order-selesai",
          label: "Order Selesai",
          icon: CheckCircle2,
          badge: null,
          badgeColor: "",
        },
        {
          id: "order-dibatalkan",
          label: "Order Dibatalkan",
          icon: XCircle,
          badge: null,
          badgeColor: "",
        },
      ],
    },
    {
      title: "PRICELIST",
      items: [
        {
          id: "pricelist",
          label: "Pricelist Robux",
          icon: Tag,
          badge: null,
          badgeColor: "",
        },
      ],
    },
    {
      title: "PELANGGAN",
      items: [
        {
          id: "daftar-pelanggan",
          label: "Daftar Pelanggan",
          icon: Users,
          badge: null,
          badgeColor: "",
        },
        {
          id: "blacklist",
          label: "Blacklist",
          icon: ShieldAlert,
          badge: null,
          badgeColor: "",
        },
      ],
    },
    {
      title: "KONTEN & ULASAN",
      items: [
        {
          id: "testimonials",
          label: "Kelola Testimoni",
          icon: MessageSquare,
          badge: null,
          badgeColor: "",
        },
      ],
    },
    {
      title: "KEUANGAN",
      items: [
        {
          id: "riwayat-pembayaran",
          label: "Riwayat Pembayaran",
          icon: Wallet,
          badge: null,
          badgeColor: "",
        },
      ],
    },
    {
      title: "PENGATURAN",
      items: [
        {
          id: "pengaturan-toko",
          label: "Pengaturan Toko",
          icon: Store,
          badge: null,
          badgeColor: "",
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#080B11] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Full Logo Header */}
        <div className="h-28 sm:h-32 px-4 flex items-center justify-between border-b border-slate-800/80 bg-[#070A10]/80">
          <Link
            href="/admin"
            className="w-full flex items-center justify-center group py-2"
          >
            <div className="relative h-20 sm:h-24 w-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <Image
                src="/logo.png"
                alt="ChampionStore Logo"
                width={200}
                height={90}
                className="h-full w-auto object-contain drop-shadow-[0_0_16px_rgba(255,31,61,0.5)] scale-110 sm:scale-115"
                priority
                unoptimized
              />
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 lg:hidden cursor-pointer shrink-0 ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1.5 mt-2">
                  {section.title}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                        isActive
                          ? "text-white bg-gradient-to-r from-red-950/80 via-red-900/30 to-slate-900/50 border border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/40 border border-transparent"
                      }`}
                    >
                      {/* Active Left Indicator Pill */}
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-red-500 rounded-r shadow-[0_0_8px_#ef4444]" />
                      )}

                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                            isActive
                              ? "text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]"
                              : "text-slate-400"
                          }`}
                        />
                        <span className="tracking-wide">{item.label}</span>
                      </div>

                      {/* Realtime Circular Pill Badge */}
                      {item.badge && (
                        <span
                          key={item.badge}
                          className={`w-5 h-5 min-w-[20px] rounded-full flex items-center justify-center text-[10px] font-black leading-none ${item.badgeColor} transition-transform animate-in zoom-in duration-150`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Help Widget Card */}
        <div className="p-3 border-t border-slate-800/80 bg-[#070A10]/95">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-950/30 via-slate-900/80 to-slate-950 border border-red-900/30 p-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">Butuh Bantuan?</h4>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Tim ChampionStore siap membantu kamu!
                </p>
              </div>
            </div>
            <a
              href="https://wa.me/6285828378025"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 w-full py-1.5 px-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 hover:border-red-500 rounded-xl text-[11px] font-bold text-red-300 hover:text-white flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat Admin</span>
            </a>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1 font-medium">
            <a
              href="/"
              target="_blank"
              className="hover:text-slate-200 transition-colors flex items-center gap-1"
            >
              <span>Lihat Toko Publik</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="text-slate-400 font-bold">ChampionStore v2.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
