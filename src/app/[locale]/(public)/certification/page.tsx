import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/site/section-header';
import { Link } from '@/i18n/navigation';

interface Step {
  name: string;
  desc: string;
}

const PREMIUM = {
  fr: {
    title: 'La Prime d’Authenticité™',
    sub: 'La gouvernance éthique, convertie en valeur d’entreprise mesurable.',
    pitch: 'Là où les checklists ESG produisent des rapports, le cadre APA fabrique de la confiance auditable — un actif portable qui comprime votre coût du capital.',
    flow: ['Conformité traditionnelle', 'Transformation de gouvernance', 'Prime d’Authenticité™', 'Risque réduit', 'Confiance investisseur', 'Valeur long terme'],
    kpis: [['300–500 pb', 'coût du capital comprimé'], ['+$2,5M', 'valorisation / entité certifiée'], ['σ → 0', 'fuite de valeur supprimée (CVP)']],
    more: 'Explorer le tableau de bord analytique →',
  },
  en: {
    title: 'The Authenticity Premium™',
    sub: 'Ethical governance, converted into measurable enterprise value.',
    pitch: 'Where ESG checklists produce reports, the APA framework manufactures auditable trust — a portable asset that compresses your cost of capital.',
    flow: ['Traditional Compliance', 'Governance Transformation', 'Authenticity Premium™', 'Reduced Risk', 'Investor Confidence', 'Long-Term Value'],
    kpis: [['300–500 bps', 'cost of capital compressed'], ['+$2.5M', 'valuation / certified entity'], ['σ → 0', 'value leakage suppressed (CVP)']],
    more: 'Explore the analytics dashboard →',
  },
} as const;

export default async function CertificationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Certification');
  const p = PREMIUM[locale === 'en' ? 'en' : 'fr'];

  const steps = t.raw('steps') as Step[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader num={t('secnum')} title={t('title')} />

      {/* ── Authenticity Premium™ — executive visual strip ── */}
      <section className="apa-gradient mt-8 rounded-apa-lg p-7 text-white">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-apa-gold-bright">{p.title}</h2>
            <p className="mt-1 text-sm text-apa-mint">{p.sub}</p>
          </div>
          <p className="max-w-md text-xs italic text-apa-sage">{p.pitch}</p>
        </div>
        <div className="mt-5 flex flex-wrap items-stretch gap-1.5">
          {p.flow.map((step, i, arr) => (
            <div key={step} className="flex flex-1 items-center gap-1.5" style={{ minWidth: 130 }}>
              <div
                className={`flex-1 rounded px-2 py-2 text-center text-[11px] font-bold leading-tight ${
                  i === 2
                    ? 'bg-apa-gold-bright text-apa-ink shadow-md'
                    : 'border border-white/25 bg-white/10 text-apa-mint'
                }`}
              >
                {step}
              </div>
              {i < arr.length - 1 ? <span aria-hidden className="text-apa-gold-bright">→</span> : null}
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {p.kpis.map(([v, l]) => (
            <div key={l} className="apa-kpi px-4 py-2.5 text-center">
              <span className="text-lg font-extrabold text-apa-gold-bright">{v}</span>
              <span className="ml-2 text-[11px] text-apa-mint">{l}</span>
            </div>
          ))}
          <Link href="/dashboard" className="ml-auto text-sm font-semibold text-apa-gold-bright hover:underline">
            {p.more}
          </Link>
        </div>
      </section>

      {/* 5-step pathway */}
      <h2 className="mt-10 text-xl font-bold text-apa-green">{t('pathwayTitle')}</h2>
      <ol className="mt-6 space-y-4">
        {steps.map((step, i) => (
          <li key={step.name} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                  i === steps.length - 1
                    ? 'bg-apa-gold-bright text-apa-ink'
                    : 'apa-gradient text-white'
                }`}
              >
                {i + 1}
              </span>
              {i < steps.length - 1 ? (
                <span className="mt-1 h-full w-0.5 flex-1 bg-apa-gold" aria-hidden />
              ) : null}
            </div>
            <div className="pb-6">
              <h3 className="font-bold text-apa-navy">{step.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-apa-ink">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Criteria */}
      <div className="apa-box apa-box-gold mt-8 p-5">
        <h2 className="font-bold text-apa-green">{t('criteriaTitle')}</h2>
        <p className="mt-2 text-sm leading-relaxed text-apa-ink">{t('criteria')}</p>
      </div>

      {/* CTAs — the diagnostic engine is live */}
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/app/cspa"
          className="rounded-md bg-apa-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-apa-green-mid"
        >
          {t('ctaStart')} →
        </Link>
        <Link
          href="/verify"
          className="rounded-md border border-apa-green px-5 py-2.5 text-sm font-semibold text-apa-green transition-colors hover:bg-apa-green hover:text-white"
        >
          {t('ctaVerify')}
        </Link>
      </div>
    </div>
  );
}
