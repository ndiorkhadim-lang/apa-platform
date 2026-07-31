/**
 * DEMO ONLY — the Capstone gate (Jalon 2.3). Submits an original, tool-complete
 * capstone, shows issuance BLOCKED until an evaluator approves, then APPROVED →
 * issuance allowed. Inlines queries to avoid importing server-only modules.
 * Run: DATABASE_URL=... PRIV=... npx tsx scripts/demo-capstone.ts
 */
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { prisma } from '@/infrastructure/prisma/client';
import { buildPrescore } from '@/domain/capstone/prescoring';
import { checkCapstoneIntegrity } from '@/domain/capstone/integrity';
import { issueCredential } from '@/application/use-cases/issue-credential';
import { prismaIssuanceRepository } from '@/infrastructure/certification/prisma-issuance-repository';
import { createEd25519Signer } from '@/infrastructure/crypto/ed25519-signer';

const DID = 'did:web:apa-platform-five.vercel.app';

const CONTENT = `Our institutional transformation adopts shared value (CSV) as strategic investment rather than cost.
Governance is redesigned for genuine power-sharing on the board, and every decision is accountable to a published charter.
The community holds legally binding co-ownership through an equity stake; local stakeholders co-decide on priorities.
We measure impact with dignity and cohesion indicators, continuous monitoring, and transparent KPI reporting.
Capital and value distribution route revenue and benefit back to the community through a documented mechanism.
An exit and continuity plan guarantees sustainability, orderly succession, and handover of institutional knowledge.
This project reforms procurement, budgeting, and audit so that governance of the organization aligns with ISO 37000,
turning accountability into measurable, verifiable outcomes for the institution and the citizens it serves. `.repeat(3);

async function issue(signer: ReturnType<typeof createEd25519Signer>, journeyId: string, userId: string) {
  return issueCredential(
    { userId, journeyId, achievement: { id: 'urn:apa:achievement:cits', name: 'CITS', alignment: [{ targetCode: 'ISO-37000' }] }, issuerDid: DID, issuerName: 'APA', actorId: userId, reissue: true },
    { repo: prismaIssuanceRepository, signer, clock: { now: () => new Date() }, ids: { uuid: () => randomUUID() } },
  );
}

async function main() {
  const user = await prisma.user.findUniqueOrThrow({ where: { email: 'demo-holder@apa.test' } });
  const journey = await prisma.certificationJourney.findFirstOrThrow({ where: { org: { slug: 'demo-ministry-finance' } }, orderBy: { startedAt: 'desc' } });
  const signer = createEd25519Signer({ privateKey: readFileSync(process.env.PRIV!, 'utf8'), verificationMethod: `${DID}#key-1` });

  // Completed tools (inline; passing reports).
  const reports = await prisma.toolReport.findMany({ where: { session: { userId: user.id } }, include: { session: { include: { tool: { select: { number: true, category: true } } } } }, orderBy: { createdAt: 'desc' } });
  const seen = new Set<number>(); const completed = new Set<number>();
  for (const r of reports) { const t = r.session.tool; if (seen.has(t.number)) continue; seen.add(t.number); const ok = t.category === 'FORM' ? (r.content as { passed?: boolean } | null)?.passed === true : true; if (ok) completed.add(t.number); }

  const corpus = (await prisma.capstoneSubmission.findMany({ where: { NOT: { journeyId: journey.id } }, select: { content: true } })).map((c) => c.content).filter(Boolean);
  const integrity = checkCapstoneIntegrity({ content: CONTENT, priorCorpus: corpus, completedToolNumbers: completed });
  const prescore = buildPrescore(CONTENT);
  console.log(`integrity.passed=${integrity.passed} tools=${integrity.toolsComplete} words=${integrity.wordCount} sim=${integrity.similarity} · aiScore=${prescore.composite}`);

  // Submit (SUBMITTED, awaiting review).
  await prisma.capstoneSubmission.upsert({
    where: { journeyId: journey.id },
    update: { title: 'Shared-value governance reform', content: CONTENT, status: 'SUBMITTED', submittedAt: new Date(), reviewVerdict: 'PENDING', aiScore: prescore.composite, integrity: integrity as never },
    create: { journeyId: journey.id, authorId: user.id, title: 'Shared-value governance reform', content: CONTENT, status: 'SUBMITTED', submittedAt: new Date(), aiScore: prescore.composite, integrity: integrity as never },
  });

  const blocked = await issue(signer, journey.id, user.id);
  console.log(`STEP 1 (capstone SUBMITTED, not approved) → issue: ${blocked.ok ? 'ISSUED' : blocked.reason}`);

  // Evaluator approves.
  await prisma.capstoneSubmission.update({ where: { journeyId: journey.id }, data: { status: 'APPROVED', reviewVerdict: 'APPROVED', decidedAt: new Date() } });
  const allowed = await issue(signer, journey.id, user.id);
  console.log(`STEP 2 (capstone APPROVED) → issue: ${allowed.ok ? `ISSUED ${allowed.publicNumber}` : allowed.reason}`);

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
