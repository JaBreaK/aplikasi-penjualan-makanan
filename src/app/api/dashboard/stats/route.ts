// src/app/api/dashboard/stats/route.ts
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Hitung Pendapatan Hari Ini (LUNAS)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set ke awal hari

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set ke awal hari berikutnya

    const pendapatanHariIni = await db.orders.aggregate({
      _sum: {
        total_harga: true,
      },
      where: {
        status_pembayaran: 'LUNAS',
        waktu_order: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // 2. Hitung Jumlah Pesanan Baru (BELUM_BAYAR)
    const jumlahPesananBaru = await db.orders.count({
      where: {
        status_pembayaran: 'BELUM_BAYAR',
      },
    });

    // 3. Cari Menu Terlaris
    const menuTerlarisAgg = await db.orderitems.groupBy({
      by: ['produk_id'],
      _sum: {
        jumlah: true,
      },
      orderBy: {
        _sum: {
          jumlah: 'desc',
        },
      },
      take: 1,
    });

    let menuTerlaris = null;
    if (menuTerlarisAgg.length > 0) {
      const produkId = menuTerlarisAgg[0].produk_id;
      menuTerlaris = await db.produk.findUnique({
        where: { id: produkId },
        select: { nama_produk: true },
      });
    }

    return NextResponse.json({
      pendapatanHariIni: pendapatanHariIni._sum.total_harga || 0,
      jumlahPesananBaru: jumlahPesananBaru,
      menuTerlaris: menuTerlaris?.nama_produk || 'Belum ada',
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ message: "Gagal mengambil statistik" }, { status: 500 });
  }
}