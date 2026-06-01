-- This is an empty migration.

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "email_verified_at"         TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "two_factor_secret"         TEXT,
  ADD COLUMN IF NOT EXISTS "two_factor_recovery_codes" TEXT,
  ADD COLUMN IF NOT EXISTS "two_factor_confirmed_at"   TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "password_confirmed_at"     TIMESTAMP;