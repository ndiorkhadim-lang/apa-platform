/**
 * Open Badges 3.0 badge credential assembly — pure.
 *
 * Each earned scoring badge becomes a W3C Verifiable Credential 2.0 /
 * OpenBadgeCredential, signed with the same Ed25519 issuer key as the main
 * certificate and verifiable offline. Lighter than a full credential: the
 * achievement IS the badge (no result[]/evidence[]).
 */

import { VC_CONTEXT, type Proof } from '@/domain/certification/credential';
import type { Badge } from '@/domain/scoring/scoring';

export interface UnsignedBadgeCredential {
  '@context': typeof VC_CONTEXT;
  id: string; // urn:apa:badge:<badgeId>:<subject>
  type: ['VerifiableCredential', 'OpenBadgeCredential'];
  issuer: { id: string; name: string };
  validFrom: string;
  credentialSubject: {
    type: ['AchievementSubject'];
    name: string;
    achievement: {
      id: string;
      type: ['Achievement'];
      name: string;
      description: string;
      criteria: { narrative: string };
    };
  };
}

export interface SignedBadgeCredential extends UnsignedBadgeCredential {
  proof: Proof;
}

export interface AssembleBadgeParams {
  badge: Badge;
  subjectName: string;
  subjectKey: string; // stable identifier for the holder (e.g. user id)
  issuerDid: string;
  issuerName: string;
  validFrom: Date;
  locale?: string;
}

/** Assemble the unsigned OB 3.0 badge credential. Deterministic. */
export function assembleBadgeCredential(p: AssembleBadgeParams): UnsignedBadgeCredential {
  const fr = p.locale === 'fr';
  return {
    '@context': VC_CONTEXT,
    id: `urn:apa:badge:${p.badge.id}:${p.subjectKey}`,
    type: ['VerifiableCredential', 'OpenBadgeCredential'],
    issuer: { id: p.issuerDid, name: p.issuerName },
    validFrom: p.validFrom.toISOString(),
    credentialSubject: {
      type: ['AchievementSubject'],
      name: p.subjectName,
      achievement: {
        id: `urn:apa:achievement:badge:${p.badge.id}`,
        type: ['Achievement'],
        name: fr ? p.badge.nameFr : p.badge.nameEn,
        description: fr ? p.badge.descFr : p.badge.descEn,
        criteria: { narrative: fr ? p.badge.descFr : p.badge.descEn },
      },
    },
  };
}
