"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MenuForm } from "@/components/admin/MenuForm"; // Komponen form yang akan kita buat
import Image from "next/image";

// Definisikan tipe data
type Produk = {
    id: number;
    nama_produk: string;
    deskripsi: string; // <-- Tambahkan ini
    harga: number;
    gambar_url: string | null;
    kategori_id: number; // <-- Tambahkan ini
    kategori: { nama_kategori: string };
  };

  // Komponen kecil untuk skeleton loader tabel
const TableSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          <td className="px-6 py-4"><div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div></td>
          <td className="px-6 py-4"><div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div></td>
          <td className="px-6 py-4"><div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div></td>
          <td className="px-6 py-4"><div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div></td>
          <td className="px-6 py-4 text-right"><div className="h-8 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div></td>
        </tr>
      ))}
    </>
  );
  

export default function ManageMenuPage() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduk, setEditingProduk] = useState<Produk | null>(null);

  const fetchProduk = async () => {
    setIsLoading(true);
    const response = await fetch('/api/menu');
    if (response.ok) {
        const data = await response.json();
        // Pastikan API mengembalikan data yang sesuai dengan tipe di atas
        setProdukList(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  const handleFormSuccess = () => {
    fetchProduk(); // Muat ulang data setelah form berhasil disubmit
    setModalOpen(false); // Tutup modal
  }

  // FUNGSI BARU UNTUK MENGHAPUS PRODUK
  const handleDelete = async (produkId: number) => {
    if (confirm("Apakah kamu yakin ingin menghapus menu ini?")) {
        const response = await fetch(`/api/menu/${produkId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert("Menu berhasil dihapus.");
            fetchProduk(); // Muat ulang data setelah berhasil hapus
        } else {
            alert("Gagal menghapus menu.");
        }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kelola Menu</h1>
        <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduk(null)}>+ Tambah Menu</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingProduk ? 'Edit Menu' : 'Tambah Menu Baru'}</DialogTitle>
              <DialogDescription>
                Isi detail menu di bawah ini. Klik simpan jika sudah selesai.
              </DialogDescription>
            </DialogHeader>
            <MenuForm produkToEdit={editingProduk} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabel Daftar Produk */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium">Gambar</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Nama Produk</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Harga</th>
              <th className="px-6 py-3 text-right text-xs font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* ================================== */}
            {/* == PERBAIKAN ADA DI BLOK INI == */}
            {/* ================================== */}
            {isLoading ? (
              <TableSkeleton />
            ) : (
              produkList.map(produk => (
                <tr key={produk.id}>
                  <td className="px-6 py-4">
                    {produk.gambar_url && <Image src={produk.gambar_url} alt={produk.nama_produk} width={40} height={40} className="rounded-md object-cover"/>}
                  </td>
                  <td className="px-6 py-4 font-medium">{produk.nama_produk}</td>
                  <td className="px-6 py-4">{produk.kategori?.nama_kategori}</td>
                  <td className="px-6 py-4">Rp {produk.harga.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => { setEditingProduk(produk); setModalOpen(true); }}>
                      Edit
                    </Button>
                    {/* TOMBOL HAPUS BARU DI SINI */}
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(produk.id)}>
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}