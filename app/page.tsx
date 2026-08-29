import { supabaseAdmin } from "@/lib/supabase/server";
import { ROBUX_PACKAGES, STORE_CONFIG, formatWhatsAppUrl, formatWhatsAppNumber } from "@/data/pricelist";
import HomeClient, { InitialStoreConfig } from "@/components/HomeClient";
import { RobuxItem } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const DEFAULT_STORE: InitialStoreConfig = {
  storeName: STORE_CONFIG.name,
  whatsappNumber: STORE_CONFIG.whatsappNumber,
  whatsappUrl: STORE_CONFIG.whatsappUrl,
  qrisImageUrl: "/qris.webp",
  logoImageUrl: "/logo.webp",
  bannerImageUrl: "",
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

async function getLatestStoreData(): Promise<{
  store: InitialStoreConfig;
  products: RobuxItem[];
}> {
  let store: InitialStoreConfig = { ...DEFAULT_STORE };
  let products: RobuxItem[] = ROBUX_PACKAGES;

  try {
    const fetchWithTimeout = async <T,>(fn: () => PromiseLike<T>, ms = 4000): Promise<T> => {
      let timer: NodeJS.Timeout;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Timeout")), ms);
      });
      try {
        return await Promise.race([Promise.resolve(fn()), timeoutPromise]);
      } finally {
        clearTimeout(timer!);
      }
    };

    const [storeRes, prodRes] = await Promise.all([
      fetchWithTimeout(() =>
        supabaseAdmin
          .from("store_settings")
          .select("*")
          .order("id", { ascending: true })
          .limit(1)
          .maybeSingle()
      ).catch(() => ({ data: null })),
      fetchWithTimeout(() =>
        supabaseAdmin
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("robux", { ascending: true })
      ).catch(() => ({ data: null })),
    ]);

    if (storeRes && storeRes.data) {
      const s = storeRes.data;
      const rawWa = s.whatsapp_number || STORE_CONFIG.whatsappNumber;
      store = {
        storeName: s.store_name || STORE_CONFIG.name,
        whatsappNumber: formatWhatsAppNumber(rawWa),
        whatsappUrl: formatWhatsAppUrl(rawWa),
        qrisImageUrl: s.qris_image_path || "/qris.webp",
        logoImageUrl: s.logo_image_path || "/logo.webp",
        bannerImageUrl: s.banner_image_path || "",
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

    if (prodRes && prodRes.data && prodRes.data.length > 0) {
      products = prodRes.data.map((p) => {
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
    console.warn("SSR store data fetch fallback:", err);
  }

  return { store, products };
}

export default async function Home() {
  const { store, products } = await getLatestStoreData();

  return (
    <HomeClient
      initialStore={store}
      initialProducts={products}
    />
  );
}
