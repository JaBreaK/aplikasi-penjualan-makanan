// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/CartSidebar";
import { ReactNode } from "react";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aplikasi Jualan Makanan",
  description: "Dibuat dengan Next.js dan cinta",
};

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
      </body>
    </html>
  );
}