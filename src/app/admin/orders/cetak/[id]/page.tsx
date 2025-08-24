"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Tipe data ini bisa diimpor dari file lain nanti agar tidak duplikat
type Order = {
  id: number;
  waktu_order: string;
  nama_pelanggan: string;
  total_harga: number;
  orderitems: {
    jumlah: number;
    subtotal: number;
    produk: {
      nama_produk: string;
      harga: number;
    };
  }[];
};

export default function CetakStrukPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        // Kita butuh API baru untuk mengambil satu order
        const response = await fetch(`/api/orders/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
          // Tunggu data ter-render, lalu panggil window.print()
          setTimeout(() => window.print(), 500);
        }
      };
      fetchOrder();
    }
  }, [id]);

  if (!order) return <p className="text-center p-8">Memuat struk...</p>;

  return (
    <div className="bg-white text-black font-mono p-4 max-w-xs mx-auto">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
      <div className="printable-area">
        <h1 className="text-center font-bold text-lg">Nama Restoranmu</h1>
        <p className="text-center text-xs">Jl. Kode No. 123, Kota Koding</p>
        <hr className="my-2 border-dashed border-black"/>
        <div className="text-xs">
          <p>No. Pesanan: #{order.id}</p>
          <p>Tanggal: {new Date(order.waktu_order).toLocaleString('id-ID')}</p>
          <p>Pelanggan: {order.nama_pelanggan}</p>
        </div>
        <hr className="my-2 border-dashed border-black"/>
        <table className="w-full text-xs">
          <tbody>
            {order.orderitems.map((item, index) => (
              <tr key={index}>
                <td className="align-top">{item.jumlah}x</td>
                <td>{item.produk.nama_produk}</td>
                <td className="text-right">{item.subtotal.toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr className="my-2 border-dashed border-black"/>
        <div className="text-xs text-right">
          <p>
            <span className="font-bold">TOTAL:</span> {order.total_harga.toLocaleString('id-ID')}
          </p>
        </div>
        <p className="text-center text-xs mt-4">--- Terima Kasih ---</p>
      </div>
    </div>
  );
}