"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Definisikan tipe data
type Produk = { id: number; nama_produk: string; harga: number; gambar_url: string | null; };
type CartItem = { id: number; nama_produk: string; harga: number; jumlah: number; };

export default function KasirPage() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProduk = async () => {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setProdukList(data);
    };
    fetchProduk();
  }, []);

  const addToCart = (produk: Produk) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === produk.id);
      if (existing) {
        return prevCart.map(item => item.id === produk.id ? { ...item, jumlah: item.jumlah + 1 } : item);
      }
      return [...prevCart, { ...produk, jumlah: 1 }];
    });
  };

  // ... (buat fungsi removeFromCart, clearCart jika perlu)

  const totalHarga = cart.reduce((sum, item) => sum + item.harga * item.jumlah, 0);

  const handleSubmitOrder = async () => {
    setIsLoading(true);
    // Kita bisa asumsikan metode pembayaran cash untuk kasir, atau ambil dari DB
    const defaultMetodeId = 1; // Ganti dengan ID "Cash" atau "QRIS di Tempat"

    const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            cartItems: cart,
            total_harga: totalHarga,
            metode_pembayaran_id: defaultMetodeId,
            // nama & nomor WA tidak dikirim, akan diisi default oleh API
        })
    });

    if(response.ok) {
        alert('Pesanan berhasil dibuat!');
        setCart([]);
        router.push('/admin/orders'); // Arahkan ke daftar pesanan
    } else {
        alert('Gagal membuat pesanan.');
    }
    setIsLoading(false);
  };

  return (
    <main className="flex h-[calc(100vh-4rem)]">
      {/* Kiri: Daftar Produk */}
      <div className="w-3/5 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Pilih Menu</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {produkList.map(produk => (
            <button key={produk.id} onClick={() => addToCart(produk)} className="p-2 border rounded-lg text-center hover:bg-gray-100">
              {produk.gambar_url && <Image src={produk.gambar_url} alt={produk.nama_produk} width={100} height={100} className="mx-auto rounded-md object-cover h-24 w-full" />}
              <p className="font-semibold mt-2 text-sm">{produk.nama_produk}</p>
              <p className="text-xs text-gray-600">Rp {produk.harga.toLocaleString('id-ID')}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Kanan: Keranjang & Checkout */}
      <div className="w-2/5 bg-gray-50 p-6 flex flex-col border-l">
        <h2 className="text-2xl font-bold mb-4">Pesanan Saat Ini</h2>
        <div className="flex-grow overflow-y-auto">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold">{item.nama_produk}</p>
                <p className="text-sm text-gray-500">{item.jumlah} x Rp {item.harga.toLocaleString('id-ID')}</p>
              </div>
              <p className="font-bold">Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}</p>
            </div>
          ))}
          {cart.length === 0 && <p className="text-center text-gray-500">Keranjang masih kosong.</p>}
        </div>
        <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-2xl mb-4">
                <span>Total:</span>
                <span>Rp {totalHarga.toLocaleString('id-ID')}</span>
            </div>
            <button 
                onClick={handleSubmitOrder} 
                disabled={cart.length === 0 || isLoading}
                className="w-full bg-green-500 text-white font-bold py-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
            >
                {isLoading ? 'Memproses...' : 'Buat Pesanan & Bayar'}
            </button>
        </div>
      </div>
    </main>
  );
}