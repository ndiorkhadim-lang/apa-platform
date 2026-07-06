-- CreateEnum
CREATE TYPE "ToolSessionStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- AlterTable: paywall gate column
ALTER TABLE "tools" ADD COLUMN "minTier" "IntelTier" NOT NULL DEFAULT 'T1';

-- CreateTable
CREATE TABLE "tool_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "toolId" TEXT NOT NULL,
    "status" "ToolSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "data" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tool_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tool_reports" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tool_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tool_sessions_userId_toolId_idx" ON "tool_sessions"("userId", "toolId");
CREATE INDEX "tool_sessions_userId_updatedAt_idx" ON "tool_sessions"("userId", "updatedAt");
CREATE INDEX "tool_reports_sessionId_createdAt_idx" ON "tool_reports"("sessionId", "createdAt");

-- AddForeignKey
ALTER TABLE "tool_sessions" ADD CONSTRAINT "tool_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tool_sessions" ADD CONSTRAINT "tool_sessions_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "tools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "tool_reports" ADD CONSTRAINT "tool_reports_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "tool_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
