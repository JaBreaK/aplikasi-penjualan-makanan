// src/app/api/dashboard/sales-chart/route.ts
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const sales = await db.orders.findMany({
      where: {
        status_pembayaran: 'LUNAS',
        waktu_order: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        waktu_order: true,
        total_harga: true,
      },
      orderBy: {
        waktu_order: 'asc',
      }
    });

    // Proses data untuk format grafik
    const dailySales: { [key: string]: number } = {};
    const labels: string[] = [];

    // Buat label untuk 7 hari terakhir
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
        labels.push(label);
        dailySales[label] = 0;
    }

    sales.forEach(sale => {
        const dateLabel = sale.waktu_order.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
        if (dailySales[dateLabel] !== undefined) {
            dailySales[dateLabel] += sale.total_harga;
        }
    });

    const chartData = labels.map(label => ({
        name: label,
        total: dailySales[label],
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ message: "Gagal mengambil statistik" }, { status: 500 });
  }
}