"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Twitter, Youtube, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const facebookUrl = "https://www.facebook.com";
  const instagramUrl = "https://www.instagram.com";
  const twitterUrl = "https://www.twitter.com";
  const youtubeUrl = "https://www.youtube.com";
  const mapsQuery = encodeURIComponent("Jl. Cipaganti No.171, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat 40161, Indonesia");

  return (
    <footer className="py-10 bg-amber-900 text-amber-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Image src="/logo.png" alt="logo" width={120} height={120} className="mb-4" />
            <p className="mb-4">Ayam Goreng Kremes Terlezat sejak 1972</p>
            <div className="flex gap-3">
              <a
                href={facebookUrl}
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-amber-800 rounded-full hover:bg-amber-700"
              >
                <Facebook size={20} />
              </a>
              <a
                href={instagramUrl}
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-amber-800 rounded-full hover:bg-amber-700"
              >
                <Instagram size={20} />
              </a>
              <a
                href={twitterUrl}
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-amber-800 rounded-full hover:bg-amber-700"
              >
                <Twitter size={20} />
              </a>
              <a
                href={youtubeUrl}
                aria-label="Youtube"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-amber-800 rounded-full hover:bg-amber-700"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h5 className="font-bold text-lg mb-4">Tautan Cepat</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-amber-300">Home</Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-amber-300">Menu</Link>
              </li>
              <li>
                <Link href="/pesanan" className="hover:text-amber-300">Pesanan</Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-amber-300">Kontak</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold text-lg mb-4">Layanan</h5>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-amber-300">Pesan Antar</Link></li>
              <li><Link href="#" className="hover:text-amber-300">Reservasi</Link></li>
              <li><Link href="#" className="hover:text-amber-300">Drive Thru</Link></li>
              <li><Link href="#" className="hover:text-amber-300">Catering</Link></li>
              <li><Link href="#" className="hover:text-amber-300">Party Package</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold text-lg mb-4">Kontak</h5>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <a href="tel:+62222038677" className="flex items-center gap-2 hover:text-amber-300">
                  <Phone size={16} /> <span>022-2038677</span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} />
                <div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-300"
                  >
                    Jl. Cipaganti No.171, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat 40161, Indonesia
                  </a>
                </div>
              </li>
              <li>
                <span className="font-medium">Jam Operasional:</span>
                <p>Setiap Hari 09:00 - 21:00 WIB</p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-amber-800 text-center">
          <p>© {new Date().getFullYear()} Ayam Goreng Suharti — Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
