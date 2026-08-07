export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { dbAvailable, prisma } from '@/infrastructure/prisma/client';
import { SovereignHeader } from '@/components/verify/sovereign-header';

export const metadata: Metadata = {
  title: 'Registry Specifications · APA Sovereign Credential Registry',
  robots: { index: false },
};

const LINE = 'border-[#262626]';
const CARD = `rounded-2xl border ${LINE} bg-[#0a0a0a] p-5`;

export default async function SpecsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';

  // Live revocation-registry state.
  const counts = dbAvailable
    ? await prisma.certificate.groupBy({ by: ['status'], _count: true })
    : [];
  const byStatus = Object.fromEntries(counts.map((c) => [c.status, c._count])) as Record<string, number>;
  const total = counts.reduce((n, c) => n + c._count, 0);
  const active = byStatus.ACTIVE ?? 0;
  const revoked = byStatus.REVOKED ?? 0;

  const Stat = ({ label, value, tone }: { label: string; value: number; tone: string }) => (
    <div className={`rounded-xl border ${LINE} bg-black p-4`}>
      <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">{label}</p>
      <p className={`mt-1 font-mono text-3xl font-bold ${tone}`}>{value}</p>
    </div>
  );

  return (
    <>
      <SovereignHeader locale={locale} />
      <main className="mx-auto max-w-4xl px-4 py-12 text-neutral-200">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-apa-gold-bright">
          {fr ? 'Spécifications du registre' : 'Registry specifications'}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-white">
          {fr ? 'W3C VC 2.0 & StatusList2021' : 'W3C VC 2.0 & StatusList2021'}
        </h1>

        {/* Live revocation registry state */}
        <section className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-400">
            {fr ? 'État du registre de révocation (en direct)' : 'Revocation registry — live state'}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Stat label={fr ? 'Titres émis' : 'Credentials issued'} value={total} tone="text-white" />
            <Stat label={fr ? 'Actifs' : 'Active'} value={active} tone="text-emerald-300" />
            <Stat label={fr ? 'Révoqués' : 'Revoked'} value={revoked} tone="text-red-300" />
          </div>
          <a
            href="/api/v1/credentials/status-list"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-xs font-bold text-apa-gold-bright hover:underline"
          >
            {fr ? 'Voir le StatusList2021Credential brut →' : 'View the raw StatusList2021Credential →'}
          </a>
        </section>

        {/* Standards */}
        <section className="mt-10 space-y-4">
          <div className={CARD}>
            <h3 className="font-serif text-lg font-bold text-white">
              {fr ? 'Verifiable Credential 2.0 (W3C)' : 'Verifiable Credential 2.0 (W3C)'}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              {fr
                ? 'Chaque sceau APA est une Verifiable Credential W3C 2.0, signée avec une preuve Ed25519 et un émetteur DID (did:web). La canonicalisation JCS (RFC 8785) garantit une signature déterministe et vérifiable hors ligne.'
                : 'Every APA seal is a W3C 2.0 Verifiable Credential, signed with an Ed25519 proof and a DID issuer (did:web). JCS canonicalization (RFC 8785) guarantees a deterministic, offline-verifiable signature.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold">
              <a href="https://www.w3.org/TR/vc-data-model-2.0/" target="_blank" rel="noopener noreferrer" className="text-apa-gold-bright hover:underline">
                W3C VC Data Model 2.0 →
              </a>
              <a href="/.well-known/did.json" target="_blank" rel="noopener noreferrer" className="text-apa-gold-bright hover:underline">
                {fr ? 'Document DID de l’émetteur →' : 'Issuer DID document →'}
              </a>
            </div>
          </div>

          <div className={CARD}>
            <h3 className="font-serif text-lg font-bold text-white">StatusList2021</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              {fr
                ? 'La révocation est encodée dans une chaîne de bits compressée (GZIP + base64url) : chaque titre détient un index de créneau. Un vérificateur télécharge la liste une fois et contrôle la révocation hors ligne — la signature est vérifiée en premier, la révocation ne peut que rétrograder VALID → REVOKED, jamais réhabiliter un titre invalide.'
                : 'Revocation is encoded in a compressed bitstring (GZIP + base64url): each credential holds a slot index. A verifier downloads the list once and checks revocation offline — the signature is verified first, and revocation can only downgrade VALID → REVOKED, never rehabilitate an invalid credential.'}
            </p>
            <a href="/api/v1/credentials/status-list" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs font-bold text-apa-gold-bright hover:underline">
              {fr ? 'Endpoint du registre →' : 'Registry endpoint →'}
            </a>
          </div>
        </section>

        {/* Next step */}
        <div className={`mt-10 flex flex-wrap items-center justify-between gap-3 ${CARD}`}>
          <p className="text-sm text-neutral-300">
            {fr ? 'Vérifier un titre spécifique ?' : 'Verify a specific credential?'}
          </p>
          <a href={`/${locale}/verify`} className="rounded-lg bg-apa-gold-bright px-4 py-2 text-sm font-bold text-black hover:opacity-90">
            {fr ? 'Retour au registre →' : 'Back to the registry →'}
          </a>
        </div>
      </main>
    </>
  );
}
