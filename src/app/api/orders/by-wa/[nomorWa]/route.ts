// src/app/api/orders/by-wa/[nomorWa]/route.ts
import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ nomorWa: string }> }
) {
  try {
    const { nomorWa } = await context.params;

    const orders = await db.orders.findMany({
      where: {
        nomor_wa: nomorWa,
      },
      orderBy: {
        waktu_order: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Gagal mengambil data pesanan by WA:", error);
    return NextResponse.json({ message: "Gagal mengambil data pesanan" }, { status: 500 });
  }
}