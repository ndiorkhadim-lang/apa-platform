import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeader } from '@/components/site/section-header';
import { Link } from '@/i18n/navigation';

type M = '✔' | '➖' | '✖';

const C = {
  fr: {
    pricingTitle: "Adhésion APA Intelligence — 3 niveaux",
    pricingSub: 'Un modèle simple : découvrez gratuitement, opérez en Professionnel, transformez en Entreprise.',
    recommended: 'Recommandé',
    perYear: '/ an',
    free: 'Gratuit',
    plans: [
      {
        name: 'Compte Gratuit',
        purpose: 'Découvrir APA, apprendre de sa base de connaissances et rejoindre l\'écosystème.',
        price: 'Gratuit',
        features: [
          'Glossaire complet de gouvernance', 'Bibliothèque de leadership éclairé', 'Articles & analyses de recherche',
          'Publications sélectionnées', 'Podcasts & vidéos', 'Aperçus des parcours', 'Actualités de la communauté',
          'Newsletter', 'Téléchargements limités',
        ],
        cta: 'Créer un compte gratuit',
        href: '/sign-up',
      },
      {
        name: 'Accès Professionnel',
        purpose: 'Pour les professionnels, consultants, PME, responsables conformité et institutions.',
        price: '10 000 USD',
        features: [
          'Suite GRC complète (63 outils)', 'Boîte à outils MAE', "Protocoles d'accès CVP",
          'Bibliothèque Intelligence premium', 'Cadres avancés & modèles', "Outils d'évaluation",
          'Rapports exclusifs', 'Tableau de bord membre', 'Support prioritaire',
        ],
        cta: "Demander l'Accès Professionnel",
        href: '/contact?plan=professional#contact-form',
      },
      {
        name: 'Partenariat Entreprise',
        purpose: 'Pour gouvernements, régulateurs, institutions financières, multinationales et partenaires stratégiques.',
        price: '50 000 USD',
        features: [
          'Tout l\'Accès Professionnel, plus :', 'Suite APA Intelligence complète', 'Conseil sur-mesure',
          'Conseiller gouvernance dédié', 'Rapports intelligence exécutifs', 'Tableau de bord stratégique 10 ans',
          "Accès à l'échelle de l'organisation", 'Benchmarking & analytics', 'Briefings exécutifs',
          'Success manager dédié',
        ],
        cta: "Contacter l'équipe Entreprise",
        href: '/contact?plan=enterprise#contact-form',
      },
    ],
    matrixTitle: 'Matrice comparative',
    matrixCols: ['Gratuit', 'Professionnel', 'Entreprise'],
    matrix: [
      ['Ressources de connaissance', '✔', '✔', '✔'],
      ['Bibliothèque de recherche', '➖', '✔', '✔'],
      ['Cadres de gouvernance', '➖', '✔', '✔'],
      ['Suite GRC (63 outils)', '✖', '✔', '✔'],
      ['Boîte à outils MAE', '✖', '✔', '✔'],
      ['Protocoles CVP', '✖', '✔', '✔'],
      ['Accompagnement certification', '✖', '✔', '✔'],
      ['Assistant IA (Navigator)', '➖', '✔', '✔'],
      ['Rapports premium', '✖', '✔', '✔'],
      ['Tableau de bord organisation', '✖', '➖', '✔'],
      ['Conseil stratégique', '✖', '✖', '✔'],
      ['Benchmarking', '✖', '✖', '✔'],
      ['Analytics exécutifs', '✖', '✖', '✔'],
      ['Support dédié', '✖', '➖', '✔'],
    ] as [string, M, M, M][],
    whyTitle: 'Pourquoi APA Intelligence',
    whyCards: [
      { t: 'Le seul corpus calibré Afrique', d: '63 outils propriétaires, 22 nations documentées (scores ACRI), des métriques décolonisées qui satisfont les standards DFI.' },
      { t: 'De la connaissance au capital', d: 'La Prime d\'Authenticité™ convertit la gouvernance vérifiée en 300–500 pb de coût du capital économisés.' },
      { t: 'Un standard, pas un abonnement', d: "L'adhésion alimente directement votre parcours de certification — chaque ressource est une preuve potentielle." },
    ],
    benefitsTitle: 'Bénéfices mesurables',
    benefits: [
      '300–500 pb de compression du coût du capital (entités certifiées)',
      '+$2,5M de valorisation moyenne par entité certifiée',
      'Accès au pipeline de $80B+ d\'IDE adressé',
      'Conformité CSDDD / UK Bribery Act / LkSG démontrable',
      'Réduction des primes d\'assurance (trajectoire MIGA)',
      'Décisions d\'investissement éclairées par 22 atlas nationaux',
    ],
    testiTitle: 'Ils font confiance au standard',
    testis: [
      { q: '« Le niveau de détail des atlas nationaux — contacts nommés, angles réglementaires — est sans équivalent sur le continent. »', a: 'Directeur des risques, institution financière panafricaine' },
      { q: '« Nous avons intégré la suite GRC dans notre due diligence : le temps d\'analyse pays a été divisé par trois. »', a: 'Partner, fonds d\'impact (Afrique de l\'Est)' },
      { q: '« Le tableau de bord 10 ans donne à notre conseil une visibilité que nos consultants n\'avaient jamais fournie. »', a: 'Secrétaire général, société d\'État (Afrique de l\'Ouest)' },
    ],
    faqTitle: 'Questions fréquentes',
    faqs: [
      ['Puis-je passer du Gratuit au Professionnel à tout moment ?', 'Oui — la mise à niveau est immédiate après activation ; vos données et sessions d\'outils sont conservées.'],
      ['Comment se paie l\'abonnement ?', 'Virement bancaire sur facture (procurement-friendly). Paystack/Flutterwave et Stripe arrivent pour le paiement en ligne.'],
      ['L\'abonnement couvre-t-il toute mon organisation ?', 'Professionnel : jusqu\'à 10 sièges. Entreprise : organisation entière, sans limite de sièges.'],
      ['Y a-t-il un engagement de durée ?', 'Annuel, renouvelable. Pas de reconduction tacite : vous décidez chaque année.'],
      ['La certification est-elle incluse ?', 'L\'accompagnement outillé oui ; l\'audit de certification est une prestation distincte (voir Certification).'],
      ['Proposez-vous des tarifs ONG / académiques ?', 'Oui, sur dossier pour les OSC et institutions académiques africaines — contactez-nous.'],
    ],
    finalTitle: 'Choisissez votre niveau d\'engagement',
    finalSub: 'Rejoignez l\'écosystème qui transforme la redevabilité en avantage compétitif.',
  },
  en: {
    pricingTitle: 'APA Intelligence Membership — 3 tiers',
    pricingSub: 'A simple model: discover for free, operate as a Professional, transform as an Enterprise.',
    recommended: 'Recommended',
    perYear: '/ year',
    free: 'Free',
    plans: [
      {
        name: 'Free Account',
        purpose: 'Discover APA, learn from its knowledge base and join the ecosystem.',
        price: 'Free',
        features: [
          'Complete governance glossary', 'Thought leadership library', 'Articles & research insights',
          'Selected publications', 'Podcasts & videos', 'Learning path previews', 'Community updates',
          'Newsletter', 'Limited downloads',
        ],
        cta: 'Create free account',
        href: '/sign-up',
      },
      {
        name: 'Professional Access',
        purpose: 'For professionals, consultants, SMEs, compliance officers and institutions.',
        price: 'USD 10,000',
        features: [
          'Complete GRC Suite (63 tools)', 'MAE Toolbox', 'CVP access protocols',
          'Premium intelligence library', 'Advanced frameworks & templates', 'Assessment tools',
          'Exclusive reports', 'Member dashboard', 'Priority support',
        ],
        cta: 'Request Professional Access',
        href: '/contact?plan=professional#contact-form',
      },
      {
        name: 'Enterprise Partnership',
        purpose: 'For governments, regulators, financial institutions, multinationals and strategic partners.',
        price: 'USD 50,000',
        features: [
          'Everything in Professional, plus:', 'Complete APA Intelligence Suite', 'Customized advisory',
          'Dedicated governance advisor', 'Executive intelligence reports', '10-year strategic dashboard',
          'Organization-wide access', 'Benchmarking & analytics', 'Executive briefings',
          'Dedicated success manager',
        ],
        cta: 'Contact the Enterprise team',
        href: '/contact?plan=enterprise#contact-form',
      },
    ],
    matrixTitle: 'Comparison matrix',
    matrixCols: ['Free', 'Professional', 'Enterprise'],
    matrix: [
      ['Knowledge resources', '✔', '✔', '✔'],
      ['Research library', '➖', '✔', '✔'],
      ['Governance frameworks', '➖', '✔', '✔'],
      ['GRC Suite (63 tools)', '✖', '✔', '✔'],
      ['MAE Toolbox', '✖', '✔', '✔'],
      ['CVP protocols', '✖', '✔', '✔'],
      ['Certification support', '✖', '✔', '✔'],
      ['AI Assistant (Navigator)', '➖', '✔', '✔'],
      ['Premium reports', '✖', '✔', '✔'],
      ['Organization dashboard', '✖', '➖', '✔'],
      ['Strategic advisory', '✖', '✖', '✔'],
      ['Benchmarking', '✖', '✖', '✔'],
      ['Executive analytics', '✖', '✖', '✔'],
      ['Dedicated support', '✖', '➖', '✔'],
    ] as [string, M, M, M][],
    whyTitle: 'Why APA Intelligence',
    whyCards: [
      { t: 'The only Africa-calibrated corpus', d: '63 proprietary tools, 22 documented nations (ACRI scores), decolonized metrics that satisfy DFI standards.' },
      { t: 'From knowledge to capital', d: 'The Authenticity Premium™ converts verified governance into 300–500 bps of cost-of-capital savings.' },
      { t: 'A standard, not a subscription', d: 'Membership feeds your certification journey directly — every resource is potential evidence.' },
    ],
    benefitsTitle: 'Measurable benefits',
    benefits: [
      '300–500 bps cost-of-capital compression (certified entities)',
      '+$2.5M average valuation uplift per certified entity',
      'Access to the $80B+ addressed FDI pipeline',
      'Demonstrable CSDDD / UK Bribery Act / LkSG compliance',
      'Insurance premium reduction (MIGA trajectory)',
      'Investment decisions informed by 22 national atlases',
    ],
    testiTitle: 'Trusted by the standard-setters',
    testis: [
      { q: '"The depth of the national atlases — named contacts, regulatory angles — has no equivalent on the continent."', a: 'Chief Risk Officer, pan-African financial institution' },
      { q: '"We embedded the GRC suite into our due diligence: country analysis time was cut by two-thirds."', a: 'Partner, impact fund (East Africa)' },
      { q: '"The 10-year dashboard gives our board a visibility our consultants never delivered."', a: 'Secretary General, state-owned enterprise (West Africa)' },
    ],
    faqTitle: 'Frequently asked questions',
    faqs: [
      ['Can I upgrade from Free to Professional anytime?', 'Yes — the upgrade is immediate upon activation; your data and tool sessions are preserved.'],
      ['How is the subscription paid?', 'Bank transfer on invoice (procurement-friendly). Paystack/Flutterwave and Stripe are coming for online payment.'],
      ['Does the subscription cover my whole organization?', 'Professional: up to 10 seats. Enterprise: organization-wide, unlimited seats.'],
      ['Is there a duration commitment?', 'Annual, renewable. No tacit renewal: you decide each year.'],
      ['Is certification included?', 'Tooled support yes; the certification audit is a separate engagement (see Certification).'],
      ['Do you offer NGO / academic pricing?', 'Yes, case-by-case for African CSOs and academic institutions — contact us.'],
    ],
    finalTitle: 'Choose your level of engagement',
    finalSub: 'Join the ecosystem turning accountability into competitive advantage.',
  },
} as const;

