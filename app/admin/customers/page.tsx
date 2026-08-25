"use client";

import React from "react";
import AdminDaftarPelanggan from "@/components/admin/AdminDaftarPelanggan";
import { useAdmin } from "@/components/admin/AdminContext";

export default function CustomersPage() {
  const { showToast } = useAdmin();
  return <AdminDaftarPelanggan onToast={showToast} />;
}
