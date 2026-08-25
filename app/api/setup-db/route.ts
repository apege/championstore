import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ROBUX_PACKAGES, STORE_CONFIG } from "@/data/pricelist";

export async function GET() {
  try {
    const results: Record<string, string> = {};

    // 1. Setup Store Settings
    const { error: storeErr } = await supabaseAdmin
      .from("store_settings")
      .upsert({
        id: "default",
        store_name: STORE_CONFIG.name,
        whatsapp_number: STORE_CONFIG.whatsappNumber,
        whatsapp_url: STORE_CONFIG.whatsappUrl,
        is_store_open: true,
        announcement_banner:
          "⚡ PROMO RAMADHAN & WEEKEND: BONUS HINGGA 200 ROBUX SETIAP PEMBELIAN PAKET SULTAN! PROSES OTOMATIS 1-5 MENIT.",
        admin_note:
          "Catatan penting untuk tim admin...\nContoh: Stok Robux normal, promo weekend aktif, cek komplain pelanggan setiap hari.",
        qris_image_url: "/qris.png",
      });

    results.store_settings = storeErr ? `Error: ${storeErr.message}` : "OK";

    // 2. Setup Products
    for (let i = 0; i < ROBUX_PACKAGES.length; i++) {
      const p = ROBUX_PACKAGES[i];
      await supabaseAdmin.from("products").upsert({
        id: p.id,
        amount: p.amount,
        price: p.price,
        original_price: p.originalPrice || null,
        is_promo: p.isPromo || false,
        is_best_seller: p.isBestSeller || false,
        is_sultan: p.isSultan || false,
        badge: p.badge || null,
        category: p.category,
        stock: 999,
        is_active: true,
        sort_order: i + 1,
      });
    }
    results.products = "OK";

    // 3. Setup initial activity log
    await supabaseAdmin.from("activity_logs").insert({
      action: "Database Initialized",
      details: "Setup & seed awal database ChampionStore berhasil dijalankan.",
      type: "system",
    });
    results.activity_logs = "OK";

    return NextResponse.json({
      success: true,
      message: "Database setup and seeding completed.",
      results,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
