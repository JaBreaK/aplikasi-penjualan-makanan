// src/app/api/metode-pembayaran/[id]/route.ts
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// MENG-UPDATE METODE PEMBAYARAN
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { nama_metode, is_active } = body;
    const updatedMethod = await db.metodepembayaran.update({
      where: { id },
      data: {
        nama_metode,
        is_active: Boolean(is_active),
      },
    });
    return NextResponse.json(updatedMethod);
  } catch (error) {
    return NextResponse.json({ message: "Gagal mengupdate data" }, { status: 500 });
  }
}

// MENGHAPUS METODE PEMBAYARAN
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await db.metodepembayaran.delete({ where: { id } });
    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ message: "Gagal menghapus data" }, { status: 500 });
  }
}