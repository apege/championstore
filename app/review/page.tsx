"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function ReviewRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const order = searchParams.get("order") || searchParams.get("token") || "";
    const user = searchParams.get("user") || "";
    const robux = searchParams.get("robux") || "";

    const params = new URLSearchParams();
    if (order) params.set("order", order);
    if (user) params.set("user", user);
    if (robux) params.set("robux", robux);

    router.replace(`/?${params.toString()}#section-testimonials`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#080C14] text-white flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 text-sm text-slate-300">
        <Loader2 className="w-5 h-5 animate-spin text-[#FF1F3D]" />
        <span>Membuka formulir ulasan pembeli terverifikasi...</span>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080C14] text-white flex items-center justify-center text-xs text-slate-400">
          Memuat...
        </div>
      }
    >
      <ReviewRedirectContent />
    </Suspense>
  );
}
