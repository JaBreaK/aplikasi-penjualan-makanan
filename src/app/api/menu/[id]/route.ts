// Lokasi file: src/app/api/menu/[id]/route.ts

import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import path from 'path';

/**
 * Mengambil data SATU produk berdasarkan ID-nya.
 * Dipakai di halaman Edit Menu.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const produk = await db.produk.findUnique({
      where: { id },
    });

    if (!produk) {
      return NextResponse.json({ message: "Produk tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(produk, { status: 200 });
  } catch (error) {
    console.error("Error fetching produk:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data" },
      { status: 500 }
    );
  }
}

/**
 * Meng-UPDATE data produk berdasarkan ID-nya.
 * Dipakai saat menekan tombol "Update" di form Edit Menu.
 */
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const id = parseInt(params.id, 10);
      const data = await request.formData();
  
      // Ambil field teks
      const nama_produk = data.get('nama_produk') as string;
      const deskripsi = data.get('deskripsi') as string;
      const harga = data.get('harga') as string;
      const kategori_id = data.get('kategori_id') as string;
  
      // Ambil field file (mungkin ada, mungkin tidak)
      const gambar: File | null = data.get('gambar') as unknown as File;
  
      let gambar_url: string | undefined = undefined;
  
      // Cek jika ada gambar baru yang diupload
      if (gambar) {
        // (Opsional: di sini kamu bisa menambahkan logika untuk menghapus gambar lama)
  
        const bytes = await gambar.arrayBuffer();
        const buffer = Buffer.from(bytes);
  
        const namaFile = Date.now() + "_" + gambar.name;
        const filePath = path.join(process.cwd(), 'public/uploads', namaFile);
        
        await writeFile(filePath, buffer);
        
        gambar_url = `/uploads/${namaFile}`; // Siapkan URL baru
      }
  
      // Siapkan data untuk diupdate ke database
      const dataToUpdate: {
          nama_produk: string;
          deskripsi: string;
          harga: number;
          kategori_id: number;
          gambar_url?: string;
      } = {
          nama_produk,
          deskripsi,
          harga: Number(harga),
          kategori_id: Number(kategori_id),
      };
  
      // Hanya tambahkan gambar_url ke data update jika ada gambar baru
      if (gambar_url) {
          dataToUpdate.gambar_url = gambar_url;
      }
  
      const updatedProduk = await db.produk.update({
        where: { id },
        data: dataToUpdate,
      });
  
      return NextResponse.json(updatedProduk, { status: 200 });
    } catch (error) {
      console.error("Error updating produk:", error);
      return NextResponse.json(
        { message: "Terjadi kesalahan saat mengupdate data" },
        { status: 500 }
      );
    }
  }

/**
 * Menghapus produk berdasarkan ID-nya.
 * Dipakai saat menekan tombol "Delete" di halaman Kelola Menu.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    await db.produk.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Produk berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting produk:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus data" },
      { status: 500 }
    );
  }
}