// src/app/api/menu/[id]/route.ts
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import path from 'path';


interface DataToUpdate {
  nama_produk: string;
  deskripsi: string;
  harga: number;
  kategori_id: number;
  gambar_url?: string; // Tanda tanya (?) berarti properti ini opsional
}

/**
 * Mengambil data SATU produk berdasarkan ID-nya.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = parseInt(id);
    const produk = await db.produk.findUnique({
      where: { id: numericId },
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
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = parseInt(id);
    const data = await request.formData();

    // ... (sisa logika PUT tidak berubah, pastikan sudah benar)
    const nama_produk = data.get('nama_produk') as string;
    const deskripsi = data.get('deskripsi') as string;
    const harga = data.get('harga') as string;
    const kategori_id = data.get('kategori_id') as string;
    const gambar: File | null = data.get('gambar') as unknown as File;

    let gambar_url: string | undefined = undefined;

    if (gambar) {
      const bytes = await gambar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const namaFile = Date.now() + "_" + gambar.name;
      const filePath = path.join(process.cwd(), 'public/uploads', namaFile);
      await writeFile(filePath, buffer);
      gambar_url = `/uploads/${namaFile}`;
    }

    const dataToUpdate: DataToUpdate = {
        nama_produk,
        deskripsi,
        harga: Number(harga),
        kategori_id: Number(kategori_id),
    };

    if (gambar_url) {
        dataToUpdate.gambar_url = gambar_url;
    }

    const updatedProduk = await db.produk.update({
      where: { id: numericId },
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
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = parseInt(id);
    await db.produk.delete({
      where: { id: numericId },
    });
    return NextResponse.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting produk:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus data" },
      { status: 500 }
    );
  }
}