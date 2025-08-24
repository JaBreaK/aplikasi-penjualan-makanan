// src/app/api/kategori/route.ts
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET (sudah ada)
export async function GET() {
  try {
    const kategori = await db.kategori.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(kategori);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengambil data" }, { status: 500 });
  }
}

// POST (baru)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_kategori } = body;
    const newKategori = await db.kategori.create({
      data: { nama_kategori },
    });
    return NextResponse.json(newKategori, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Gagal membuat data" }, { status: 500 });
  }
}