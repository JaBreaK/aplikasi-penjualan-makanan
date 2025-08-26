import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import type { orders_status_pembayaran, orders_status_pesanan } from "@prisma/client"; 

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // <-- TAMBAHKAN 'await' DI SINI
    const numericId = parseInt(id);
    const body = await request.json();
    // Ambil status dan keterangan dari body

    const { 
      status_pembayaran, 
      status_pesanan,
      keterangan_batal,
      metode_pembayaran_id 
  }: { 
      status_pembayaran: orders_status_pembayaran, 
      status_pesanan: orders_status_pesanan,
      keterangan_batal?: string ,
      metode_pembayaran_id?: number
  } = body;

  // Jika ada permintaan untuk mengubah metode pembayaran
    if (metode_pembayaran_id) {
        const pembayaranTerbaru = await db.pembayaran.findFirst({
            where: { order_id: numericId },
            orderBy: { waktu_bayar: 'desc' }
        });

        if (pembayaranTerbaru) {
            await db.pembayaran.update({
                where: { id: pembayaranTerbaru.id },
                data: { metode_id: metode_pembayaran_id }
            });
        }
    }

    // Siapkan data yang akan diupdate
    const dataToUpdate: {
      status_pembayaran: orders_status_pembayaran;
      status_pesanan?: orders_status_pesanan;
        keterangan_batal?: string | null;
    } = {
        status_pembayaran,
    };

    // Jika statusnya BATAL, simpan keterangannya.
    // Jika statusnya diubah dari BATAL ke yang lain, hapus keterangannya.
    if (status_pembayaran === 'BATAL') {
      dataToUpdate.keterangan_batal = keterangan_batal || "Dibatalkan oleh admin.";
    } else {
      dataToUpdate.keterangan_batal = null;
    }

    // Cek apakah ada update untuk status pesanan (dapur)
    if (status_pesanan) {
      dataToUpdate.status_pesanan = status_pesanan;
  }

    const updatedOrder = await db.orders.update({
      where: { id: numericId },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengupdate status" },
      { status: 500 }
    );
  }
}
// GET (baru)
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const numericId = parseInt(id);
    
    const { searchParams } = new URL(request.url);
    const nomorWa = searchParams.get('nomorWa');

    // Buat objek 'where' dasar
    const whereClause: { id: number; nomor_wa?: string } = {
      id: numericId
    };

    // JIKA ADA nomorWa, tambahkan ke kondisi (untuk verifikasi pelanggan)
    if (nomorWa) {
      whereClause.nomor_wa = nomorWa;
    }
    // JIKA TIDAK ADA nomorWa, biarkan kosong (untuk akses admin)

    const order = await db.orders.findUnique({
      where: whereClause, // Gunakan objek 'where' yang sudah kita siapkan
      include: {
        orderitems: { include: { produk: true } },
        pembayaran: {
          include: { metodepembayaran: true },
          orderBy: { waktu_bayar: 'desc' }
        }
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Pesanan tidak ditemukan atau Anda tidak punya akses" }, { status: 404 });
    }
    
    return NextResponse.json(order);
  } catch (error: unknown) {
    console.error("Gagal mengambil data pesanan:", error);
    if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Gagal mengambil data pesanan" }, { status: 500 });
  }
}