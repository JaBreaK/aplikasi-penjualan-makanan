// src/app/admin/edit-menu/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image"; // Gunakan Next/Image untuk optimasi

type Kategori = {
  id: number;
  nama_kategori: string;
};

export default function EditMenuPage() {
  const { id } = useParams();
  const router = useRouter();

  // State untuk form fields
  const [namaProduk, setNamaProduk] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [harga, setHarga] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [gambarUrlLama, setGambarUrlLama] = useState(""); // <-- State untuk URL gambar saat ini
  const [gambarBaru, setGambarBaru] = useState<File | null>(null); // <-- State untuk file gambar baru

  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!id) return;
      setIsLoading(true);

      // Ambil data produk dan kategori secara bersamaan
      const [kategoriRes, menuRes] = await Promise.all([
        fetch('/api/kategori'),
        fetch(`/api/menu/${id}`)
      ]);

      const kategoriData = await kategoriRes.json();
      setKategoriList(kategoriData);

      if (menuRes.ok) {
        const menuData = await menuRes.json();
        setNamaProduk(menuData.nama_produk);
        setDeskripsi(menuData.deskripsi || "");
        setHarga(menuData.harga.toString());
        setKategoriId(menuData.kategori_id.toString());
        setGambarUrlLama(menuData.gambar_url || ""); // <-- Simpan URL gambar lama
      }
      setIsLoading(false);
    };
    fetchInitialData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("nama_produk", namaProduk);
    formData.append("deskripsi", deskripsi);
    formData.append("harga", harga);
    formData.append("kategori_id", kategoriId);
    
    // Hanya tambahkan gambar ke FormData jika ada file baru yang dipilih
    if (gambarBaru) {
      formData.append("gambar", gambarBaru);
    }

    const response = await fetch(`/api/menu/${id}`, {
      method: 'PUT',
      body: formData, // Kirim sebagai FormData
    });

    if (response.ok) {
      setMessage("Update berhasil!");
      setTimeout(() => {
        router.push('/admin/manage-menu');
      }, 1500);
    } else {
      const errorData = await response.json();
      setMessage(`Update gagal: ${errorData.message}`);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p className="p-8 text-center">Memuat data produk...</p>;
  }

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Edit Menu</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
        {/* ... (Input form lainnya tidak berubah) ... */}

        {/* Tampilkan gambar saat ini */}
        {gambarUrlLama && (
            <div>
                <label className="block mb-1 font-semibold">Gambar Saat Ini</label>
                <Image src={gambarUrlLama} alt={namaProduk} width={200} height={200} className="rounded-md border object-cover"/>
            </div>
        )}

        {/* Input untuk mengganti gambar */}
        <div>
          <label className="block mb-1 font-semibold">Ganti Gambar (Opsional)</label>
          <input
            type="file"
            onChange={(e) => setGambarBaru(e.target.files ? e.target.files[0] : null)}
            className="p-2 border rounded w-full"
            accept="image/png, image/jpeg"
          />
        </div>
        
        {/* ... (Tombol Submit) ... */}
         <div>
          <label className="block mb-1 font-semibold">Nama Produk</label>
          <input type="text" value={namaProduk} onChange={(e) => setNamaProduk(e.target.value)} className="p-2 border rounded w-full" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Deskripsi</label>
          <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} className="p-2 border rounded w-full" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Harga</label>
          <input type="number" value={harga} onChange={(e) => setHarga(e.target.value)} className="p-2 border rounded w-full" required />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Kategori</label>
          <select value={kategoriId} onChange={(e) => setKategoriId(e.target.value)} className="p-2 border rounded w-full bg-white" required>
            <option value="" disabled>Pilih Kategori</option>
            {kategoriList.map(kategori => ( <option key={kategori.id} value={kategori.id}>{kategori.nama_kategori}</option>))}
          </select>
        </div>
        <button type="submit" disabled={isLoading} className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400 mt-2">
          {isLoading ? 'Menyimpan...' : 'Update Menu'}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}