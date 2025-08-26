"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Phone, MapPin, Heart } from "lucide-react";

const signatureMenus = [
  {
    id: 1,
    name: "Ayam Goreng Klasik Suharti",
    desc: "Rahasia bumbu turun-temurun, renyah di luar lembut di dalam.",
    img: "https://images.unsplash.com/photo-1604908177522-0b7e9a9f3f3d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Ayam Geprek Pedas Asli",
    desc: "Cocol sambal racikan pabrik rasa rumahan yang pedas nendang.",
    img: "https://images.unsplash.com/photo-1617196033239-28e4aa3b6d5a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Paket Nasi + Lalapan",
    desc: "Paket hemat lengkap untuk makan keluarga.",
    img: "https://images.unsplash.com/photo-1604908873472-f9c58b119f9a?q=80&w=1200&auto=format&fit=crop",
  },
];

const history = [
  { year: "1965", text: "Dibuka pertama kali sebagai warung kecil keluarga." },
  { year: "1980", text: "Resep bumbu dipatenkan sebagai resep keluarga." },
  { year: "1998", text: "Mulai ekspansi ke beberapa kota di pulau Jawa." },
  { year: "2015", text: "Generasi kedua membawa inovasi menu geprek." },
  { year: "2024", text: "Memperkuat brand online & layanan pesan antar." },
];

const testimonials = [
  { name: "Siti", text: "Rasa nostalgia! Seperti masakan ibu." },
  { name: "Budi", text: "Sambalnya bikin ketagihan." },
  { name: "Rina", text: "Rasa konsisten sejak kecil." },
];

