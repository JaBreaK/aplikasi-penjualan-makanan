"use client";

import { useState, useEffect } from "react";

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

type Pembayaran = {
  id: number;
  status: string;
  metodePembayaran: MetodePembayaran;
};

type Order = {
  id: number;
  waktu_order: string;
  nama_pelanggan: string;
  nomor_wa: string;
  total_harga: number;
  status_pembayaran: string;
  orderitems: OrderItem[];
  pembayaran: Pembayaran[]; // <-- TAMBAHKAN TIPE INI
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ... (useEffect dan handleUpdateStatus tidak berubah)
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
      setIsLoading(false);
    };
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_pembayaran: newStatus }),
      });
      if (!response.ok) throw new Error("Gagal update");
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status_pembayaran: newStatus } : order
      ));
    } catch (error) {
      alert("Terjadi kesalahan.");
    }
  };

  if (isLoading) return <p className="p-8">Memuat pesanan...</p>;

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Daftar Pesanan Masuk</h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => {
          // Ambil data pembayaran terbaru (jika ada)
          const pembayaranTerbaru = order.pembayaran?.[0];

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
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    order.status_pembayaran === 'LUNAS' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {order.status_pembayaran.replace('_', ' ')}
                  </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold">Pelanggan:</h3>
                  <p>{order.nama_pelanggan} ({order.nomor_wa})</p>
                </div>
                {/* BAGIAN BARU UNTUK METODE PEMBAYARAN */}

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
                <div className="text-right font-bold text-lg mt-4">
                  Total: Rp {order.total_harga.toLocaleString('id-ID')}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  {order.status_pembayaran !== 'LUNAS' && (
                    <button onClick={() => handleUpdateStatus(order.id, 'LUNAS')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Tandai LUNAS
                    </button>
                  )}
                  {order.status_pembayaran !== 'BELUM_BAYAR' && (
                    <button onClick={() => handleUpdateStatus(order.id, 'BELUM_BAYAR')} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                      Batal LUNAS
                    </button>
                  )}
                  <button
  onClick={() => window.open(`/admin/orders/cetak/${order.id}`, '_blank')}
  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
>
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