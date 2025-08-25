"use client";

import { useEffect, useState, FormEvent, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // <-- Pastikan Image di-import

// Gabungkan Tipe Data
type MetodePembayaran = {
    nama_metode: string;
    nomor_rekening: string | null;
    nama_rekening: string | null;
    gambar_qris_url: string | null;
};
type Order = {
    id: number;
    status_pembayaran: string;
    total_harga: number;
    keterangan_batal: string | null; // <-- TAMBAHKAN INI
    catatan_pelanggan: string | null;
    orderitems: {
        jumlah: number;
        produk: { nama_produk: string };
    }[];
    pembayaran: {
        metodepembayaran: MetodePembayaran;
    }[];
};

// Komponen untuk Indikator Status
const StatusIndicator = ({ status }: { status: string }) => {
    let bgColor = "bg-gray-400";
    let text = "Status Tidak Dikenal";
    let info = "Hubungi admin untuk informasi lebih lanjut.";

    switch (status) {
        case "BELUM_BAYAR":
            bgColor = "bg-yellow-500";
            text = "Menunggu Pembayaran";
            info = "Silakan lakukan pembayaran dan upload bukti di bawah ini.";
            break;
        case "MENUNGGU_KONFIRMASI":
            bgColor = "bg-blue-500";
            text = "Pembayaran Sedang Diverifikasi";
            info = "Bukti pembayaranmu sudah kami terima. Mohon tunggu proses verifikasi oleh admin.";
            break;
        case "LUNAS":
            bgColor = "bg-green-500";
            text = "Pembayaran Berhasil & Pesanan Diproses";
            info = "Terima kasih! Pesananmu sedang kami siapkan.";
            break;
        case "BATAL":
            bgColor = "bg-red-500";
            text = "Pembayaran Dibatalkan";
            info = "Silakan hubungi admin untuk informasi lebih lanjut.";
            break;
    }

    return (
        <div className={`p-6 rounded-lg text-white text-center ${bgColor}`}>
            <p className="font-bold text-xl">{text}</p>
            <p className="text-sm mt-1">{info}</p>
        </div>
    );
};


export default function PesananDetailPage() {
    const { orderId } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [buktiBayar, setBuktiBayar] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");

    const fetchOrder = useCallback(async () => {
        if (orderId) {
            setIsLoading(true);
            const savedNomorWa = localStorage.getItem('customer_nomor_wa');
            if (!savedNomorWa) {
                setOrder(null);
                setIsLoading(false);
                return;
            }
            const response = await fetch(`/api/orders/${orderId}?nomorWa=${savedNomorWa}`);
            if (response.ok) {
                setOrder(await response.json());
            } else {
                setOrder(null);
            }
            setIsLoading(false);
        }
    }, [orderId]); // <-- Tambahkan orderId sebagai dependency

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const handleUpload = async (e: FormEvent) => {
        e.preventDefault();
        if (!buktiBayar) return;
        setIsLoading(true);
        const formData = new FormData();
        formData.append("bukti", buktiBayar);

        const response = await fetch(`/api/konfirmasi-pembayaran/${orderId}`, {
            method: "POST", body: formData,
        });

        if (response.ok) {
            setMessage("Upload berhasil! Status akan segera terupdate setelah verifikasi.");
            await fetchOrder(); 
        } else {
            setMessage("Upload gagal, coba lagi.");
        }
        setIsLoading(false);
    };

    if (isLoading) return <p className="p-8 text-center">Memuat pesanan...</p>;
    if (!order) return <p className="p-8 text-center">Pesanan tidak ditemukan atau Anda tidak memiliki akses.</p>;

    const metodepembayaran = order.pembayaran?.[0]?.metodepembayaran;

    return (
        <main className="container mx-auto p-8 flex justify-center bg-gray-50 min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full h-fit">
                <h1 className="text-2xl font-bold mb-2">Detail Pesanan #{order.id}</h1>
                <p className="text-gray-500 mb-6">Terima kasih atas pesananmu!</p>

                <StatusIndicator status={order.status_pembayaran} />

                {order.status_pembayaran === 'BATAL' && order.keterangan_batal && (
                    <div className="my-6 bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-lg text-left">
                        <p className="font-bold">Pesanan Dibatalkan</p>
                        <p>Alasan: {order.keterangan_batal}</p>
                    </div>
                )}
                {message && <p className="my-4 p-3 bg-blue-100 text-blue-800 rounded-md text-center">{message}</p>}

                <div className="my-6 border-t pt-6">
                    <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>
                    <ul className="mb-4 space-y-1">
                        {order.orderitems.map((item, index) => (
                            <li key={index} className="flex justify-between text-gray-700">
                                <span>{item.jumlah}x {item.produk.nama_produk}</span>
                            </li>
                        ))}
                    </ul>
                    {order.catatan_pelanggan && (
                        <div className="mt-4 bg-yellow-50 p-3 rounded-lg">
                            <p className="font-semibold text-sm">Catatan Anda:</p>
                            <p className="text-gray-700 text-sm">{order.catatan_pelanggan}</p>
                        </div>
                    )}
                    <hr className="my-4"/>
                    <div className="flex justify-between font-bold text-lg mt-2">
                        <span>TOTAL</span>
                        <span>Rp {order.total_harga.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                {order.status_pembayaran === 'BELUM_BAYAR' && (
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                         <h2 className="text-xl font-bold mb-4">Instruksi Pembayaran</h2>
                         <p className="mb-2">Silakan lakukan pembayaran sejumlah total pesanan ke salah satu metode di bawah ini:</p>
                         {metodepembayaran ? (
                            <div className="p-4 bg-white rounded-md border">
                                <p className="font-bold text-lg">{metodepembayaran.nama_metode}</p>
                                {metodepembayaran.nomor_rekening && (
                                    <p className="mt-1">Nomor: <strong className="text-lg">{metodepembayaran.nomor_rekening}</strong></p>
                                )}
                                {metodepembayaran.nama_rekening && (
                                    <p>A/N: <strong>{metodepembayaran.nama_rekening}</strong></p>
                                )}
                                {metodepembayaran.gambar_qris_url && (
                                    <div className="mt-2">
                                        <Image src={metodepembayaran.gambar_qris_url} alt={`QRIS ${metodepembayaran.nama_metode}`} width={200} height={200} className="rounded-md"/>
                                    </div>
                                )}
                            </div>
                         ) : (
                            <p>Metode pembayaran tidak ditemukan.</p>
                         )}
                     <p className="mt-4 font-semibold text-red-600">PENTING: Setelah melakukan pembayaran, upload bukti transfer di bawah ini.</p>

                         <form onSubmit={handleUpload} className="mt-6">
                            <label className="block mb-2 font-semibold">Upload Bukti Pembayaran:</label>
                            <input type="file" onChange={(e) => setBuktiBayar(e.target.files?.[0] || null)} className="w-full p-2 border rounded" required />
                            <button type="submit" disabled={isLoading} className="w-full mt-4 bg-blue-500 text-white font-bold py-3 rounded-lg disabled:bg-gray-400">
                                {isLoading ? 'Mengupload...' : 'Konfirmasi Pembayaran'}
                            </button>
                         </form>
                    </div>
                )}

                <Link href="/pesanan" className="mt-8 inline-block text-blue-600 hover:underline">
                    Kembali ke Halaman Pesanan
                </Link>
            </div>
        </main>
    );
}