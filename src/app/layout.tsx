// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/CartSidebar";
import { ReactNode } from "react";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: 'Ayam Goreng Suharti Cipaganti | Resep Warisan Sejak 1972',
  description: 'Nikmati kelezatan otentik Ayam Goreng Kremes Suharti. Dibuat dengan resep warisan sejak 1972, menggunakan bahan-bahan segar pilihan. Pesan sekarang!',
  keywords: ['ayam goreng suharti', 'ayam kremes', 'restoran yogyakarta', 'kuliner legendaris'],
  openGraph: {
    title: 'Ayam Goreng Suharti Cipaganti | Resep Warisan Sejak 1972',
    description: 'Renyahnya tak tertandingi, pedasnya bikin nagih. Cicipi langsung legenda kuliner Indonesia di Ayam Goreng Suharti!',
  },
  icons: {
    // Tambahkan "?v=2" untuk memaksa browser download ulang
    icon: '/favicon.ico?v=2', 
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
      <Providers> {/* <-- BUNGKUS DI SINI */}
          <CartProvider>
            {children}
            <CartSidebar />
          </CartProvider>
        </Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}