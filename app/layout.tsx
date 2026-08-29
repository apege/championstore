import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://championstore.my.id"),
  title: "ChampionStore_IDN | Top Up Robux Resmi, Murah & Legal",
  description:
    "Pusat top up Robux resmi terpercaya di Indonesia. Proses kilat 1-5 menit hanya butuh username, legal 100% dan bergaransi uang kembali.",
  applicationName: "ChampionStore_IDN",
  authors: [{ name: "ChampionStore_IDN" }],
  keywords: [
    "Top Up Robux",
    "Robux Murah",
    "Beli Robux Legal",
    "ChampionStore",
    "Top Up Roblox Indonesia",
  ],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "ChampionStore_IDN | Top Up Robux Resmi, Murah & Legal",
    description:
      "Pusat top up Robux resmi terpercaya di Indonesia. Proses kilat 1-5 menit, 100% Robux Legal & Bergaransi.",
    url: "https://championstore.my.id",
    siteName: "ChampionStore_IDN",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "ChampionStore_IDN Logo",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ChampionStore_IDN | Top Up Robux Resmi, Murah & Legal",
    description:
      "Pusat top up Robux resmi terpercaya di Indonesia. Proses kilat 1-5 menit, legal & aman.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} dark antialiased scroll-smooth`}>
      <body className="min-h-screen bg-[#080C14] font-sans antialiased text-slate-100 selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
