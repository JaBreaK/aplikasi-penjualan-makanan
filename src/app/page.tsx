"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion"; // Import framer-motion
import { useCart } from "@/context/CartContext"; // <-- IMPORT useCart

// The same data type as before
type MenuItem = {
  id: number;
  nama_produk: string;
  deskripsi: string | null;
  harga: number;
};

export default function HomePage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      // We still fetch data the same way
      const response = await fetch('/api/menu');
      const data = await response.json();
      setMenu(data);
      setIsLoading(false);
    };
    fetchMenu();
  }, []);

  // Animation variants for the container of the menu cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Each card animates 0.2s after the previous one
      },
    },
  };

  // Animation variants for each menu card
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <main className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex flex-col justify-center items-center text-center p-8"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 text-white z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Sajian Lezat, Cita Rasa Hebat.
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl max-w-2xl mb-8 text-gray-600 text-white z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Temukan hidangan favoritmu yang dibuat dari bahan-bahan segar pilihan, khusus untukmu.
        </motion.p>
        <motion.div
        className="z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="#featured-menu" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition-colors">
            Lihat Menu
          </Link>
        </motion.div>
      </motion.section>

      {/* Featured Items Section */}
      <section id="featured-menu" className="py-20 px-8">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Menu Andalan Kami</h2>
          {menu.slice(0, 3).map((item) => ( 
            <motion.div
              key={item.id}
              className="bg-white border rounded-lg p-6 shadow-md flex flex-col" // Tambah flex flex-col
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="flex-grow"> {/* Tambah div ini untuk mendorong tombol ke bawah */}
                <h3 className="text-2xl font-bold mb-2">{item.nama_produk}</h3>
                <p className="text-gray-600 mb-4">{item.deskripsi}</p>
                <p className="text-xl font-semibold text-blue-600">
                  Rp {item.harga.toLocaleString('id-ID')}
                </p>
              </div>
              <button 
                onClick={() => addToCart(item)}
                className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors"
              >
                + Tambah ke Keranjang
              </button>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Simple Footer */}
      <footer className="text-center py-8 bg-gray-100 border-t">
        <p>&copy; 2025 Nama Restoranmu. All Rights Reserved.</p>
      </footer>
    </main>
  );
}