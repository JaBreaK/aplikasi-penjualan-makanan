-- CreateEnum
CREATE TYPE "public"."orders_tipe_pesanan" AS ENUM ('ONLINE', 'OFFLINE');

-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "tipe_pesanan" "public"."orders_tipe_pesanan" NOT NULL DEFAULT 'ONLINE';
