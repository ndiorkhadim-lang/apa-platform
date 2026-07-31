/**
 * POST /api/v1/credentials/issue — privileged credential issuance (ADMIN_APA).
 *
 * HTTP adapter over the issue-credential use-case: wires the Prisma repository
 * and the real Ed25519 signer (key from env), enforces RBAC, and maps the
 * use-case's typed refusals to HTTP status codes. Irreversible + side-effectful,
 * so it is gated and never cached.
 */

import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { getSession } from '@/lib/session';
import { dbAvailable } from '@/infrastructure/prisma/client';
import { issueCredential } from '@/application/use-cases/issue-credential';
import { prismaIssuanceRepository } from '@/infrastructure/certification/prisma-issuance-repository';
import { createEd25519Signer } from '@/infrastructure/crypto/ed25519-signer';
import { getIssuerConfig } from '@/infrastructure/certification/issuer';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  userId: z.string().min(1),
  journeyId: z.string().min(1),
  achievement: z
    .object({
      id: z.string().min(1),
      name: z.string().min(1),
      alignment: z.array(z.object({ targetCode: z.string(), targetName: z.string().optional() })).default([]),
    })
    .optional(),
  validityMonths: z.number().int().positive().max(120).optional(),
});

const DEFAULT_ACHIEVEMENT = {
  id: 'urn:apa:achievement:cits',
  name: 'Certified Institutional Transformation Strategist (CITS)',
  alignment: [{ targetCode: 'ISO-37000', targetName: 'ISO 37000:2021 Governance of organizations' }],
};

export async function POST(request: Request) {
  if (!dbAvailable) {
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }

  // RBAC — issuance is ADMIN_APA only.
  const session = await getSession();
  const role = (session?.user as { platformRole?: string } | undefined)?.platformRole;
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (role !== 'ADMIN_APA') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  // Signer must be configured with a private key.
  const issuer = getIssuerConfig();
  if (!issuer.privateKeyPem) {
    return NextResponse.json({ error: 'issuer_key_unconfigured' }, { status: 503 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const signer = createEd25519Signer({
    privateKey: issuer.privateKeyPem,
    verificationMethod: issuer.verificationMethod,
  });

  const result = await issueCredential(
    {
      userId: body.userId,
      journeyId: body.journeyId,
      achievement: body.achievement ?? DEFAULT_ACHIEVEMENT,
      issuerDid: issuer.did,
      issuerName: issuer.name,
      actorId: session.user.id,
      validityMonths: body.validityMonths,
    },
    {
      repo: prismaIssuanceRepository,
      signer,
      clock: { now: () => new Date() },
      ids: { uuid: () => randomUUID() },
    },
  );

  if (result.ok) {
    const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? '';
    return NextResponse.json(
      {
        credentialId: result.credentialId,
        publicNumber: result.publicNumber,
        verifyUrl: `${site}/verify/${result.publicNumber}`,
        credential: result.credential,
      },
      { status: 201 },
    );
  }

  switch (result.reason) {
    case 'CONTEXT_NOT_FOUND':
      return NextResponse.json({ error: 'context_not_found' }, { status: 404 });
    case 'ALREADY_ISSUED':
      return NextResponse.json({ error: 'already_issued' }, { status: 409 });
    case 'CSPA_MISSING':
      return NextResponse.json({ error: 'cspa_missing' }, { status: 422 });
    case 'EVIDENCE_GATE_BLOCKED':
      return NextResponse.json(
        { error: 'evidence_gate_blocked', gate: result.gate },
        { status: 422 },
      );
  }
}
