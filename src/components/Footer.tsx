"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kolom 1: Logo & About */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="mb-4">
              {/* Gunakan logo versi putih/terang jika ada */}
              <Image src="/logo.png" alt="Logo" width={150} height={50} />
            </Link>
            <p className="text-sm max-w-xs">
              Menyajikan kelezatan otentik Ayam Goreng Kremes dengan resep warisan sejak 1972.
            </p>
          </div>

          {/* Kolom 2: Quick Links */}
          <div>
            <h3 className="font-bold text-lg text-white mb-4 relative pb-2">
              Tautan Cepat
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-yellow-500"></span>
            </h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/menu" className="hover:text-white transition-colors">Menu</Link></li>
              <li><Link href="/pesanan" className="hover:text-white transition-colors">Pesanan</Link></li>
              <li><Link href="/kontak" className="hover:text-white transition-colors">Kontak</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Social Media */}
          <div>
            <h3 className="font-bold text-lg text-white mb-4 relative pb-2">
              Hubungi Kami
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-yellow-500"></span>
            </h3>
            <p className="text-sm mb-4">Jl. Cipaganti No.171, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat 40161, Indonesia</p>
            <div className="flex gap-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <Facebook size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 py-6">
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Ayam Goreng Suharti. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}