"use client";

import { useState, useEffect, useRef } from 'react'; // Tambah useState, useEffect, useRef
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from "next-auth/react";

const navLinks = [
  { name: 'Dashboard', href: '/admin/' },
  { name: 'Kelola Pesanan', href: '/admin/orders' },
  { name: 'Kelola Menu', href: '/admin/manage-menu' },
  { name: 'Metode Pembayaran', href: '/admin/metode-pembayaran' },
  { name: 'Kategori', href: '/admin/kategori' },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  // State untuk menyimpan jumlah pesanan baru
  const [newOrderCount, setNewOrderCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Fungsi untuk mengecek pesanan baru
    const checkNewOrders = async () => {
      try {
        const response = await fetch('/api/orders/new-count');
        if (response.ok) {
          const data = await response.json();
          
          // Jika jumlah pesanan baru lebih banyak dari sebelumnya, putar suara
          if (data.count > newOrderCount && newOrderCount !== 0) {
            audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
          }
          
          setNewOrderCount(data.count);
        }
      } catch (error) {
        console.error("Gagal mengecek pesanan baru:", error);
      }
    };

    // Cek pertama kali saat komponen dimuat
    checkNewOrders(); 

    // Atur interval untuk mengecek setiap 15 detik
    const intervalId = setInterval(checkNewOrders, 15000); 

    // Hentikan interval saat komponen dibongkar
    return () => clearInterval(intervalId);
  }, [newOrderCount]); // Jalankan ulang efek jika newOrderCount berubah (untuk perbandingan)

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      {/* Elemen audio tersembunyi */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto"></audio>

      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin" className="text-xl font-bold hover:text-gray-300">
            Admin Panel
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isOrdersLink = link.name === 'Kelola Pesanan';

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-gray-900' : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {link.name}
                  {/* Tampilkan notifikasi di link "Kelola Pesanan" */}
                  {isOrdersLink && newOrderCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center ">
                      {newOrderCount}
                    </span>
                  )}
                </Link>
              );
            })}
             <Link href="/" className="bg-blue-500 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600">
                Lihat Situs
             </Link>
             {/* TOMBOL LOGOUT BARU */}
             <button 
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="bg-red-500 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
             >
                Logout
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
}