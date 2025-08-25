// src/app/api/orders/route.ts
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const orders = await db.orders.findMany({
      orderBy: {
        waktu_order: 'desc',
      },
      // INI BAGIAN YANG DI-UPGRADE
      include: {
        orderitems: {
          include: {
            produk: true,
          },
        },
        // Minta Prisma untuk menyertakan data dari relasi 'pembayaran'
        pembayaran: {
          // Urutkan berdasarkan yang terbaru jika ada beberapa percobaan bayar
          orderBy: {
            waktu_bayar: 'desc',
          },
          // Di dalam pembayaran, sertakan juga detail 'metodePembayaran'
          include: {
            metodepembayaran: true,
          },
        },
      },
    });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data pesanan" },
      { status: 500 }
    );
  }
}

type CartItemClient = {
  id: number;
  harga: number;
  jumlah: number;
}


// FUNGSI BARU UNTUK MEMBUAT PESANAN
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
          cartItems,
          nama_pelanggan, 
          nomor_wa,
          total_harga,
          catatan_pelanggan,
          metode_pembayaran_id 
        } : {cartItems : CartItemClient[],
          nama_pelanggan: string,
          nomor_wa: string,
          total_harga: number,
          catatan_pelanggan?: string,
          metode_pembayaran_id : number
        } = body;

    // Validasi data yang masuk
    if (!cartItems || cartItems.length === 0 || !nama_pelanggan || !nomor_wa || !metode_pembayaran_id) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

  

    const createdOrder = await db.$transaction(async (prisma) => {
      // 1. Buat catatan di tabel Orders
      const newOrder = await prisma.orders.create({
        data: {
          nama_pelanggan,
          nomor_wa,
          total_harga,
          catatan_pelanggan,
          status_pembayaran: 'BELUM_BAYAR',
        },
      });

      // 2. Buat catatan di tabel OrderItems
      const orderItemsData = cartItems.map((item: CartItemClient) => ({
        order_id: newOrder.id,
        produk_id: item.id,
        jumlah: item.jumlah,
        subtotal: item.harga * item.jumlah,
      }));
      await prisma.orderitems.createMany({ data: orderItemsData });
      
      // 3. Buat catatan pembayaran dengan metode default
      await prisma.pembayaran.create({
          data: {
              order_id: newOrder.id,
              metode_id: metode_pembayaran_id, // Gunakan ID default
              jumlah_bayar: total_harga,
              status: 'PENDING'
          }
      });
      
      return newOrder;
    });
    
    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error) {
    console.error("Gagal membuat pesanan:", error);
    return NextResponse.json({ message: "Terjadi kesalahan saat membuat pesanan" }, { status: 500 });
  }
}