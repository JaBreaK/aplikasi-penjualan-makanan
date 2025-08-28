"use client";

import { useState, useEffect } from "react";

type Kategori = {
  id: number;
  nama_kategori: string;
};

export default function AddMenuPage() {


  const [namaProduk, setNamaProduk] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [harga, setHarga] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [gambar, setGambar] = useState<File | null>(null); // <-- STATE BARU UNTUK FILE GAMBAR

  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // ... (useEffect untuk fetchKategori tidak berubah)
    const fetchKategori = async () => {
        const response = await fetch('/api/kategori');
        const data = await response.json();
        setKategoriList(data);
    };
    fetchKategori();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gambar) {
      setMessage("Silakan pilih gambar terlebih dahulu.");
      return;
    }
    setIsLoading(true);
    setMessage("");

    // Buat FormData untuk mengirim file dan teks
    const formData = new FormData();
    formData.append("nama_produk", namaProduk);
    formData.append("deskripsi", deskripsi);
    formData.append("harga", harga);
    formData.append("kategori_id", kategoriId);
    formData.append("gambar", gambar); // 'gambar' adalah nama field untuk file

    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        body: formData, // Kirim sebagai FormData, bukan JSON
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan data");
      }

      // ... (Reset form seperti sebelumnya)
      setMessage("Menu berhasil ditambahkan!");
      // Kosongkan form setelah berhasil
      setNamaProduk("");
      setDeskripsi("");
      setHarga("");
      setKategoriId("");
      setGambar(null);
      (e.target as HTMLFormElement).reset(); // Reset input file

    } catch (error: unknown) { // <-- GANTI TIPE MENJADI 'unknown'
      // Lakukan pengecekan tipe sebelum menggunakan error
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Tambah Menu Baru</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
        {/* ... (Input nama, deskripsi, harga, kategori tidak berubah) ... */}
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
          <select value={kategoriId} onChange={(e) => setKategoriId(e.target.value)} className="p-2 border rounded w-full bg-white" required >
            <option value="" disabled>Pilih Kategori</option>
            {kategoriList.map(kategori => ( <option key={kategori.id} value={kategori.id}>{kategori.nama_kategori}</option>))}
          </select>
        </div>

        {/* INPUT BARU UNTUK FILE GAMBAR */}
        <div>
          <label className="block mb-1 font-semibold">Gambar Produk</label>
          <input
            type="file"
            onChange={(e) => setGambar(e.target.files ? e.target.files[0] : null)}
            className="p-2 border rounded w-full"
            accept="image/png, image/jpeg"
            required
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 mt-2" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan Menu'}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}