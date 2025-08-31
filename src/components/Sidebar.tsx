"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from "next-auth/react";
import { LayoutDashboard, ListOrdered, Utensils, CreditCard, Tag, LogOut, X } from 'lucide-react';
import Image from 'next/image';

const navLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Pesanan', href: '/admin/orders', icon: ListOrdered },
  { name: 'Menu', href: '/admin/manage-menu', icon: Utensils },
  { name: 'Kategori', href: '/admin/kategori', icon: Tag },
  { name: 'Pembayaran', href: '/admin/metode-pembayaran', icon: CreditCard },
];

export default function Sidebar({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) {
  const pathname = usePathname();

  const NavLink = ({ link }: { link: typeof navLinks[0] }) => {
    const isActive = pathname === link.href;
    return (
        <Link
            href={link.href}
            onClick={toggle}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200 transition-all hover:bg-gray-700 hover:text-white ${isActive ? 'bg-gray-800 text-white' : ''}`}
        >
            <link.icon className="h-4 w-4" />
            {link.name}
        </Link>
    );
  }

  return (
    <>
        {/* Backdrop untuk mobile */}
        {isOpen && <div onClick={toggle} className="fixed inset-0 bg-black/60 z-20 lg:hidden"></div>}

        <aside className={`fixed top-0 left-0 z-30 flex h-full w-64 flex-col border-r border-gray-700 bg-[#1f2937] transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between border-b border-gray-700 p-4 h-16">
                <Link href="/admin" className="flex items-center gap-2 font-semibold text-white">
                    <Image src="/logo.png" alt="Logo" width={90} height={30} />
                    <span>Admin</span>
                </Link>
                <button onClick={toggle} className="lg:hidden text-white p-2">
                    <X size={24} />
                </button>
            </div>
            <nav className="flex flex-1 flex-col gap-y-2 p-4">
                {navLinks.map((link) => (
                    <NavLink key={link.name} link={link} />
                ))}
                <div className="mt-auto flex flex-col gap-y-2">
                    <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200 transition-all hover:bg-gray-700 hover:text-white">
                        Lihat Situs
                    </Link>
                    <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200 transition-all hover:bg-gray-700 hover:text-white text-left">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </nav>
        </aside>
    </>
  );
}