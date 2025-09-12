"use client";

import { motion } from 'framer-motion';
import { MapPin, Phone} from 'lucide-react';


export default function KontakPageClient() {
  return (
    <main className="bg-gradient-to-b from-white via-orange-50 to-white">
      <div className="container mx-auto px-6 py-16 md:py-24">
        {/* Judul Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-brand-dark">Get in Touch</h1>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Kami senang mendengar darimu. Baik itu pertanyaan, masukan, atau sekadar sapaan.
          </p>
        </motion.div>

        {/* Layout Utama Dua Kolom */}
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Kiri: Peta dan Info Kontak */}
          <div className="space-y-8">
            <motion.div 
              className="h-80 w-full rounded-lg shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
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
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="flex items-start gap-4 mb-6">
                <MapPin size={24} className="text-brand-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-brand-dark">Alamat</h3>
                  <p className="text-gray-600">Jl. Cipaganti No.171, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat 40161, Indonesia</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone size={24} className="text-brand-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-brand-dark">Telepon</h3>
                  <p className="text-gray-600">0222038677</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Kanan: Form Kontak */}
          <motion.div
            className="bg-brand-secondary p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-brand-dark mb-6">Kirim Pesan</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">Nama Anda</label>
                <input type="text" id="name" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent transition" />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">Email Anda</label>
                <input type="email" id="email" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent transition" />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1 font-medium">Pesan</label>
                <textarea id="message" rows={5} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-brand-primary text-brand-dark font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Kirim
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}