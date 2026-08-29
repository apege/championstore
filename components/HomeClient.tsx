"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RobuxItem, CartItem, PaymentMethodId } from "@/types";

import Navbar from "@/components/Navbar";
import BackgroundEffects from "@/components/BackgroundEffects";
import HeroBanner from "@/components/HeroBanner";
import FeaturesBar from "@/components/FeaturesBar";
import AccountInputSection from "@/components/AccountInputSection";
import RobuxGridSection from "@/components/RobuxGridSection";
import PaymentMethodSection from "@/components/PaymentMethodSection";
import WorkflowSection from "@/components/WorkflowSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FloatingBottomBar from "@/components/FloatingBottomBar";
import CartModal from "@/components/CartModal";
import CheckoutModal from "@/components/CheckoutModal";
import Footer from "@/components/Footer";

export interface InitialStoreConfig {
  storeName: string;
  whatsappNumber: string;
  whatsappUrl: string;
  qrisImageUrl: string;
  logoImageUrl: string;
  bannerImageUrl: string;
  promoActive: boolean;
  promoTag: string;
  promoBadge: string;
  promoTitle: string;
  promoSubtitle: string;
  promoRobuxAmount: number;
  promoOriginalLabel: string;
  promoDiscountPrice: number;
  promoEndDate?: string;
}

interface HomeClientProps {
  initialStore: InitialStoreConfig;
  initialProducts: RobuxItem[];
}

