"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Kelola Pesanan', href: '/admin/orders' },
  { name: 'Kelola Menu', href: '/admin/manage-menu' },
  { name: 'Metode Pembayaran', href: '/admin/metode-pembayaran' },
];

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin" className="text-xl font-bold hover:text-gray-300">
            Admin Panel
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
             <Link href="/" className="bg-blue-500 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600">
                Lihat Situs
             </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}