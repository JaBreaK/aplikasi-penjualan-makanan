import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import type { orders_status_pembayaran } from "@prisma/client"; 

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
      keterangan_batal 
  }: { 
      status_pembayaran: orders_status_pembayaran, 
      keterangan_batal?: string 
  } = body;

    // Siapkan data yang akan diupdate
    const dataToUpdate: {
      status_pembayaran: orders_status_pembayaran;
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
export async function GET(request: NextRequest, 
  context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // <-- TAMBAHKAN 'await' DI SINI
    const numericId = parseInt(id);
    
    // AMBIL NOMOR WA DARI URL QUERY (misal: /api/orders/1?nomorWa=0812...)
    const { searchParams } = new URL(request.url);
    const nomorWa = searchParams.get('nomorWa');

    // Jika tidak ada nomor WA yang dikirim, tolak permintaan
    if (!nomorWa) {
        return NextResponse.json({ message: "Akses ditolak: Nomor WA diperlukan" }, { status: 401 });
    }

    // Cari pesanan yang ID DAN NOMOR WA-nya cocok
    const order = await db.orders.findUnique({
      where: { id: numericId,
        nomor_wa: nomorWa // <-- KONDISI PENTING DITAMBAHKAN DI SINI
      },
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
  } catch (error) {
    console.error("Gagal mengambil:", error); 
    return NextResponse.json({ message: "Gagal mengambil data pesanan" }, { status: 500 });
  }
}