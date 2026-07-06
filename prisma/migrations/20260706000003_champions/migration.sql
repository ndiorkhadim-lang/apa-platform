-- CreateEnum
CREATE TYPE "ChampionAppStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'SCREENING', 'INTERVIEW', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "champion_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ChampionAppStatus" NOT NULL DEFAULT 'DRAFT',
    "firstName" TEXT, "lastName" TEXT, "gender" TEXT, "dateOfBirth" TEXT,
    "nationality" TEXT, "countryResidence" TEXT, "city" TEXT, "phone" TEXT,
    "email" TEXT, "linkedin" TEXT, "website" TEXT,
    "position" TEXT, "organization" TEXT, "industry" TEXT, "yearsExperience" INTEGER,
    "education" TEXT, "certifications" TEXT, "languages" TEXT, "expertise" TEXT,
    "motivationWhy" TEXT, "motivationLeadership" TEXT, "motivationImpact" TEXT, "motivationValue" TEXT,
    "cvUrl" TEXT, "coverLetterUrl" TEXT, "idDocUrl" TEXT, "certificatesUrl" TEXT,
    "recommendationUrl" TEXT, "portfolioUrl" TEXT,
    "acceptEthics" BOOLEAN NOT NULL DEFAULT false,
    "acceptPrivacy" BOOLEAN NOT NULL DEFAULT false,
    "acceptResponsibilities" BOOLEAN NOT NULL DEFAULT false,
    "signature" TEXT,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "champion_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "champion_reviews" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "score" INTEGER,
    "notes" TEXT,
    "decision" "ChampionAppStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "champion_reviews_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "champion_applications_userId_key" ON "champion_applications"("userId");
CREATE INDEX "champion_applications_status_countryResidence_idx" ON "champion_applications"("status", "countryResidence");
CREATE INDEX "champion_applications_status_submittedAt_idx" ON "champion_applications"("status", "submittedAt");
CREATE INDEX "champion_reviews_applicationId_createdAt_idx" ON "champion_reviews"("applicationId", "createdAt");

-- FKs
ALTER TABLE "champion_applications" ADD CONSTRAINT "champion_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "champion_reviews" ADD CONSTRAINT "champion_reviews_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "champion_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
