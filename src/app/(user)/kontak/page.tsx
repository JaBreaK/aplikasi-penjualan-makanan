// src/app/(user)/kontak/page.tsx
import type { Metadata } from 'next';
import KontakPageClient from '@/components/KontakPageClient'; // Impor komponen baru

// Sediakan Metadata di sini (Server)
export const metadata: Metadata = {
  title: 'Hubungi Kami - Ayam Goreng Suharti',
  description: 'Hubungi kami untuk pertanyaan, reservasi, atau kemitraan. Temukan alamat dan nomor telepon Ayam Goreng Suharti di sini.',
};

// Panggil Komponen Klien
export default function KontakPage() {
  return <KontakPageClient />;
}