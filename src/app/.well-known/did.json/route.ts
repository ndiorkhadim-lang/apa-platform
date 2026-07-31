/**
 * GET /.well-known/did.json — did:web resolution endpoint.
 *
 * Publishes the issuer's Ed25519 assertion key so any W3C verifier can resolve
 * did:web:<domain> and independently check APA credential signatures. Public,
 * no auth, cacheable. Returns 503 until the issuer key is configured.
 */

import { NextResponse } from 'next/server';
import { getIssuerConfig } from '@/infrastructure/certification/issuer';
import { publicKeyMultibase } from '@/infrastructure/crypto/ed25519-signer';
import { buildDidDocument } from '@/domain/certification/did';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  const issuer = getIssuerConfig();
  if (!issuer.publicKeyPem) {
    return NextResponse.json(
      { error: 'issuer_key_unconfigured', detail: 'APA_ISSUER_PUBLIC_KEY_PEM is not set.' },
      { status: 503 },
    );
  }

  let multibase: string;
  try {
    multibase = publicKeyMultibase(issuer.publicKeyPem);
  } catch {
    return NextResponse.json({ error: 'issuer_key_invalid' }, { status: 500 });
  }

  const doc = buildDidDocument({
    did: issuer.did,
    publicKeyMultibase: multibase,
    keyFragment: issuer.keyFragment,
  });

  return NextResponse.json(doc, {
    headers: {
      'Content-Type': 'application/did+json',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
