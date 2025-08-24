"use client";

import { useState, useEffect, FormEvent } from "react";

type Metode = {
  id: number;
  nama_metode: string;
  is_active: boolean;
};

export default function MetodePembayaranPage() {
  const [metodeList, setMetodeList] = useState<Metode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [namaMetodeBaru, setNamaMetodeBaru] = useState("");

  const fetchMetode = async () => {
    setIsLoading(true);
    const response = await fetch("/api/metode-pembayaran");
    const data = await response.json();
    setMetodeList(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMetode();
  }, []);

  const handleAddMetode = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/api/metode-pembayaran", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama_metode: namaMetodeBaru, is_active: true }),
    });
    setNamaMetodeBaru("");
    fetchMetode(); // Muat ulang data
  };

  const handleToggleStatus = async (metode: Metode) => {
    await fetch(`/api/metode-pembayaran/${metode.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...metode, is_active: !metode.is_active }),
    });
    fetchMetode(); // Muat ulang data
  };

  if (isLoading) return <p className="p-8">Memuat data...</p>;

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Kelola Metode Pembayaran</h1>

      {/* Form Tambah Metode */}
      <form onSubmit={handleAddMetode} className="mb-8 p-4 border rounded-lg max-w-md">
        <h2 className="text-xl font-semibold mb-2">Tambah Metode Baru</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={namaMetodeBaru}
            onChange={(e) => setNamaMetodeBaru(e.target.value)}
            placeholder="Contoh: OVO"
            className="p-2 border rounded w-full"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Tambah
          </button>
        </div>
      </form>

      {/* Tabel Daftar Metode */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Nama Metode</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {metodeList.map((metode) => (
              <tr key={metode.id} className="border-b">
                <td className="p-3">{metode.nama_metode}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      metode.is_active ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                    }`}
                  >
                    {metode.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleToggleStatus(metode)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Ubah Status
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