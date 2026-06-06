/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `stock_movements` table. All the data in the column will be lost.
  - Changed the type of `role` on the `mobile_devices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `product_name` to the `sale_items` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MobileDeviceRole" AS ENUM ('SCANNER', 'TPE', 'SCANNER_TPE');

-- DropIndex
DROP INDEX "idx_audits_deleted_at";

-- DropIndex
DROP INDEX "idx_audits_entity";

-- DropIndex
DROP INDEX "idx_cash_deleted_at";

-- DropIndex
DROP INDEX "idx_cash_opened_at";

-- DropIndex
DROP INDEX "idx_categories_deleted_at";

-- DropIndex
DROP INDEX "idx_categories_store_active";

-- DropIndex
DROP INDEX "idx_devices_deleted_at";

-- DropIndex
DROP INDEX "idx_products_category";

-- DropIndex
DROP INDEX "idx_products_deleted_at";

-- DropIndex
DROP INDEX "idx_products_store_active";

-- DropIndex
DROP INDEX "idx_tokens_deleted_at";

-- DropIndex
DROP INDEX "idx_sale_items_deleted_at";

-- DropIndex
DROP INDEX "idx_sales_deleted_at";

-- DropIndex
DROP INDEX "idx_stock_deleted_at";

-- DropIndex
DROP INDEX "idx_stores_active";

-- DropIndex
DROP INDEX "idx_users_deleted_at";

-- DropIndex
DROP INDEX "idx_users_store_active";

-- AlterTable
ALTER TABLE "cash_sessions" ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "mobile_devices" ADD COLUMN     "updated_at" TIMESTAMP(3),
DROP COLUMN "role",
ADD COLUMN     "role" "MobileDeviceRole" NOT NULL;

-- AlterTable
ALTER TABLE "sale_items" ADD COLUMN     "product_name" VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "stock_movements" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "updated_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "idx_audits_entity" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "idx_cash_store_date" ON "cash_sessions"("store_id", "opened_at");

-- CreateIndex
CREATE INDEX "idx_categories_store" ON "categories"("store_id");

-- CreateIndex
CREATE INDEX "idx_products_store_category" ON "products"("store_id", "category_id");

-- CreateIndex
CREATE INDEX "idx_products_name" ON "products"("name");

-- CreateIndex
CREATE INDEX "idx_tokens_user_active" ON "refresh_tokens"("user_id", "is_revoked");

-- CreateIndex
CREATE INDEX "idx_sales_status" ON "sales"("status");

-- CreateIndex
CREATE INDEX "idx_users_store" ON "users"("store_id");

-- =============================================================================
-- TRIGGERS updated_at (amendement v1.1 §5)
-- Fonction réutilisable — créée une seule fois, appelée par tous les triggers
-- =============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- stores
CREATE TRIGGER trg_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- products
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- categories
CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- cash_sessions
CREATE TRIGGER trg_cash_sessions_updated_at
  BEFORE UPDATE ON cash_sessions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- sales
CREATE TRIGGER trg_sales_updated_at
  BEFORE UPDATE ON sales
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- mobile_devices
CREATE TRIGGER trg_mobile_devices_updated_at
  BEFORE UPDATE ON mobile_devices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- INDEX PARTIELS WHERE deleted_at IS NULL (amendement v1.1 §6)
-- Couvrent uniquement les lignes actives — plus petits, plus rapides
-- Note : CONCURRENTLY retiré car incompatible avec les transactions de migration
-- =============================================================================

-- users : lookup actifs par email et rôle
CREATE INDEX idx_users_active
  ON users (email, role)
  WHERE deleted_at IS NULL;

-- products : filtre catalogue par boutique + catégorie
CREATE INDEX idx_products_active_store_category
  ON products (store_id, category_id)
  WHERE deleted_at IS NULL;

-- products : recherche par code barre (scan Flutter / POS)
CREATE INDEX idx_products_active_barcode
  ON products (barcode)
  WHERE deleted_at IS NULL;

-- products : recherche par nom
CREATE INDEX idx_products_active_name
  ON products (name)
  WHERE deleted_at IS NULL;

-- categories : navigation arborescente sur actifs
CREATE INDEX idx_categories_active
  ON categories (store_id, parent_id)
  WHERE deleted_at IS NULL;

-- stores : liste des boutiques actives
CREATE INDEX idx_stores_active
  ON stores (created_at DESC)
  WHERE deleted_at IS NULL;

-- sales : historique POS — aligné sur orderBy createdAt DESC
CREATE INDEX idx_sales_active_date
  ON sales (created_at DESC, cashier_id)
  WHERE deleted_at IS NULL;

-- cash_sessions : sessions par caissier et statut sur actives
CREATE INDEX idx_sessions_active
  ON cash_sessions (cashier_id, status)
  WHERE deleted_at IS NULL;

-- mobile_devices : appareils actifs par utilisateur
CREATE INDEX idx_devices_active
  ON mobile_devices (user_id)
  WHERE deleted_at IS NULL;
