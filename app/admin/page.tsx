"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminBanner from "@/components/admin/AdminBanner";
import AdminStats from "@/components/admin/AdminStats";
import AdminActivity from "@/components/admin/AdminActivity";
import AdminIdWarning from "@/components/admin/AdminIdWarning";
import AdminAnnouncement from "@/components/admin/AdminAnnouncement";
import AdminTopProducts from "@/components/admin/AdminTopProducts";
import AdminNotes from "@/components/admin/AdminNotes";
import AdminModals from "@/components/admin/AdminModals";
import AdminTabViews from "@/components/admin/AdminTabViews";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModal, setActiveModal] = useState<string | null>(null);
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

  const handleSidebarTabClick = (tabId: string) => {
    if (tabId === "tambah-produk") {
      setActiveModal("tambah-produk");
      return;
    }
    setActiveTab(tabId);
  };

  const [selectedActivationUsername, setSelectedActivationUsername] =
    useState<string>("PinkQueen_23");

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

        {/* Dynamic Main Body (Compact & Responsive for 100% Zoom) */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 space-y-4 sm:space-y-5 max-w-[1540px] w-full mx-auto">
          {activeTab === "dashboard" ? (
            <>
              {/* 1. Greeting Banner */}
              <AdminBanner />

              {/* 2. Five Metric Cards */}
              <AdminStats
                onSelectCategory={(catId) => {
                  setActiveTab(catId);
                }}
              />

              {/* 3. Middle 3-Column Section (Wide Center Rectangle, Narrow Sides) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Left Card: Aktivitas Terbaru (3 cols) */}
                <div className="lg:col-span-3 h-full">
                  <AdminActivity
                    onViewAll={() => setActiveModal("all-activities")}
                  />
                </div>

                {/* Center Card: PERINGATAN! ID ROBLOX BELUM AKTIF (6 cols - Persegi Gede di Tengah) */}
                <div className="lg:col-span-6 h-full">
                  <AdminIdWarning
                    onActivate={(username) => {
                      setSelectedActivationUsername(username);
                      setActiveModal("activate-id");
                    }}
                    onCancelOrder={(username) => {
                      setSelectedActivationUsername(username);
                      setActiveModal("cancel-order");
                    }}
                  />
                </div>

                {/* Right Card: Pengumuman (3 cols) */}
                <div className="lg:col-span-3 h-full">
                  <AdminAnnouncement
                    onReadGuide={() => setActiveModal("read-guide")}
                  />
                </div>
              </div>

              {/* 4. Bottom 2-Column Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Left: Produk Terlaris (8 cols) */}
                <div className="lg:col-span-8">
                  <AdminTopProducts
                    onViewAll={() => setActiveTab("pricelist")}
                  />
                </div>

                {/* Right: Catatan Admin (4 cols) */}
                <div className="lg:col-span-4">
                  <AdminNotes
                    onOpenEditModal={() => setActiveModal("edit-notes")}
                  />
                </div>
              </div>
            </>
          ) : (
            /* Sub-views for other tabs */
            <AdminTabViews
              activeTab={activeTab}
              onActivateIdOrder={() => setActiveModal("activate-id")}
              onToast={showToast}
            />
          )}
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
