import { getTranslations, getFormatter } from 'next-intl/server';
import type { SignedCredential } from '@/domain/certification/credential';
import type { CredentialVerdict } from '@/infrastructure/certification/verify-service';
import type { CertificateStatus } from '@/generated/prisma/client';

/**
 * Authenticity Premium™ credential surface — the PDF's black executive canvas
 * (#000000 background, #262626 hairlines, high-contrast type). Pure server
 * render: no client JS, evidence unfolds via native <details>.
 */

const LINE = 'border-[#262626]';

const STATUS_LABEL: Record<CertificateStatus, { fr: string; en: string; tone: string }> = {
  ACTIVE: { fr: 'ACTIF', en: 'ACTIVE', tone: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10' },
  EXPIRED: { fr: 'EXPIRÉ', en: 'EXPIRED', tone: 'text-amber-200 border-amber-500/40 bg-amber-500/10' },
  REVOKED: { fr: 'RÉVOQUÉ', en: 'REVOKED', tone: 'text-red-300 border-red-500/40 bg-red-500/10' },
};

async function IntegrityBadge({ state }: { state: CredentialVerdict }) {
  const t = await getTranslations('VerifyCredential');
  const map: Record<CredentialVerdict, { tone: string; glyph: string }> = {
    VALID: { tone: 'text-emerald-300 border-emerald-500/50 bg-emerald-500/10', glyph: '✓' },
    REVOKED: { tone: 'text-red-300 border-red-500/60 bg-red-500/15', glyph: '⃠' },
    INVALID: { tone: 'text-red-300 border-red-500/50 bg-red-500/10', glyph: '✕' },
    UNAVAILABLE: { tone: 'text-neutral-400 border-neutral-600 bg-neutral-800/40', glyph: '?' },
  };
  const s = map[state];
  return (
    <div className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${s.tone}`}>
      <span aria-hidden className="text-lg font-black leading-none">{s.glyph}</span>
      <div className="leading-tight">
        <div className="text-sm font-bold uppercase tracking-wide">{t(`integrity.${state}.title`)}</div>
        <div className="text-xs opacity-80">{t(`integrity.${state}.detail`)}</div>
      </div>
    </div>
  );
}

function Field({ label, children, mono }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">{label}</dt>
      <dd className={`mt-1 break-words text-neutral-100 ${mono ? 'font-mono text-xs' : 'text-sm'}`}>{children}</dd>
    </div>
  );
}

export async function CredentialView({
  document,
  verdict,
  status,
  publicNumber,
  issuedAt,
  expiresAt,
  locale,
}: {
  document: SignedCredential;
  verdict: CredentialVerdict;
  status: CertificateStatus;
  publicNumber: string;
  issuedAt: Date;
  expiresAt: Date;
  locale: string;
}) {
  const t = await getTranslations('VerifyCredential');
  const format = await getFormatter();
  const fr = locale !== 'en';
  const subject = document.credentialSubject;
  const st = STATUS_LABEL[status];

  return (
    <article className={`overflow-hidden rounded-2xl border ${LINE} bg-black text-white`}>
      {/* Header */}
      <header className={`border-b ${LINE} p-6 sm:p-8`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-apa-gold-bright">
              {t('kicker')}
            </p>
            <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
              {subject.achievement.name}
            </h1>
            <p className="mt-2 font-mono text-sm text-neutral-400">{publicNumber}</p>
          </div>
          <span className={`shrink-0 rounded border px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${st.tone}`}>
            {fr ? st.fr : st.en}
          </span>
        </div>

        <div className="mt-6">
          <IntegrityBadge state={verdict} />
        </div>

        {/* Standards */}
        <div className="mt-5 flex flex-wrap gap-2">
          {['W3C VC 2.0', 'Open Badges 3.0', ...subject.achievement.alignment.map((a) => a.targetCode)].map((chip) => (
            <span key={chip} className={`rounded-full border ${LINE} px-3 py-1 text-[11px] font-semibold text-neutral-300`}>
              {chip}
            </span>
          ))}
        </div>
      </header>

      {/* Metadata */}
      <dl className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
        <Field label={t('holder')}>{subject.name}</Field>
        <Field label={t('issuer')}>{document.issuer.name}</Field>
        <Field label={t('cspa')}>
          <span className="font-mono text-base font-bold text-apa-gold-bright">
            {subject.result.find((r) => r.resultDescription === 'cspa-composite')?.value ?? '—'}
          </span>
          {(() => {
            const m = subject.result.find((r) => r.resultDescription === 'cspa-maturity')?.value ?? '';
            const label = m && t.has(`maturity.${m}`) ? t(`maturity.${m}`) : m;
            return label ? <span className="ml-2 text-xs text-neutral-400">{label}</span> : null;
          })()}
        </Field>
        <Field label={t('validity')}>
          {format.dateTime(issuedAt, { dateStyle: 'medium' })} → {format.dateTime(expiresAt, { dateStyle: 'medium' })}
        </Field>
        <Field label={t('credentialId')} mono>{document.id}</Field>
        <Field label={t('issuerDid')} mono>{document.issuer.id}</Field>
      </dl>

      {/* Impact — evidence[] unfold */}
      <section className={`border-t ${LINE} p-6 sm:p-8`}>
        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">
          {t('impact.title')}
        </h2>
        <p className="mt-1 text-xs text-neutral-500">{t('impact.subtitle', { count: subject.evidence.length })}</p>
        <ul className="mt-5 space-y-2">
          {subject.evidence.map((item) => (
            <li key={item.id}>
              <details className={`group rounded-lg border ${LINE} bg-neutral-950`}>
                <summary className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm">
                  <span className="font-mono text-xs text-apa-gold-bright">#{item['apa:toolNumber']}</span>
                  <span className="font-medium text-neutral-100">{item.name}</span>
                  <span className="ml-auto text-neutral-500 transition-transform group-open:rotate-90" aria-hidden>›</span>
                </summary>
                <div className={`border-t ${LINE} px-4 py-3 text-xs text-neutral-400`}>
                  <p>{item.narrative}</p>
                  <p className="mt-2 font-mono text-[11px] text-neutral-600">
                    {t('impact.report')}: {item['apa:reportId']}
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </section>

      {/* Proof footer — cryptographic audit trail */}
      <footer id="audit-trail" className={`scroll-mt-20 border-t ${LINE} bg-neutral-950 p-6 text-xs text-neutral-500 sm:p-8`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('proofType')} mono>{document.proof.type}</Field>
          <Field label={t('verificationMethod')} mono>{document.proof.verificationMethod}</Field>
        </div>
        <p className="mt-4 text-[11px] text-neutral-600">{t('offlineNote')}</p>
      </footer>
    </article>
  );
}
