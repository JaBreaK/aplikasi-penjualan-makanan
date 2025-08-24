// src/app/api/orders/route.ts
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orders = await db.orders.findMany({
      orderBy: {
        waktu_order: 'desc',
      },
      // INI BAGIAN YANG DI-UPGRADE
      include: {
        orderitems: {
          include: {
            produk: true,
          },
        },
        // Minta Prisma untuk menyertakan data dari relasi 'pembayaran'
        pembayaran: {
          // Urutkan berdasarkan yang terbaru jika ada beberapa percobaan bayar
          orderBy: {
            waktu_bayar: 'desc',
          },
          // Di dalam pembayaran, sertakan juga detail 'metodePembayaran'
          include: {
            metodepembayaran: true,
          },
        },
      },
    });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data pesanan" },
      { status: 500 }
    );
  }
}