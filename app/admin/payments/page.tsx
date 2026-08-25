"use client";

import React from "react";
import AdminRiwayatPembayaran from "@/components/admin/AdminRiwayatPembayaran";
import { useAdmin } from "@/components/admin/AdminContext";

export default function PaymentsPage() {
  const { showToast } = useAdmin();
  return <AdminRiwayatPembayaran onToast={showToast} />;
}
