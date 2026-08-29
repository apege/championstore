"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Store,
  Flame,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Save,
  Upload,
  Calendar,
  Trash2,
  RotateCcw,
  Eye,
  Check,
  Zap,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { compressToWebP } from "@/lib/compressToWebP";
import { formatWhatsAppUrl, formatWhatsAppNumber } from "@/data/pricelist";

interface AdminPengaturanTokoProps {
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function AdminPengaturanToko({
  onToast,
}: AdminPengaturanTokoProps) {
  // Collapse state for each section
  const [openSections, setOpenSections] = useState<{
    identity: boolean;
    promo: boolean;
    qris: boolean;
  }>({
    identity: true,
    promo: false,
    qris: false,
  });

  // Section 1: Store Identity & Contact
  const [storeName, setStoreName] = useState("ChampionStore");
  const [whatsappAdmin, setWhatsappAdmin] = useState("6285828378025");

  // Section 2: Promo Banner Settings
  const [isPromoActive, setIsPromoActive] = useState(true);
  const [promoTag, setPromoTag] = useState("PROMO SPESIAL BULAN INI");
  const [promoBadge, setPromoBadge] = useState("LIMITED STOCK");
  const [promoTitle, setPromoTitle] = useState("ROBUX BULAN INI");
  const [promoDesc, setPromoDesc] = useState(
    "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali"
  );
  const [promoNominal, setPromoNominal] = useState("2.200");
  const [promoOriginalPrice, setPromoOriginalPrice] = useState("2.000 Robux");
  const [promoPrice, setPromoPrice] = useState("45.000");
  const [promoDeadline, setPromoDeadline] = useState(
    "1 Oktober 2026 • 06:59 WIB"
  );
  const [promoDeadlineRaw, setPromoDeadlineRaw] = useState<string>("2026-10-01T06:59");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [bannerImage, setBannerImage] = useState<string>("/roblox_hero.jpg");

  // Custom Calendar state matching exact design in screenshot
  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const DAYS_OF_WEEK = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Date>(() => new Date(2026, 9, 1));
  const [viewYear, setViewYear] = useState<number>(() => 2026);
  const [viewMonth, setViewMonth] = useState<number>(() => 9); // October
  const [selectedHour, setSelectedHour] = useState<number>(6);
  const [selectedMinute, setSelectedMinute] = useState<number>(59);
  const [activePreset, setActivePreset] = useState<string | null>("Akhir Bulan");

  // Helper format Indonesian date
  const formatIndonesianDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = d.getDate();
      const month = MONTH_NAMES[d.getMonth()];
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${day} ${month} ${year} • ${hours}:${minutes} WIB`;
    } catch {
      return dateStr;
    }
  };

  const handleApplyPreset = (preset: string) => {
    setActivePreset(preset);
    const now = new Date();
    let target = new Date();
    if (preset === "+3 Hari") {
      target = new Date(now.getTime() + 3 * 86400 * 1000);
    } else if (preset === "+7 Hari") {
      target = new Date(now.getTime() + 7 * 86400 * 1000);
    } else if (preset === "+14 Hari") {
      target = new Date(now.getTime() + 14 * 86400 * 1000);
    } else if (preset === "Akhir Bulan") {
      target = new Date(viewYear, viewMonth + 1, 0);
    }
    setCalendarSelectedDate(target);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const getCalendarCells = (year: number, month: number) => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const cells: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      cells.push({
        day: d,
        isCurrentMonth: false,
        date: new Date(year, month - 1, d),
      });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      cells.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    // Next month padding to fill complete weeks (multiples of 7)
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      cells.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return cells;
  };

  const handleApplyCustomPromoTime = () => {
    const finalDate = new Date(
      calendarSelectedDate.getFullYear(),
      calendarSelectedDate.getMonth(),
      calendarSelectedDate.getDate(),
      selectedHour,
      selectedMinute
    );
    const day = finalDate.getDate();
    const month = MONTH_NAMES[finalDate.getMonth()];
    const year = finalDate.getFullYear();
    const hh = String(selectedHour).padStart(2, "0");
    const mm = String(selectedMinute).padStart(2, "0");
    const formatted = `${day} ${month} ${year} • ${hh}:${mm} WIB`;

    const iso = new Date(finalDate.getTime() - finalDate.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    setPromoDeadline(formatted);
    setPromoDeadlineRaw(iso);
    setIsDatePickerOpen(false);
    onToast(`Waktu berakhir promo diset ke: ${formatted}`, "success");
  };

  // Section 3: QRIS & Store Logo
  const [qrisImage, setQrisImage] = useState<string>("/qris.webp");
  const [storeLogoImage, setStoreLogoImage] = useState<string>("/logo.png");

  // Fetch settings from API
  React.useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/store");
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.storeName) setStoreName(json.data.storeName);
          if (json.data.whatsappNumber) setWhatsappAdmin(json.data.whatsappNumber);
          if (json.data.qrisImageUrl) setQrisImage(json.data.qrisImageUrl);
          if (json.data.logoImageUrl) setStoreLogoImage(json.data.logoImageUrl);
          if (json.data.bannerImageUrl) setBannerImage(json.data.bannerImageUrl);
          if (json.data.promoTag) setPromoTag(json.data.promoTag);
          if (json.data.promoBadge) setPromoBadge(json.data.promoBadge);
          if (json.data.promoTitle) setPromoTitle(json.data.promoTitle);
          if (json.data.promoSubtitle) setPromoDesc(json.data.promoSubtitle);
          if (json.data.promoRobuxAmount) setPromoNominal(Number(json.data.promoRobuxAmount).toLocaleString("id-ID"));
          if (json.data.promoOriginalLabel) setPromoOriginalPrice(json.data.promoOriginalLabel);
          if (json.data.promoDiscountPrice) setPromoPrice(Number(json.data.promoDiscountPrice).toLocaleString("id-ID"));
          if (json.data.promoActive !== undefined) setIsPromoActive(Boolean(json.data.promoActive));
          if (json.data.promoEndDate) {
            setPromoDeadlineRaw(json.data.promoEndDate);
            setPromoDeadline(formatIndonesianDate(json.data.promoEndDate));
          }
        }
      } catch (e) {
        console.warn("Failed to load store settings:", e);
      }
    }
    loadSettings();
  }, []);

  // Toggle all sections
  const isAllOpen =
    openSections.identity && openSections.promo && openSections.qris;

  const handleToggleAll = () => {
    const nextState = !isAllOpen;
    setOpenSections({
      identity: nextState,
      promo: nextState,
      qris: nextState,
    });
  };

  const handleToggleSection = (section: "identity" | "promo" | "qris") => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Image Upload with Automatic WebP Compression
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];
      try {
        const compressed = await compressToWebP(originalFile, 0.85, 1920);
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setBannerImage(reader.result as string);
            onToast("Banner promo berhasil diunggah (Terkompresi WebP)!", "success");
          }
        };
        reader.readAsDataURL(compressed);
      } catch (err) {
        console.warn("WebP compression error:", err);
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setBannerImage(reader.result as string);
            onToast("Banner promo berhasil diunggah!", "success");
          }
        };
        reader.readAsDataURL(originalFile);
      }
    }
  };

  const handleQrisUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];
      try {
        const compressed = await compressToWebP(originalFile, 0.9, 1200);
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setQrisImage(reader.result as string);
            onToast("Foto barcode QRIS berhasil diunggah (Terkompresi WebP)!", "success");
          }
        };
        reader.readAsDataURL(compressed);
      } catch (err) {
        console.warn("WebP compression error:", err);
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setQrisImage(reader.result as string);
            onToast("Foto barcode QRIS berhasil diunggah!", "success");
          }
        };
        reader.readAsDataURL(originalFile);
      }
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];
      try {
        const compressed = await compressToWebP(originalFile, 0.9, 800);
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setStoreLogoImage(reader.result as string);
            onToast("Logo navbar toko berhasil diunggah (Terkompresi WebP)!", "success");
          }
        };
        reader.readAsDataURL(compressed);
      } catch (err) {
        console.warn("WebP compression error:", err);
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setStoreLogoImage(reader.result as string);
            onToast("Logo navbar toko berhasil diunggah!", "success");
          }
        };
        reader.readAsDataURL(originalFile);
      }
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      setSavedSuccess(false);
      let cleanWa = whatsappAdmin.replace(/[^0-9]/g, "");
      if (cleanWa.startsWith("0")) cleanWa = "62" + cleanWa.slice(1);
      else if (cleanWa.startsWith("8")) cleanWa = "62" + cleanWa;
      else if (!cleanWa.startsWith("62") && cleanWa.length > 7) cleanWa = "62" + cleanWa;

      const res = await fetch("/api/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          whatsappNumber: cleanWa,
          qrisImageUrl: qrisImage,
          logoImageUrl: storeLogoImage,
          bannerImageUrl: bannerImage,
          promoActive: isPromoActive,
          promoTag,
          promoBadge,
          promoTitle,
          promoSubtitle: promoDesc,
          promoRobuxAmount: parseInt(promoNominal.replace(/[^0-9]/g, ""), 10) || 2200,
          promoOriginalLabel: promoOriginalPrice,
          promoDiscountPrice: parseInt(promoPrice.replace(/[^0-9]/g, ""), 10) || 45000,
          promoEndDate: promoDeadlineRaw || promoDeadline,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan");
      }
      setSavedSuccess(true);
      onToast("Perubahan pengaturan toko & banner berhasil disimpan ke database!", "success");
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan pengaturan";
      onToast(msg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Title Bar & Toggle All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Pengaturan Toko &amp; Banner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Konfigurasi identitas toko, nomor WhatsApp CS, barcode QRIS, dan
            banner promo pelanggan
          </p>
        </div>

        <button
          onClick={handleToggleAll}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all self-start sm:self-auto active:scale-95 shadow-sm cursor-pointer"
        >
          <span>{isAllOpen ? "Tutup Semua Section" : "Buka Semua Section"}</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* ======================================================== */}
        {/* SECTION 1: IDENTITAS TOKO & KONTAK */}
        {/* ======================================================== */}
        <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 shadow-xl overflow-hidden transition-all">
          {/* Header */}
          <div
            onClick={() => handleToggleSection("identity")}
            className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/40 transition-colors select-none"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-red-950/60 border border-red-800/50 text-[#FF1F3D] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,31,61,0.2)]">
                <Store className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wider">
                  IDENTITAS TOKO &amp; KONTAK
                </h2>
                <p className="text-xs text-slate-400 truncate">
                  Nama toko di navbar pelanggan dan nomor WhatsApp CS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden md:inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-slate-300 border border-slate-800">
                {storeName} • WA: {whatsappAdmin}
              </span>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400">
                {openSections.identity ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>

          {/* Form Body */}
          {openSections.identity && (
            <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-2 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 animate-in fade-in duration-150">
              {/* Field 1: Nama Toko */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Nama Toko (Navbar Pelanggan)
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="ChampionStore"
                  className="w-full bg-[#080C14] text-white font-medium text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none transition-all shadow-inner"
                />
                <p className="text-[11px] text-slate-500">
                  Tampil di navbar web utama ({storeName}).
                </p>
              </div>

              {/* Field 2: WhatsApp Admin CS */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">
                  Nomor WhatsApp Admin CS (Format 62...)
                </label>
                <input
                  type="text"
                  value={whatsappAdmin}
                  onChange={(e) => setWhatsappAdmin(e.target.value)}
                  placeholder="6285828378025"
                  className="w-full bg-[#080C14] text-white font-medium text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none transition-all shadow-inner"
                />
                <p className="text-[11px] text-slate-500">
                  Tujuan konfirmasi order dan tombol bantuan CS pelanggan.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: PENGATURAN PROMO BANNER WEB PELANGGAN */}
        {/* ======================================================== */}
        <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 shadow-xl overflow-hidden transition-all">
          {/* Header */}
          <div
            onClick={() => handleToggleSection("promo")}
            className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/40 transition-colors select-none"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-red-950/60 border border-red-800/50 text-[#FF1F3D] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,31,61,0.2)]">
                <Flame className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wider">
                  PENGATURAN PROMO BANNER WEB PELANGGAN
                </h2>
                <p className="text-xs text-slate-400 truncate">
                  Atur paket promo yang muncul pada banner hero bagian atas website toko
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden md:inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-950/40 text-red-400 border border-red-800/40">
                {isPromoActive
                  ? `Promo Aktif • ${promoNominal} Robux (Rp ${promoPrice})`
                  : "Promo Nonaktif"}
              </span>

              {/* Toggle Switch */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPromoActive(!isPromoActive);
                }}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                  isPromoActive ? "bg-[#FF1F3D]" : "bg-slate-800"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isPromoActive ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>

              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400">
                {openSections.promo ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>

          {/* Form Body */}
          {openSections.promo && (
            <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-2 border-t border-slate-800/60 space-y-5 animate-in fade-in duration-150">
              {/* Row 1: Promo Tag & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Promo Tag (Pill Kiri)
                  </label>
                  <input
                    type="text"
                    value={promoTag}
                    onChange={(e) => setPromoTag(e.target.value)}
                    placeholder="PROMO SPESIAL BULAN INI"
                    className="w-full bg-[#080C14] text-white text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Promo Badge (Tag Merah)
                  </label>
                  <input
                    type="text"
                    value={promoBadge}
                    onChange={(e) => setPromoBadge(e.target.value)}
                    placeholder="LIMITED STOCK"
                    className="w-full bg-[#080C14] text-white text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Judul & Subjudul */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Judul Promo Banner
                  </label>
                  <input
                    type="text"
                    value={promoTitle}
                    onChange={(e) => setPromoTitle(e.target.value)}
                    placeholder="ROBUX BULAN INI"
                    className="w-full bg-[#080C14] text-white text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Subjudul / Deskripsi Singkat
                  </label>
                  <input
                    type="text"
                    value={promoDesc}
                    onChange={(e) => setPromoDesc(e.target.value)}
                    placeholder="Top Up Robux Instant..."
                    className="w-full bg-[#080C14] text-white text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Nominal, Label Asli & Harga Promo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Nominal Robux Promo
                  </label>
                  <input
                    type="text"
                    value={promoNominal}
                    onChange={(e) => setPromoNominal(e.target.value)}
                    placeholder="2.200"
                    className="w-full bg-[#080C14] text-white text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Label Asli (Tercoret)
                  </label>
                  <input
                    type="text"
                    value={promoOriginalPrice}
                    onChange={(e) => setPromoOriginalPrice(e.target.value)}
                    placeholder="2.000 Robux"
                    className="w-full bg-[#080C14] text-white text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Harga Promo (Rp)
                  </label>
                  <input
                    type="text"
                    value={promoPrice}
                    onChange={(e) => setPromoPrice(e.target.value)}
                    placeholder="45.000"
                    className="w-full bg-[#080C14] text-white text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Waktu Berakhir Promo (Countdown Timer) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Waktu Berakhir Promo (Countdown Timer)
                </label>
                <div
                  onClick={() => setIsDatePickerOpen(true)}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-red-500/50 flex items-center justify-between gap-3 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-950/60 border border-red-800/50 text-[#FF1F3D] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs sm:text-sm text-white">
                        {promoDeadline}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Klik untuk mengatur tanggal &amp; jam hitung mundur
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDatePickerOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-[#FF1F3D] hover:text-red-300 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  >
                    UBAH
                  </button>
                </div>
              </div>

              {/* Row 5: Foto Background Banner Promo */}
              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#FF1F3D]" />
                    <span>Foto / Background Banner Promo (Hero Web Pelanggan)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload foto ilustrasi atau background banner promo yang akan muncul pada card promo di header website pelanggan
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Upload Box */}
                  <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-red-500/40 hover:border-red-500 rounded-2xl bg-red-950/10 cursor-pointer transition-all group text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-600/50 text-[#FF1F3D] flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(255,31,61,0.3)] group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-extrabold text-[#FF1F3D]">
                      Upload Foto Banner Promo
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Tarik banner ke sini atau klik browse (PNG / JPG / WEBP)
                    </span>
                  </label>

                  {/* Preview Box */}
                  <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-3 flex flex-col justify-between overflow-hidden">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-[#FF1F3D]" />
                        <span>Preview Foto Banner</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setBannerImage("/roblox_hero.jpg")}
                        className="text-red-400 hover:underline text-[10px] cursor-pointer"
                      >
                        Reset Default
                      </button>
                    </div>

                    <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-800 bg-[#080C14]">
                      <Image
                        src={bannerImage}
                        alt="Promo Banner Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 6: Live Preview Tampilan Banner Promo Pelanggan */}
              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <Eye className="w-3.5 h-3.5 text-[#FF1F3D]" />
                  <span>Preview Tampilan Banner Promo Pelanggan</span>
                </div>

                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1C0609] via-[#160A10] to-[#0D1222] border border-red-500/40 p-5 sm:p-6 shadow-2xl">
                  {/* Subtle Background Art */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <Image
                      src={bannerImage}
                      alt="Banner Background"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Tag, Title, Price */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-[10px] font-extrabold text-white">
                          {promoTag}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-[#FF1F3D] text-[10px] font-black text-white shadow-[0_0_8px_rgba(255,31,61,0.6)]">
                          {promoBadge}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                        {promoTitle}
                      </h3>

                      <div className="flex items-baseline gap-2.5 flex-wrap">
                        <span className="text-lg sm:text-xl font-black text-white">
                          {promoNominal} ROBUX
                        </span>
                        <span className="line-through text-xs text-slate-400 font-semibold">
                          {promoOriginalPrice}
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-[#FF1F3D] drop-shadow-[0_0_8px_rgba(255,31,61,0.6)]">
                          Rp {promoPrice}
                        </span>
                      </div>
                    </div>

                    {/* Right: Countdown Timer Box */}
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-red-600/40 shadow-inner shrink-0 text-center space-y-1.5">
                      <div className="text-[10px] font-black uppercase tracking-wider text-red-400 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>PROMO BERAKHIR DALAM</span>
                      </div>

                      <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-black">
                        <div className="px-2 py-1 bg-slate-900 rounded-lg border border-slate-800">
                          <div className="text-white">07</div>
                          <div className="text-[8px] text-slate-400">HARI</div>
                        </div>
                        <span className="text-slate-500">:</span>
                        <div className="px-2 py-1 bg-slate-900 rounded-lg border border-slate-800">
                          <div className="text-white">06</div>
                          <div className="text-[8px] text-slate-400">JAM</div>
                        </div>
                        <span className="text-slate-500">:</span>
                        <div className="px-2 py-1 bg-slate-900 rounded-lg border border-slate-800">
                          <div className="text-white">51</div>
                          <div className="text-[8px] text-slate-400">MNT</div>
                        </div>
                        <span className="text-slate-500">:</span>
                        <div className="px-2 py-1 bg-slate-900 rounded-lg border border-slate-800">
                          <div className="text-[#FF1F3D]">43</div>
                          <div className="text-[8px] text-slate-400">DTK</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* SECTION 3: BARCODE QRIS & LOGO TOKO */}
        {/* ======================================================== */}
        <div className="rounded-3xl bg-[#0B0F1A] border border-slate-800/80 shadow-xl overflow-hidden transition-all">
          {/* Header */}
          <div
            onClick={() => handleToggleSection("qris")}
            className="p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/40 transition-colors select-none"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-red-950/60 border border-red-800/50 text-[#FF1F3D] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,31,61,0.2)]">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wider">
                  BARCODE QRIS &amp; LOGO TOKO
                </h2>
                <p className="text-xs text-slate-400 truncate">
                  Barcode pembayaran QRIS otomatis dan logo storefront toko
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden md:inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-slate-300 border border-slate-800">
                QRIS: Terpasang • Logo: Terpasang
              </span>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400">
                {openSections.qris ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>

          {/* Form Body */}
          {openSections.qris && (
            <div className="px-5 pb-6 sm:px-6 sm:pb-7 pt-2 border-t border-slate-800/60 space-y-6 animate-in fade-in duration-150">
              {/* Part 1: QRIS Pembayaran */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#FF1F3D]" />
                    <span>Gambar QRIS Pembayaran</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload barcode QRIS toko untuk menerima pembayaran otomatis dari website
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Upload QRIS Box */}
                  <label className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-red-500/40 hover:border-red-500 rounded-2xl bg-red-950/10 cursor-pointer transition-all group text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrisUpload}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-600/50 text-[#FF1F3D] flex items-center justify-center mb-3 shadow-[0_0_12px_rgba(255,31,61,0.3)] group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-extrabold text-[#FF1F3D]">
                      Upload Barcode QRIS
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      Tarik gambar ke sini atau klik browse (PNG / JPG / WEBP)
                    </span>
                  </label>

                  {/* Live Preview QRIS Box */}
                  <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
                      <span className="flex items-center gap-1.5 text-white">
                        <Eye className="w-3.5 h-3.5 text-[#FF1F3D]" />
                        <span>Live Preview QRIS</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setQrisImage("/qris.webp")}
                        className="text-red-400 hover:underline text-xs cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Default</span>
                      </button>
                    </div>

                    <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#080C14] flex items-center justify-center p-2">
                      <Image
                        src={qrisImage}
                        alt="QRIS Preview"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Part 2: Logo Toko (Navbar Pelanggan) */}
              <div className="pt-6 border-t border-slate-800/60 space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#FF1F3D]" />
                    <span>Logo Toko (Navbar Pelanggan)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload logo bundar toko yang akan muncul di navbar storefront pelanggan
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Upload Logo Box */}
                  <label className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-red-500/40 hover:border-red-500 rounded-2xl bg-red-950/10 cursor-pointer transition-all group text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-600/50 text-[#FF1F3D] flex items-center justify-center mb-3 shadow-[0_0_12px_rgba(255,31,61,0.3)] group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-extrabold text-[#FF1F3D]">
                      Upload Logo Toko
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      Tarik logo ke sini atau klik browse (PNG / JPG / WEBP)
                    </span>
                  </label>

                  {/* Live Preview Logo Box */}
                  <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-3">
                      <span className="flex items-center gap-1.5 text-white">
                        <Eye className="w-3.5 h-3.5 text-[#FF1F3D]" />
                        <span>Live Preview Logo</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setStoreLogoImage("/logo.png")}
                        className="text-red-400 hover:underline text-xs cursor-pointer flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Default</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#080C14] border border-slate-800/80 my-auto">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border border-red-500/40 bg-slate-900 flex items-center justify-center shadow-[0_0_10px_rgba(255,31,61,0.3)] shrink-0">
                        <Image
                          src={storeLogoImage}
                          alt="Store Logo Preview"
                          fill
                          className="object-contain p-1"
                          unoptimized
                        />
                      </div>
                      <div className="leading-tight">
                        <div className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                          {storeName}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Tampil di Navbar Toko
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* BOTTOM ACTION BUTTON: SIMPAN SEMUA PENGATURAN */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Pengaturan berhasil disimpan ke database!</span>
          </div>
        )}

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-[#FF1F3D] to-red-600 hover:from-red-500 hover:to-[#FF1F3D] text-white text-sm font-extrabold shadow-[0_0_20px_rgba(255,31,61,0.6)] active:scale-95 transition-all cursor-pointer disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Menyimpan ke Supabase...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Simpan Semua Pengaturan</span>
            </>
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* MODAL: PENGATUR TANGGAL & JAM HITUNG MUNDUR PROMO */}
      {/* ======================================================== */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-[390px] bg-[#0B0F1A] border border-slate-800 text-white rounded-[32px] p-6 shadow-[0_0_50px_rgba(255,31,61,0.25)] space-y-4 animate-in zoom-in-95 duration-200">
            {/* Top Quick Presets Row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { label: "+3 Hari", id: "+3 Hari" },
                { label: "+7 Hari", id: "+7 Hari" },
                { label: "+14 Hari", id: "+14 Hari" },
                { label: "Akhir Bulan", id: "Akhir Bulan" },
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    activePreset === preset.id
                      ? "bg-gradient-to-r from-red-600 via-[#FF1F3D] to-red-600 text-white shadow-md shadow-red-600/40 border border-red-500"
                      : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-red-500/40 hover:bg-red-950/30"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Month & Year Header with Navigation Arrows */}
            <div className="flex items-center justify-between pt-1">
              <h3 className="text-lg font-black text-white tracking-tight">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="w-8 h-8 rounded-xl border border-slate-800 bg-slate-900/80 flex items-center justify-center text-blue-400 hover:bg-blue-950/50 hover:border-blue-500/40 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="w-8 h-8 rounded-xl border border-slate-800 bg-slate-900/80 flex items-center justify-center text-blue-400 hover:bg-blue-950/50 hover:border-blue-500/40 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {DAYS_OF_WEEK.map((day, idx) => (
                <div
                  key={day}
                  className={`text-xs font-black py-1 ${
                    idx === 0 ? "text-[#FF1F3D]" : "text-slate-400"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {getCalendarCells(viewYear, viewMonth).map((cell, index) => {
                const isSelected =
                  cell.isCurrentMonth &&
                  calendarSelectedDate.getDate() === cell.day &&
                  calendarSelectedDate.getMonth() === viewMonth &&
                  calendarSelectedDate.getFullYear() === viewYear;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setCalendarSelectedDate(cell.date);
                      setViewYear(cell.date.getFullYear());
                      setViewMonth(cell.date.getMonth());
                      setActivePreset(null);
                    }}
                    className={`h-9 w-9 mx-auto flex items-center justify-center text-xs font-extrabold rounded-2xl transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-red-600 via-[#FF1F3D] to-red-600 text-white shadow-lg shadow-red-600/50 border border-red-400 scale-105"
                        : cell.isCurrentMonth
                        ? "text-slate-200 hover:bg-blue-950/40 hover:text-blue-300 hover:border hover:border-blue-500/30"
                        : "text-slate-700 font-medium cursor-default"
                    }`}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-slate-800/80 pt-3" />

            {/* Time Configuration Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-[#FF1F3D] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF1F3D]" />
                  </div>
                  <span className="font-extrabold text-xs sm:text-sm text-white">
                    Atur Jam &amp; Menit Berakhir
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-red-950/70 border border-red-800/60 text-[#FF1F3D] font-mono font-black text-xs tracking-wider">
                  {String(selectedHour).padStart(2, "0")}:
                  {String(selectedMinute).padStart(2, "0")} WIB
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400">
                    Jam (00 - 23)
                  </label>
                  <select
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(Number(e.target.value))}
                    className="w-full bg-[#080C14] text-white border border-slate-800 focus:border-[#FF1F3D] rounded-2xl px-3 py-2 text-xs font-black focus:outline-none [color-scheme:dark]"
                  >
                    {Array.from({ length: 24 }).map((_, i) => (
                      <option key={i} value={i} className="bg-[#0B0F1A] text-white">
                        {String(i).padStart(2, "0")} : 00
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400">
                    Menit (00 - 59)
                  </label>
                  <select
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(Number(e.target.value))}
                    className="w-full bg-[#080C14] text-white border border-slate-800 focus:border-[#FF1F3D] rounded-2xl px-3 py-2 text-xs font-black focus:outline-none [color-scheme:dark]"
                  >
                    {Array.from({ length: 60 }).map((_, i) => (
                      <option key={i} value={i} className="bg-[#0B0F1A] text-white">
                        Menit {String(i).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDatePickerOpen(false)}
                className="py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 font-extrabold text-xs transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApplyCustomPromoTime}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-[#FF1F3D] to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Terapkan Waktu Promo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
