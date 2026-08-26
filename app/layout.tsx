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
  title: "ChampionStore_IDN | Top Up Robux Resmi, Murah & Legal",
  description:
    "Pusat top up Robux resmi terpercaya di Indonesia. Proses instan 5-10 menit hanya butuh username, garansi 100% aman.",
  icons: {
    icon: "/logo.png",
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
