// src/app/api/metode-pembayaran/[id]/route.ts
import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

// MENG-UPDATE METODE PEMBAYARAN



export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = parseInt(id);
    const data = await request.formData();

    const nama_metode = data.get('nama_metode') as string;
    const nomor_rekening = data.get('nomor_rekening') as string;
    const nama_rekening = data.get('nama_rekening') as string;
    const gambar_qris: File | null = data.get('gambar_qris') as unknown as File;
    
    let gambar_qris_url: string | undefined = undefined;

    // Cek jika ada gambar QRIS baru yang diupload
    if (gambar_qris) {
      const bytes = await gambar_qris.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const namaFile = `qris_${numericId}_${Date.now()}`;

      // UPLOAD KE SUPABASE STORAGE
      const { error: uploadError } = await supabase.storage
        .from('qris-images') // Nama bucket baru
        .upload(namaFile, buffer, {
          contentType: gambar_qris.type,
          upsert: true // Timpa file lama jika namanya sama
        });

      if (uploadError) {
        throw new Error(`Gagal upload QRIS ke Supabase: ${uploadError.message}`);
      }
      
      // Ambil URL publik dari gambar yang baru diupload
      const { data: publicUrlData } = supabase.storage
        .from('qris-images')
        .getPublicUrl(namaFile);
      
      gambar_qris_url = publicUrlData.publicUrl;
    }

    type DataToUpdate = {
      nama_metode: string;
      nomor_rekening: string;
      nama_rekening: string;
      gambar_qris_url?: string; // Optional property
    };

    const dataToUpdate: DataToUpdate = {
      nama_metode,
      nomor_rekening,
      nama_rekening,
    };

    // Hanya tambahkan gambar_qris_url jika ada gambar baru yang diupload
    if (gambar_qris_url) {
      dataToUpdate.gambar_qris_url = gambar_qris_url;
    }

    const updatedMethod = await db.metodepembayaran.update({
      where: { id: numericId },
      data: dataToUpdate,
    });
    
    return NextResponse.json(updatedMethod);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Gagal mengupdate data", error: (error as Error).message }, { status: 500 });
  }
}

// MENGHAPUS METODE PEMBAYARAN
export async function DELETE(request: NextRequest, 
  context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // <-- TAMBAHKAN 'await' DI SINI
    const numericId = parseInt(id);
    await db.metodepembayaran.delete({ where: { id: numericId } });
    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    console.error("Gagal megnhapus :", error);
    return NextResponse.json({ message: "Gagal menghapus data" }, { status: 500 });
  }
}