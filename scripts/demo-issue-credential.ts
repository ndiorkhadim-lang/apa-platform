/**
 * DEMO ONLY — seeds a full issuance graph, issues a real CITS credential via the
 * use-case + Ed25519 signer, then verifies the DB-stored document by resolving
 * the issuer key from the DID document (multibase). Prints the /verify path.
 * Run: DATABASE_URL=... PRIV=... PUB=... npx tsx scripts/demo-issue-credential.ts
 */
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { prisma } from '@/infrastructure/prisma/client';
import { issueCredential } from '@/application/use-cases/issue-credential';
import { prismaIssuanceRepository } from '@/infrastructure/certification/prisma-issuance-repository';
import {
  createEd25519Signer,
  publicKeyMultibase,
  publicKeyFromMultibase,
} from '@/infrastructure/crypto/ed25519-signer';
import { checkIntegrity } from '@/infrastructure/certification/verify-service';
import { buildDidDocument } from '@/domain/certification/did';
import { ALL_REQUIRED_TOOL_NUMBERS } from '@/domain/certification/evidence';
import type { SignedCredential } from '@/domain/certification/credential';

const DID = 'did:web:apa-platform-five.vercel.app';
const priv = readFileSync(process.env.PRIV!, 'utf8');
const pub = readFileSync(process.env.PUB!, 'utf8');

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo-holder@apa.test' },
    update: {},
    create: { name: 'Demo Holder', email: 'demo-holder@apa.test', platformRole: 'USER' },
  });
  const nation = await prisma.nation.findUnique({ where: { code: 'SN' } });
  const org = await prisma.organization.upsert({
    where: { slug: 'demo-ministry-finance' },
    update: {},
    create: { name: 'Ministry of Finance (Demo)', slug: 'demo-ministry-finance', nationId: nation?.id },
  });

  let journey = await prisma.certificationJourney.findFirst({ where: { orgId: org.id } });
  if (journey) {
    await prisma.certificate.deleteMany({ where: { journeyId: journey.id } });
  } else {
    journey = await prisma.certificationJourney.create({ data: { orgId: org.id } });
  }

  await prisma.cspaAssessment.create({
    data: { journeyId: journey.id, scoringVersion: 'cspa-v1', answers: {}, score: 87, passed: true },
  });

  const tools = await prisma.tool.findMany({ where: { number: { in: ALL_REQUIRED_TOOL_NUMBERS } } });
  for (const tool of tools) {
    const session = await prisma.toolSession.create({
      data: { userId: user.id, toolId: tool.id, status: 'ARCHIVED', data: {} },
    });
    await prisma.toolReport.create({
      data: { sessionId: session.id, title: `${tool.nameEn} report`, content: { score: 82 } },
    });
  }

  const signer = createEd25519Signer({ privateKey: priv, verificationMethod: `${DID}#key-1` });
  const res = await issueCredential(
    {
      userId: user.id,
      journeyId: journey.id,
      achievement: {
        id: 'urn:apa:achievement:cits',
        name: 'Certified Institutional Transformation Strategist (CITS)',
        alignment: [{ targetCode: 'ISO-37000', targetName: 'ISO 37000:2021' }],
      },
      issuerDid: DID,
      issuerName: 'African Public Administration Institute',
      actorId: user.id,
    },
    { repo: prismaIssuanceRepository, signer, clock: { now: () => new Date() }, ids: { uuid: () => randomUUID() } },
  );

  if (!res.ok) {
    console.log('❌ ISSUE FAILED:', JSON.stringify(res, null, 2));
    process.exit(1);
  }

  const cert = await prisma.certificate.findUnique({ where: { id: res.credentialId } });

  // DID resolution: publish doc → resolve key from multibase → verify DB document.
  const didDoc = buildDidDocument({ did: DID, publicKeyMultibase: publicKeyMultibase(pub) });
  const resolvedPem = publicKeyFromMultibase(didDoc.verificationMethod[0].publicKeyMultibase)
    .export({ type: 'spki', format: 'pem' })
    .toString();
  const state = checkIntegrity(cert!.document as unknown as SignedCredential, resolvedPem);

  console.log('✅ ISSUED');
  console.log('  publicNumber   :', res.publicNumber);
  console.log('  credentialUuid :', cert!.credentialUuid);
  console.log('  DID multibase  :', didDoc.verificationMethod[0].publicKeyMultibase);
  console.log('  auditLog       :', (await prisma.auditLog.count({ where: { action: 'certificate.issue' } })), 'certificate.issue entries');
  console.log('  INTEGRITY (resolved via DID):', state);
  console.log('  VERIFY PATH    :', `/en/verify/${res.publicNumber}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
