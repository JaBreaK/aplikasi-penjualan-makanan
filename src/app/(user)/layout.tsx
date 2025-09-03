// src/app/(user)/layout.tsx
"use client";

import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";
import Footer from "@/components/Footer";


export default function UserLayout({ children }: { children: ReactNode }) {
  const { isCartOpen } = useCart();

  return (
    <div 
      className={`transition-all duration-500 ease-in-out ${isCartOpen ? 'mr-0 md:mr-110' : 'mr-0'}`}
    >
      <Navbar />
      {children}
      <Footer />
    </div>
    
  )
}