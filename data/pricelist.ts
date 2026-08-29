import { RobuxItem } from "@/types";

export const ROBUX_PACKAGES: RobuxItem[] = [
  {
    id: "rbx-1800",
    amount: 1800,
    price: 35000,
    category: "regular",
  },
  {
    id: "rbx-2200",
    amount: 2200,
    price: 45000,
    originalPrice: 50000,
    isPromo: true,
    isBestSeller: true,
    badge: "PROMO",
    category: "promo",
  },
  {
    id: "rbx-2700",
    amount: 2700,
    price: 50000,
    category: "popular",
  },
  {
    id: "rbx-3200",
    amount: 3200,
    price: 60000,
    category: "popular",
  },
  {
    id: "rbx-3700",
    amount: 3700,
    price: 70000,
    category: "regular",
  },
  {
    id: "rbx-4200",
    amount: 4200,
    price: 80000,
    category: "popular",
  },
  {
    id: "rbx-4700",
    amount: 4700,
    price: 90000,
    category: "regular",
  },
  {
    id: "rbx-5500",
    amount: 5500,
    price: 100000,
    originalPrice: 115000,
    isBestSeller: true,
    badge: "POPULER",
    category: "popular",
  },
  {
    id: "rbx-10500",
    amount: 10500,
    price: 200000,
    isSultan: true,
    badge: "SULTAN",
    category: "sultan",
  },
  {
    id: "rbx-15500",
    amount: 15500,
    price: 300000,
    isSultan: true,
    badge: "SULTAN",
    category: "sultan",
  },
  {
    id: "rbx-20500",
    amount: 20500,
    price: 400000,
    isSultan: true,
    badge: "SULTAN",
    category: "sultan",
  },
  {
    id: "rbx-30500",
    amount: 30500,
    price: 500000,
    isSultan: true,
    badge: "SULTAN",
    category: "sultan",
  },
];

export const CATEGORIES = [
  { id: "all", label: "Semua", count: ROBUX_PACKAGES.length },
  { id: "popular", label: "Populer", count: ROBUX_PACKAGES.filter(p => p.category === "popular" || p.isBestSeller).length },
  { id: "promo", label: "Promo", count: ROBUX_PACKAGES.filter(p => p.isPromo).length },
  { id: "sultan", label: "Paket Sultan", count: ROBUX_PACKAGES.filter(p => p.isSultan).length },
];

export function formatWhatsAppUrl(rawPhone?: string): string {
  if (!rawPhone) return "https://wa.me/6282344687947";
  let clean = String(rawPhone).replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  } else if (clean.startsWith("8")) {
    clean = "62" + clean;
  } else if (!clean.startsWith("62") && clean.length > 7) {
    clean = "62" + clean;
  }
  return `https://wa.me/${clean}`;
}

export function formatWhatsAppNumber(rawPhone?: string): string {
  if (!rawPhone) return "+62 823-4468-7947";
  let clean = String(rawPhone).replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  } else if (clean.startsWith("8")) {
    clean = "62" + clean;
  } else if (!clean.startsWith("62") && clean.length > 7) {
    clean = "62" + clean;
  }
  return `+${clean}`;
}

export const STORE_CONFIG = {
  name: "ChampionStore_IDN",
  tagline: "Top Up Robux Resmi & Legal",
  instagram: "@CHAMPIONSTORE_IDN",
  whatsappUrl: "https://wa.me/6282344687947",
  whatsappNumber: "+62 823-4468-7947",
};
