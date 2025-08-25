-- CreateEnum
CREATE TYPE "public"."orders_status_pembayaran" AS ENUM ('BELUM_BAYAR', 'MENUNGGU_KONFIRMASI', 'LUNAS', 'BATAL');

-- CreateEnum
CREATE TYPE "public"."pembayaran_status" AS ENUM ('PENDING', 'MENUNGGU_KONFIRMASI', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "public"."kategori" (
    "id" SERIAL NOT NULL,
    "nama_kategori" VARCHAR(100) NOT NULL,

    CONSTRAINT "kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."metodepembayaran" (
    "id" SERIAL NOT NULL,
    "nama_metode" VARCHAR(100) NOT NULL,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "metodepembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orderitems" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "produk_id" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,

    CONSTRAINT "orderitems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" SERIAL NOT NULL,
    "waktu_order" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nama_pelanggan" VARCHAR(100) NOT NULL,
    "nomor_wa" VARCHAR(20) NOT NULL,
    "total_harga" INTEGER NOT NULL,
    "status_pembayaran" "public"."orders_status_pembayaran" DEFAULT 'BELUM_BAYAR',
    "keterangan_batal" TEXT,
    "catatan_pelanggan" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pembayaran" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "metode_id" INTEGER NOT NULL,
    "jumlah_bayar" INTEGER NOT NULL,
    "waktu_bayar" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."pembayaran_status" DEFAULT 'PENDING',
    "kode_referensi" VARCHAR(255),
    "bukti_pembayaran_url" TEXT,

    CONSTRAINT "pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."produk" (
    "id" SERIAL NOT NULL,
    "nama_produk" VARCHAR(255) NOT NULL,
    "deskripsi" TEXT,
    "harga" INTEGER NOT NULL,
    "gambar_url" VARCHAR(255),
    "kategori_id" INTEGER,

    CONSTRAINT "produk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderItems_produk_id_idx" ON "public"."orderitems"("produk_id");

-- CreateIndex
CREATE INDEX "OrderItems_order_id_idx" ON "public"."orderitems"("order_id");

-- CreateIndex
CREATE INDEX "Pembayaran_metode_id_idx" ON "public"."pembayaran"("metode_id");

-- CreateIndex
CREATE INDEX "Pembayaran_order_id_idx" ON "public"."pembayaran"("order_id");

-- CreateIndex
CREATE INDEX "kategori_id" ON "public"."produk"("kategori_id");

-- AddForeignKey
ALTER TABLE "public"."orderitems" ADD CONSTRAINT "orderitems_ibfk_1" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."orderitems" ADD CONSTRAINT "orderitems_ibfk_2" FOREIGN KEY ("produk_id") REFERENCES "public"."produk"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."pembayaran" ADD CONSTRAINT "pembayaran_ibfk_1" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."pembayaran" ADD CONSTRAINT "pembayaran_ibfk_2" FOREIGN KEY ("metode_id") REFERENCES "public"."metodepembayaran"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "public"."produk" ADD CONSTRAINT "produk_ibfk_1" FOREIGN KEY ("kategori_id") REFERENCES "public"."kategori"("id") ON DELETE SET NULL ON UPDATE RESTRICT;
