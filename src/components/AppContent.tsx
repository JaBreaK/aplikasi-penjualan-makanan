"use client";

import { useCart } from "@/context/CartContext";
import { ReactNode } from "react";
import Navbar from "./Navbar";

export default function AppContent({ children }: { children: ReactNode }) {
  const { isCartOpen } = useCart();
  
  return (
    // Kita ganti logikanya di sini
    <div 
      className={`transition-all duration-500 ease-in-out ${isCartOpen ? 'mr-0 md:mr-110' : 'mr-0'}`}
    >
        <Navbar />
      {children}
    </div>
  )
}