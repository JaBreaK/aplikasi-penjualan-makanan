// src/app/api/orders/new-count/route.ts
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Hitung semua pesanan yang statusnya butuh perhatian admin
    const newOrderCount = await db.orders.count({
      where: {
        status_pembayaran: {
          in: ['MENUNGGU_KONFIRMASI', 'BELUM_BAYAR']
        }
      },
    });

    return NextResponse.json({ count: newOrderCount });
  } catch (error) {
    console.error("Error fetching:", error);
    return NextResponse.json({ message: "Gagal menghitung pesanan baru" }, { status: 500 });
  }
}