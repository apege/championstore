"use client";

import React from "react";
import AdminPricelist from "@/components/admin/AdminPricelist";
import { useAdmin } from "@/components/admin/AdminContext";

export default function PricelistPage() {
  const { showToast } = useAdmin();
  return <AdminPricelist onToast={showToast} />;
}
