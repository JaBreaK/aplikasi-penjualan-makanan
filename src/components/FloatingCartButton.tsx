"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function FloatingCartButton() {
    const { cartItems, isCartOpen, openCart } = useCart();

    const totalItems = cartItems.reduce((sum, item) => sum + item.jumlah, 0);

    // Tombol ini hanya akan muncul jika ada item di keranjang DAN cart sedang tertutup
    if (totalItems === 0 || isCartOpen) {
        return null;
    }

    return (
        <motion.div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 md:hidden" // Hanya tampil di layar kecil
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
        >
            <button
                onClick={openCart}
                className="flex items-center gap-3 bg-blue-600 text-white font-bold px-6 py-3 rounded-full shadow-lg"
            >
                <ShoppingCart size={20} />
                <span>Lihat Keranjang ({totalItems})</span>
            </button>
        </motion.div>
    );
}