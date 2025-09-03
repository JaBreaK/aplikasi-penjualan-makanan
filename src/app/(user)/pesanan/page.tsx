"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OrderHistorySkeleton from "@/components/OrderHistorySkeleton"; // <-- IMPORT BARU

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
        const savedNomorWa = localStorage.getItem('customer_nomor_wa');
        setNomorWa(savedNomorWa);

        if (savedNomorWa) {
            const fetchOrders = async () => {
                const response = await fetch(`/api/orders/by-wa/${savedNomorWa}`);
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
                setIsLoading(false);
            };
            fetchOrders();
        } else {
            setIsLoading(false);
        }
    }, []);

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Riwayat Pesanan</h1>

            <div className="max-w-2xl mx-auto">
                {isLoading ? (
                    // TAMPILKAN SKELETON SAAT LOADING
                    <div className="flex flex-col gap-4">
                        <OrderHistorySkeleton />
                        <OrderHistorySkeleton />
                        <OrderHistorySkeleton />
                        <OrderHistorySkeleton />
                        <OrderHistorySkeleton />
                        <OrderHistorySkeleton />
                        <OrderHistorySkeleton />
                        <OrderHistorySkeleton />
                    </div>
                ) : !nomorWa || orders.length === 0 ? (
                    // TAMPILKAN PESAN JIKA KOSONG
                    <div className="text-center max-w-md mx-auto">
                        <p className="text-gray-600 mb-6">
                            Kamu belum pernah membuat pesanan. Silakan lihat menu kami!
                        </p>
                        <Link href="/menu" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold">
                            Lihat Menu
                        </Link>
                    </div>
                ) : (
                    // TAMPILKAN HASIL JIKA ADA
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
                )}
            </div>
        </main>
    );
}