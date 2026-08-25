"use client";

import React from "react";
import AdminBlacklist from "@/components/admin/AdminBlacklist";
import { useAdmin } from "@/components/admin/AdminContext";

export default function BlacklistPage() {
  const { showToast } = useAdmin();
  return <AdminBlacklist onToast={showToast} />;
}
