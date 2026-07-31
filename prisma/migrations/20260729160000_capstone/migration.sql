-- Jalon 2.3 — Capstone (institutional transformation project) submission.

DO $$ BEGIN
  CREATE TYPE "CapstoneStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "capstone_submissions" (
  "id" TEXT PRIMARY KEY,
  "journeyId" TEXT NOT NULL,
  "authorId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL DEFAULT '',
  "status" "CapstoneStatus" NOT NULL DEFAULT 'DRAFT',
  "aiScore" INTEGER,
  "aiBreakdown" JSONB,
  "integrity" JSONB,
  "reviewerId" TEXT,
  "reviewVerdict" "AuditVerdict" NOT NULL DEFAULT 'PENDING',
  "reviewNotes" TEXT,
  "submittedAt" TIMESTAMP(3),
  "decidedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "capstone_submissions_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "certification_journeys"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "capstone_submissions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "capstone_submissions_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "capstone_submissions_journeyId_key" ON "capstone_submissions"("journeyId");
CREATE INDEX IF NOT EXISTS "capstone_submissions_status_idx" ON "capstone_submissions"("status");
CREATE INDEX IF NOT EXISTS "capstone_submissions_reviewVerdict_idx" ON "capstone_submissions"("reviewVerdict");
