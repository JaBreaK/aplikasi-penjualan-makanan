"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Tipe data untuk pesanan
type Order = {
    id: number;
    waktu_order: string;
    total_harga: number;
    status_pembayaran: string;
}

export default function RiwayatPesananPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [nomorWa, setNomorWa] = useState<string | null>(null);

    useEffect(() => {
        // Ambil nomor WA dari Local Storage
        const savedNomorWa = localStorage.getItem('customer_nomor_wa');
        setNomorWa(savedNomorWa);

        // Jika nomor WA ditemukan, ambil data pesanannya
        if (savedNomorWa) {
            const fetchOrders = async () => {
                setIsLoading(true);
                const response = await fetch(`/api/orders/by-wa/${savedNomorWa}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
                setIsLoading(false);
            };
            fetchOrders();
        } else {
            // Jika tidak ada nomor WA, langsung berhenti loading
            setIsLoading(false);
        }
    }, []); // Hanya berjalan sekali saat halaman dimuat

    // Tampilan saat loading
    if (isLoading) {
        return <p className="p-8 text-center">Memuat riwayat pesanan...</p>;
    }

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Riwayat Pesanan Anda</h1>

            {/* Jika tidak ada nomor WA atau tidak ada pesanan */}
            {!nomorWa || orders.length === 0 ? (
                <div className="text-center max-w-md mx-auto">
                    <p className="text-gray-600 mb-6">
                        Kamu belum pernah membuat pesanan. Silakan lihat menu kami dan buat pesanan pertamamu!
                    </p>
                    <Link href="/" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold">
                        Lihat Menu
                    </Link>
                </div>
            ) : (
                // Jika ada pesanan, tampilkan daftarnya
                <div className="max-w-2xl mx-auto">
                    <p className="text-center text-gray-500 mb-6">
                        Menampilkan semua pesanan untuk nomor WhatsApp: <strong>{nomorWa}</strong>
                    </p>
                    <div className="flex flex-col gap-4">
                        {orders.map(order => (
                            <Link href={`/pesanan/${order.id}`} key={order.id} className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">Pesanan #{order.id}</p>
                                        <p className="text-sm text-gray-500">{new Date(order.waktu_order).toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">Rp {order.total_harga.toLocaleString('id-ID')}</p>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            order.status_pembayaran === 'LUNAS' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                                            
                                        }`}>
                                            {order.status_pembayaran.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}