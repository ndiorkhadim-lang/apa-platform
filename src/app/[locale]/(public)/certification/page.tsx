import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/site/section-header';
import { Link } from '@/i18n/navigation';

interface Step {
  name: string;
  desc: string;
}

export default async function CertificationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Certification');

  const steps = t.raw('steps') as Step[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader num={t('secnum')} title={t('title')} />

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

      {/* CTAs */}
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/sign-in"
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
      <p className="mt-4 text-xs italic text-apa-grey">{t('formNote')}</p>
    </div>
  );
}
