"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import MenuCardSkeleton from "@/components/MenuCardSkeleton";

// Definisikan tipe data
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
};

export default function MenuPage() {
  const [semuaProduk, setSemuaProduk] = useState<Produk[]>([]);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [filterKategoriId, setFilterKategoriId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { cartItems, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [produkRes, kategoriRes] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/kategori')
      ]);
      if (produkRes.ok && kategoriRes.ok) {
        const produkData = await produkRes.json();
        const kategoriData = await kategoriRes.json();
        setSemuaProduk(produkData);
        setKategoriList(kategoriData);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const produkTersaring = useMemo(() => filterKategoriId
    ? semuaProduk.filter(produk => produk.kategori_id === filterKategoriId)
    : semuaProduk,
  [filterKategoriId, semuaProduk]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <section id="menu" className="py-12 md:py-20 px-4 md:px-8">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 font-serif">Menu Kami</h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Pilih kategori untuk melihat menu yang kamu suka, atau klik pada gambar untuk melihat detail lebih lanjut.</p>

          {/* Tombol Filter Kategori */}
          <div className="flex justify-center flex-wrap gap-3 md:gap-4 mb-12">
            {isLoading ? (
              <>
                <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse"></div>
              </>
            ) : (
              <>
                <button
  onClick={() => setFilterKategoriId(null)}
  className={`px-5 py-2 rounded-full font-semibold text-sm md:text-base transition-all duration-300
    ${
      filterKategoriId === null
        ? 'text-white shadow-lg bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700 bg-[length:200%_200%] animate-gradient'
        : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-orange-500 hover:via-amber-600 hover:to-orange-700 hover:text-white'
    }`}
>
  Semua
</button>

                {kategoriList.map((kategori) => (
                  <button
                  key={kategori.id}
                  onClick={() => setFilterKategoriId(kategori.id)}
                  className={`px-5 py-2 rounded-full font-semibold text-sm md:text-base transition-all duration-300
                    ${
                      filterKategoriId === kategori.id
                        ? 'text-white shadow-lg bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700 bg-[length:200%_200%] animate-gradient'
                        : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-orange-500 hover:via-amber-600 hover:to-orange-700 hover:text-white'
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
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {Array.from({ length: 8 }).map((_, index) => <MenuCardSkeleton key={index} />)}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6 md:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {produkTersaring.map((item) => {
                const itemDiKeranjang = cartItems.find(cartItem => cartItem.id === item.id);
                return (
                  <motion.div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden transition-shadow hover:shadow-xl h-full"
                    variants={itemVariants}
                  >
                    <Link href={`/menu/${item.id}`} className="block">
                      <div className="w-full h-40 md:h-48 relative">
                        <Image 
                          src={item.gambar_url || '/placeholder.png'}
                          alt={item.nama_produk} 
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                    </Link>
                    <div className="p-4 md:p-6 flex-grow flex flex-col">
                      <div className="flex-grow">
                        <h3 className="text-md md:text-xl font-bold mb-2 h-12">{item.nama_produk}</h3>
                        <p className="text-gray-600 leading-relaxed mb-8 line-clamp-2">
  {item.deskripsi}
</p>

                        <p className="text-lg font-semibold text-blue-600 mb-4">
                          Rp {item.harga.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="mt-auto">
                        {itemDiKeranjang ? (
                          <div className="flex items-center justify-between bg-gray-100 rounded-lg">
                            <button onClick={() => removeFromCart(item.id, true)} className="px-3 py-2 text-lg font-bold text-gray-700 hover:bg-gray-200"><Minus size={16} /></button>
                            <span className="font-bold text-lg">{itemDiKeranjang.jumlah}</span>
                            <button onClick={() => addToCart(item)} className="px-3 py-2 text-lg font-bold text-gray-700 hover:bg-gray-200"><Plus size={16} /></button>
                          </div>
                        ) : (
                          <button
  onClick={() => addToCart(item)}
  className="w-full rounded-full text-white font-bold px-5 py-2 
             bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700 
             bg-[length:200%_200%] animate-gradient 
             hover:from-orange-600 hover:via-amber-700 hover:to-orange-800 
             transition-transform hover:scale-105 
             flex items-center justify-center gap-2"
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