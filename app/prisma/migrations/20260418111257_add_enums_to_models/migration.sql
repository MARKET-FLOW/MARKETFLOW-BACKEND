/*
  Warnings:

  - The `origin` column on the `sales` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `sync_queue` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `status` on the `cash_sessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `device_type` on the `mobile_devices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `mobile_devices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `payment_method` on the `sales` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `sales` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `movement_type` on the `stock_movements` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('ANDROID', 'IOS', 'TABLET');

-- CreateEnum
CREATE TYPE "MovementType" AS ENUM ('IN', 'OUT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'MOBILE_MONEY');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'MANAGER', 'CASHIER');

-- CreateEnum
CREATE TYPE "SaleOrigin" AS ENUM ('POS', 'WEB', 'MOBILE');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "cash_sessions" DROP COLUMN "status",
ADD COLUMN     "status" "SessionStatus" NOT NULL;

-- AlterTable
ALTER TABLE "mobile_devices" DROP COLUMN "device_type",
ADD COLUMN     "device_type" "DeviceType" NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;

-- AlterTable
ALTER TABLE "sales" DROP COLUMN "payment_method",
ADD COLUMN     "payment_method" "PaymentMethod" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "SaleStatus" NOT NULL,
DROP COLUMN "origin",
ADD COLUMN     "origin" "SaleOrigin" NOT NULL DEFAULT 'POS';

-- AlterTable
ALTER TABLE "stock_movements" DROP COLUMN "movement_type",
ADD COLUMN     "movement_type" "MovementType" NOT NULL;

-- AlterTable
ALTER TABLE "sync_queue" DROP COLUMN "status",
ADD COLUMN     "status" "SyncStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CASHIER';

-- CreateIndex
CREATE INDEX "idx_cash_store_status" ON "cash_sessions"("store_id", "status");

-- CreateIndex
CREATE INDEX "idx_sync_store_status" ON "sync_queue"("store_id", "status");
