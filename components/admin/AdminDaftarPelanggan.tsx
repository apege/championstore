"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  Search,
  ShieldAlert,
  MessageCircle,
  ExternalLink,
  Check,
  UserX,
  X,
} from "lucide-react";

export interface CustomerItem {
  id: string;
  username: string;
  robloxId: string;
  wa: string;
  totalOrders: number;
  totalSpent: string;
  isBlacklisted?: boolean;
}

interface AdminDaftarPelangganProps {
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function AdminDaftarPelanggan({
  onToast,
}: AdminDaftarPelangganProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmBlacklistTarget, setConfirmBlacklistTarget] =
    useState<CustomerItem | null>(null);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch("/api/customers");
      const json = await res.json();
      if (json.success && json.data) {
        const formatted: CustomerItem[] = json.data.map((c: any) => ({
          id: c.id,
          username: c.roblox_username,
          robloxId: c.roblox_id || "Belum terdata",
          wa: c.phone || "Belum terdata",
          totalOrders: c.total_orders || 0,
          totalSpent: `Rp ${Number(c.total_spent || 0).toLocaleString("id-ID")}`,
          isBlacklisted: c.is_blacklisted,
        }));
        setCustomers(formatted);
      }
    } catch (err) {
      console.warn("Failed to fetch customers:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCustomers(true);
    setIsRefreshing(false);
    onToast("Data pelanggan berhasil diperbarui dari database!", "success");
  };

  const handleBlacklistConfirm = async () => {
    if (!confirmBlacklistTarget) return;

    try {
      await fetch("/api/blacklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: confirmBlacklistTarget.username,
          phone: confirmBlacklistTarget.wa !== "Belum terdata" ? confirmBlacklistTarget.wa : null,
          reason: "Diblokir secara manual dari daftar pelanggan oleh Admin",
        }),
      });

      setCustomers((prev) =>
        prev.filter((c) => c.id !== confirmBlacklistTarget.id)
      );
      onToast(
        `Pelanggan @${confirmBlacklistTarget.username} berhasil dimasukkan ke daftar Blacklist!`,
        "info"
      );
    } catch {
      onToast("Gagal memblacklist user", "error");
    } finally {
      setConfirmBlacklistTarget(null);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.robloxId.includes(searchTerm) ||
      c.wa.includes(searchTerm)
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Title & Refresh Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Daftar Pelanggan
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kelola seluruh data akun pelanggan aktif dan riwayat belanja Robux
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all self-start sm:self-auto active:scale-95 shadow-sm cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 text-[#FF1F3D] ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Main Customers List Box */}
      <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 p-4 sm:p-6 space-y-4 shadow-xl">
        {/* Search & Counter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari username atau email pelanggan..."
              className="w-full bg-[#080C14] text-xs text-slate-200 pl-10 pr-4 py-2.5 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none focus:ring-1 focus:ring-[#FF1F3D] transition-all"
            />
          </div>

          <span className="text-xs font-semibold text-slate-400">
            Menampilkan {filteredCustomers.length} pelanggan
          </span>
        </div>

        {/* Customer Cards List */}
        <div className="space-y-3">
          {filteredCustomers.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Tidak ada pelanggan yang cocok dengan pencarian.
            </div>
          ) : (
            filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                className="group relative rounded-2xl bg-[#080C14] border border-slate-800/80 hover:border-slate-700 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 hover:shadow-lg"
              >
                {/* Left Side: Username & ID / WA Meta */}
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm sm:text-base text-[#FF1F3D] tracking-tight">
                    @{cust.username}
                  </h3>

                  <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 font-medium">
                    <span>
                      ID:{" "}
                      <span
                        className={
                          cust.robloxId !== "Belum terdata"
                            ? "text-slate-200 font-semibold"
                            : "italic text-slate-500"
                        }
                      >
                        {cust.robloxId}
                      </span>
                    </span>
                    <span>•</span>
                    <span>
                      WA:{" "}
                      <span
                        className={
                          cust.wa !== "Belum terdata"
                            ? "text-emerald-400 font-semibold"
                            : "italic text-slate-500"
                        }
                      >
                        {cust.wa}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Right Side: Total Orders, Total Spent, & Blacklist Button */}
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                  {/* Order stats */}
                  <div className="text-left md:text-right leading-tight">
                    <div className="text-xs font-bold text-white">
                      {cust.totalOrders} Pesanan
                    </div>
                    <div className="text-xs font-extrabold text-[#FF1F3D] mt-0.5">
                      Total: {cust.totalSpent}
                    </div>
                  </div>

                  {/* Blacklist Action Button */}
                  <button
                    onClick={() => setConfirmBlacklistTarget(cust)}
                    className="px-4 py-1.5 rounded-xl bg-red-950/20 hover:bg-red-950/60 border border-red-800/40 hover:border-red-600/60 text-[#FF1F3D] hover:text-red-400 text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    Blacklist
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: CONFIRM BLACKLIST DIALOG */}
      {/* ======================================================== */}
      {confirmBlacklistTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setConfirmBlacklistTarget(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="relative w-full max-w-sm rounded-3xl bg-[#0D121F] border border-slate-800 shadow-2xl p-6 text-center space-y-4 z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-600/60 text-red-500 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(239,68,68,0.4)]">
              <UserX className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-white">
                Blacklist @{confirmBlacklistTarget.username}?
              </h3>
              <p className="text-xs text-slate-400">
                Akun ini tidak akan dapat membuat order baru di ChampionStore.
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={() => setConfirmBlacklistTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                Batal
              </button>

              <button
                onClick={handleBlacklistConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-[0_0_12px_rgba(239,68,68,0.5)] transition-all"
              >
                Ya, Blacklist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
