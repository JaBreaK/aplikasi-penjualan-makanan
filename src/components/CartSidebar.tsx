"use client";
    
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";

export default function CartSidebar() {
    const { 
        isCartOpen, 
        closeCart, 
        cartItems, 
        addToCart, 
        removeFromCart,
        // State & fungsi checkout
        nama, setNama, 
        nomorWa, setNomorWa, 
        catatan, setCatatan,
        metodeId, setMetodeId,
        metodeList,
        handleCheckout, 
        isCheckingOut 
    } = useCart();

    const total = cartItems.reduce((sum, item) => sum + item.harga * item.jumlah, 0);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        
                        className="fixed z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    <motion.div
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold">Pesanan Anda</h2>
                            <button onClick={closeCart} className="p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
                        </div>
                        
                        {cartItems.length > 0 ? (
                            <>
                                <div className="flex-grow p-4 overflow-y-auto">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex gap-4 mb-4">
                                            <div>
                                                <p className="font-semibold">{item.nama_produk}</p>
                                                <p className="text-sm text-gray-500">Rp {item.harga.toLocaleString('id-ID')}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button onClick={() => removeFromCart(item.id, true)} className="border rounded-full p-1 hover:bg-gray-100"><Minus size={14}/></button>
                                                    <span>{item.jumlah}</span>
                                                    <button onClick={() => addToCart(item)} className="border rounded-full p-1 hover:bg-gray-100"><Plus size={14}/></button>
                                                </div>
                                            </div>
                                            <div className="ml-auto text-right">
                                                <p className="font-bold">Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}</p>
                                                <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline mt-2">Hapus</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t bg-gray-50">
                                    <div className="space-y-3 mb-4">
                                        <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama Anda" className="p-2 border rounded w-full" required />
                                        <input
  type="tel"
  value={nomorWa}
  onChange={(e) => {
    const onlyNums = e.target.value.replace(/\D/g, ""); // hapus selain angka
    setNomorWa(onlyNums);
  }}
  placeholder="Nomor WhatsApp"
  className="p-2 border rounded w-full"
  required
/>

                                        <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Catatan (opsional)" className="p-2 border rounded w-full" rows={2}></textarea>
                                        <select value={metodeId} onChange={(e) => setMetodeId(e.target.value)} className="p-2 border rounded w-full bg-white" required>
                                            <option value="" disabled>Pilih Metode Pembayaran</option>
                                            {metodeList.map(metode => (<option key={metode.id} value={metode.id}>{metode.nama_metode}</option>))}
                                        </select>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg mb-4">
                                        <span>Total</span>
                                        <span>Rp {total.toLocaleString('id-ID')}</span>
                                    </div>
                                    <button onClick={handleCheckout} disabled={isCheckingOut || !nama || !nomorWa || !metodeId} className="w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400">
                                        {isCheckingOut ? 'Memproses...' : 'Buat Pesanan'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-grow flex flex-col justify-center items-center p-6 text-center">
                                <p className="text-gray-500 mb-4">Keranjang Anda masih kosong.</p>
                                <button onClick={closeCart} className="bg-gray-200 px-4 py-2 rounded-lg">Lanjut Belanja</button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}