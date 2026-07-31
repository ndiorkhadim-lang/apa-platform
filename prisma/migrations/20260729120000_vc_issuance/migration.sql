-- Phase 2.1 — W3C Verifiable Credential 2.0 issuance fields on certificates.
-- The certificates table is empty pre-Phase-2 (no credential has been issued),
-- so NOT NULL columns without defaults are safe here.
ALTER TABLE "certificates" ADD COLUMN IF NOT EXISTS "credentialUuid" TEXT NOT NULL;
ALTER TABLE "certificates" ADD COLUMN IF NOT EXISTS "issuerDid" TEXT NOT NULL;
ALTER TABLE "certificates" ADD COLUMN IF NOT EXISTS "evidenceVersion" TEXT NOT NULL;
ALTER TABLE "certificates" ADD COLUMN IF NOT EXISTS "cspaComposite" INTEGER NOT NULL;
ALTER TABLE "certificates" ADD COLUMN IF NOT EXISTS "cspaMaturity" TEXT NOT NULL;
ALTER TABLE "certificates" ADD COLUMN IF NOT EXISTS "proofValue" TEXT NOT NULL;
ALTER TABLE "certificates" ADD COLUMN IF NOT EXISTS "document" JSONB NOT NULL;
ALTER TABLE "certificates" ADD COLUMN IF NOT EXISTS "revocationIndex" INTEGER;

CREATE UNIQUE INDEX IF NOT EXISTS "certificates_credentialUuid_key" ON "certificates"("credentialUuid");
