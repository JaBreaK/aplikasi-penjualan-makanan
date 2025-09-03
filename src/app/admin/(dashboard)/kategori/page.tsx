"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Kategori = {
  id: number;
  nama_kategori: string;
};

export default function KategoriPage() {
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingKategori, setEditingKategori] = useState<Kategori | null>(null);
  const [namaKategori, setNamaKategori] = useState("");

  const fetchKategori = async () => {
    setIsLoading(true);
    const response = await fetch("/api/kategori");
    if (response.ok) {
        setKategoriList(await response.json());
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const handleOpenModal = (kategori: Kategori | null) => {
    setEditingKategori(kategori);
    setNamaKategori(kategori ? kategori.nama_kategori : "");
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = editingKategori ? `/api/kategori/${editingKategori.id}` : "/api/kategori";
    const method = editingKategori ? "PUT" : "POST";
    
    try {
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nama_kategori: namaKategori }),
        });
        if (!response.ok) throw new Error("Gagal menyimpan data.");

        toast.success(editingKategori ? "Kategori berhasil diupdate!" : "Kategori berhasil ditambahkan!");
        setModalOpen(false);
        await fetchKategori();

      } catch (error: unknown) { // <-- Ganti ke unknown
        if (error instanceof Error) {
            toast.error("Gagal menyimpan", { description: error.message });
        }
    }
  };
  
  const handleDelete = async (id: number) => {
    if (confirm("Yakin mau hapus kategori ini?")) {
      try {
        const res = await fetch(`/api/kategori/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Gagal menghapus kategori.");
        }
        toast.success("Kategori berhasil dihapus.");
        await fetchKategori();

      } catch (error: unknown) { // <-- Ganti ke unknown
        if (error instanceof Error) {
            toast.error("Gagal menghapus", { description: error.message });
        }
      }
    }
  };

  

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Kelola Kategori</h1>
            <Button onClick={() => handleOpenModal(null)}>+ Tambah Kategori</Button>
        </div>

        {/* Modal untuk Tambah/Edit */}
        <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editingKategori ? 'Edit Kategori' : 'Tambah Kategori Baru'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="py-4">
                    <Input
                        value={namaKategori}
                        onChange={(e) => setNamaKategori(e.target.value)}
                        placeholder="Nama Kategori"
                        required
                    />
                    <div className="flex justify-end mt-4">
                        <Button type="submit">Simpan</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

        {/* Tabel Daftar Kategori */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Kategori</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                        <tr>
                            <td colSpan={3} className="text-center py-4">Memuat data...</td>
                        </tr>
                    ) : (
                        kategoriList.map((kategori) => (
                            <tr key={kategori.id}>
                                <td className="px-6 py-4">{kategori.id}</td>
                                <td className="px-6 py-4 font-medium">{kategori.nama_kategori}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(kategori)}>Edit</Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(kategori.id)}>Hapus</Button>
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