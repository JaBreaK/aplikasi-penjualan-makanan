"use client";

import Link from "next/link";
import Image from "next/image";
import { motion,  Variants } from "framer-motion";

import { ChefHat, Leaf, Clock, Heart, MapPin, Phone } from "lucide-react";

export default function SuhartiLandingPageExtended() {
    
  // Definisikan variants dengan tipe data yang benar
  const fadeIn = (delayTime: number = 0): Variants => ({
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        delay: delayTime // 'delay' ada di dalam 'transition'
      } 
    }
  });

  return (
    <main className="bg-[#fdfaf5] text-[#3d2c1d]">
      {/* 1. Hero Section - Full Screen Video */}
      <section className="relative h-screen flex justify-center items-center text-white text-center p-5 overflow-hidden">
        <div className="absolute inset-0 z-0 brightness-50">
           {/* Ganti dengan video pendek suasana restoran atau proses masak */}
           <video
            className="w-full h-full object-cover"
            src="https://videos.pexels.com/video-files/853865/853865-hd_1920_1080_25fps.mp4"
            autoPlay
            loop
            muted
            playsInline
          ></video>
        </div>
        <motion.div 
          className="relative z-10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 1, type: "spring" }} className="mb-4 inline-block">
              <Image src="/logo.png" alt="Logo Suharti" width={150} height={150} />
          </motion.div>
          <div className="flex flex-col items-center justify-center text-center">
  <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 drop-shadow-lg">
    Ayam Goreng Suharti
  </h1>
  <p className="text-lg md:text-xl max-w-2xl drop-shadow-md">
    Resep Otentik, Kenikmatan Sejak 1972
  </p>
</div>

        </motion.div>
      </section>

      {/* 2. Sejarah Kami - Timeline Interaktif */}
      <section className="py-24 px-5">
        <div className="container mx-auto max-w-4xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeIn()} className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-6">Perjalanan Cita Rasa Sejak 1972</h2>
            <p className="text-gray-600 leading-relaxed text-lg">Dari Yogyakarta untuk Indonesia, inilah kisah kami.</p>
          </motion.div>

          {/* Timeline Item 1 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeIn()} className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="w-full md:w-1/2 p-6 bg-white rounded-lg shadow-xl">
              <h3 className="font-bold text-2xl font-serif mb-2">1972: Awal Mula</h3>
              <p className="text-gray-600">Berawal dari sebuah warung sederhana di Yogyakarta, Ibu Suharti merintis usaha dengan resep ayam kremes warisan yang unik dan tak tertandingi.</p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
                <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg border-4 border-white">
                    <Image src="/menu/bg-testi.png" alt="Warung lama" width={200} height={200} className="object-cover w-full h-full"/>
                </div>
            </div>
          </motion.div>

          {/* Timeline Item 2 */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeIn()} className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="w-full md:w-1/2 p-6 bg-white rounded-lg shadow-xl">
              <h3 className="font-bold text-2xl font-serif mb-2">Era Modern</h3>
              <p className="text-gray-600">Membawa kelezatan yang sama ke seluruh penjuru negeri, kami tetap menjaga otentisitas resep sambil beradaptasi dengan zaman untuk melayani Anda lebih baik.</p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
                 <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg border-4 border-white">
                    <Image src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop" alt="Restoran modern" width={200} height={200} className="object-cover w-full h-full"/>
                </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Keunggulan Kami */}
      <section className="py-24 px-5 bg-white">
         <div className="container mx-auto text-center">
             <h2 className="text-4xl font-serif font-bold mb-16">Mengapa Memilih Kami?</h2>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
             <motion.div variants={fadeIn()} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="flex flex-col items-center">
                    <ChefHat size={48} className="text-yellow-600 mb-4"/>
                    <h3 className="font-bold text-xl mb-2">Resep Asli</h3>
                    <p className="text-gray-600">Resep otentik yang dijaga kemurniannya sejak puluhan tahun lalu.</p>
                 </motion.div>
                 <motion.div variants={fadeIn(0.2)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="flex flex-col items-center">
                    <Leaf size={48} className="text-green-600 mb-4"/>
                    <h3 className="font-bold text-xl mb-2">Bahan Segar</h3>
                    <p className="text-gray-600">Hanya menggunakan ayam kampung pilihan dan bumbu rempah segar.</p>
                 </motion.div>
                 <motion.div variants={fadeIn(0.4)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="flex flex-col items-center">
                    <Clock size={48} className="text-blue-600 mb-4"/>
                    <h3 className="font-bold text-xl mb-2">Selalu Hangat</h3>
                    <p className="text-gray-600">Setiap pesanan dimasak dadakan untuk menjamin kehangatan dan kerenyahan.</p>
                 </motion.div>
                 <motion.div variants={fadeIn(0.6)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="flex flex-col items-center">
                    <Heart size={48} className="text-red-600 mb-4"/>
                    <h3 className="font-bold text-xl mb-2">Dengan Hati</h3>
                    <p className="text-gray-600">Dimasak dengan cinta, disajikan dengan bangga untuk Anda.</p>
                 </motion.div>
             </div>
         </div>
      </section>

      {/* 4. Galeri Menu - Parallax Effect */}
      <section className="py-24 px-5">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-12">Sajian Andalan</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ganti dengan 3 produk terbaikmu dari API */}
            <motion.div variants={fadeIn()} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="group">
              <div className="overflow-hidden rounded-lg shadow-lg"><Image src="/menu/menu-1.jpeg" alt="Ayam Goreng" width={400} height={400} className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"/></div>
              <h3 className="text-2xl font-semibold mt-4">Ayam Goreng Kremes</h3>
            </motion.div>
            <motion.div variants={fadeIn(0.2)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="group">
              <div className="overflow-hidden rounded-lg shadow-lg"><Image src="/menu/menu-2.jpeg" alt="Gurame Asam Manis" width={400} height={400} className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"/></div>
              <h3 className="text-2xl font-semibold mt-4">Gurame Asam Manis</h3>
            </motion.div>
            <motion.div variants={fadeIn(0.4)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="group">
              <div className="overflow-hidden rounded-lg shadow-lg"><Image src="/menu/menu-3.jpeg" alt="Gudeg Kendil" width={400} height={400} className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"/></div>
              <h3 className="text-2xl font-semibold mt-4">Gudeg Kendil</h3>
            </motion.div>
          </div>
          <Link href="/menu" className="mt-12 inline-block bg-[#3d2c1d] text-white font-bold py-3 px-8 rounded-lg hover:bg-black transition-colors text-lg">
            Lihat Menu Lengkap & Pesan
          </Link>
        </div>
      </section>

      {/* 5. Lokasi & Kontak */}
      <section className="py-24 px-5 bg-white">
        <div className="container mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-12">Temukan Kami</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeIn()} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="max-w-full mx-auto rounded-lg shadow-2xl overflow-hidden">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.056976569107!2d110.3891824153835!3d-7.783850079366538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59d3b6b6b6b6%3A0x6b6b6b6b6b6b6b6b!2sAyam%20Goreng%20Suharti!5e0!3m2!1sen!2sid!4v1620000000000" width="100%" height="400" style={{ border: 0 }} allowFullScreen={false} loading="lazy"></iframe>
                </motion.div>
                <motion.div variants={fadeIn(0.2)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="text-left">
                    <div className="flex items-start gap-4 mb-6">
                        <MapPin size={24} className="text-yellow-600 mt-1"/>
                        <div>
                            <h3 className="font-bold text-xl">Alamat</h3>
                            <p className="text-gray-600">Jl. Laksda Adisucipto No.208, Janti, Caturtunggal, Depok, Sleman, Yogyakarta</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Phone size={24} className="text-yellow-600 mt-1"/>
                        <div>
                            <h3 className="font-bold text-xl">Reservasi</h3>
                            <p className="text-gray-600">(0274) 484215</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
      </section>
    </main>
  );
}