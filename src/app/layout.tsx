// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartSidebar from "@/components/CartSidebar";
import AppContent from "@/components/AppContent";
import FloatingCartButton from "@/components/FloatingCartButton"; // <-- IMPORT BARU
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aplikasi Jualan Makanan",
  description: "Dibuat dengan Next.js dan cinta",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        <CartProvider>
          <AppContent>
            {children}
          </AppContent>
          <CartSidebar />
          <FloatingCartButton /> {/* <-- TAMBAHKAN DI SINI */}
        </CartProvider>
      </body>
    </html>
  );
}