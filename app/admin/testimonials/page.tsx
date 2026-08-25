"use client";

import React from "react";
import AdminTestimoni from "@/components/admin/AdminTestimoni";
import { useAdmin } from "@/components/admin/AdminContext";

export default function TestimonialsPage() {
  const { showToast } = useAdmin();
  return <AdminTestimoni onToast={showToast} />;
}
