-- CreateTable
CREATE TABLE "acri_scores" (
    "id" TEXT NOT NULL,
    "nationId" TEXT NOT NULL,
    "criterion" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "dataVersion" TEXT NOT NULL DEFAULT 'illustrative-v1',

    CONSTRAINT "acri_scores_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "acri_scores_nationId_criterion_dataVersion_key" ON "acri_scores"("nationId", "criterion", "dataVersion");
CREATE INDEX "acri_scores_dataVersion_criterion_idx" ON "acri_scores"("dataVersion", "criterion");

-- FK
ALTER TABLE "acri_scores" ADD CONSTRAINT "acri_scores_nationId_fkey" FOREIGN KEY ("nationId") REFERENCES "nations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
