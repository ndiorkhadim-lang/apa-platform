/**
 * DEMO ONLY — the 2.2→2.1 completion loop. Simulates the learner clearing all
 * 12 practical locks in the player (passing ToolReports), then reissues the
 * credential via the use-case. Prints the new public number + evidence count.
 * Run: DATABASE_URL=... PRIV=... npx tsx scripts/demo-loop.ts
 */
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { prisma } from '@/infrastructure/prisma/client';
import { issueCredential } from '@/application/use-cases/issue-credential';
import { prismaIssuanceRepository } from '@/infrastructure/certification/prisma-issuance-repository';
import { createEd25519Signer } from '@/infrastructure/crypto/ed25519-signer';
import { ALL_REQUIRED_TOOL_NUMBERS } from '@/domain/certification/evidence';

/** Inline journey resolver (mirrors learner-journey.ts without the server-only guard). */
async function resolveJourneyId(): Promise<string | null> {
  const j = await prisma.certificationJourney.findFirst({
    where: { org: { slug: 'demo-ministry-finance' } },
    orderBy: { startedAt: 'desc' },
    select: { id: true },
  });
  return j?.id ?? null;
}

const DID = 'did:web:apa-platform-five.vercel.app';

async function main() {
  const stage = process.argv[2] ?? 'full'; // 'partial' | 'full'
  const user = await prisma.user.findUniqueOrThrow({ where: { email: 'demo-holder@apa.test' } });

  // Clear prior demo reports so the run is deterministic.
  await prisma.toolReport.deleteMany({ where: { session: { userId: user.id } } });
  await prisma.toolSession.deleteMany({ where: { userId: user.id } });

  // Complete practical locks with PASSING reports. 'partial' leaves 2 undone.
  const numbers = stage === 'partial' ? ALL_REQUIRED_TOOL_NUMBERS.slice(0, -2) : ALL_REQUIRED_TOOL_NUMBERS;
  const tools = await prisma.tool.findMany({ where: { number: { in: numbers } } });
  for (const tool of tools) {
    const session = await prisma.toolSession.create({ data: { userId: user.id, toolId: tool.id, status: 'ARCHIVED', data: {} } });
    await prisma.toolReport.create({ data: { sessionId: session.id, title: `${tool.nameEn} report`, content: { score: 82, passed: true } } });
  }

  const journeyId = await resolveJourneyId();
  const signer = createEd25519Signer({ privateKey: readFileSync(process.env.PRIV!, 'utf8'), verificationMethod: `${DID}#key-1` });
  const res = await issueCredential(
    {
      userId: user.id,
      journeyId: journeyId!,
      achievement: { id: 'urn:apa:achievement:cits', name: 'Certified Institutional Transformation Strategist (CITS)', alignment: [{ targetCode: 'ISO-37000' }] },
      issuerDid: DID,
      issuerName: 'African Public Administration Institute',
      actorId: user.id,
      reissue: true,
    },
    { repo: prismaIssuanceRepository, signer, clock: { now: () => new Date() }, ids: { uuid: () => randomUUID() } },
  );

  console.log(`[${stage}] locks completed: ${tools.length}/${ALL_REQUIRED_TOOL_NUMBERS.length}`);
  if (res.ok) {
    console.log(`  → ISSUED ${res.publicNumber} · evidence[]=${res.credential.credentialSubject.evidence.length}`);
  } else {
    console.log(`  → REFUSED: ${res.reason}${res.reason === 'EVIDENCE_GATE_BLOCKED' ? ` (missing ${res.gate.missing.length})` : ''}`);
  }
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
