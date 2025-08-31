import { db } from "@/lib/prisma";
import type { Metadata } from 'next';
import Image from "next/image";
// Kita akan butuh komponen AddToCartButton nanti
// import AddToCartButton from "@/components/AddToCartButton"; 

// --- INI BAGIAN AJAIBNYA (SEO OTOMATIS) ---
type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseInt(params.id);
  
  // 1. Ambil data produk dari database
  const produk = await db.produk.findUnique({
    where: { id: id },
  });

  if (!produk) {
    return {
      title: "Produk Tidak Ditemukan",
      description: "Halaman yang Anda cari tidak ada.",
    }
  }

  // 2. Buat title dan description secara dinamis
  return {
    title: `${produk.nama_produk} - Ayam Goreng Suharti`,
    description: produk.deskripsi || `Pesan ${produk.nama_produk} sekarang, hidangan legendaris dengan resep asli sejak 1972.`,
    openGraph: {
        title: `${produk.nama_produk} - Ayam Goreng Suharti`,
        description: produk.deskripsi || `Renyah dan lezat!`,
        images: [{ url: produk.gambar_url || '/placeholder.png' }]
    }
  }
}
// --- AKHIR BAGIAN AJAIB ---


// --- INI TAMPILAN HALAMANNYA ---
export default async function ProdukDetailPage({ params }: Props) {
    const id = parseInt(params.id);
    const produk = await db.produk.findUnique({
        where: { id: id },
    });

    if (!produk) {
        return <p className="p-8 text-center">Produk tidak ditemukan.</p>
    }

    return (
        <main className="container mx-auto p-8 pt-12">
            <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Kolom Gambar */}
                <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={produk.gambar_url || '/placeholder.png'}
                        alt={produk.nama_produk}
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                </div>
                {/* Kolom Detail */}
                <div className="sticky top-28">
                    <h1 className="text-4xl font-bold font-serif mb-4">{produk.nama_produk}</h1>
                    <p className="text-3xl font-semibold text-blue-600 mb-6">
                        Rp {produk.harga.toLocaleString('id-ID')}
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-8">
                        {produk.deskripsi}
                    </p>
                    
                    {/* Nanti tombol ini bisa kita buat fungsional */}
                    <button className="w-full bg-[#3d2c1d] text-white font-bold py-3 px-4 rounded hover:bg-black">
                        Tambah ke Keranjang
                    </button>
                </div>
            </div>
        </main>
    );
}