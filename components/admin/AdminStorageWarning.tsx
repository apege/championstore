"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Download,
  Trash2,
  HardDrive,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  RefreshCw,
  Loader2,
  FileArchive,
  Info,
} from "lucide-react";

interface StorageWarningData {
  totalProofsCount: number;
  expiringSoonCount: number;
  expiredCount: number;
  shouldWarn: boolean;
  warningDays: number;
  retentionDays: number;
  oldestDaysRemaining: number | null;
  expiringSoonList: Array<{
    order_code: string;
    roblox_username: string;
    created_at: string;
    daysOld: number;
    daysRemaining: number;
    price: number;
    robux: number;
  }>;
  storageFreeLimit: string;
}

interface AdminStorageWarningProps {
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function AdminStorageWarning({ onToast }: AdminStorageWarningProps) {
  const [data, setData] = useState<StorageWarningData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchStorageStatus = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/storage", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.warn("Failed to check storage retention status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageStatus();
  }, []);

  const handleDownloadZip = async (scope: "expiring" | "all" = "expiring") => {
    try {
      setIsDownloading(true);
      onToast("Mempersiapkan arsip ZIP bukti transfer...", "info");
      
      const link = document.createElement("a");
      link.href = `/api/admin/storage?action=download-zip&scope=${scope}`;
      link.download = `bukti-transfer-championstore-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setIsDownloading(false);
        onToast("Arsip ZIP berhasil diunduh!", "success");
      }, 2000);
    } catch (err) {
      setIsDownloading(false);
      onToast("Gagal mengunduh ZIP bukti transfer", "error");
    }
  };

  const handlePurgeExpired = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus foto bukti transfer yang berusia lebih dari 90 hari dari Supabase Storage?"
      )
    ) {
      return;
    }

    try {
      setIsPurging(true);
      const res = await fetch("/api/admin/storage", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Gagal membersihkan");

      onToast(json.message || "Storage berhasil dibersihkan!", "success");
      await fetchStorageStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membersihkan storage";
      onToast(msg, "error");
    } finally {
      setIsPurging(false);
    }
  };

  if (!data) return null;

  // If there are no expiring or expired files, show minimal badge or nothing
  if (!data.shouldWarn) {
    return (
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0B0F19] border border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white">Retensi Storage 1GB: Normal &amp; Aman</span>
            <span className="text-[11px] text-slate-500 block">
              Foto bukti transfer otomatis dihapus setelah 90 hari • {data.totalProofsCount} bukti tersimpan • Testimoni permanen
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleDownloadZip("all")}
          disabled={isDownloading || data.totalProofsCount === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
        >
          <FileArchive className="w-3.5 h-3.5 text-blue-400" />
          <span>Cadangkan Semua (ZIP)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-gradient-to-r from-[#1C0F05] via-[#1A0B10] to-[#0D1222] border-2 border-amber-500/40 p-5 sm:p-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] space-y-4 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-500/60 text-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-amber-950/50">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                Peringatan Retensi Storage Supabase (Batas 1GB)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
                Pemberitahuan 7 Hari
              </span>
            </div>
            <p className="text-xs text-amber-200/80 mt-1 leading-relaxed max-w-2xl">
              Terdapat{" "}
              <strong className="text-white font-black underline">
                {data.expiringSoonCount} bukti transfer
              </strong>{" "}
              yang telah berusia 83+ hari dan akan{" "}
              <strong className="text-amber-300 font-bold">
                otomatis dihapus dalam {data.oldestDaysRemaining ?? 7} hari
              </strong>{" "}
              (kebijakan batas retensi 90 hari). Harap unduh cadangan ZIP sebelum file dihapus otomatis.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Download ZIP button */}
          <button
            type="button"
            onClick={() => handleDownloadZip("expiring")}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            )}
            <span>Unduh Bukti 83+ Hari (ZIP)</span>
          </button>

          {/* Purge button if expired items exist */}
          {data.expiredCount > 0 && (
            <button
              type="button"
              onClick={handlePurgeExpired}
              disabled={isPurging}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 hover:text-white font-bold text-xs transition-all active:scale-95 cursor-pointer disabled:opacity-60"
            >
              {isPurging ? (
                <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
              ) : (
                <Trash2 className="w-4 h-4 text-rose-400" />
              )}
              <span>Bersihkan &gt;90 Hari ({data.expiredCount})</span>
            </button>
          )}

          {/* Expand Toggle */}
          {data.expiringSoonList.length > 0 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Lihat Daftar Order"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Accordion Detail Table of Expiring Proofs */}
      {isExpanded && data.expiringSoonList.length > 0 && (
        <div className="pt-3 border-t border-slate-800/80 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
            <span>Daftar Bukti Transfer Mendekati Batas 90 Hari:</span>
            <span className="text-[11px] text-slate-500">
              Total {data.expiringSoonList.length} transaksi
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto rounded-2xl border border-slate-800/80 bg-[#080C14] divide-y divide-slate-800/60 no-scrollbar">
            {data.expiringSoonList.map((item) => (
              <div
                key={item.order_code}
                className="p-3 flex items-center justify-between gap-3 hover:bg-slate-900/50 transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono font-extrabold text-white">
                    {item.order_code}
                  </span>
                  <span className="text-slate-400 font-bold truncate">
                    @{item.roblox_username}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    • Rp {Number(item.price).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-slate-400">
                    Usia: <strong>{item.daysOld} hari</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-950/80 border border-amber-800/60 text-amber-300 font-extrabold text-[10px]">
                    Sisa {item.daysRemaining} hari
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info Notice */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-800/40">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Foto ulasan &amp; testimoni pelanggan bersifat permanen (hanya dihapus manual oleh admin).</span>
        </div>
        <button
          type="button"
          onClick={() => handleDownloadZip("all")}
          className="text-blue-400 hover:underline font-bold text-left cursor-pointer"
        >
          Cadangkan Seluruh Bukti Transfer ({data.totalProofsCount} File) &rarr;
        </button>
      </div>
    </div>
  );
}
