// src/app/api/metode-pembayaran/[id]/route.ts
import { db } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

// MENG-UPDATE METODE PEMBAYARAN
export async function PUT(request: NextRequest, 
  context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // <-- TAMBAHKAN 'await' DI SINI
    const numericId = parseInt(id);
    const body = await request.json();
    const { nama_metode, is_active } = body;
    const updatedMethod = await db.metodepembayaran.update({
      where: { id: numericId },
      data: {
        nama_metode,
        is_active: Boolean(is_active),
      },
    });
    return NextResponse.json(updatedMethod);
  } catch (error) {
    console.error("Gagal membuat metode pembayaran:", error);
    return NextResponse.json({ message: "Gagal mengupdate data" }, { status: 500 });
  }
}

// MENGHAPUS METODE PEMBAYARAN
export async function DELETE(request: NextRequest, 
  context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // <-- TAMBAHKAN 'await' DI SINI
    const numericId = parseInt(id);
    await db.metodepembayaran.delete({ where: { id: numericId } });
    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    console.error("Gagal megnhapus :", error);
    return NextResponse.json({ message: "Gagal menghapus data" }, { status: 500 });
  }
}