-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('CONTACT', 'PREQUAL');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "type" "LeadType" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organization" TEXT,
    "country" TEXT,
    "message" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'fr',
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leads_type_createdAt_idx" ON "leads"("type", "createdAt");

-- CreateIndex
CREATE INDEX "leads_ipAddress_createdAt_idx" ON "leads"("ipAddress", "createdAt");
