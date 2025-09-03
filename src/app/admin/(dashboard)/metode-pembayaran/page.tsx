"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";

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
  const MetodeForm = ({ metode, onSave }: { metode: Metode, onSave: () => void }) => {
    const [namaRekening, setNamaRekening] = useState(metode.nama_rekening || "");
    const [nomorRekening, setNomorRekening] = useState(metode.nomor_rekening || "");
    const [gambarQris, setGambarQris] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData();
        formData.append('nama_metode', metode.nama_metode); // Nama metode tidak diubah
        formData.append('nama_rekening', namaRekening);
        formData.append('nomor_rekening', nomorRekening);
        if (gambarQris) {
            formData.append('gambar_qris', gambarQris);
        }

        try {
            const response = await fetch(`/api/metode-pembayaran/${metode.id}`, {
                method: 'PUT',
                body: formData,
            });
            if (!response.ok) throw new Error("Gagal menyimpan perubahan.");
            
            toast.success(`Metode "${metode.nama_metode}" berhasil diupdate.`);
            onSave(); // Panggil fungsi onSave untuk refresh data
        
          } catch (error: unknown) { // <-- Ganti ke unknown
            if (error instanceof Error) {
                toast.error("Gagal menyimpan", { description: error.message });
            }
        } finally {
            setIsSaving(false);
        }
    };

    const isQris = metode.nama_metode.toLowerCase().includes('qris');
    const isTransfer = metode.nama_metode.toLowerCase().includes('transfer');
    const isCash = metode.nama_metode.toLowerCase().includes('cash');

    return (
      <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">{metode.nama_metode}</h2>
          <div className="flex flex-col gap-4">
              
              {/* Tampilkan field ini HANYA jika bukan Cash */}
              {!isCash && (
                  <div>
                      <label className="block mb-1 font-semibold text-sm">Atas Nama</label>
                      <input type="text" value={namaRekening} onChange={(e) => setNamaRekening(e.target.value)} className="p-2 border rounded w-full"/>
                  </div>
              )}
              
              {/* Tampilkan field ini HANYA untuk Transfer Bank */}
              {isTransfer && (
                  <div>
                      <label className="block mb-1 font-semibold text-sm">Nomor Rekening/VA</label>
                      <input type="text" value={nomorRekening} onChange={(e) => setNomorRekening(e.target.value)} className="p-2 border rounded w-full"/>
                  </div>
              )}

              {/* Tampilkan field ini HANYA untuk QRIS */}
              {isQris && (
                  <div>
                      <label className="block mb-1 font-semibold text-sm">Gambar QRIS</label>
                      {metode.gambar_qris_url && <Image src={metode.gambar_qris_url} alt="QRIS" width={100} height={100} className="mb-2 rounded"/>}
                      <input type="file" onChange={(e) => setGambarQris(e.target.files?.[0] || null)} className="p-2 border rounded w-full"/>
                  </div>
              )}

              {/* Untuk Cash, tampilkan pesan */}
              {isCash && (
                  <p className="text-sm text-gray-500">Tidak ada detail tambahan untuk metode Cash.</p>
              )}

              <button type="submit" disabled={isSaving} className="bg-blue-500 text-white px-4 py-2 rounded self-end">
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
          </div>
      </form>
  );
  }

  if (isLoading) return <p className="p-8">Memuat data...</p>;

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">Kelola Detail Metode Pembayaran</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metodeList.map((metode) => (
          <MetodeForm key={metode.id} metode={metode} onSave={fetchMetode} />
        ))}
      </div>
    </main>
  );
}