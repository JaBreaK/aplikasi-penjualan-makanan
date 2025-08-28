"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type MenuItem = {
  id: number;
  nama_produk: string;
  harga: number;
};

export default function ManageMenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      const response = await fetch('/api/menu');
      const data = await response.json();
      setMenu(data);
      setIsLoading(false);
    };
    fetchMenu();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin mau hapus menu ini?")) {
      return;
    }
  
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error("Gagal menghapus menu.");
      }
  
      // Jika berhasil, update tampilan dengan menghapus item dari state
      setMenu(menu.filter((item) => item.id !== id));
      alert("Menu berhasil dihapus!");
  
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghapus menu.");
    }
  };

  if (isLoading) return <p className="p-8">Loading...</p>;

  return (
    <main className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Kelola Menu</h1>
        <Link href="/admin/add-menu" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          + Tambah Menu
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="w-full bg-gray-100 text-left">
              <th className="p-3">Nama Produk</th>
              <th className="p-3">Harga</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">{item.nama_produk}</td>
                <td className="p-3">Rp {item.harga.toLocaleString("id-ID")}</td>
                <td className="p-3 flex gap-2">
                <Link 
  href={`/admin/edit-menu/${item.id}`} 
  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
>
  Edit
</Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}