export default function HomeClient({
  initialStore,
  initialProducts,
}: HomeClientProps) {
  const router = useRouter();
  const [packages, setPackages] = useState<RobuxItem[]>(initialProducts);

  // Default selected package
  const defaultPackage =
    packages.find((p) => p.amount === 2200) ||
    packages.find((p) => p.isPromo) ||
    packages[0];

  const [selectedItem, setSelectedItem] = useState<RobuxItem | null>(
    defaultPackage
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [username, setUsername] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodId>("website");
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Single card selection
  const handleSelectItem = (item: RobuxItem) => {
    setSelectedItem(item);
  };

  // Add to cart button (+) adds item to the cart in navbar
  const handleAddToCart = (item: RobuxItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((ci) => ci.item.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSelectPromo = () => {
    const promo = packages.find((p) => p.amount === 2200) || packages.find((p) => p.isPromo);
    if (promo) {
      setSelectedItem(promo);
    }
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  const handleOpenCheckout = async () => {
    if (cartItems.length === 0 && !selectedItem) {
      alert("Silakan pilih paket Robux terlebih dahulu!");
      return;
    }

    if (!username.trim()) {
      alert("Harap masukkan Username Roblox terlebih dahulu pada Langkah 1!");
      const accSection = document.getElementById("section-account");
      if (accSection) {
        accSection.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    const itemsToCheckout =
      cartItems.length > 0
        ? cartItems
        : selectedItem
        ? [{ item: selectedItem, quantity: 1 }]
        : [];

    const totalRobux = itemsToCheckout.reduce(
      (acc, ci) => acc + ci.item.amount * ci.quantity,
      0
    );
    const totalPrice = itemsToCheckout.reduce(
      (acc, ci) => acc + ci.item.price * ci.quantity,
      0
    );

    if (paymentMethod === "website") {
      const checkoutUrl = `/checkout?username=${encodeURIComponent(
        username
      )}&userId=${encodeURIComponent(
        userId ? String(userId) : ""
      )}&amount=${totalRobux}&price=${totalPrice}`;

      router.push(checkoutUrl);
      return;
    }

    if (paymentMethod === "whatsapp") {
      const packagesSummary = itemsToCheckout
        .map(
          (ci) =>
            `${ci.item.amount.toLocaleString("id-ID")} Robux (x${ci.quantity})`
        )
        .join(", ");

      const itemsPayload = itemsToCheckout.map((ci) => ({
        id: ci.item.id,
        amount: ci.item.amount,
        price: ci.item.price,
        quantity: ci.quantity,
        name: `${ci.item.amount.toLocaleString("id-ID")} Robux`,
      }));

      let inv = `CS-${Math.floor(10000000 + Math.random() * 90000000)}`;

      // 1. Insert order to Supabase
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim(),
            robloxId: userId ? String(userId) : null,
            phone: "-",
            items: itemsPayload,
            paymentMethod: "whatsapp",
            customerNote: `Paket: ${packagesSummary}`,
          }),
        });
        const json = await res.json();
        if (json.success && json.invoiceNumber) {
          inv = json.invoiceNumber;
        }
      } catch (err) {
        console.warn("Failed to create WhatsApp order in Supabase:", err);
      }

      const text = encodeURIComponent(
        `*Halo Admin ${initialStore.storeName}, saya ingin konfirmasi order Robux!*\n\n` +
          `• *No. Invoice:* ${inv}\n` +
          `• *Username Roblox:* ${username}\n` +
          (userId ? `• *Roblox ID:* ${userId}\n` : "") +
          `• *Paket Robux:* ${packagesSummary}\n` +
          `• *Total Robux:* ${totalRobux.toLocaleString("id-ID")} Robux\n` +
          `• *Total Bayar:* Rp ${totalPrice.toLocaleString("id-ID")}\n` +
          `• *Metode:* Pembayaran via WhatsApp\n\n` +
          `Mohon segera diproses ya min. Terima kasih!`
      );

      // 2. Direct redirect to WhatsApp Admin in new tab/window
      window.open(`${initialStore.whatsappUrl}?text=${text}`, "_blank");

      // 3. Open modal in success mode on the web
      setIsCheckoutOpen(true);
      return;
    }
  };

  const totalCartCount = cartItems.reduce((acc, ci) => acc + ci.quantity, 0);

  // Checkout items to pass
  const checkoutItems: CartItem[] =
    cartItems.length > 0
      ? cartItems
      : selectedItem
      ? [{ item: selectedItem, quantity: 1 }]
      : [];

  return (
    <div className="relative min-h-screen bg-[#080C14] text-slate-100 font-sans selection:bg-red-600 selection:text-white flex flex-col">
      {/* Background Animated & 3D Red-Blue Sparkles / Roblox Cubes */}
      <BackgroundEffects />

      {/* Header Navigation with Cart Count & SSR Store Data */}
      <Navbar
        selectedCount={totalCartCount}
        onOpenCart={handleOpenCart}
        initialStoreInfo={initialStore}
      />

      {/* Main Dashboard Container */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-6">
        {/* Section 0: Hero Promo Banner with Realtime SSR Data */}
        <HeroBanner
          onSelectPromo={handleSelectPromo}
          initialPromoConfig={initialStore}
        />

        {/* Features & Trust Guarantees Auto-scrolling Bar */}
        <FeaturesBar />

        {/* Section 1: Masukkan Data Akun */}
        <AccountInputSection
          username={username}
          onUsernameChange={setUsername}
          onUserIdChange={setUserId}
        />

        {/* Section 2: Pilih Robux (Pricelist Resmi Champion Store) */}
        <RobuxGridSection
          packages={packages}
          selectedItem={selectedItem}
          onSelectItem={handleSelectItem}
          onAddToCart={handleAddToCart}
        />

        {/* Section 3: Pilih Pembayaran (QRIS / WhatsApp) */}
        <PaymentMethodSection
          selectedMethod={paymentMethod}
          onSelectMethod={setPaymentMethod}
        />

        {/* Section 4: Alur Transaksi Mudah & Cepat */}
        <WorkflowSection />

        {/* Section 5: Testimoni Pelanggan */}
        <TestimonialsSection />
      </main>

      {/* Sticky Bottom Bar */}
      <FloatingBottomBar
        selectedItem={selectedItem}
        cartItems={cartItems}
        onCheckout={handleOpenCheckout}
      />

      {/* Clean Multi-Item Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleOpenCheckout}
      />

      {/* Interactive Checkout Modal (QRIS scan / direct WhatsApp) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={checkoutItems}
        username={username}
        paymentMethod={paymentMethod}
        initialStoreInfo={initialStore}
      />

      {/* Brand Footer with SSR Store Info */}
      <Footer initialStoreInfo={initialStore} />
    </div>
  );
}
