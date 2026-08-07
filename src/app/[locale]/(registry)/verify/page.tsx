export const dynamic = 'force-dynamic';
import { getFormatter, setRequestLocale } from 'next-intl/server';
import { dbAvailable, prisma } from '@/infrastructure/prisma/client';
import { DBNotReady } from '@/components/site/db-not-ready';
import { SovereignHeader } from '@/components/verify/sovereign-header';
import { Link } from '@/i18n/navigation';
import type { CertificateStatus } from '@/generated/prisma/client';

const LINE = 'border-[#262626]';
const CARD = `rounded-2xl border ${LINE} bg-[#0a0a0a] p-5`;
const STATUS_TONE: Record<CertificateStatus, string> = {
  ACTIVE: 'border-emerald-500/40 text-emerald-300',
  EXPIRED: 'border-amber-500/40 text-amber-300',
  REVOKED: 'border-red-500/40 text-red-300',
};

interface Service {
  id: string;
  glyph: string;
  en: string;
  fr: string;
  purposeEn: string;
  purposeFr: string;
  stepsEn: string[];
  stepsFr: string[];
  ctaEn: string;
  ctaFr: string;
  href: (locale: string, uuid?: string) => string;
}

const SERVICES: Service[] = [
  {
    id: 'search',
    glyph: '⌕',
    en: 'Certificate Search & Instant Verification',
    fr: 'Recherche & Vérification Instantanée',
    purposeEn: 'Confirm any APA credential is authentic and unaltered — Ed25519 signature replayed in-process, revocation checked against StatusList2021.',
    purposeFr: 'Confirmer qu’un titre APA est authentique et non altéré — signature Ed25519 rejouée en interne, révocation contrôlée via StatusList2021.',
    stepsEn: ['Enter a public number or cryptographic ID', 'Instant signature + revocation check', 'Open the full sovereign credential'],
    stepsFr: ['Saisir un numéro public ou un ID cryptographique', 'Contrôle instantané signature + révocation', 'Ouvrir le titre souverain complet'],
    ctaEn: 'Search the registry ↓',
    ctaFr: 'Rechercher dans le registre ↓',
    href: () => '#search',
  },
  {
    id: 'audit-trail',
    glyph: '⛓',
    en: 'Audit Trail & Proof Chain',
    fr: 'Piste d’Audit & Chaîne de Preuve',
    purposeEn: 'Trace the full learning, C-SPA and Capstone evidence behind a diploma — the immutable proof chain embedded in the credential.',
    purposeFr: 'Retracer l’ensemble des preuves d’apprentissage, C-SPA et Capstone derrière un diplôme — la chaîne de preuve immuable intégrée au titre.',
    stepsEn: ['Look up a credential', 'Inspect its evidence[] impact ledger', 'Follow each tool #N proof anchor'],
    stepsFr: ['Rechercher un titre', 'Inspecter son registre d’impact evidence[]', 'Suivre chaque ancre de preuve outil #N'],
    ctaEn: 'View a proof chain →',
    ctaFr: 'Voir une chaîne de preuve →',
    href: (locale, uuid) => (uuid ? `/${locale}/verify/${uuid}` : '#search'),
  },
  {
    id: 'specs',
    glyph: '❖',
    en: 'W3C VC 2.0 & StatusList2021 Specs',
    fr: 'Spécifications W3C VC 2.0 & StatusList2021',
    purposeEn: 'The technical standards behind every seal, plus the live state of the revocation registry — for auditors and integrators.',
    purposeFr: 'Les standards techniques derrière chaque sceau, ainsi que l’état en temps réel du registre de révocation — pour auditeurs et intégrateurs.',
    stepsEn: ['Read the VC 2.0 + DID model', 'Review StatusList2021 mechanics', 'Check live revocation counts'],
    stepsFr: ['Lire le modèle VC 2.0 + DID', 'Étudier le fonctionnement StatusList2021', 'Vérifier les compteurs de révocation en direct'],
    ctaEn: 'Open the specifications →',
    ctaFr: 'Ouvrir les spécifications →',
    href: (locale) => `/${locale}/verify/specs`,
  },
  {
    id: 'export',
    glyph: '⇩',
    en: 'Export Verified Audit PDF',
    fr: 'Exporter le PDF d’Audit Vérifié',
    purposeEn: 'Generate an official, print-ready audit report for ministries and development finance institutions — QR-anchored to this registry.',
    purposeFr: 'Générer un rapport d’audit officiel, prêt à imprimer, pour les ministères et bailleurs de fonds — ancré par QR à ce registre.',
    stepsEn: ['Look up a credential', 'Open its official certificate', 'Print / export to PDF'],
    stepsFr: ['Rechercher un titre', 'Ouvrir son certificat officiel', 'Imprimer / exporter en PDF'],
    ctaEn: 'Export official PDF →',
    ctaFr: 'Exporter le PDF officiel →',
    href: (locale, uuid) => (uuid ? `/${locale}/verify/${uuid}/certificate` : '#search'),
  },
];

