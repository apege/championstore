"use client";

import React from "react";
import AdminPengaturanToko from "@/components/admin/AdminPengaturanToko";
import { useAdmin } from "@/components/admin/AdminContext";

export default function SettingsPage() {
  const { showToast } = useAdmin();
  return <AdminPengaturanToko onToast={showToast} />;
}
