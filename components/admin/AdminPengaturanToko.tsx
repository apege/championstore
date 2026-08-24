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
  ExternalLink,
} from "lucide-react";

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
    "1 September 2026 • 06:59 WIB"
  );
  const [bannerImage, setBannerImage] = useState<string>("/roblox_hero.jpg");

  // Section 3: QRIS & Store Logo
  const [qrisImage, setQrisImage] = useState<string>("/qris.webp");
  const [storeLogoImage, setStoreLogoImage] = useState<string>("/logo.png");

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

  // Image Upload Simulations
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setBannerImage(reader.result as string);
          onToast("Banner promo berhasil diunggah!", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQrisUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setQrisImage(reader.result as string);
          onToast("Barcode QRIS baru berhasil diunggah!", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setStoreLogoImage(reader.result as string);
          onToast("Logo navbar toko berhasil diunggah!", "success");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = () => {
    onToast("Semua pengaturan toko & banner berhasil disimpan!", "success");
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
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-950/60 border border-red-800/50 text-[#FF1F3D] flex items-center justify-center">
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
                    onClick={() => onToast("Pengaturan tanggal dibuka", "info")}
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
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-[#FF1F3D] to-red-600 hover:from-red-500 hover:to-[#FF1F3D] text-white text-sm font-extrabold shadow-[0_0_20px_rgba(255,31,61,0.6)] active:scale-95 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Semua Pengaturan</span>
        </button>
      </div>
    </div>
  );
}