export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!dbAvailable) return <DBNotReady locale={locale} />;
  const fr = locale !== 'en';
  const sp = await searchParams;
  const format = await getFormatter();

  const number = typeof sp.n === 'string' ? sp.n.trim().toUpperCase() : '';
  const certificate = number
    ? await prisma.certificate.findUnique({
        where: { publicNumber: number },
        select: {
          publicNumber: true,
          credentialUuid: true,
          status: true,
          issuedAt: true,
          expiresAt: true,
          journey: { select: { org: { select: { name: true } } } },
        },
      })
    : null;

  return (
    <>
      <SovereignHeader locale={locale} />
      <main className="mx-auto max-w-6xl px-4 py-12 text-neutral-200">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-apa-gold-bright">
          {fr ? 'Registre de Certification Souveraine' : 'Sovereign Certification Registry'}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-white">
          {fr ? 'Vérification nationale & internationale' : 'National & international verification'}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
          {fr
            ? 'Chaque titre APA est une Verifiable Credential W3C 2.0, signée Ed25519 et révocable via StatusList2021 — vérifiable hors ligne par toute institution.'
            : 'Every APA credential is a W3C 2.0 Verifiable Credential, Ed25519-signed and revocable via StatusList2021 — offline-verifiable by any institution.'}
        </p>

        {/* ── Search & Instant Verification ── */}
        <section id="search" className={`mt-8 ${CARD}`}>
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">
            {fr ? 'Recherche & vérification instantanée' : 'Certificate search & instant verification'}
          </h2>
          <form method="GET" className="mt-4 flex flex-wrap gap-3">
            <input
              type="text"
              name="n"
              defaultValue={number}
              placeholder={fr ? 'Numéro public ou ID (ex. APA-2026-SN-000001)' : 'Public number or ID (e.g. APA-2026-SN-000001)'}
              className={`min-w-64 flex-1 rounded-lg border bg-black px-4 py-3 font-mono text-sm uppercase tracking-wide text-white ${LINE} focus:border-apa-gold-bright focus:outline-none`}
            />
            <button
              type="submit"
              className="rounded-lg bg-apa-gold-bright px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
            >
              {fr ? 'Vérifier' : 'Verify'}
            </button>
          </form>

          {number && !certificate && (
            <p className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-sm text-amber-200">
              {fr ? `Aucun titre trouvé pour « ${number} ».` : `No credential found for “${number}”.`}
            </p>
          )}

          {certificate && (
            <div className={`mt-4 rounded-xl border ${LINE} bg-black p-5`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-lg font-bold text-white">{certificate.publicNumber}</span>
                <span className={`rounded border px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${STATUS_TONE[certificate.status]}`}>
                  {certificate.status}
                </span>
              </div>
              <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-[11px] font-bold uppercase text-neutral-500">{fr ? 'Organisation' : 'Organization'}</dt>
                  <dd className="mt-1 font-semibold text-white">{certificate.journey.org.name}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase text-neutral-500">{fr ? 'Émis le' : 'Issued'}</dt>
                  <dd className="mt-1 text-neutral-300">{format.dateTime(certificate.issuedAt, { dateStyle: 'long' })}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase text-neutral-500">{fr ? 'Expire le' : 'Expires'}</dt>
                  <dd className="mt-1 text-neutral-300">{format.dateTime(certificate.expiresAt, { dateStyle: 'long' })}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={`/verify/${certificate.credentialUuid}`} className="rounded-lg border border-apa-gold-bright/50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-apa-gold-bright hover:bg-apa-gold-bright hover:text-black">
                  {fr ? 'Titre complet & piste d’audit →' : 'Full credential & audit trail →'}
                </Link>
                <Link href={`/verify/${certificate.credentialUuid}/certificate`} className={`rounded-lg border px-4 py-2 text-xs font-bold uppercase tracking-wide text-neutral-200 ${LINE} hover:border-apa-gold-bright`}>
                  {fr ? '⇩ Exporter le PDF d’audit' : '⇩ Export audit PDF'}
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ── Registry services ── */}
        <section className="mt-10">
          <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-400">
            {fr ? 'Services du registre' : 'Registry services'}
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {SERVICES.map((s) => {
              const href = s.href(locale, certificate?.credentialUuid);
              const internal = href.startsWith('/');
              const label = fr ? s.ctaFr : s.ctaEn;
              return (
                <div key={s.id} className={CARD}>
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg border border-apa-gold-bright/40 text-apa-gold-bright">{s.glyph}</span>
                    <h3 className="font-serif text-base font-bold text-white">{fr ? s.fr : s.en}</h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-400">{fr ? s.purposeFr : s.purposeEn}</p>
                  <ol className="mt-3 space-y-1">
                    {(fr ? s.stepsFr : s.stepsEn).map((step, i) => (
                      <li key={i} className="flex gap-2 text-xs text-neutral-300">
                        <span className="font-mono text-apa-gold-bright">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  {internal ? (
                    <Link href={href} className="mt-4 inline-block text-xs font-bold text-apa-gold-bright hover:underline">{label}</Link>
                  ) : (
                    <a href={href} className="mt-4 inline-block text-xs font-bold text-apa-gold-bright hover:underline">{label}</a>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
