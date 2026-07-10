-- Onboarding personalization fields (nullable, non-breaking).
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "apaRelationship" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "apaInterests" TEXT;
