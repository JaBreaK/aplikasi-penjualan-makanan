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

    // Hanya validasi data yang paling penting
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: "Keranjang tidak boleh kosong." }, { status: 400 });
    }

    // --- LOGIKA CERDAS DIMULAI DI SINI ---

    // 1. Tentukan detail pelanggan
    const isKasirOrder = !nama_pelanggan && !nomor_wa;
    const finalNamaPelanggan = nama_pelanggan || 'Pelanggan di Tempat';
    const finalNomorWa = nomor_wa || '-';

    // 2. Tentukan metode pembayaran
    let finalMetodeId = metode_pembayaran_id;
    if (!finalMetodeId) {
      const defaultMetode = await db.metodepembayaran.findFirst({ where: { is_active: true } });
      if (!defaultMetode) {
        return NextResponse.json({ message: "Metode pembayaran tidak tersedia." }, { status: 500 });
      }
      finalMetodeId = defaultMetode.id;
    }
    
    // 3. Tentukan status pembayaran
    // Jika dari kasir, anggap langsung LUNAS. Jika online, BELUM_BAYAR.
    const finalStatusPembayaran = isKasirOrder ? 'LUNAS' : 'BELUM_BAYAR';

    // --- AKHIR LOGIKA CERDAS ---

    const createdOrder = await db.$transaction(async (prisma) => {
      const newOrder = await prisma.orders.create({
        data: {
          nama_pelanggan: finalNamaPelanggan,
          nomor_wa: finalNomorWa,
          total_harga,
          catatan_pelanggan,
          status_pembayaran: finalStatusPembayaran,
        },
      });

      const orderItemsData = cartItems.map((item) => ({
        order_id: newOrder.id,
        produk_id: item.id,
        jumlah: item.jumlah,
        subtotal: item.harga * item.jumlah,
      }));
      await prisma.orderitems.createMany({ data: orderItemsData });
      
      await prisma.pembayaran.create({
          data: {
              order_id: newOrder.id,
              metode_id: finalMetodeId,
              jumlah_bayar: total_harga,
              status: isKasirOrder ? 'SUCCESS' : 'PENDING'
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