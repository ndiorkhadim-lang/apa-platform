-- AlterTable: geographic eligibility (5 global hubs + preferred working region)
ALTER TABLE "champion_applications" ADD COLUMN "regionalHub" TEXT;
ALTER TABLE "champion_applications" ADD COLUMN "preferredRegion" TEXT;