const MARK_STYLE: Record<M, string> = {
  '✔': 'text-apa-green font-bold',
  '➖': 'text-apa-gold font-bold',
  '✖': 'text-apa-line',
};

export default async function IntelligencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Intelligence');
  const c = C[locale === 'en' ? 'en' : 'fr'];

  const suggestions = t.raw('suggestions') as string[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeader num={t('secnum')} title={t('title')} />

      {/* Navigator hero (kept — the AI concierge) */}
      <div className="apa-gradient mt-8 rounded-apa-lg p-8 text-white">
        <span className="apa-badge">{t('navigatorBadge')}</span>
        <p className="mt-5 max-w-3xl text-lg italic leading-relaxed text-apa-mint">
          {t('navigatorQuote')}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <li key={s} className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm text-apa-mint">
              › {s}
            </li>
          ))}
        </ul>
      </div>

      {/* ── PRICING — 3 tiers ── */}
      <section className="mt-16" id="pricing">
        <h2 className="text-2xl font-bold text-apa-green">{c.pricingTitle}</h2>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />
        <p className="mt-4 text-sm text-apa-grey">{c.pricingSub}</p>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {c.plans.map((p, i) => {
            const highlighted = i === 1;
            return (
              <article
                key={p.name}
                className={`relative flex flex-col rounded-apa-lg p-7 transition-transform hover:-translate-y-1 ${
                  highlighted
                    ? 'apa-gradient text-white shadow-xl ring-2 ring-apa-gold-bright'
                    : 'border border-apa-line bg-white shadow-sm'
                }`}
              >
                {highlighted ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-apa-gold-bright px-4 py-1 text-xs font-extrabold uppercase tracking-wide text-apa-ink">
                    ★ {c.recommended}
                  </span>
                ) : null}
                <h3 className={`text-lg font-bold ${highlighted ? 'text-apa-gold-bright' : 'text-apa-navy'}`}>
                  {p.name}
                </h3>
                <p className={`mt-2 min-h-16 text-sm ${highlighted ? 'text-apa-mint' : 'text-apa-grey'}`}>
                  {p.purpose}
                </p>
                <p className="mt-4">
                  <span className={`text-3xl font-extrabold ${highlighted ? 'text-white' : 'text-apa-green'}`}>
                    {p.price}
                  </span>
                  {i > 0 ? (
                    <span className={`ml-1 text-sm ${highlighted ? 'text-apa-mint' : 'text-apa-grey'}`}>
                      {c.perYear}
                    </span>
                  ) : null}
                </p>
                <ul className={`mt-6 flex-1 space-y-2.5 text-sm ${highlighted ? 'text-apa-mint' : 'text-apa-ink'}`}>
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <span className={highlighted ? 'text-apa-gold-bright' : 'text-apa-green'}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={`mt-7 rounded-md px-5 py-3 text-center text-sm font-bold transition-colors ${
                    highlighted
                      ? 'bg-apa-gold-bright text-apa-ink hover:bg-apa-gold'
                      : 'bg-apa-green text-white hover:bg-apa-green-mid'
                  }`}
                >
                  {p.cta} →
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── COMPARISON MATRIX ── */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-apa-green">{c.matrixTitle}</h2>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />
        <div className="mt-6 overflow-x-auto rounded-apa-lg border border-apa-line">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-apa-green text-white">
                <th className="px-4 py-3 text-left text-xs uppercase" />
                {c.matrixCols.map((col, i) => (
                  <th key={col} className={`px-4 py-3 text-center text-xs uppercase ${i === 1 ? 'bg-apa-gold text-apa-ink' : ''}`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.matrix.map(([label, a, b, d]) => (
                <tr key={label} className="border-t border-apa-mist even:bg-apa-soft">
                  <td className="px-4 py-2.5 font-medium text-apa-ink">{label}</td>
                  {[a, b, d].map((m, i) => (
                    <td key={i} className={`px-4 py-2.5 text-center text-base ${MARK_STYLE[m]} ${i === 1 ? 'bg-apa-gold/10' : ''}`}>
                      {m}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-apa-grey">✔ {locale === 'fr' ? 'Inclus' : 'Included'} · ➖ {locale === 'fr' ? 'Limité' : 'Limited'} · ✖ {locale === 'fr' ? 'Non inclus' : 'Not included'}</p>
      </section>

      {/* ── WHY ── */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-apa-green">{c.whyTitle}</h2>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {c.whyCards.map((w, i) => (
            <div key={w.t} className={`apa-box p-5 ${i === 1 ? 'apa-box-gold' : i === 2 ? 'apa-box-navy' : ''}`}>
              <h3 className="font-bold text-apa-green">{w.t}</h3>
              <p className="mt-2 text-sm leading-relaxed">{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-apa-green">{c.benefitsTitle}</h2>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {c.benefits.map((b) => (
            <div key={b} className="flex items-start gap-3 rounded-apa border border-apa-line bg-white px-4 py-3 text-sm">
              <span className="text-apa-gold">◆</span>
              {b}
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-apa-green">{c.testiTitle}</h2>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {c.testis.map((v) => (
            <figure key={v.a} className="rounded-apa-lg border border-apa-line bg-white p-6">
              <blockquote className="text-sm italic leading-relaxed text-apa-ink">{v.q}</blockquote>
              <figcaption className="mt-4 text-xs font-semibold text-apa-grey">— {v.a}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-apa-green">{c.faqTitle}</h2>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />
        <div className="mt-6 space-y-3">
          {c.faqs.map(([q, a]) => (
            <details key={q} className="rounded-apa border border-apa-line bg-white px-5 py-4">
              <summary className="cursor-pointer text-sm font-bold text-apa-navy">{q}</summary>
              <p className="mt-3 text-sm leading-relaxed text-apa-ink">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="apa-gradient mt-16 rounded-apa-lg p-10 text-center text-white">
        <h2 className="text-2xl font-bold">{c.finalTitle}</h2>
        <p className="mt-2 text-apa-mint">{c.finalSub}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/sign-up" className="rounded-md border border-apa-gold-bright px-6 py-3 text-sm font-semibold text-apa-gold-bright transition-colors hover:bg-apa-gold-bright hover:text-apa-ink">
            {c.plans[0].cta}
          </Link>
          <Link href="/contact?plan=professional#contact-form" className="rounded-md bg-apa-gold-bright px-6 py-3 text-sm font-bold text-apa-ink transition-colors hover:bg-apa-gold">
            {c.plans[1].cta}
          </Link>
          <Link href="/contact?plan=enterprise#contact-form" className="rounded-md border border-apa-gold-bright px-6 py-3 text-sm font-semibold text-apa-gold-bright transition-colors hover:bg-apa-gold-bright hover:text-apa-ink">
            {c.plans[2].cta}
          </Link>
        </div>
      </section>
    </div>
  );
}
