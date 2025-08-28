"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import MenuCardSkeleton from "@/components/MenuCardSkeleton";

// Tipe data untuk Kategori dan Produk
type Kategori = {
  id: number;
  nama_kategori: string;
};

type Produk = {
  id: number;
  nama_produk: string;
  deskripsi: string | null;
  harga: number;
  kategori_id: number;
  gambar_url: string | null;
  kategori: Kategori | null;
};

export default function HomePage() {
  const [semuaProduk, setSemuaProduk] = useState<Produk[]>([]);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [filterKategoriId, setFilterKategoriId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  const { cartItems, addToCart, removeFromCart } = useCart();

  // Ambil data produk dan kategori dari API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const produkRes = await fetch('/api/menu');
        if (!produkRes.ok) {
          throw new Error('Gagal ambil data menu');
        }
        const produkData: Produk[] = await produkRes.json();
        setSemuaProduk(produkData);
  
        // derive kategori unik dari produkData
        const kategoriMap = new Map<number, Kategori>();
        produkData.forEach((p) => {
          if (p.kategori && !kategoriMap.has(p.kategori.id)) {
            kategoriMap.set(p.kategori.id, p.kategori);
          }
        });
        // jika ingin urut berdasarkan nama:
        const kategoriArray = Array.from(kategoriMap.values()).sort((a, b) =>
          a.nama_kategori.localeCompare(b.nama_kategori)
        );
        setKategoriList(kategoriArray);
      } catch (err) {
        console.error(err);
        // bisa tampilkan toast atau state error di sini
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // Logika untuk memfilter produk
  const produkTersaring = filterKategoriId
    ? semuaProduk.filter(produk => produk.kategori_id === filterKategoriId)
    : semuaProduk;

  // Konfigurasi animasi untuk daftar produk
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <main className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex flex-col justify-center items-center text-center p-8 text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
            alt="Background makanan"
            layout="fill"
            objectFit="cover"
            quality={80}
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="flex z-10 flex-col items-center justify-center text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-4 "
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Sajian Lezat, Cita Rasa Hebat.
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl max-w-2xl mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Temukan hidangan favoritmu yang dibuat dari bahan-bahan segar
            pilihan, khusus untukmu.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link
              href="#menu"
              className="bg-[#3d2c1d] text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-black transition-transform hover:scale-105"
            >
              Lihat Menu
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Menu Section */}
      <section id="menu" className="py-20 px-8">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Menu Kami</h2>
          <p className="text-center text-gray-600 mb-12">
            Pilih kategori untuk melihat menu yang kamu suka.
          </p>

          {/* Tombol Filter Kategori */}
          <div className="flex justify-center flex-wrap gap-3 md:gap-4 mb-12">
            {isLoading ? (
              // SKELETON UNTUK TOMBOL KATEGORI
              <>
                <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
              </>
            ) : (
              // Tombol Kategori Asli
              <>
                <button
                  onClick={() => setFilterKategoriId(null)}
                  className={`px-5 py-2 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                    filterKategoriId === null
                      ? "bg-[#3d2c1d] text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Semua
                </button>
                {kategoriList.map((kategori) => (
                  <button
                    key={kategori.id}
                    onClick={() => setFilterKategoriId(kategori.id)}
                    className={`px-5 py-2 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ${
                      filterKategoriId === kategori.id
                        ? "bg-[#3d2c1d] text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {kategori.nama_kategori}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Daftar Produk */}
          {isLoading ? (
            // TAMPILKAN GRID SKELETON SAAT LOADING
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {/* Ulangi komponen skeleton sebanyak yang kamu mau, misal 8 kali */}
              {Array.from({ length: 8 }).map((_, index) => (
                <MenuCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {produkTersaring.map((item) => {
              // Cari item ini di dalam keranjang
              const itemDiKeranjang = cartItems.find(cartItem => cartItem.id === item.id);
              
              return (
                <motion.div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden transition-shadow hover:shadow-xl"
                  variants={itemVariants}
                >
                  <div className="w-full h-48 relative">
                      <Image
                        src={item.gambar_url || "/placeholder.png"} // Fallback ke gambar placeholder
                        alt={item.nama_produk}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  <div className="p-4 md:p-6 flex-grow flex flex-col">
                    <div className="flex-grow">
                      <h3 className="text-lg md:text-xl font-bold mb-2">{item.nama_produk}</h3>
                      <p className="text-gray-600 mb-4 text-xs md:text-sm">{item.deskripsi}</p>
                      <p className="text-md md:text-lg font-semibold text-blue-600">
                        Rp {item.harga.toLocaleString('id-ID')}
                      </p>
                    </div>

                    {/* ======================================= */}
                    {/* == LOGIKA TOMBOL BARU DIMULAI DI SINI == */}
                    {/* ======================================= */}
                    <div className="mt-4">
                      {itemDiKeranjang ? (
                        // JIKA ITEM SUDAH ADA DI KERANJANG, TAMPILKAN STEPPER
                        <div className="flex items-center justify-between bg-gray-100 rounded-lg">
                          <button 
                            onClick={() => removeFromCart(item.id, true)}
                            className="px-4 py-2 text-lg font-bold text-gray-700 rounded-l-lg hover:bg-gray-200"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-bold text-lg">{itemDiKeranjang.jumlah}</span>
                          <button 
                            onClick={() => addToCart(item)}
                            className="px-4 py-2 text-lg font-bold text-gray-700 rounded-r-lg hover:bg-gray-200"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        // JIKA BELUM ADA, TAMPILKAN TOMBOL TAMBAH
                        <button 
                          onClick={() => addToCart(item)}
                          className="w-full bg-[#3d2c1d] text-white font-bold py-2 px-4 rounded hover:bg-black transition-transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <span>Tambah</span>
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}