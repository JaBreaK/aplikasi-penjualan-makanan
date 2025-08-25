// src/app/api/konfirmasi-pembayaran/[orderId]/route.ts
import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

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
    const dirPath = path.join(process.cwd(), "public/bukti-pembayaran");
    const filePath = path.join(dirPath, namaFile);

    await writeFile(filePath, buffer);

    const gambar_url = `/bukti-pembayaran/${namaFile}`;

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