/**
 * POST /api/v1/credentials/revoke — one-click manual revocation (ADMIN_APA).
 *
 * Marks the certificate REVOKED and records the audit entry; the StatusList2021
 * registry then reflects the revoked bit and /verify flips to REVOKED. Privileged
 * and side-effectful — gated and never cached.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/session';
import { dbAvailable } from '@/infrastructure/prisma/client';
import { revokeCertificate } from '@/infrastructure/certification/prisma-issuance-repository';

export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  publicNumber: z.string().min(1),
  reason: z.string().min(1).max(500),
});

export async function POST(request: Request) {
  if (!dbAvailable) return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });

  const session = await getSession();
  const role = (session?.user as { platformRole?: string } | undefined)?.platformRole;
  if (!session) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  if (role !== 'ADMIN_APA') return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const ok = await revokeCertificate(body.publicNumber, body.reason, session.user.id);
  if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  return NextResponse.json({ ok: true, publicNumber: body.publicNumber, status: 'REVOKED' });
}
