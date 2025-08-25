// src/app/api/konfirmasi-pembayaran/[orderId]/route.ts
import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ orderId: string }> }
  ) {
  try {
    const { orderId } = await context.params;
    const numericOrderId = parseInt(orderId);
    const data = await request.formData();
    const gambar: File | null = data.get("bukti") as unknown as File;

    if (!gambar) {
      return NextResponse.json({ message: "Bukti bayar diperlukan" }, { status: 400 });
    }

    const bytes = await gambar.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const namaFile = Date.now() + "_" + gambar.name;
    // UPLOAD KE SUPABASE, BUKAN KE FOLDER PUBLIC
    const { error: uploadError } = await supabase.storage
      .from('bukti-pembayaran') // Nama bucket
      .upload(namaFile, buffer, {
        contentType: gambar.type,
      });

    if (uploadError) {
      throw new Error(`Gagal upload ke Supabase: ${uploadError.message}`);
    }

    // Ambil URL publik dari gambar yang baru diupload
    const { data: publicUrlData } = supabase.storage
      .from('bukti-pembayaran')
      .getPublicUrl(namaFile);
    
    const gambar_url = publicUrlData.publicUrl;

    // Simpan URL dari Supabase ke database Prisma

    // Cari pembayaran yang terkait dengan order ini
    const pembayaran = await db.pembayaran.findFirst({
        where: { order_id: numericOrderId },
        orderBy: { waktu_bayar: 'desc' }
    });

    if (!pembayaran) {
        return NextResponse.json({ message: "Catatan pembayaran tidak ditemukan" }, { status: 404 });
    }

    // Update catatan pembayaran dengan URL bukti dan ubah status
    await db.pembayaran.update({
        where: { id: pembayaran.id },
        data: {
            bukti_pembayaran_url: gambar_url,
            status: 'MENUNGGU_KONFIRMASI' // <-- Ganti dari PENDING
        }
    });
    
    // (BARU) Update juga status di tabel Orders utama
    await db.orders.update({
        where: { id: numericOrderId },
        data: {
            status_pembayaran: 'MENUNGGU_KONFIRMASI'
        }
    });
    
    return NextResponse.json({ message: "Upload bukti berhasil" });

  } catch (error) {
    console.error("Error uploading proof:", error);
    return NextResponse.json({ message: "Gagal mengupload bukti" }, { status: 500 });
  }
}