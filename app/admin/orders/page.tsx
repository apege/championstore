"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminOrderMasuk from "@/components/admin/AdminOrderMasuk";
import { useAdmin } from "@/components/admin/AdminContext";

function OrdersPageContent() {
  const searchParams = useSearchParams();
  const { showToast } = useAdmin();
  const statusParam = searchParams.get("status");

  let tabType: "order-masuk" | "order-diproses" | "order-selesai" | "order-dibatalkan" = "order-masuk";
  if (statusParam === "processing" || statusParam === "diproses") {
    tabType = "order-diproses";
  } else if (statusParam === "completed" || statusParam === "selesai") {
    tabType = "order-selesai";
  } else if (statusParam === "cancelled" || statusParam === "dibatalkan") {
    tabType = "order-dibatalkan";
  }

  return <AdminOrderMasuk tabType={tabType} onToast={showToast} />;
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-slate-500 text-xs">Memuat pesanan...</div>}>
      <OrdersPageContent />
    </Suspense>
  );
}
