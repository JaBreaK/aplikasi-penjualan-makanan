"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";

type Metode = {
  id: number;
  nama_metode: string;
  is_active: boolean;
  nomor_rekening: string | null;
  nama_rekening: string | null;
  gambar_qris_url: string | null;
};

export default function MetodePembayaranPage() {
  const [metodeList, setMetodeList] = useState<Metode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk memuat ulang data
  const fetchMetode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/metode-pembayaran");
      
      // TAMBAHKAN PENGECEKAN INI
      if (!response.ok) {
        throw new Error("Gagal mengambil data dari server.");
      }
      
      const data = await response.json();
      setMetodeList(data); // Hanya set jika berhasil
  
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      setMetodeList([]); // Jika error, set ke array kosong
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetode();
  }, []);
  
  // Komponen terpisah untuk setiap form metode pembayaran
  const MetodeForm = ({ metode }: { metode: Metode }) => {
    const [namaMetode] = useState(metode.nama_metode);
    const [nomorRekening, setNomorRekening] = useState(metode.nomor_rekening || "");
    const [namaRekening, setNamaRekening] = useState(metode.nama_rekening || "");
    const [gambarQris, setGambarQris] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData();
        formData.append('nama_metode', namaMetode);
        formData.append('nomor_rekening', nomorRekening);
        formData.append('nama_rekening', namaRekening);
        if (gambarQris) {
            formData.append('gambar_qris', gambarQris);
        }

        await fetch(`/api/metode-pembayaran/${metode.id}`, {
            method: 'PUT',
            body: formData,
        });

        setIsSaving(false);
        await fetchMetode(); // Muat ulang semua data
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold mb-4">{metode.nama_metode}</h2>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block mb-1 font-semibold text-sm">Nomor Rekening/VA</label>
                    <input type="text" value={nomorRekening} onChange={(e) => setNomorRekening(e.target.value)} className="p-2 border rounded w-full"/>
                </div>
                <div>
                    <label className="block mb-1 font-semibold text-sm">Atas Nama</label>
                    <input type="text" value={namaRekening} onChange={(e) => setNamaRekening(e.target.value)} className="p-2 border rounded w-full"/>
                </div>
                <div>
                    <label className="block mb-1 font-semibold text-sm">Ganti Gambar QRIS</label>
                    {metode.gambar_qris_url && <Image src={metode.gambar_qris_url} alt="QRIS" width={100} height={100} className="mb-2 rounded"/>}
                    <input type="file" onChange={(e) => setGambarQris(e.target.files?.[0] || null)} className="p-2 border rounded w-full"/>
                </div>
                <button type="submit" disabled={isSaving} className="bg-blue-500 text-white px-4 py-2 rounded self-end">
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>
        </form>
    );
  }

  if (isLoading) return <p className="p-8">Memuat data...</p>;

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Kelola Detail Metode Pembayaran</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metodeList.map((metode) => (
          <MetodeForm key={metode.id} metode={metode} />
        ))}
      </div>
    </main>
  );
}