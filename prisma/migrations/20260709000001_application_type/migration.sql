-- CreateEnum
CREATE TYPE "ApplicationType" AS ENUM ('CHAMPION', 'ADVISOR');

-- AlterTable
ALTER TABLE "champion_applications" ADD COLUMN "type" "ApplicationType" NOT NULL DEFAULT 'CHAMPION';

-- Replace single-user unique with (userId, type)
DROP INDEX IF EXISTS "champion_applications_userId_key";
CREATE UNIQUE INDEX "champion_applications_userId_type_key" ON "champion_applications"("userId", "type");
CREATE INDEX "champion_applications_type_status_submittedAt_idx" ON "champion_applications"("type", "status", "submittedAt");
