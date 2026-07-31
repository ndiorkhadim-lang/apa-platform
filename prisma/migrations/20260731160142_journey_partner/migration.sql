-- Journey Partner: application type, user flag, and proposal model.
ALTER TYPE "ApplicationType" ADD VALUE IF NOT EXISTS 'PARTNER';

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "journeyPartner" BOOLEAN NOT NULL DEFAULT false;

DO $$ BEGIN
  CREATE TYPE "JourneyProposalStatus" AS ENUM ('DRAFT','SUBMITTED','UNDER_REVIEW','REVISIONS_REQUESTED','APPROVED','PUBLISHED','REJECTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "journey_proposals" (
  "id" TEXT PRIMARY KEY,
  "partnerId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "status" "JourneyProposalStatus" NOT NULL DEFAULT 'SUBMITTED',
  "title" TEXT NOT NULL,
  "roleTier" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "region" TEXT,
  "durationDays" INTEGER,
  "priceUSD" INTEGER,
  "themes" TEXT,
  "summary" TEXT NOT NULL,
  "reviewNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX IF NOT EXISTS "journey_proposals_partnerId_idx" ON "journey_proposals"("partnerId");
