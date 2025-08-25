// src/app/api/kategori/[id]/route.ts
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Meng-UPDATE kategori berdasarkan ID.
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // <-- Perhatikan: 'params' sekarang adalah 'Promise'
) {
  try {
    const { id } = await context.params; // <-- TAMBAHKAN 'await' DI SINI
    const numericId = parseInt(id);
    const body = await request.json();
    const { nama_kategori } = body;

    const updatedKategori = await db.kategori.update({
      where: { id: numericId },
      data: { nama_kategori },
    });

    return NextResponse.json(updatedKategori);
  } catch (error) {
    console.error("Gagal mengupdate data:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengupdate data" },
      { status: 500 }
    );
  }
}

/**
 * Menghapus kategori berdasarkan ID.
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // <-- Perhatikan: 'params' sekarang adalah 'Promise'
) {
  try {
    const { id } = await context.params; // <-- TAMBAHKAN 'await' DI SINI
    const numericId = parseInt(id);

    await db.kategori.delete({
      where: { id: numericId },
    });

    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus data:", error);
    return NextResponse.json(
      { message: "Gagal menghapus: Kategori mungkin masih digunakan oleh produk." },
      { status: 400 }
    );
  }
}