export default function LandingPage() {
  return (
    <main className="bg-white text-slate-900 antialiased">
      {/* HERO */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center p-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop"
            alt="Ayam Suharti"
            fill
            style={{ objectFit: "cover" }}
            quality={80}
            priority
            className="animate-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
        </div>

        {/* Decorative floating badges */}
        <motion.div
          initial={{ y: -40, x: -40, opacity: 0 }}
          animate={{ y: 0, x: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 60 }}
          className="absolute top-8 left-8 z-20"
        >
          <div className="px-3 py-2 bg-yellow-400/95 text-black rounded-full font-bold flex items-center gap-2 shadow-xl">
            <Heart size={16} />
            Warisan Sejak 1965
          </div>
        </motion.div>

        <div className="relative z-10 max-w-4xl">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-yellow-300 drop-shadow-lg"
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Ayam Goreng <span className="text-white">Suharti</span>
          </motion.h1>

          <motion.p
            className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Renyahnya legendaris, bumbu turun-temurun. Dari warung keluarga jadi rasa
            yang dicari banyak generasi.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 flex justify-center gap-4"
          >
            <Link
              href="/menu"
              className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-full text-lg hover:bg-yellow-400 transition-transform hover:scale-105 inline-flex items-center gap-2 shadow-lg"
              aria-label="Lihat Menu dan Pesan"
            >
              <span>Lihat Menu & Pesan</span>
              <ArrowRight size={18} />
            </Link>

            <a
              href="#tentang"
              className="text-white/90 bg-black/30 py-3 px-6 rounded-full hover:bg-black/40 transition"
            >
              Tentang Suharti
            </a>
          </motion.div>
        </div>

        {/* subtle marquee */}
        <div className="absolute bottom-8 inset-x-0 z-20">
          <div className="overflow-hidden">
            <motion.div
              className="whitespace-nowrap text-white/80 text-sm md:text-base"
              animate={{ x: ["100%", "-100%"] }}
              transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            >
              • Resep keluarga • Daging pilihan • Sambal racikan khas • Layanan antar cepat •
            </motion.div>
          </div>
        </div>

        {/* Floating chicken illustration (svg) */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="absolute right-8 bottom-24 z-10 hidden md:block"
        >
          <div className="w-36 h-36 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M3 12c1-2 3-4 6-4s5 2 6 4" stroke="#fde68a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
              <circle cx="17" cy="8" r="3" stroke="#fde68a" strokeWidth="1.2" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* ABOUT / HISTORY */}
      <section id="tentang" className="py-20 bg-gradient-to-b from-white to-yellow-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-1/2">
              <motion.h2
                className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Sejarah Singkat Suharti
              </motion.h2>
              <motion.p
                className="text-slate-700 mb-6"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Bermula dari sebuah warung keluarga, Suharti tumbuh lewat resep bumbu yang
                diwariskan turun-temurun. Dari dapur kecil ke lidah banyak orang — setiap
                gigitan membawa cerita.
              </motion.p>

              <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-yellow-300/80" />
                <div className="space-y-6">
                  {history.map((item, idx) => (
                    <motion.div
                      key={item.year}
                      className="relative"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.12 }}
                    >
                      <div className="absolute -left-9 top-0 w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-sm shadow">
                        {item.year.split("").slice(0, 2).join("")}
                      </div>
                      <div className="pl-6">
                        <div className="font-semibold">{item.year}</div>
                        <div className="text-slate-600">{item.text}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:w-1/2 flex items-center justify-center">
              <motion.div
                className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
                initial={{ scale: 0.98, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative h-80">
                  <Image
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop"
                    alt="Warisan resep"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="font-bold text-lg">Warisan Keluarga</div>
                    <div className="text-sm">Resep asli & rasa yang setia</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE MENU */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h3
            className="text-2xl md:text-3xl font-extrabold mb-6"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            Menu Andalan
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {signatureMenus.map((m, i) => (
              <motion.div
                key={m.id}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-2xl transform hover:-translate-y-2 transition"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 * i }}
              >
                <div className="relative h-44">
                  <Image src={m.img} alt={m.name} fill style={{ objectFit: "cover" }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                <div className="p-4">
                  <div className="font-bold text-lg">{m.name}</div>
                  <div className="text-slate-600 mt-2 text-sm">{m.desc}</div>
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      href={`/menu/#${m.id}`}
                      className="text-yellow-500 font-semibold inline-flex items-center gap-2"
                    >
                      Pesan Sekarang
                      <ArrowRight size={16} />
                    </Link>
                    <div className="text-sm text-slate-500">Mulai dari <span className="font-semibold">Rp 18.000</span></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-yellow-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h4
            className="text-2xl font-extrabold mb-6"
            initial={{ scale: 0.98, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            Mereka yang Sudah Coba
          </motion.h4>

          <div className="relative">
            <AnimatePresence>
              <motion.div
                key={testimonials[0].name}
                className="bg-white rounded-2xl p-8 shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-lg italic">“{testimonials[0].text}”</div>
                <div className="mt-4 font-bold">— {testimonials[0].name}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CONTACT / FOOTER */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="font-extrabold text-xl">Ayam Goreng Suharti</div>
            <div className="text-slate-300 mt-2">Warisan rasa dari dapur keluarga ke meja Anda.</div>
            <div className="mt-4 flex items-center gap-3 text-slate-300">
              <Phone size={16} />
              <a href="tel:+628123456789" className="hover:text-white">+62 812-3456-789</a>
            </div>
            <div className="mt-2 flex items-center gap-3 text-slate-300">
              <MapPin size={16} />
              <span>Jl. Contoh No.10, Kota</span>
            </div>
          </div>

          <div>
            <div className="font-semibold mb-2">Jam Operasional</div>
            <div className="text-slate-300">Senin - Minggu: 09.00 - 21.00</div>

            <div className="mt-6">
              <div className="font-semibold mb-2">Ikuti Kami</div>
              <div className="flex gap-3">
                <a className="px-3 py-2 bg-white/10 rounded">Instagram</a>
                <a className="px-3 py-2 bg-white/10 rounded">Facebook</a>
              </div>
            </div>
          </div>

          <div>
            <div className="font-semibold mb-2">Pesan Cepat</div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // karena aturan tidak buat file baru / backend, kita tampilkan alert sederhana
                alert("Terima kasih! Tim Suharti akan menghubungi Anda (demo).");
              }}
              className="space-y-3"
            >
              <input required placeholder="Nama" className="w-full px-3 py-2 rounded bg-white/5" />
              <input required placeholder="No. HP" className="w-full px-3 py-2 rounded bg-white/5" />
              <textarea placeholder="Pesan singkat" className="w-full px-3 py-2 rounded bg-white/5" rows={3} />
              <button type="submit" className="mt-2 inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded font-semibold">
                Kirim
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-8 text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} Ayam Goreng Suharti — Semua hak cipta dilindungi.
        </div>
      </footer>

      {/* Persistent quick-order button */}
      <motion.a
        href="/menu"
        initial={{ scale: 0.9 }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="fixed bottom-6 right-6 z-50 bg-yellow-500 text-black px-4 py-3 rounded-full shadow-xl flex items-center gap-3"
      >
        <Phone size={18} />
        Pesan Sekarang
      </motion.a>

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        @keyframes zoom-in-out {
          0% { transform: scale(1); }
          50% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .animate-zoom {
          animation: zoom-in-out 20s ease-in-out infinite;
          will-change: transform;
          transform-origin: center center;
        }
        /* small utility for glass blur on supported browsers */
        .backdrop-blur-sm {
          -webkit-backdrop-filter: blur(4px);
          backdrop-filter: blur(4px);
        }
        /* reduce image dragging selection */
        img {
          -webkit-user-drag: none;
          user-drag: none;
        }
      `}</style>
    </main>
  );
}
