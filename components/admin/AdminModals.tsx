"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Lock,
  Edit3,
  BookOpen,
  PlusCircle,
  Package,
  History,
  ShieldCheck,
  Check,
  Loader2,
  Trash2,
} from "lucide-react";

interface AdminModalsProps {
  activeModal: string | null;
  onClose: () => void;
  adminNote: string;
  setAdminNote: (note: string) => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
  targetUsername?: string;
}

export default function AdminModals({
  activeModal,
  onClose,
  adminNote,
  setAdminNote,
  onToast,
  targetUsername = "PinkQueen_23",
}: AdminModalsProps) {
  // States for activation modal
  const [isActivating, setIsActivating] = useState(false);
  const [tempNote, setTempNote] = useState(adminNote);

  // States for tambah produk
  const [newRobux, setNewRobux] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("1000");

  // States for All Activities
  const [allLogs, setAllLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  React.useEffect(() => {
    if (activeModal === "edit-notes") {
      setTempNote(adminNote);
    }
  }, [activeModal, adminNote]);

  React.useEffect(() => {
    if (activeModal === "all-activities") {
      setLogsLoading(true);
      fetch("/api/admin/logs?limit=50")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            setAllLogs(json.data);
          }
        })
        .catch((err) => console.warn("Failed to load all logs:", err))
        .finally(() => setLogsLoading(false));
    }
  }, [activeModal]);

  if (!activeModal) return null;

  const handleActivateId = () => {
    onClose();
    onToast(`ID Roblox @${targetUsername} berhasil diaktifkan di sistem!`, "success");
  };

  const handleSaveNote = async () => {
    setAdminNote(tempNote);
    try {
      const res = await fetch("/api/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote: tempNote }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan catatan");
      }
      onToast("Catatan admin berhasil disimpan ke database!", "success");
      window.dispatchEvent(new CustomEvent("champion-store-updated"));
    } catch {
      onToast("Catatan diperbarui di tampilan lokal", "info");
    }
    onClose();
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRobux || !newPrice) {
      onToast("Mohon lengkapi nominal dan harga!", "error");
      return;
    }

    const robuxNum = parseInt(newRobux.replace(/[^0-9]/g, ""), 10) || 0;
    const priceNum = parseInt(newPrice.replace(/[^0-9]/g, ""), 10) || 0;

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: robuxNum,
          price: priceNum,
          category: robuxNum >= 5000 ? "sultan" : robuxNum === 2200 ? "promo" : "popular",
          stock: parseInt(newStock, 10) || 999,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menambah produk");
      }
      onToast(`Produk ${robuxNum.toLocaleString("id-ID")} Robux berhasil disimpan ke database!`, "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menambah produk";
      onToast(msg, "error");
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0D121F] border border-slate-800 shadow-2xl p-4 sm:p-6 z-10 animate-in fade-in zoom-in-95 duration-200 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. Modal: Aktifkan ID Roblox */}
        {activeModal === "activate-id" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-600/60 text-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                <Zap className="w-5 h-5 fill-red-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">
                  Aktivasi ID Roblox Order
                </h3>
                <p className="text-xs text-slate-400">Order #CLX25051892</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">Username Target:</span>
                <span className="font-bold text-[#FF1F3D]">@{targetUsername}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">Paket Robux:</span>
                <span className="font-bold text-red-400">2200 Robux</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">Biaya Pengaktifan:</span>
                <span className="font-extrabold text-red-500 text-sm">Rp 97.000</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Status Server:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Menunggu Pengaktifan
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-red-950/30 border border-red-900/50 flex items-start gap-2.5 text-xs text-red-200">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p>
                Sistem akan memvalidasi koneksi API akun Roblox dan membuka akses order otomatis.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleActivateId}
                disabled={isActivating}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-xs font-black text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-2"
              >
                {isActivating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Konfirmasi Aktivasi</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 2. Modal: Batalkan Order */}
        {activeModal === "cancel-order" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800 text-red-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">
                  Batalkan Order
                </h3>
                <p className="text-xs text-slate-400">Order #CLX25051892</p>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Apakah kamu yakin ingin membatalkan order ini? Status order akan diubah menjadi <strong className="text-red-400">Dibatalkan</strong>.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">Alasan Pembatalan:</label>
              <select className="w-full bg-slate-900 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-red-500">
                <option>ID Roblox tidak valid / dibatasi oleh Roblox</option>
                <option>Pembayaran tidak diverifikasi dalam 24 jam</option>
                <option>Permintaan pembatalan dari customer</option>
                <option>Stok Robux sedang restock</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={() => {
                  onClose();
                  onToast("Order berhasil dibatalkan!", "info");
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-black text-white shadow-lg transition-colors"
              >
                Ya, Batalkan Order
              </button>
            </div>
          </div>
        )}

        {/* 3. Modal: Edit Catatan Admin */}
        {activeModal === "edit-notes" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800 text-red-400 flex items-center justify-center">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">
                  Edit Catatan Admin
                </h3>
                <p className="text-xs text-slate-400">Catatan internal tim operasional</p>
              </div>
            </div>

            <textarea
              rows={4}
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              className="w-full bg-slate-900/90 text-slate-200 text-xs p-3.5 rounded-2xl border border-slate-800 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 leading-relaxed"
              placeholder="Tulis catatan penting disini..."
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNote}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        )}

        {/* 4. Modal: Panduan Admin */}
        {activeModal === "read-guide" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800 text-blue-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">
                  Panduan Operasional Admin
                </h3>
                <p className="text-xs text-slate-400">SOP Pemrosesan Order ChampionStore</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 max-h-72 overflow-y-auto pr-1">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">1</span>
                  Verifikasi Pembayaran
                </h4>
                <p className="text-slate-400 pl-5">
                  Cek kesesuaian nominal transfer atau status gateway otomatis sebelum memproses order.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">2</span>
                  Status ID Roblox
                </h4>
                <p className="text-slate-400 pl-5">
                  Jika muncul peringatan "ID Roblox Belum Aktif", pastikan verifikasi biaya aktivasi terkonfirmasi sebelum di-push ke server Roblox.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">3</span>
                  Penyelesaian & Notifikasi WA
                </h4>
                <p className="text-slate-400 pl-5">
                  Setelah Robux terkirim, status diubah menjadi Selesai. Sistem akan otomatis kirim bukti ke WhatsApp customer.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white"
            >
              Saya Mengerti
            </button>
          </div>
        )}

        {/* 5. Modal: Tambah Produk */}
        {activeModal === "tambah-produk" && (
          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800 text-red-400 flex items-center justify-center">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">
                  Tambah Produk Robux
                </h3>
                <p className="text-xs text-slate-400">Buat paket Robux baru di katalog</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nominal Robux (cth: 5000 Robux)
                </label>
                <input
                  type="text"
                  value={newRobux}
                  onChange={(e) => setNewRobux(e.target.value)}
                  placeholder="5000 Robux"
                  className="w-full bg-slate-900 text-xs text-white p-3 rounded-xl border border-slate-800 focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Harga Jual (Rp)
                </label>
                <input
                  type="text"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="620.000"
                  className="w-full bg-slate-900 text-xs text-white p-3 rounded-xl border border-slate-800 focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Stok Tersedia
                </label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full bg-slate-900 text-xs text-white p-3 rounded-xl border border-slate-800 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-lg"
              >
                Simpan Produk
              </button>
            </div>
          </form>
        )}

        {/* 6. Modal: Lihat Semua Aktivitas */}
        {activeModal === "all-activities" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800 text-red-400 flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">
                  Semua Log Aktivitas
                </h3>
                <p className="text-xs text-slate-400">Riwayat audit & aktivitas admin</p>
              </div>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 text-xs scrollbar-thin scrollbar-thumb-slate-800">
              {logsLoading ? (
                <div className="py-10 text-center text-slate-400 flex flex-col items-center gap-2">
                  <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
                  <span>Memuat log aktivitas...</span>
                </div>
              ) : allLogs.length === 0 ? (
                <div className="py-10 text-center text-slate-500">
                  Belum ada catatan log aktivitas tersimpan.
                </div>
              ) : (
                allLogs.map((item) => {
                  const createdAt = new Date(item.created_at || Date.now());
                  const timeFormatted = createdAt.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  let tagLabel = "System";
                  let tagBg = "bg-slate-800 text-slate-300";
                  if (item.type === "order") {
                    tagLabel = "Order";
                    tagBg = "bg-amber-950/60 text-amber-400 border border-amber-800/40";
                  } else if (item.type === "processing") {
                    tagLabel = "Proses";
                    tagBg = "bg-blue-950/60 text-blue-400 border border-blue-800/40";
                  } else if (item.type === "success") {
                    tagLabel = "Sukses";
                    tagBg = "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40";
                  } else if (item.type === "cancelled" || item.type === "blacklist") {
                    tagLabel = item.type === "blacklist" ? "Blacklist" : "Batal";
                    tagBg = "bg-red-950/60 text-red-400 border border-red-800/40";
                  } else if (item.type === "review") {
                    tagLabel = "Testimoni";
                    tagBg = "bg-purple-950/60 text-purple-400 border border-purple-800/40";
                  } else if (item.type === "product") {
                    tagLabel = "Katalog";
                    tagBg = "bg-cyan-950/60 text-cyan-400 border border-cyan-800/40";
                  }

                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <p className="text-slate-200 font-semibold text-xs leading-snug">
                          {item.details || item.action}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{timeFormatted}</span>
                          {item.user_target && (
                            <>
                              <span>•</span>
                              <span className="text-[#FF1F3D] font-bold">
                                @{item.user_target}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md shrink-0 ${tagBg}`}
                      >
                        {tagLabel}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
