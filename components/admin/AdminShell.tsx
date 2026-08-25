"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminModals from "@/components/admin/AdminModals";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Lock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";

interface AdminShellProps {
  children: (helpers: {
    showToast: (msg: string, type?: "success" | "error" | "info") => void;
    openModal: (modalName: string, payload?: any) => void;
  }) => React.ReactNode;
  activeTabOverride?: string;
}

export default function AdminShell({
  children,
  activeTabOverride,
}: AdminShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedActivationUsername, setSelectedActivationUsername] =
    useState<string>("PinkQueen_23");
  const [adminNote, setAdminNote] = useState<string>(
    "Catatan penting untuk tim admin...\nContoh: Stok Robux normal, promo weekend aktif, cek komplain pelanggan setiap hari."
  );

  // Toast Notification state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const openModal = (modalName: string, payload?: any) => {
    if (modalName === "activate-id" && typeof payload === "string") {
      setSelectedActivationUsername(payload);
    }
    setActiveModal(modalName);
  };

  // Check auth session
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/auth");
        const json = await res.json();
        setIsAuthenticated(Boolean(json.authenticated));
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkSession();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername.trim(),
          password: loginPassword,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Username atau Password salah.");
      }

      setIsAuthenticated(true);
      showToast("Selamat datang kembali di Admin Panel ChampionStore!", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal login";
      setLoginError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  // Compute activeTab from pathname and searchParams
  const getActiveTab = (): string => {
    if (activeTabOverride) return activeTabOverride;

    if (pathname === "/admin" || pathname === "/admin/") {
      return "dashboard";
    }

    if (pathname.startsWith("/admin/orders")) {
      const status = searchParams.get("status");
      if (status === "pending" || status === "masuk") return "order-masuk";
      if (status === "processing" || status === "diproses") return "order-diproses";
      if (status === "completed" || status === "selesai") return "order-selesai";
      if (status === "cancelled" || status === "dibatalkan") return "order-dibatalkan";
      return "order-masuk";
    }

    if (pathname.startsWith("/admin/pricelist")) return "pricelist";
    if (pathname.startsWith("/admin/customers") || pathname.startsWith("/admin/pelanggan")) return "daftar-pelanggan";
    if (pathname.startsWith("/admin/blacklist")) return "blacklist";
    if (pathname.startsWith("/admin/payments") || pathname.startsWith("/admin/riwayat-pembayaran")) return "riwayat-pembayaran";
    if (pathname.startsWith("/admin/settings") || pathname.startsWith("/admin/pengaturan")) return "pengaturan-toko";

    return "dashboard";
  };

  const activeTab = getActiveTab();

  const handleSidebarTabClick = (tabId: string) => {
    switch (tabId) {
      case "dashboard":
        router.push("/admin");
        break;
      case "order-masuk":
        router.push("/admin/orders?status=pending");
        break;
      case "order-diproses":
        router.push("/admin/orders?status=processing");
        break;
      case "order-selesai":
        router.push("/admin/orders?status=completed");
        break;
      case "order-dibatalkan":
        router.push("/admin/orders?status=cancelled");
        break;
      case "pricelist":
        router.push("/admin/pricelist");
        break;
      case "daftar-pelanggan":
        router.push("/admin/customers");
        break;
      case "blacklist":
        router.push("/admin/blacklist");
        break;
      case "riwayat-pembayaran":
        router.push("/admin/payments");
        break;
      case "pengaturan-toko":
      case "pengaturan-akun":
        router.push("/admin/settings");
        break;
      default:
        router.push("/admin");
        break;
    }
  };

  // Loading Session State
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#070A11] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#FF1F3D] animate-spin" />
          <p className="text-xs text-slate-400 font-medium">
            Memverifikasi sesi admin...
          </p>
        </div>
      </div>
    );
  }

  // Not Logged In State -> Show Admin Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070A11] flex items-center justify-center p-4 selection:bg-red-600 selection:text-white">
        <div className="w-full max-w-md bg-[#0C101A] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute top-0 right-0 w-36 h-36 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center space-y-3 mb-6 relative">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700/80 p-2.5 flex items-center justify-center shadow-lg shadow-red-950/40">
              <Image
                src="/logo.png"
                alt="ChampionStore Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Admin Panel Login
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Akses terbatas hanya untuk tim operasional ChampionStore
              </p>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 relative">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Username Admin
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Masukkan username admin..."
                required
                className="w-full bg-[#070A11] text-xs text-white px-4 py-3 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#070A11] text-xs text-white px-4 py-3 rounded-2xl border border-slate-800 focus:border-[#FF1F3D] focus:outline-none transition-all shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-[#FF1F3D] to-red-600 hover:from-red-500 hover:to-red-600 text-white text-xs font-black shadow-[0_0_20px_rgba(255,31,61,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-[11px] text-slate-400 hover:text-white transition-colors"
            >
              ← Kembali ke Toko Publik
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex selection:bg-red-600 selection:text-white">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={handleSidebarTabClick}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        {/* Top Header */}
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dynamic Main Body */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 max-w-[1540px] w-full mx-auto">
          {children({ showToast, openModal })}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <AdminModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        adminNote={adminNote}
        setAdminNote={setAdminNote}
        targetUsername={selectedActivationUsername}
        onToast={showToast}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0F1524] border border-slate-700 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-200 max-w-sm">
          {toast.type === "success" && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          )}
          {toast.type === "error" && (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          {toast.type === "info" && (
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
          )}
          <p className="text-xs font-semibold text-white">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="p-1 text-slate-400 hover:text-white ml-auto"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
