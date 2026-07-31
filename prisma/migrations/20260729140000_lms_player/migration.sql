-- Jalon 2.2 — Executive Learning Player (Course / Module / Lesson / progress).

DO $$ BEGIN
  CREATE TYPE "LessonKind" AS ENUM ('READING', 'TOOL', 'ASSESSMENT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "LessonProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "courses" (
  "id" TEXT PRIMARY KEY,
  "slug" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "titleEn" TEXT NOT NULL,
  "titleFr" TEXT NOT NULL,
  "summaryEn" TEXT NOT NULL,
  "summaryFr" TEXT NOT NULL,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "courses_slug_key" ON "courses"("slug");
CREATE INDEX IF NOT EXISTS "courses_published_order_idx" ON "courses"("published", "order");

CREATE TABLE IF NOT EXISTS "modules" (
  "id" TEXT PRIMARY KEY,
  "courseId" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "titleEn" TEXT NOT NULL,
  "titleFr" TEXT NOT NULL,
  CONSTRAINT "modules_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "modules_courseId_order_key" ON "modules"("courseId", "order");
CREATE INDEX IF NOT EXISTS "modules_courseId_idx" ON "modules"("courseId");

CREATE TABLE IF NOT EXISTS "lessons" (
  "id" TEXT PRIMARY KEY,
  "moduleId" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "kind" "LessonKind" NOT NULL DEFAULT 'READING',
  "titleEn" TEXT NOT NULL,
  "titleFr" TEXT NOT NULL,
  "bodyEn" TEXT NOT NULL DEFAULT '',
  "bodyFr" TEXT NOT NULL DEFAULT '',
  "toolId" TEXT,
  CONSTRAINT "lessons_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "lessons_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "tools"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "lessons_moduleId_order_key" ON "lessons"("moduleId", "order");
CREATE INDEX IF NOT EXISTS "lessons_moduleId_idx" ON "lessons"("moduleId");
CREATE INDEX IF NOT EXISTS "lessons_toolId_idx" ON "lessons"("toolId");

CREATE TABLE IF NOT EXISTS "lesson_progress" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "lessonId" TEXT NOT NULL,
  "status" "LessonProgressStatus" NOT NULL DEFAULT 'IN_PROGRESS',
  "completedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "lesson_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "lesson_progress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "lesson_progress_userId_lessonId_key" ON "lesson_progress"("userId", "lessonId");
CREATE INDEX IF NOT EXISTS "lesson_progress_userId_status_idx" ON "lesson_progress"("userId", "status");
