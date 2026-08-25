"use client";

import React from "react";
import AdminBanner from "@/components/admin/AdminBanner";
import AdminStats from "@/components/admin/AdminStats";
import AdminActivity from "@/components/admin/AdminActivity";
import AdminIdWarning from "@/components/admin/AdminIdWarning";
import AdminAnnouncement from "@/components/admin/AdminAnnouncement";
import AdminTopProducts from "@/components/admin/AdminTopProducts";
import AdminNotes from "@/components/admin/AdminNotes";
import { useAdmin } from "@/components/admin/AdminContext";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { openModal } = useAdmin();

  return (
    <>
      {/* 1. Greeting Banner */}
      <AdminBanner />

      {/* 2. Five Metric Cards */}
      <AdminStats
        onSelectCategory={(catId) => {
          if (catId === "order-masuk") router.push("/admin/orders?status=pending");
          else if (catId === "order-diproses") router.push("/admin/orders?status=processing");
          else if (catId === "order-selesai") router.push("/admin/orders?status=completed");
          else if (catId === "order-dibatalkan") router.push("/admin/orders?status=cancelled");
          else if (catId === "pricelist") router.push("/admin/pricelist");
        }}
      />

      {/* 3. Middle 3-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Card: Aktivitas Terbaru (3 cols) */}
        <div className="lg:col-span-3 h-full">
          <AdminActivity onViewAll={() => openModal("all-activities")} />
        </div>

        {/* Center Card: PERINGATAN! ID ROBLOX (6 cols) */}
        <div className="lg:col-span-6 h-full">
          <AdminIdWarning
            onActivate={(username) => {
              openModal("activate-id", username);
            }}
          />
        </div>

        {/* Right Card: Pengumuman (3 cols) */}
        <div className="lg:col-span-3 h-full">
          <AdminAnnouncement onReadGuide={() => openModal("read-guide")} />
        </div>
      </div>

      {/* 4. Bottom 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Produk Terlaris (8 cols) */}
        <div className="lg:col-span-8">
          <AdminTopProducts onViewAll={() => router.push("/admin/pricelist")} />
        </div>

        {/* Right: Catatan Admin (4 cols) */}
        <div className="lg:col-span-4">
          <AdminNotes onOpenEditModal={() => openModal("edit-notes")} />
        </div>
      </div>
    </>
  );
}
