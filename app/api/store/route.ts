import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { STORE_CONFIG, formatWhatsAppUrl, formatWhatsAppNumber } from "@/data/pricelist";

// GET /api/store - Get store settings
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("store_settings")
      .select("*")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({
        success: true,
        data: {
          storeName: STORE_CONFIG.name,
          whatsappNumber: STORE_CONFIG.whatsappNumber,
          whatsappUrl: STORE_CONFIG.whatsappUrl,
          isStoreOpen: true,
          qrisImageUrl: "/qris.webp",
          logoImageUrl: "/logo.png",
          bannerImageUrl: "/roblox_hero.jpg",
          promoActive: true,
          promoTag: "PROMO SPESIAL BULAN INI",
          promoBadge: "LIMITED STOCK",
          promoTitle: "ROBUX BULAN INI",
          promoSubtitle: "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!",
          promoRobuxAmount: 2200,
          promoOriginalLabel: "2.000 Robux",
          promoDiscountPrice: 45000,
          adminNote: "Catatan penting untuk tim admin: Selalu cek bukti transfer dan status ID Roblox sebelum memproses pesanan.",
        },
        fromFallback: true,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        storeName: data.store_name,
        whatsappNumber: formatWhatsAppNumber(data.whatsapp_number),
        whatsappUrl: formatWhatsAppUrl(data.whatsapp_number),
        isStoreOpen: true,
        qrisImageUrl: data.qris_image_path || "/qris.webp",
        logoImageUrl: data.logo_image_path || "/logo.png",
        bannerImageUrl: data.banner_image_path || "/roblox_hero.jpg",
        promoActive: data.promo_active !== false,
        promoTag: data.promo_tag || "PROMO SPESIAL BULAN INI",
        promoBadge: data.promo_badge || "LIMITED STOCK",
        promoTitle: data.promo_title || "ROBUX BULAN INI",
        promoSubtitle: data.promo_subtitle || "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!",
        promoRobuxAmount: Number(data.promo_robux_amount) || 2200,
        promoOriginalLabel: data.promo_original_label || "2.000 Robux",
        promoDiscountPrice: Number(data.promo_discount_price) || 45000,
        promoEndDate: data.promo_end_date,
        adminNote: data.admin_note || "Catatan penting untuk tim operasional toko.",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH /api/store - Update store settings
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      storeName,
      whatsappNumber,
      qrisImageUrl,
      logoImageUrl,
      bannerImageUrl,
      promoActive,
      promoTag,
      promoBadge,
      promoTitle,
      promoSubtitle,
      promoRobuxAmount,
      promoOriginalLabel,
      promoDiscountPrice,
      promoEndDate,
      adminNote,
    } = body;

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (storeName !== undefined) updates.store_name = storeName;
    if (whatsappNumber !== undefined) {
      let cleanWa = String(whatsappNumber).replace(/[^0-9]/g, "");
      if (cleanWa.startsWith("0")) cleanWa = "62" + cleanWa.slice(1);
      else if (cleanWa.startsWith("8")) cleanWa = "62" + cleanWa;
      updates.whatsapp_number = cleanWa;
      updates.whatsapp_url = `https://wa.me/${cleanWa}`;
    }
    if (qrisImageUrl !== undefined) updates.qris_image_path = qrisImageUrl;
    if (logoImageUrl !== undefined) updates.logo_image_path = logoImageUrl;
    if (bannerImageUrl !== undefined) updates.banner_image_path = bannerImageUrl;
    if (promoActive !== undefined) updates.promo_active = Boolean(promoActive);
    if (promoTag !== undefined) updates.promo_tag = promoTag;
    if (promoBadge !== undefined) updates.promo_badge = promoBadge;
    if (promoTitle !== undefined) updates.promo_title = promoTitle;
    if (promoSubtitle !== undefined) updates.promo_subtitle = promoSubtitle;
    if (promoRobuxAmount !== undefined) updates.promo_robux_amount = Number(promoRobuxAmount);
    if (promoOriginalLabel !== undefined) updates.promo_original_label = promoOriginalLabel;
    if (promoDiscountPrice !== undefined) updates.promo_discount_price = Number(promoDiscountPrice);
    if (promoEndDate !== undefined) updates.promo_end_date = promoEndDate;
    if (adminNote !== undefined) updates.admin_note = adminNote;

    // Check if store_settings record exists
    const { data: existing } = await supabaseAdmin
      .from("store_settings")
      .select("id")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    let result;
    if (existing) {
      result = await supabaseAdmin
        .from("store_settings")
        .update(updates)
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      let cleanWa = whatsappNumber ? String(whatsappNumber).replace(/[^0-9]/g, "") : "6285828378025";
      if (cleanWa.startsWith("0")) cleanWa = "62" + cleanWa.slice(1);
      else if (cleanWa.startsWith("8")) cleanWa = "62" + cleanWa;

      result = await supabaseAdmin
        .from("store_settings")
        .insert({
          id: "default",
          store_name: storeName || STORE_CONFIG.name,
          whatsapp_number: cleanWa,
          whatsapp_url: `https://wa.me/${cleanWa}`,
          admin_note: adminNote || "Catatan penting untuk tim operasional toko.",
          ...updates,
        })
        .select()
        .single();
    }

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
