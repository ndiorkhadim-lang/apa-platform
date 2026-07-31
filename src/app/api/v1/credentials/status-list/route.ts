/**
 * GET /api/v1/credentials/status-list — StatusList2021 revocation registry.
 *
 * Publishes a single GZIP+base64url bitstring covering every issued credential:
 * bit = 1 → revoked, 0 → active. This is the `statusListCredential` that each
 * credential's `credentialStatus` points to. Public, no auth, short cache.
 */

import { NextResponse } from 'next/server';
import { dbAvailable } from '@/infrastructure/prisma/client';
import { getIssuerConfig } from '@/infrastructure/certification/issuer';
import { getRevokedIndices } from '@/infrastructure/certification/prisma-issuance-repository';
import { buildEncodedStatusList } from '@/infrastructure/certification/status-list-service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!dbAvailable) return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });

  const issuer = getIssuerConfig();
  const encodedList = buildEncodedStatusList(await getRevokedIndices());
  const listUrl = new URL(request.url).toString().split('?')[0];

  return NextResponse.json(
    {
      '@context': ['https://www.w3.org/ns/credentials/v2'],
      id: listUrl,
      type: ['VerifiableCredential', 'StatusList2021Credential'],
      issuer: issuer.did,
      validFrom: new Date().toISOString(),
      credentialSubject: {
        id: `${listUrl}#list`,
        type: 'StatusList2021',
        statusPurpose: 'revocation',
        encodedList,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    },
  );
}
