"use client";

import React, { useState } from "react";
import AdminOrderMasuk from "./AdminOrderMasuk";
import AdminPricelist from "./AdminPricelist";
import AdminDaftarPelanggan from "./AdminDaftarPelanggan";
import AdminBlacklist from "./AdminBlacklist";
import AdminRiwayatPembayaran from "./AdminRiwayatPembayaran";
import AdminPengaturanToko from "./AdminPengaturanToko";
import {
  Package,
  Users,
  ShieldAlert,
  Wallet,
  BarChart3,
  Search,
  Filter,
  Eye,
  Check,
  Zap,
} from "lucide-react";

interface AdminTabViewsProps {
  activeTab: string;
  onActivateIdOrder: () => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function AdminTabViews({
  activeTab,
  onActivateIdOrder,
  onToast,
}: AdminTabViewsProps) {
  // 1. Order Management Tabs
  if (
    activeTab === "order-masuk" ||
    activeTab === "order-diproses" ||
    activeTab === "order-selesai" ||
    activeTab === "order-dibatalkan"
  ) {
    return (
      <AdminOrderMasuk
        tabType={
          activeTab as
            | "order-masuk"
            | "order-diproses"
            | "order-selesai"
            | "order-dibatalkan"
        }
        onToast={onToast}
      />
    );
  }

  // 2. Pricelist Robux Tab
  if (activeTab === "pricelist") {
    return <AdminPricelist onToast={onToast} />;
  }

  // 3. Daftar Pelanggan Tab
  if (activeTab === "daftar-pelanggan") {
    return <AdminDaftarPelanggan onToast={onToast} />;
  }

  // 4. Blacklist Tab
  if (activeTab === "blacklist") {
    return <AdminBlacklist onToast={onToast} />;
  }

  // 5. Riwayat Pembayaran Tab
  if (activeTab === "riwayat-pembayaran" || activeTab === "riwayat-keuangan") {
    return <AdminRiwayatPembayaran onToast={onToast} />;
  }

  // 6. Pengaturan Toko & Banner Tab
  if (activeTab === "pengaturan-toko" || activeTab === "pengaturan-akun") {
    return <AdminPengaturanToko onToast={onToast} />;
  }

  const [searchTerm, setSearchTerm] = useState("");

  const sampleProducts = [
    { id: "P-01", name: "800 Robux", price: "Rp 105.000", stock: 1200, status: "Tersedia" },
    { id: "P-02", name: "1.200 Robux", price: "Rp 155.000", stock: 950, status: "Tersedia" },
    { id: "P-03", name: "1.700 Robux", price: "Rp 215.000", stock: 800, status: "Tersedia" },
    { id: "P-04", name: "2.200 Robux", price: "Rp 275.000", stock: 650, status: "Tersedia" },
    { id: "P-05", name: "3.200 Robux", price: "Rp 395.000", stock: 400, status: "Tersedia" },
    { id: "P-06", name: "5.600 Robux", price: "Rp 695.000", stock: 250, status: "Tersedia" },
    { id: "P-07", name: "10.000 Robux", price: "Rp 1.190.000", stock: 120, status: "Tersedia" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0B0F19] p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white capitalize tracking-tight">
            {activeTab.replace("-", " ")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manajemen dan kontrol data {activeTab.replace("-", " ")} ChampionStore
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter data..."
              className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#080C14] text-white rounded-2xl border border-slate-800 focus:outline-none focus:border-[#FF1F3D]"
            />
          </div>
          <button className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Other Data Table */}
      <div className="overflow-hidden rounded-3xl bg-[#0B0F19] border border-slate-800/80 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E1422] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-5 font-bold">Kode</th>
                <th className="py-4 px-5 font-bold">Nama</th>
                <th className="py-4 px-5 font-bold">Detail</th>
                <th className="py-4 px-5 font-bold">Status</th>
                <th className="py-4 px-5 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {sampleProducts.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-900/50 transition-colors"
                >
                  <td className="py-4 px-5 font-mono font-bold text-slate-400">
                    {item.id}
                  </td>
                  <td className="py-4 px-5 font-extrabold text-white">
                    {item.name}
                  </td>
                  <td className="py-4 px-5 font-bold text-[#FF1F3D]">
                    {item.price}
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold border bg-emerald-950/60 text-emerald-400 border-emerald-800/60">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-center">
                    <button
                      onClick={() =>
                        onToast(`Detail item ${item.name} dibuka`, "info")
                      }
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white mx-auto inline-flex transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
