// src/app/api/metode-pembayaran/route.ts
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const methods = await db.metodepembayaran.findMany();
    return NextResponse.json(methods, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=360, stale-while-revalidate=3600"
      }
    });
  } catch (error) {
    console.error("Gagal mengambil metode pembayaran:", error);
    return NextResponse.json({ message: "Gagal mengambil data" }, { status: 500 });
  }
}


// MEMBUAT METODE PEMBAYARAN BARU
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_metode, is_active } = body;
    const newMethod = await db.metodepembayaran.create({
      data: {
        nama_metode,
        is_active: Boolean(is_active),
      },
    });
    return NextResponse.json(newMethod, { status: 201 });
  } catch (error) {
    console.error("Gagal membuat membuat metode pembayaran:", error);
    return NextResponse.json({ message: "Gagal membuat data" }, { status: 500 });
  }
}