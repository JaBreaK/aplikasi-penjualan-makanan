"use client";

import { useState, useEffect, FormEvent } from "react";

type Kategori = {
  id: number;
  nama_kategori: string;
};

export default function KategoriPage() {
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [namaKategoriBaru, setNamaKategoriBaru] = useState("");
  const [editingKategori, setEditingKategori] = useState<Kategori | null>(null);

  const fetchKategori = async () => {
    setIsLoading(true);
    const response = await fetch("/api/kategori");
    const data = await response.json();
    setKategoriList(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingKategori ? `/api/kategori/${editingKategori.id}` : "/api/kategori";
    const method = editingKategori ? "PUT" : "POST";
    
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama_kategori: namaKategoriBaru }),
    });
    
    setNamaKategoriBaru("");
    setEditingKategori(null);
    fetchKategori();
  };
  
  const handleEdit = (kategori: Kategori) => {
    setEditingKategori(kategori);
    setNamaKategoriBaru(kategori.nama_kategori);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin mau hapus kategori ini? Produk yang menggunakan kategori ini akan kehilangan kategorinya.")) {
      await fetch(`/api/kategori/${id}`, { method: 'DELETE' });
      fetchKategori();
    }
  };

  if (isLoading) return <p className="p-8">Memuat data...</p>;

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Kelola Kategori Menu</h1>

      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg max-w-md">
        <h2 className="text-xl font-semibold mb-2">{editingKategori ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={namaKategoriBaru}
            onChange={(e) => setNamaKategoriBaru(e.target.value)}
            placeholder="Contoh: Makanan Penutup"
            className="p-2 border rounded w-full"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {editingKategori ? 'Update' : 'Tambah'}
          </button>
          {editingKategori && (
            <button type="button" onClick={() => { setEditingKategori(null); setNamaKategoriBaru(""); }} className="bg-gray-500 text-white px-4 py-2 rounded">
              Batal
            </button>
          )}
        </div>
      </form>

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">ID</th>
            <th className="p-3">Nama Kategori</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {kategoriList.map((kategori) => (
            <tr key={kategori.id} className="border-b">
              <td className="p-3">{kategori.id}</td>
              <td className="p-3">{kategori.nama_kategori}</td>
              <td className="p-3 flex gap-2">
                <button onClick={() => handleEdit(kategori)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(kategori.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}