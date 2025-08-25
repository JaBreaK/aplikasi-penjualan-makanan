// src/app/api/menu/route.ts
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises'; // Import modul untuk menulis file
import path from 'path'; // Import modul untuk path

export async function POST(request: Request) {
  try {
    const data = await request.formData(); // Ambil data sebagai FormData

    // Ambil field file dan teks
    const gambar: File | null = data.get('gambar') as unknown as File;
    const nama_produk = data.get('nama_produk') as string;
    const deskripsi = data.get('deskripsi') as string;
    const harga = data.get('harga') as string;
    const kategori_id = data.get('kategori_id') as string;

    if (!gambar) {
      return NextResponse.json({ message: "Tidak ada gambar yang diupload" }, { status: 400 });
    }

    // Ubah file menjadi buffer
    const bytes = await gambar.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat nama file unik untuk menghindari duplikasi
    const namaFile = Date.now() + "_" + gambar.name;
    // Tentukan path untuk menyimpan file di folder public
    const dirPath = path.join(process.cwd(), 'public/uploads');
    const filePath = path.join(dirPath, namaFile);

    // Tulis file ke direktori
    await writeFile(filePath, buffer);
    console.log(`File tersimpan di: ${filePath}`);

    // Buat URL publik yang akan disimpan di database
    const gambar_url = `/uploads/${namaFile}`;

    // Simpan data ke database
    const newProduk = await db.produk.create({
      data: {
        nama_produk,
        deskripsi,
        harga: Number(harga),
        kategori_id: Number(kategori_id),
        gambar_url: gambar_url, // Simpan URL publiknya
      },
    });
    
    return NextResponse.json(newProduk, { status: 201 });
  } catch (error) {
    console.error("Error creating produk:", error);
    return NextResponse.json({ message: "Error creating produk" }, { status: 500 });
  }
}
// Mengambil SEMUA produk
export async function GET() {
  try {
    const produk = await db.produk.findMany({
      include: {
        kategori: true, // Sertakan data kategori
      },
    });
    return NextResponse.json(produk, { status: 200 });
  } catch (error) {
    console.error("Gagal mengambil Produk:", error);
    return NextResponse.json({ message: "Error fetching produk" }, { status: 500 });
  }
}

