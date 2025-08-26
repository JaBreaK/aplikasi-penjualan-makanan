"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import Image from 'next/image';

// TAMBAHKAN LINK MENU DI SINI
const navLinks = [
  { name: 'Menu', href: '/menu' },
  { name: 'Pesanan', href: '/pesanan' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cartItems, openCart } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.jumlah, 0);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-20">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Kiri: Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Logo Ayam Enak"
            width={90}
            height={30}
            priority
          />
        </Link>

        {/* Kanan: Menu Navigasi */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`hidden md:inline text-gray-600 font-semibold hover:text-blue-600 transition-colors ${isActive ? 'text-blue-600' : ''}`}
              >
                {link.name}
              </Link>
            )
          })}

          <button 
            onClick={openCart} 
            className="relative flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}