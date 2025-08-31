"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Menu, X } from "lucide-react";
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Menu', href: '/menu' },
  { name: 'Pesanan', href: '/pesanan' },
  { name: 'Kontak', href: '/kontak' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cartItems, openCart } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.jumlah, 0);
  
  // State untuk mengontrol menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20">
      <nav className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        {/* Kiri: Logo */}
        <Link href="/" className="flex-shrink-0 z-50">
          <Image
            src="/logo.png"
            alt="Logo Ayam Enak"
            width={60}
            height={20}
            priority
          />
        </Link>

        {/* Tengah: Menu Navigasi Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`font-semibold text-gray-600 hover:text-[#F0A04B] transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-[#F0A04B] after:transition-transform after:duration-300 ${isActive ? 'after:scale-x-100' : 'after:scale-x-0'}`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>

        {/* Kanan: Keranjang & Tombol Menu Mobile */}
        <div className="flex items-center gap-4 z-50">
          <button 
            onClick={openCart} 
            className="relative flex items-center text-gray-700 hover:text-blue-600 transition-colors"
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {totalItems}
              </span>
            )}
          </button>
          
          <button onClick={toggleMobileMenu} className="md:hidden p-2">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Menu Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-0 left-0 w-full bg-white shadow-lg z-40 pt-20"
          >
            <div className="flex flex-col items-center gap-6 py-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="font-semibold text-xl text-gray-700 hover:text-[#F0A04B]"
                  onClick={() => setIsMobileMenuOpen(false)} // Tutup menu saat link diklik
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}