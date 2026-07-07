-- CreateEnum
CREATE TYPE "CspaRunStatus" AS ENUM ('DRAFT', 'COMPLETED');

-- CreateTable
CREATE TABLE "cspa_questions" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'cspa-v1',
    "section" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "textEn" TEXT NOT NULL,
    "textFr" TEXT NOT NULL,
    "optionsEn" JSONB NOT NULL,
    "optionsFr" JSONB NOT NULL,

    CONSTRAINT "cspa_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cspa_runs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'cspa-v1',
    "status" "CspaRunStatus" NOT NULL DEFAULT 'DRAFT',
    "answers" JSONB,
    "sectionScores" JSONB,
    "composite" INTEGER,
    "maturity" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cspa_runs_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "cspa_questions_version_section_order_key" ON "cspa_questions"("version", "section", "order");
CREATE INDEX "cspa_questions_version_idx" ON "cspa_questions"("version");
CREATE INDEX "cspa_runs_userId_status_idx" ON "cspa_runs"("userId", "status");
CREATE INDEX "cspa_runs_status_completedAt_idx" ON "cspa_runs"("status", "completedAt");

-- FK
ALTER TABLE "cspa_runs" ADD CONSTRAINT "cspa_runs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
