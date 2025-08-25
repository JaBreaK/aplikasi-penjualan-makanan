"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type MetodePembayaran = {
    id: number;
    nama_metode: string;
    is_active: boolean;
  };

export default function CartPage() {
    const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const [metodeList, setMetodeList] = useState<MetodePembayaran[]>([]);
  const [metodeId, setMetodeId] = useState("");
  const [nama, setNama] = useState("");
  const [nomorWa, setNomorWa] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    const savedNama = localStorage.getItem('customer_nama');
    const savedNomorWa = localStorage.getItem('customer_nomor_wa');
    if (savedNama) setNama(savedNama);
    if (savedNomorWa) setNomorWa(savedNomorWa);
  }, []);

  // Ambil daftar metode pembayaran yang aktif
  useEffect(() => {
    const fetchMetode = async () => {
      const response = await fetch('/api/metode-pembayaran');
      if (response.ok) {
        const data = await response.json();
        setMetodeList(data.filter((metode: MetodePembayaran) => metode.is_active));
      }
    };
    fetchMetode();
  }, []);

  const totalHarga = cartItems.reduce((total, item) => total + item.harga * item.jumlah, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metodeId) {
        alert("Silakan pilih metode pembayaran terlebih dahulu.");
        return;
    }
    setIsLoading(true);
    setMessage("");

    localStorage.setItem('customer_nama', nama);
    localStorage.setItem('customer_nomor_wa', nomorWa);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cartItems,
          nama_pelanggan: nama,
          nomor_wa: nomorWa,
          total_harga: totalHarga, // Kirim total harga dari frontend
          catatan_pelanggan: catatan,
          metode_pembayaran_id: parseInt(metodeId),
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal membuat pesanan.");
      }
      
      const createdOrder = await response.json();
      clearCart();
      router.push(`/pesanan/${createdOrder.id}`);

    } catch (error: unknown) { // <-- GANTI DARI 'any' KE 'unknown'
        // Lakukan pengecekan tipe sebelum digunakan
        if (error instanceof Error) {
          setMessage(`Error: ${error.message}`);
        } else {
          setMessage("Terjadi kesalahan yang tidak diketahui.");
        }
        setIsLoading(false);
      }
  };

  if (cartItems.length === 0 && !message) {
    return (
      <main className="container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Keranjang Belanja Kosong</h1>
        <p className="text-gray-600 mb-8">Sepertinya kamu belum menambahkan apa pun.</p>
        <Link href="/" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
          Kembali ke Menu
        </Link>
      </main>
    );
  }
  
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>
      {message && <p className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">{message}</p>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
        <div>
            <h2 className="text-2xl font-bold mb-4">Item di Keranjang</h2>
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow-md">
                  <div className="flex-grow">
                    <p className="font-bold text-lg">{item.nama_produk}</p>
                    <p className="text-gray-600">Rp {item.harga.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => removeFromCart(item.id, true)} className="bg-gray-200 px-3 py-1 rounded">-</button>
                    <span className="font-bold w-8 text-center">{item.jumlah}</span>
                    <button onClick={() => addToCart(item)} className="bg-gray-200 px-3 py-1 rounded">+</button>
                  </div>
                  <p className="w-32 text-right font-bold">
                    Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}
                  </p>
                  <button onClick={() => removeFromCart(item.id)} className="ml-4 text-red-500 hover:text-red-700 font-semibold">
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
            <form onSubmit={handleCheckout} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Detail Pelanggan</h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-1 font-semibold">Nama Lengkap</label>
                        <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} className="p-2 border rounded w-full" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">Nomor WhatsApp</label>
                        <input type="text" value={nomorWa} onChange={(e) => setNomorWa(e.target.value)} className="p-2 border rounded w-full" placeholder="Contoh: 08123456789" required />
                    </div>
                    <div>
              <label className="block mb-1 font-semibold">Pilih Metode Pembayaran</label>
              <select
                value={metodeId}
                onChange={(e) => setMetodeId(e.target.value)}
                className="p-2 border rounded w-full bg-white"
                required
              >
                <option value="" disabled>-- Pilih Opsi --</option>
                {metodeList.map(metode => (
                  <option key={metode.id} value={metode.id}>{metode.nama_metode}</option>
                ))}
              </select>
            </div>
                    <div>
                      <label className="block mb-1 font-semibold">Catatan untuk Penjual (Opsional)</label>
                      <textarea
                          value={catatan}
                          onChange={(e) => setCatatan(e.target.value)}
                          className="p-2 border rounded w-full"
                          placeholder="Contoh: Tolong sambalnya dipisah, jangan pakai bawang goreng."
                          rows={3}
                      ></textarea>
                  </div>
                </div>
            </form>
        </div>
        <div className="lg:col-span-1">
            {/* ... Ringkasan Pesanan & Tombol Checkout ... */}
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
              <h2 className="text-2xl font-bold mb-4">Ringkasan Pesanan</h2>
              <hr className="my-4"/>
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>Rp {totalHarga.toLocaleString('id-ID')}</p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isLoading || !nama || !nomorWa || cartItems.length === 0}
                className="w-full mt-6 bg-green-500 text-white font-bold py-3 rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                {isLoading ? 'Memproses...' : 'Buat Pesanan Sekarang'}
              </button>
            </div>
        </div>
      </div>
    </main>
  );
}