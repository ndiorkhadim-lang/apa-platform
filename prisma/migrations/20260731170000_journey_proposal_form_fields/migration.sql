-- Partner Application & Strategic Journey form (§03): journey fields + roleTier default.
ALTER TABLE "journey_proposals" ALTER COLUMN "roleTier" SET DEFAULT 'OBSERVER';
ALTER TABLE "journey_proposals" ADD COLUMN IF NOT EXISTS "sector" TEXT;
ALTER TABLE "journey_proposals" ADD COLUMN IF NOT EXISTS "maxCapacity" INTEGER;
ALTER TABLE "journey_proposals" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE "journey_proposals" ADD COLUMN IF NOT EXISTS "hostCommunities" TEXT;
