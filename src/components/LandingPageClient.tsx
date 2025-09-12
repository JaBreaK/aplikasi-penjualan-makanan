"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect,  useState } from "react";
import { motion, Variants, AnimatePresence, HTMLMotionProps, RepeatType } from "framer-motion";

import { ChefHat, Leaf, Clock, Heart, Phone, Star, ShoppingCart, MapPin, Users, Award, Truck,  ChevronLeft, ChevronRight, Instagram, Facebook } from "lucide-react";

export default function SuhartiLandingPageExtended() {
  // ---------- variants & helpers ----------
  const fadeIn = (delayTime: number = 0): Variants => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: delayTime, ease: 'easeOut' } }
  });

  const pop = (delay = 0): Variants => ({
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 28, delay } }
  });

  // --- return any so TypeScript won't complain about exact transition literal types ---
  const floatY = (amount = 8): Partial<HTMLMotionProps<"div">> => ({
    animate: { y: [0, -amount, 0] },
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: 'loop' as RepeatType,
      ease: 'easeInOut'
    }
  });
  
  const rotate = (amount = 5): Partial<HTMLMotionProps<"div">> => ({
    animate: { rotate: [0, -amount, 0, amount, 0] },
    transition: {
      duration: 8,
      repeat: Infinity,
      repeatType: 'loop' as RepeatType,
      ease: 'easeInOut'
    }
  });

  // ---------- sample data ----------
  const testimonials = [
    { name: 'Rani Putri', text: 'Gurihnya nempel, kremesnya juara — selalu pesan tiap minggu!', avatar: '/testi/testi-1.jpeg', score: 5 },
    { name: 'Budi Santoso', text: 'Paket keluarga worth it, porsi besar dan rasa autentik.', avatar: '/testi/testi-2.png', score: 5 },
    { name: 'Siti Rahma', text: 'Pelayanan cepat, masih hangat sampai rumah. Recommended!', avatar: '/testi/testi-3.avif', score: 4 },
    { name: 'Ahmad Fauzi', text: 'Rasanya seperti masakan ibu, nostalgic banget!', avatar: '/testi/testi-4.webp', score: 5 },
    { name: 'Dewi Lestari', text: 'Harganya terjangkau, kualitas premium. Langganan sejak 2010!', avatar: '/testi/testi-5.jpg', score: 5 }
  ];

  

  const outlets = [
    { city: 'Bandung', address: 'Jl. Contoh No.123', phone: '(022) 123456' },
    { city: 'Jakarta', address: 'Jl. Contoh No.456', phone: '(021) 789012' },
    { city: 'Yogyakarta', address: 'Jl. Contoh No.789', phone: '(0274) 345678' },
    { city: 'Surabaya', address: 'Jl. Contoh No.101', phone: '(031) 901234' }
  ];

  const events = [
    { date: '15 Sep', title: 'Workshop Masak', desc: 'Belajar membuat ayam kremes ala Suharti' },
    { date: '22 Sep', title: 'HUT Suharti', desc: 'Diskon spesial 20% untuk semua menu' },
    { date: '30 Sep', title: 'Festival Kuliner', desc: 'Temui kami di Festival Kuliner Bandung' }
  ];

  // ---------- interactive states ----------
  const [visibleTesti, setVisibleTesti] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setVisibleTesti((s) => (s + 1) % testimonials.length), 4000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  // small counter animation
  const [orders, setOrders] = useState(1245);
  useEffect(() => {
    const id = setInterval(() => setOrders((o) => (o + Math.floor(Math.random() * 3) + 1)), 2200);
    return () => clearInterval(id);
  }, []);

  // carousel index for menu
  

  // gallery state
  
  const galleryImages = [
    '/menuu/menu-1.webp', '/menuu/menu-2.webp', '/menuu/menu-3.webp', 
    '/menu/menu-4.png', '/menu/menu-5.png', '/menu/menu-6.png'
  ];

  // FAQ state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const faqs = [
    { question: 'Apakah menyediakan layanan catering?', answer: 'Ya, kami menyediakan layanan catering untuk acara keluarga, kantor, dan acara spesial lainnya.' },
    { question: 'Bagaimana cara pemesanan online?', answer: 'Anda bisa memesan melalui aplikasi GoFood, GrabFood, atau menghubungi kami langsung di nomor telepon yang tersedia.' },
    { question: 'Apakah ada menu vegetarian?', answer: 'Kami menyediakan beberapa menu vegetarian seperti gudeg, tempe, tahu, dan sayuran tradisional lainnya.' },
    { question: 'Berapa lama waktu pengantaran?', answer: 'Waktu pengantaran bervariasi tergantung lokasi, umumnya 30-45 menit untuk area dalam kota.' }
  ];

  // ---------- visual helpers (no external config) ----------
  const gradientClass = 'global-gradient';

  return (
    <main className="bg-gradient-to-b from-white via-orange-50 to-white text-gray-800 relative overflow-x-hidden">

      {/* inline global styles for lively animations */}
      <style jsx global>{`
        .global-gradient{background:linear-gradient(90deg,#F0A04B 0%,#FFD166 45%,#F59E0B 100%);background-size:200% 200%;animation:gradientShift 6s ease infinite}
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        .float-blob{filter:blur(12px);opacity:0.22}
        .sparkle{position:absolute;pointer-events:none;mix-blend-mode:screen;filter:blur(0.5px)}
        .pulse{animation:pulseGlow 1.8s infinite}
        @keyframes pulseGlow{0%{box-shadow:0 0 0 0 rgba(240,160,75,0.35)}70%{box-shadow:0 0 0 18px rgba(240,160,75,0)}100%{box-shadow:0 0 0 0 rgba(240,160,75,0)}}
        .parallax-item{transition:transform 0.3s ease-out}
        .menu-card:hover .menu-image{transform:scale(1.05)}
        .menu-image{transition:transform 0.5s ease}
        .floating-element{animation:floating 5s ease-in-out infinite}
        @keyframes floating{0%{transform:translateY(0px)}50%{transform:translateY(-10px)}100%{transform:translateY(0px)}}
      `}</style>

      {/* floating decorative blobs & icons */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div className="absolute left-8 top-10 w-52 h-52 rounded-full bg-[#FFD166] float-blob" animate={{ y: [0, -18, 0], x: [0, 8, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}/>
        <motion.div className="absolute right-8 top-20 w-40 h-40 rounded-full bg-[#F0A04B] float-blob" animate={{ y: [0, -10, 0], x: [0, -8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}/>
        <motion.div className="absolute left-1/2 top-48 w-28 h-28 rounded-full bg-[#FFB86B] float-blob" animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}/>
        
        {/* Additional floating elements */}
        <motion.div className="absolute left-1/4 bottom-1/3 w-8 h-8 rounded-full bg-orange-300 opacity-40" {...floatY(12)} />
        <motion.div className="absolute right-1/4 top-2/3 w-6 h-6 rounded-full bg-amber-300 opacity-30" {...floatY(8)} />
        <motion.div className="absolute left-1/3 bottom-1/4 w-10 h-10 rounded-full bg-yellow-200 opacity-20" {...floatY(15)} />
        
        {/* Floating food icons */}
        <motion.div className="absolute left-20 top-1/3 text-amber-600 opacity-50" {...rotate(8)}>
          <ChefHat size={32} />
        </motion.div>
        <motion.div className="absolute right-24 bottom-1/4 text-amber-700 opacity-40" {...rotate(-5)}>
          <Leaf size={28} />
        </motion.div>
      </div>

      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/menu/ayam.jpg" alt="hero" fill className="object-cover brightness-60" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Animated particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-yellow-400 opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 10 - 5, 0],
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">

            <motion.div initial={{ x: -18, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.18 }} className="text-center md:text-left">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }} className="inline-block mb-4">
                <Image src="/logo.png" alt="logo" width={120} height={120} className="floating-element" />
              </motion.div>
              <motion.h1 
                initial={{ y: 18, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.28 }} 
                className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight drop-shadow-lg"
              >
                Ayam Goreng <span className="text-amber-300">Suharti</span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center md:justify-start mt-2 gap-2"
              >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-white ml-2 text-sm">4.9 (1.235 reviews)</span>
              </motion.div>
              
              <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.34 }} className="mt-4 text-white/90 max-w-xl text-lg">
                Resep otentik, kriuk sempurna. Dimasak dengan cinta sejak 1972.
              </motion.p>

              <div className="mt-8 flex flex-wrap gap-4 items-center justify-center md:justify-start">
                <motion.a 
                  whileHover={{ scale: 1.04 }} 
                  whileTap={{ scale: 0.98 }} 
                  href="https://gofood.co.id/bandung/restaurant/ayam-goreng-suharti-cipaganti-c2f9102d-8517-41ed-a246-884b9cf5613c" 
                  className={`inline-flex items-center gap-3 px-6 py-4 rounded-full font-bold text-lg ${gradientClass} text-white shadow-xl transform transition hover:shadow-2xl`}
                >
                  <ShoppingCart size={20} /> Pesan via GoFood
                </motion.a>
                
                <motion.a 
                  whileHover={{ scale: 1.04 }} 
                  whileTap={{ scale: 0.98 }} 
                  href="/menu" 
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-full font-bold text-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                >
                  Lihat Menu Lengkap
                </motion.a>
              </div>

              <motion.div className="mt-6 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white inline-flex items-center gap-3 pulse">
                <ChefHat size={20}/> 
                <span className="font-semibold">{orders.toLocaleString()}+ Pesanan Hari Ini</span>
              </motion.div>

              {/* animated quick badges */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <motion.div {...floatY(6)} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-white text-sm backdrop-blur-sm"> 
                  <Leaf size={16}/> Bahan Segar Setiap Hari
                </motion.div>
                <motion.div {...floatY(8)} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-white text-sm backdrop-blur-sm"> 
                  <Clock size={16}/> Siap Kirim dalam 15 Menit
                </motion.div>
                <motion.div {...floatY(5)} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-white text-sm backdrop-blur-sm"> 
                  <Heart size={16}/> Dimasak Dengan Hati
                </motion.div>
              </div>
            </motion.div>

            {/* animated promo/order card */}
            <motion.aside 
              initial={{ x: 18, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              transition={{ delay: 0.4, type: "spring" }} 
              className="relative w-full md:w-[450px] p-6 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl floating-element"
            >
              <div className="absolute -top-10 right-6 w-28 h-28 rounded-full overflow-hidden shadow-2xl border-2 border-white">
                <Image src="/menu/menu-1.jpeg" alt="promo" width={120} height={120} className="object-cover w-full h-full"/>
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/30 to-transparent"></div>
              </div>

              <div className="pt-16">
                <div className="flex items-center gap-2 mb-2">
                  <div className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">PROMO TERBATAS</div>
                  <div className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">DISKON 15%</div>
                </div>
                
                <h3 className="text-white font-bold text-2xl mb-2">Paket Keluarga Spesial</h3>
                <p className="text-white/90 text-sm mb-4">Nikmati paket hemat 4 porsi + sambal spesial + es teh manis — hanya untuk pemesanan online.</p>

                <div className="flex items-center gap-2 text-white mb-4">
                  <Clock size={16} />
                  <span className="text-sm">Berlaku hingga 30 September 2090</span>
                </div>

                <div className="mt-4 flex gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.98 }} 
                    className={`flex-1 py-3 rounded-xl ${gradientClass} text-white font-bold shadow-lg`}
                  >
                    Pesan Sekarang
                  </motion.button>
                  <motion.button 
                    whileHover={{ y: -4, scale: 1.05 }} 
                    whileTap={{ scale: 0.98 }} 
                    className="p-3 rounded-xl bg-white text-amber-600 font-bold shadow-lg"
                  >
                    <ShoppingCart size={20}/>
                  </motion.button>
                </div>

                <div className="mt-4 flex gap-2 text-xs text-white/80">
                  <div className="bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">🅿️ Gratis Parkir</div>
                  <div className="bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">🎉 Reservasi</div>
                  <div className="bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">📦 Takeaway</div>
                  <div className="bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">🚗 Drive-Thru</div>
                </div>
              </div>
            </motion.aside>

          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="py-12 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center p-6 rounded-2xl bg-amber-50 shadow-md"
            >
              <Users className="mx-auto text-amber-600" size={36} />
              <div className="text-3xl font-bold text-amber-700 mt-3">50.000+</div>
              <div className="text-amber-600">Pelanggan Setia</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 rounded-2xl bg-amber-50 shadow-md"
            >
              <Award className="mx-auto text-amber-600" size={36} />
              <div className="text-3xl font-bold text-amber-700 mt-3">12</div>
              <div className="text-amber-600">Penghargaan</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center p-6 rounded-2xl bg-amber-50 shadow-md"
            >
              <Truck className="mx-auto text-amber-600" size={36} />
              <div className="text-3xl font-bold text-amber-700 mt-3">25</div>
              <div className="text-amber-600">Kota Terjangkau</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center p-6 rounded-2xl bg-amber-50 shadow-md"
            >
              <ChefHat className="mx-auto text-amber-600" size={36} />
              <div className="text-3xl font-bold text-amber-700 mt-3">51</div>
              <div className="text-amber-600">Tahun Berpengalaman</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SAMPLES: timeline + menu carousel + animated gallery */}
      <section className="py-14 md:py-20 px-4 md:px-8 bg-gradient-to-b from-white to-amber-50 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div variants={fadeIn()} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Perjalanan Cita Rasa — <span className="text-orange-500">Sejak 1972</span></h2>
            <p className="text-gray-600 mt-2">Dari warung kecil hingga menjadi legenda kuliner Indonesia</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <motion.div variants={pop(0.05)} whileHover={{ y: -8 }} className="p-6 bg-white rounded-2xl shadow-lg border border-amber-100">
              <div className="text-amber-500 font-bold text-2xl mb-2">1972</div>
              <h4 className="font-bold text-lg mb-2">Awal Mula</h4>
              <p className="text-gray-600">Buka pertama kali sebagai warung kaki lima dengan resep kremes legendaris.</p>
            </motion.div>

            <motion.div variants={pop(0.12)} whileHover={{ y: -8 }} className="p-6 bg-white rounded-2xl shadow-lg border border-amber-100">
              <div className="text-amber-500 font-bold text-2xl mb-2">1995</div>
              <h4 className="font-bold text-lg mb-2">Ekspansi Pertama</h4>
              <p className="text-gray-600">Membuka cabang pertama dengan tetap mempertahankan kualitas dan cita rasa.</p>
            </motion.div>

            <motion.div variants={pop(0.2)} whileHover={{ y: -8 }} className="p-6 bg-white rounded-2xl shadow-lg border border-amber-100">
              <div className="text-amber-500 font-bold text-2xl mb-2">2023</div>
              <h4 className="font-bold text-lg mb-2">Era Digital</h4>
              <p className="text-gray-600">Order online, layanan cepat, dan kemasan premium untuk pengalaman terbaik.</p>
            </motion.div>
          </div>

          {/* menu section */}
          

          {/* gallery section */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">Galeri <span className="text-amber-600">Kami</span></h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((img, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="relative h-48 md:h-64 rounded-2xl overflow-hidden shadow-md"
                >
                  <Image src={img} alt={`Gallery image ${i+1}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-lg font-medium">Lihat Detail</div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/menu" className="px-6 py-3 rounded-full bg-amber-600 text-white font-medium hover:bg-amber-700">
                Lihat Semua Menu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* keunggulan */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-white relative overflow-hidden">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-serif font-bold mb-12"
          >
            Mengapa Memilih <span className="text-amber-600">Kami?</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8 }} 
              className="p-6 bg-amber-50 rounded-2xl shadow-sm border border-amber-100"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <ChefHat className="text-amber-600" size={28}/>
              </div>
              <h4 className="font-bold text-lg mb-2">Resep Asli</h4>
              <p className="text-gray-600">Resep turun-temurun yang tidak berubah sejak 1972.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8 }} 
              className="p-6 bg-amber-50 rounded-2xl shadow-sm border border-amber-100"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Leaf className="text-green-600" size={28}/>
              </div>
              <h4 className="font-bold text-lg mb-2">Bahan Segar</h4>
              <p className="text-gray-600">Dibuat dari bahan pilihan berkualitas terbaik.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -8 }} 
              className="p-6 bg-amber-50 rounded-2xl shadow-sm border border-amber-100"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Clock className="text-blue-600" size={28}/>
              </div>
              <h4 className="font-bold text-lg mb-2">Selalu Hangat</h4>
              <p className="text-gray-600">Dimasak saat dipesan, diantarkan dengan cepat.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -8 }} 
              className="p-6 bg-amber-50 rounded-2xl shadow-sm border border-amber-100"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Heart className="text-red-600" size={28}/>
              </div>
              <h4 className="font-bold text-lg mb-2">Dengan Hati</h4>
              <p className="text-gray-600">Disajikan dengan penuh cinta dan perhatian.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — carousel, animated */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-amber-50 relative overflow-hidden">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Apa Kata <span className="text-amber-600">Pelanggan Kami</span></h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setVisibleTesti((v) => (v - 1 + testimonials.length) % testimonials.length)} 
                className="p-2 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setVisibleTesti((v) => (v + 1) % testimonials.length)} 
                className="p-2 rounded-full bg-amber-100 text-amber-600 hover:bg-amber-200"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="relative h-72">
            <AnimatePresence initial={false} mode="wait">
              {testimonials.map((t, i) => i === visibleTesti && (
                <motion.div 
                  key={t.name} 
                  initial={{ opacity: 0, x: 40 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -40 }} 
                  transition={{ duration: 0.6 }} 
                  className="absolute inset-0 p-6 bg-white rounded-2xl shadow-lg"
                >
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-100">
                      <Image src={t.avatar} alt={t.name} width={96} height={96} className="object-cover w-full h-full"/>
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-1 text-amber-500 mb-2">
                        {Array.from({length: t.score}).map((_,i) => (
                          <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="font-semibold text-lg">{t.name}</p>
                      <p className="text-gray-600 mt-3 text-lg italic">
  <q>{t.text}</q>
</p>

                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setVisibleTesti(i)}
                  className={`w-3 h-3 rounded-full ${i === visibleTesti ? 'bg-amber-600' : 'bg-amber-200'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-center mb-12"
          >
            Acara & <span className="text-amber-600">Promo Spesial</span>
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-amber-50 rounded-2xl p-6 shadow-md border border-amber-100"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-amber-600 text-white rounded-lg p-3 text-center min-w-[60px]">
                    <div className="font-bold text-xl">{event.date.split(' ')[0]}</div>
                    <div className="text-sm">{event.date.split(' ')[1]}</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{event.title}</h4>
                    <p className="text-gray-600">{event.desc}</p>
                  </div>
                </div>
                <button className="mt-4 w-full py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700">
                  Info Lengkap
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-amber-50">
        <div className="container mx-auto max-w-4xl">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-center mb-12"
          >
            Pertanyaan <span className="text-amber-600">Umum</span>
          </motion.h3>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button 
                  className="flex justify-between items-center w-full p-5 text-left font-medium text-lg"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  <span>{faq.question}</span>
                  <ChevronRight 
                    size={20} 
                    className={`transform transition-transform ${activeFaq === i ? 'rotate-90' : ''}`}
                  />
                </button>
                
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-gray-600">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUTLETS SECTION */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-center mb-12"
          >
            Cabang <span className="text-amber-600">Kami</span>
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {outlets.map((outlet, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-amber-50 rounded-2xl p-5 shadow-md border border-amber-100"
              >
                <h4 className="font-bold text-lg mb-2">{outlet.city}</h4>
                <p className="text-gray-600 mb-3">{outlet.address}</p>
                <p className="text-amber-600 font-medium">{outlet.phone}</p>
                <button className="mt-4 w-full py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 flex items-center justify-center gap-2">
                  <MapPin size={16} /> Lihat Peta
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LOKASI & KONTAK with animated pins */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-amber-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <motion.h4 
                variants={fadeIn()} 
                initial="hidden" 
                whileInView="visible" 
                className="text-2xl font-bold mb-4"
              >
                Kunjungi <span className="text-amber-600">Kami</span>
              </motion.h4>
              
              <motion.p 
                variants={fadeIn(0.08)} 
                initial="hidden" 
                whileInView="visible" 
                className="text-gray-600 mb-6"
              >
                Jl. Cipaganti No.171, Pasteur, Bandung — buka 09:00 - 21:00 setiap hari. Nikmati suasana nyaman dan pelayanan terbaik kami.
              </motion.p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="text-amber-600" size={20} />
                  <span>Setiap Hari: 09:00 - 21:00 WIB</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-amber-600" size={20} />
                  <span>+62 812 3456 7890</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-amber-600" size={20} />
                  <span>Jl. Cipaganti No.171, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat 40161, Indonesia</span>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <motion.a 
                  whileHover={{ scale: 1.03 }} 
                  href="tel:+628123456789" 
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-amber-600 text-white font-medium shadow-md"
                >
                  <Phone size={16}/> Hubungi
                </motion.a>
                
                <motion.a 
                  whileHover={{ scale: 1.03 }} 
                  href="#" 
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-full ${gradientClass} text-white font-medium shadow-md`}
                >
                  <MapPin size={16}/> Arahkan
                </motion.a>
                
                <motion.a 
                  whileHover={{ scale: 1.03 }} 
                  href="#" 
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 text-white font-medium shadow-md"
                >
                  <Facebook size={16}/> Facebook
                </motion.a>
                
                <motion.a 
                  whileHover={{ scale: 1.03 }} 
                  href="#" 
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-pink-600 text-white font-medium shadow-md"
                >
                  <Instagram size={16}/> Instagram
                </motion.a>
              </div>
            </div>

            <motion.div 
              variants={fadeIn(0.14)} 
              initial="hidden" 
              whileInView="visible" 
              className="w-full h-96 rounded-2xl overflow-hidden shadow-lg relative"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.052432623904!2d107.60114700000001!3d-6.884323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6f453cfc7c3%3A0xd755c1e1973cc075!2sAyam%20Goreng%20Suharti!5e0!3m2!1sid!2smm!4v1756654194895!5m2!1sid!2smm"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              
              {/* Animated map marker */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MapPin size={40} className="drop-shadow-lg" />
              </motion.div>
            </motion.div>
          </div>

          
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="py-12 px-4 md:py-16 md:px-8 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-4"
          >
            Dapatkan Info <span className="text-amber-600">Promo Terbaru</span>
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Daftarkan email Anda untuk mendapatkan informasi promo terbaru, menu spesial, dan acara menarik dari Ayam Goreng Suharti.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-3 justify-center items-center"
          >
            <input 
              type="email" 
              placeholder="Alamat email Anda" 
              className="px-5 py-3 border border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 w-full md:w-auto flex-grow max-w-md"
            />
            <button className={`px-6 py-3 rounded-full ${gradientClass} text-white font-medium shadow-md whitespace-nowrap`}>
              Berlangganan
            </button>
          </motion.div>
        </div>
      </section>

      
    </main>
  );
}
