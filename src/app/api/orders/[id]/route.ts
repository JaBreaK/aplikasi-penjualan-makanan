import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();
    const { status_pembayaran } = body;

    // Validasi status yang masuk
    if (!['BELUM_BAYAR', 'LUNAS', 'BATAL'].includes(status_pembayaran)) {
      return NextResponse.json({ message: "Status tidak valid" }, { status: 400 });
    }

    const updatedOrder = await db.orders.update({
      where: { id },
      data: {
        status_pembayaran: status_pembayaran,
      },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengupdate status" },
      { status: 500 }
    );
  }
}
// GET (baru)
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
      const id = parseInt(params.id);
      const order = await db.orders.findUnique({
        where: { id },
        include: {
          orderitems: { include: { produk: true } },
        },
      });
      if (!order) {
        return NextResponse.json({ message: "Pesanan tidak ditemukan" }, { status: 404 });
      }
      return NextResponse.json(order);
    } catch (error) {
      return NextResponse.json({ message: "Gagal mengambil data pesanan" }, { status: 500 });
    }
  }