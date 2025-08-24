// src/app/api/kategori/[id]/route.ts
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PUT (untuk edit)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { nama_kategori } = body;
    const updatedKategori = await db.kategori.update({
      where: { id },
      data: { nama_kategori },
    });
    return NextResponse.json(updatedKategori);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengupdate data" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await db.kategori.delete({ where: { id } });
    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    // Handle error jika kategori masih digunakan oleh produk
    return NextResponse.json({ message: "Gagal menghapus: Kategori masih digunakan oleh produk." }, { status: 400 });
  }
}