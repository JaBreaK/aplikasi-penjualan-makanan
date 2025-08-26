-- CreateEnum
CREATE TYPE "public"."orders_status_pesanan" AS ENUM ('PESANAN_DITERIMA', 'SEDANG_DIMASAK', 'SIAP_DIAMBIL', 'SELESAI');

-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "status_pesanan" "public"."orders_status_pesanan" NOT NULL DEFAULT 'PESANAN_DITERIMA';
