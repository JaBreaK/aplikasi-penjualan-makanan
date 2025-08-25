// src/app/api/menu/[id]/route.ts
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // <-- Import Supabase

// Definisikan tipe data untuk update
interface DataToUpdate {
  nama_produk: string;
  deskripsi: string;
  harga: number;
  kategori_id: number;
  gambar_url?: string;
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
 * Meng-UPDATE data produk berdasarkan ID-nya (menggunakan Supabase Storage).
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = parseInt(id);
    const data = await request.formData();

    const nama_produk = data.get('nama_produk') as string;
    const deskripsi = data.get('deskripsi') as string;
    const harga = data.get('harga') as string;
    const kategori_id = data.get('kategori_id') as string;
    const gambar: File | null = data.get('gambar') as unknown as File;

    let gambar_url: string | undefined = undefined;

    // Cek jika ada gambar baru yang diupload
    if (gambar) {
      const bytes = await gambar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const namaFile = `produk_${numericId}_${Date.now()}`;

      // UPLOAD KE SUPABASE
      const { error: uploadError } = await supabase.storage
        .from('uploads') // Pastikan nama bucket benar
        .upload(namaFile, buffer, {
          contentType: gambar.type,
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Gagal upload ke Supabase: ${uploadError.message}`);
      }
      
      // Ambil URL publik dari Supabase
      const { data: publicUrlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(namaFile);
      
      gambar_url = publicUrlData.publicUrl;
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
      { message: "Terjadi kesalahan saat mengupdate data", error: (error as Error).message },
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