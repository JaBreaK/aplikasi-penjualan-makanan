"use client";

import { useState, useEffect } from "react";
import type { orders_status_pembayaran } from "@prisma/client"; 

// Definisikan tipe data baru yang lebih lengkap
type Produk = {
  nama_produk: string;
};

type OrderItem = {
  id: number;
  jumlah: number;
  produk: Produk;
};

type MetodePembayaran = {
  nama_metode: string;
};

type pembayaran = {
  id: number;
  status: string;
  metodepembayaran: MetodePembayaran;
  bukti_pembayaran_url: string ;
};

type Order = {
  id: number;
  waktu_order: string;
  nama_pelanggan: string;
  nomor_wa: string;
  total_harga: number;
  status_pembayaran: string;
  keterangan_batal: string | null;
  orderitems: OrderItem[];
  pembayaran: pembayaran[];
  catatan_pelanggan: string | null; // <-- TAMBAHKAN TIPE INI
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null); // Reset error setiap kali fetch
    try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
            throw new Error("Gagal memuat data pesanan");
        }
        const data = await response.json();
        setOrders(data);
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        }
    } finally {
        setIsLoading(false);
    }
};

  useEffect(() => {
    fetchOrders();
  }, []);

    // UBAH TIPE DATA DI SINI
    const handleUpdateStatus = async (orderId: number, newStatus: orders_status_pembayaran, keterangan?: string) => {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            status_pembayaran: newStatus, // newStatus sekarang punya tipe yang benar
            keterangan_batal: keterangan
          }),
        });
  
        if (!response.ok) throw new Error("Gagal update");
        
        await fetchOrders();
        
      } catch (error: unknown) { // Beri tipe 'unknown'
        // Sekarang 'error' sudah dipakai untuk menampilkan pesan yang lebih spesifik
        if (error instanceof Error) {
          alert(`Terjadi kesalahan: ${error.message}`);
        } else {
          alert("Terjadi kesalahan yang tidak diketahui.");
        }
      }
    };
    
    const handleBatal = (orderId: number) => {
      const alasan = prompt("Masukkan alasan pembatalan pesanan:");
      if (alasan) { 
          handleUpdateStatus(orderId, 'BATAL', alasan); // Kirim 'BATAL' sebagai tipe ENUM
      }
    };

  if (isLoading) return <p className="p-8">Memuat pesanan...</p>;
  if (error) return <p className="p-8 text-center text-red-500">Error: {error}</p>;

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Daftar Pesanan Masuk</h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => {
          // Ambil data pembayaran terbaru (jika ada)
          const pembayaranTerbaru = order.pembayaran?.[0];
          let statusColor = "bg-yellow-200 text-yellow-800";
          if (order.status_pembayaran === 'LUNAS') statusColor = "bg-green-200 text-green-800";
          if (order.status_pembayaran === 'BATAL') statusColor = "bg-red-200 text-red-800";

          return (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex justify-between items-center mb-4">
                {/* ... (Info Order ID dan Waktu tidak berubah) ... */}
                <div>
                    <h2 className="font-bold text-xl">Order #{order.id}</h2>
                    <p className="text-sm text-gray-500">
                      {new Date(order.waktu_order).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColor}`}>
                  {order.status_pembayaran.replace('_', ' ')}
                </span>
              </div>
              {/* Tampilkan keterangan jika pesanan dibatalkan */}
              {order.status_pembayaran === 'BATAL' && order.keterangan_batal && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                  <p className="font-bold">Alasan Pembatalan:</p>
                  <p>{order.keterangan_batal}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold">Pelanggan:</h3>
                  <p>{order.nama_pelanggan} ({order.nomor_wa})</p>
                </div>
                <div>
                  <h3 className="font-semibold">Metode Pembayaran:</h3>
                  <p className="font-medium text-blue-600">
                    {pembayaranTerbaru?.metodepembayaran?.nama_metode || 'N/A'}
                  </p>
                </div>
                {/* BAGIAN BARU UNTUK METODE PEMBAYARAN */}
                <div>
          <h3 className="font-semibold">Bukti Pembayaran:</h3>
          {pembayaranTerbaru?.bukti_pembayaran_url ? (
            <a href={pembayaranTerbaru.bukti_pembayaran_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Lihat Bukti
            </a>
          ) : (
            <p>Belum diupload</p>
          )}
        </div>

                {/* ... (Detail Pesanan, Total, dan Tombol tidak berubah) ... */}
                 <h3 className="font-semibold mb-2">Detail Pesanan:</h3>
                  <ul className="list-disc list-inside">
                    {order.orderitems.map((item) => (
                      <li key={item.id}>
                        {item.jumlah}x {item.produk.nama_produk}
                      </li>
                    ))}
                  </ul>
                </div>
                {order.catatan_pelanggan && (
  <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4">
    <p className="font-bold">Catatan dari Pelanggan:</p>
    <p>{order.catatan_pelanggan}</p>
  </div>
)}
                <div className="text-right font-bold text-lg mt-4">
                  Total: Rp {order.total_harga.toLocaleString('id-ID')}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  {/* Tombol Batal, hanya muncul jika status bukan LUNAS atau BATAL */}
                {order.status_pembayaran !== 'LUNAS' && order.status_pembayaran !== 'BATAL' && (
                    <button onClick={() => handleBatal(order.id)} className="bg-red-500 text-white px-4 py-2 rounded">
                        Batalkan Pesanan
                    </button>
                )}
    {/* Tampilkan tombol Verifikasi jika ada bukti dan statusnya MENUNGGU */}
    {order.status_pembayaran === 'MENUNGGU_KONFIRMASI' && pembayaranTerbaru?.bukti_pembayaran_url && (
        <button
            onClick={() => handleUpdateStatus(order.id, 'LUNAS')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
            Verifikasi & Tandai LUNAS
        </button>
    )}

    {/* Tombol "Tandai LUNAS" manual jika statusnya masih BELUM_BAYAR (untuk pembayaran cash/lainnya) */}
    {order.status_pembayaran === 'BELUM_BAYAR' && (
        <button
            onClick={() => handleUpdateStatus(order.id, 'LUNAS')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Tandai LUNAS (Manual)
        </button>
    )}
    
    <button onClick={() => window.open(`/admin/orders/cetak/${order.id}`, '_blank')} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
        Cetak Struk
    </button>
</div>
            </div>
          );
        })}
      </div>
    </main>
  );
}