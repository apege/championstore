import { supabaseAdmin } from "@/lib/supabase/server";
import { ROBUX_PACKAGES, STORE_CONFIG } from "@/data/pricelist";
import HomeClient, { InitialStoreConfig } from "@/components/HomeClient";
import { RobuxItem } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  // Fetch store_settings and active products directly from Supabase on the server
  let initialStore: InitialStoreConfig = {
    storeName: STORE_CONFIG.name,
    whatsappNumber: STORE_CONFIG.whatsappNumber,
    whatsappUrl: STORE_CONFIG.whatsappUrl,
    qrisImageUrl: "/qris.webp",
    logoImageUrl: "/logo.png",
    bannerImageUrl: "/roblox_hero.jpg",
    promoActive: true,
    promoTag: "PROMO SPESIAL BULAN INI",
    promoBadge: "LIMITED STOCK",
    promoTitle: "ROBUX BULAN INI",
    promoSubtitle:
      "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!",
    promoRobuxAmount: 2200,
    promoOriginalLabel: "2.000 Robux",
    promoDiscountPrice: 45000,
  };

  let initialProducts: RobuxItem[] = ROBUX_PACKAGES;

  try {
    const [storeRes, prodRes] = await Promise.all([
      supabaseAdmin
        .from("store_settings")
        .select("*")
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabaseAdmin
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("robux", { ascending: true }),
    ]);

    if (storeRes.data) {
      const s = storeRes.data;
      const cleanWa = (s.whatsapp_number || STORE_CONFIG.whatsappNumber).replace(
        /[^0-9]/g,
        ""
      );
      initialStore = {
        storeName: s.store_name || STORE_CONFIG.name,
        whatsappNumber: cleanWa,
        whatsappUrl: `https://wa.me/${cleanWa}`,
        qrisImageUrl: s.qris_image_path || "/qris.webp",
        logoImageUrl: s.logo_image_path || "/logo.png",
        bannerImageUrl: s.banner_image_path || "/roblox_hero.jpg",
        promoActive: s.promo_active === true,
        promoTag: s.promo_tag || "PROMO SPESIAL BULAN INI",
        promoBadge: s.promo_badge || "LIMITED STOCK",
        promoTitle: s.promo_title || "ROBUX BULAN INI",
        promoSubtitle:
          s.promo_subtitle ||
          "Top Up Robux Instant, Cepat, Legal, Aman & Bergaransi 100% Uang Kembali!",
        promoRobuxAmount: Number(s.promo_robux_amount) || 2200,
        promoOriginalLabel: s.promo_original_label || "2.000 Robux",
        promoDiscountPrice: Number(s.promo_discount_price) || 45000,
        promoEndDate: s.promo_end_date || undefined,
      };
    }

    if (prodRes.data && prodRes.data.length > 0) {
      initialProducts = prodRes.data.map((p) => {
        const isPromo = p.robux === 2200;
        const isSultan = p.robux >= 10000;
        const isBestSeller = p.robux === 5500;
        let badge: string | undefined = undefined;
        if (isPromo) badge = "PROMO";
        else if (isSultan) badge = "SULTAN";
        else if (isBestSeller) badge = "POPULER";

        let category: "popular" | "promo" | "sultan" | "regular" = "regular";
        if (isSultan) category = "sultan";
        else if (isPromo) category = "promo";
        else if ([2700, 3200, 4200, 5500].includes(p.robux))
          category = "popular";

        return {
          id: `rbx-${p.robux}`,
          dbId: p.id,
          amount: p.robux,
          price: Number(p.price),
          originalPrice: isPromo ? 50000 : isBestSeller ? 115000 : undefined,
          isPromo,
          isBestSeller,
          isSultan,
          badge,
          category,
          stock: 999,
          isActive: p.is_active,
        };
      });
    }
  } catch (err) {
    console.warn("SSR store fetch fallback:", err);
  }

  return (
    <HomeClient
      initialStore={initialStore}
      initialProducts={initialProducts}
    />
  );
}
