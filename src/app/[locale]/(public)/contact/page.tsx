import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/site/section-header';
import { APA_OFFICES } from '@/domain/site/contact';
import { submitContact, submitPrequal } from './actions';

interface Impact {
  title: string;
  desc: string;
}
interface ContactRow {
  channel: string;
  detail: string;
}

function renderDetail(detail: string) {
  if (detail.includes('@')) {
    return (
      <a href={`mailto:${detail}`} className="text-apa-green underline">
        {detail}
      </a>
    );
  }
  if (detail.startsWith('http')) {
    return (
      <a href={detail} target="_blank" rel="noopener noreferrer" className="text-apa-green underline">
        {detail}
      </a>
    );
  }
  return detail;
}

const inputCls =
  'mt-1 w-full rounded-md border border-apa-line bg-white px-3 py-2.5 text-sm focus:border-apa-green focus:outline-none focus:ring-2 focus:ring-apa-green/20';

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const [t, tForm, tPrequal] = await Promise.all([
    getTranslations('Contact'),
    getTranslations('ContactForm'),
    getTranslations('PrequalForm'),
  ]);

  const impacts = t.raw('impacts') as Impact[];
  const rows = t.raw('rows') as ContactRow[];

  const sent = sp.sent === '1';
  const deck = sp.deck === '1';
  const err = typeof sp.err === 'string' ? sp.err : null;
  const perr = typeof sp.perr === 'string' ? sp.perr : null;

  // Intelligence pricing CTAs pre-fill the message (plan=professional|enterprise)
  const plan = typeof sp.plan === 'string' ? sp.plan : null;
  const planMessage =
    plan === 'professional'
      ? locale === 'fr'
        ? "Bonjour, je souhaite activer l'Accès Professionnel APA Intelligence (10 000 USD/an) pour mon organisation. Merci de m'envoyer la facture et les étapes d'activation."
        : 'Hello, I would like to activate APA Intelligence Professional Access (USD 10,000/yr) for my organization. Please send the invoice and activation steps.'
      : plan === 'enterprise'
        ? locale === 'fr'
          ? "Bonjour, je représente une organisation intéressée par le Partenariat Entreprise APA Intelligence (50 000 USD/an). Merci de nous mettre en relation avec l'équipe Entreprise pour un briefing."
          : 'Hello, I represent an organization interested in the APA Intelligence Enterprise Partnership (USD 50,000/yr). Please connect us with the Enterprise team for a briefing.'
        : '';

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader num={t('secnum')} title={t('title')} />

      {/* Impact cards */}
      <h2 className="mt-10 text-xl font-bold text-apa-green">{t('impactTitle')}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {impacts.map((im, i) => (
          <div
            key={im.title}
            className={`apa-box p-5 ${i === 1 ? 'apa-box-gold' : i === 2 ? 'apa-box-navy' : ''}`}
          >
            <h3 className="font-bold text-apa-green">{im.title}</h3>
            <p className="mt-2 text-sm leading-relaxed">{im.desc}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm text-apa-ink">
        <span className="font-bold text-apa-green">{t('indicatorsLabel')}</span>{' '}
        {t('indicators')}
      </p>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        {/* Left — contact info + contact form */}
        <div>
          <h2 className="text-xl font-bold text-apa-green">{t('contactTitle')}</h2>
          <div className="mt-2 h-[3px] w-full bg-apa-gold" />
          <table className="mt-6 w-full border-collapse text-sm">
            <thead>
              <tr className="bg-apa-green text-left text-xs uppercase text-white">
                <th className="px-3 py-2">{t('cols.channel')}</th>
                <th className="px-3 py-2">{t('cols.detail')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.channel} className="border border-apa-line even:bg-apa-soft">
                  <td className="whitespace-nowrap px-3 py-2 font-bold text-apa-navy">
                    {r.channel}
                  </td>
                  <td className="px-3 py-2">{renderDetail(r.detail)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* The 3 official offices */}
          <h3 className="mt-8 text-lg font-bold text-apa-green">
            {locale === 'fr' ? 'Nos bureaux' : 'Our offices'}
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {APA_OFFICES.map((o) => (
              <address key={o.country} className="rounded-apa border border-apa-line bg-white p-4 text-sm not-italic">
                <p className="font-bold text-apa-navy">
                  {o.flag} {o.country}
                  {o.isHQ ? <span className="ml-2 rounded bg-apa-green px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">HQ</span> : null}
                </p>
                {o.lines.map((line) => (
                  <p key={line} className="mt-0.5 text-apa-grey">{line}</p>
                ))}
              </address>
            ))}
          </div>

          <h3 id="contact-form" className="mt-10 text-lg font-bold text-apa-green">
            {tForm('title')}
          </h3>
          {sent ? (
            <p role="status" className="apa-box mt-4 p-4 text-sm font-semibold text-apa-green">
              ✓ {tForm('success')}
            </p>
          ) : (
            <form action={submitContact} className="mt-4 space-y-3">
              <input type="hidden" name="locale" value={locale} />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-apa-ink">
                  {tForm('name')}
                  <input name="name" required minLength={2} className={inputCls} />
                </label>
                <label className="block text-sm font-semibold text-apa-ink">
                  {tForm('email')}
                  <input type="email" name="email" required className={inputCls} />
                </label>
                <label className="block text-sm font-semibold text-apa-ink">
                  {tForm('organization')}
                  <input name="organization" className={inputCls} />
                </label>
                <label className="block text-sm font-semibold text-apa-ink">
                  {tForm('country')}
                  <input name="country" className={inputCls} />
                </label>
              </div>
              <label className="block text-sm font-semibold text-apa-ink">
                {tForm('message')}
                <textarea
                  name="message"
                  required
                  minLength={10}
                  rows={5}
                  defaultValue={planMessage}
                  className={inputCls}
                />
              </label>
              {err ? (
                <p role="alert" className="apa-box apa-box-gold p-3 text-sm">
                  {tForm(err === 'throttled' ? 'throttled' : 'invalid')}
                </p>
              ) : null}
              <button
                type="submit"
                className="rounded-md bg-apa-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-apa-green-mid"
              >
                {tForm('submit')}
              </button>
            </form>
          )}
        </div>

        {/* Right — pre-qualification deck */}
        <div>
          <h2 className="text-xl font-bold text-apa-green">{t('downloadTitle')}</h2>
          <div className="mt-2 h-[3px] w-full bg-apa-gold" />
          <p className="mt-6 text-sm text-apa-grey">{t('downloadDesc')}</p>

          <div id="prequal-form" className="apa-box apa-box-gold mt-6 p-5">
            {deck ? (
              <div role="status">
                <p className="text-sm font-semibold text-apa-green">
                  ✓ {tPrequal('success')}
                </p>
                <a
                  href="/docs/APA_Prequalification_Deck.pdf"
                  download
                  className="mt-4 inline-block rounded-md bg-apa-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-apa-green-mid"
                >
                  ⬇ {tPrequal('download')}
                </a>
              </div>
            ) : (
              <form action={submitPrequal} className="space-y-3">
                <input type="hidden" name="locale" value={locale} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-apa-ink">
                    {tPrequal('name')}
                    <input name="name" required minLength={2} className={inputCls} />
                  </label>
                  <label className="block text-sm font-semibold text-apa-ink">
                    {tPrequal('email')}
                    <input type="email" name="email" required className={inputCls} />
                  </label>
                  <label className="block text-sm font-semibold text-apa-ink">
                    {tPrequal('organization')}
                    <input name="organization" className={inputCls} />
                  </label>
                  <label className="block text-sm font-semibold text-apa-ink">
                    {tPrequal('country')}
                    <input name="country" className={inputCls} />
                  </label>
                </div>
                {perr ? (
                  <p role="alert" className="apa-box p-3 text-sm">
                    {tForm(perr === 'throttled' ? 'throttled' : 'invalid')}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className="rounded-md bg-apa-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-apa-green-mid"
                >
                  {tPrequal('submit')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
