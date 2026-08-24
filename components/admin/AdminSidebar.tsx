"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
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
          badge: "24",
          badgeColor: "bg-[#DC2626] text-white",
        },
        {
          id: "order-diproses",
          label: "Order Diproses",
          icon: Clock,
          badge: "8",
          badgeColor: "bg-[#2563EB] text-white",
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
        <div className="px-4 py-4 sm:py-5 border-b border-slate-800/60 flex items-center justify-between">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center group transition-transform active:scale-95"
            title="Kembali ke Beranda Store"
          >
            <div className="relative h-20 sm:h-24 w-full max-w-[220px] flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="ChampionStore Logo"
                fill
                className="object-contain drop-shadow-[0_0_18px_rgba(239,68,68,0.4)] scale-110 sm:scale-115"
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
                            isActive ? "text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]" : "text-slate-400"
                          }`}
                        />
                        <span className="tracking-wide">
                          {item.label}
                        </span>
                      </div>

                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded-full ${item.badgeColor} shadow-sm animate-pulse`}
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
            <div className="flex items-start justify-between">
              <div className="space-y-1 pr-1">
                <h4 className="text-[11px] font-bold text-white flex items-center gap-1">
                  Butuh Bantuan?
                </h4>
                <p className="text-[10px] text-slate-300 leading-tight">
                  Tim <span className="text-red-400 font-semibold">ChampionStoreIDN</span> siap membantu kamu!
                </p>
                <div className="pt-1.5">
                  <a
                    href="https://wa.me/6281234567890?text=Halo%20Admin%20ChampionStore"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-[10px] font-bold rounded-lg transition-all shadow-[0_0_10px_rgba(239,68,68,0.4)] active:scale-95"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Chat Admin
                  </a>
                </div>
              </div>

              {/* Support Icon */}
              <div className="w-10 h-10 shrink-0 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center shadow-md">
                <MessageCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="mt-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-red-400 font-medium transition-colors"
            >
              Lihat Toko Publik <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
