import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/infrastructure/prisma/client';

const REGION_ORDER = ['West', 'East', 'Central', 'North', 'Southern'] as const;

function flagOf(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

const C = {
  fr: {
    heroKicker: 'Programme Champions APA™',
    heroTitle: 'Devenez Champion APA',
    heroSub: "Menez le changement à travers l'Afrique. Aidez les organisations à élever leur gouvernance, leur redevabilité et leur performance — et rejoignez le réseau qui transforme l'éthique en avantage compétitif.",
    apply: 'Candidater maintenant',
    who: 'Qui sont les Champions APA ?',
    whoCards: [
      { t: 'Mission', d: "Porter le standard APA dans votre pays : faire de la redevabilité vérifiable la norme des institutions africaines." },
      { t: 'Rôle', d: "Ambassadeur officiel : déploiement des 63 outils, animation du pipeline de certification, lien avec DFI, régulateurs et entreprises." },
      { t: 'Impact', d: "Compression de la prime de risque (300–500 pb), déblocage d'IDE, conversion d'organisations locales en entités bancables." },
      { t: 'Responsabilités', d: "Représentation avec intégrité (mandats #25 & #55), 2 activations/trimestre, reporting au hub continental de Dakar." },
      { t: 'Couverture', d: "22 nations prioritaires (Atlas ACRI) en activation M1–M8, vision 54 nations — plus 5 hubs mondiaux (Washington, Londres, Paris, Dubaï, New York)." },
    ],
    benefits: 'Les bénéfices',
    benefitsList: [
      'Reconnaissance professionnelle continentale', 'Réseau de dirigeants & DFI', 'Formations exclusives APA',
      'Certification officielle Champion', 'Tribunes & prises de parole', 'Exposition internationale',
      'Développement du leadership', 'Ressources premium (Intelligence T2)', 'Opportunités de carrière',
      'Badges de reconnaissance', 'Certificat numérique vérifiable', 'Tableau de bord Champion',
    ],
    eligibility: "Critères d'éligibilité",
    eligibilityList: [
      '8+ ans d\'expérience professionnelle (gouvernance, conformité, finance, développement)',
      'Intégrité irréprochable — vérification de références',
      'Leadership démontré dans votre secteur ou communauté',
      'Excellente communication écrite et orale',
      'Engagement : mandat de 24 mois renouvelable',
      'Disponibilité : ~8h/mois (activations, comité, reporting)',
      'Français et/ou anglais courant (bilingue = atout)',
      'Expertise pertinente : GRC, ESG, audit, politique publique, investissement',
    ],
    process: 'Le processus de sélection',
    processSteps: [
      ['Candidature', 'Dossier en ligne — 20 minutes, brouillon récupérable.'],
      ['Présélection', 'Revue par le comité sous 10 jours ouvrés.'],
      ['Entretien', 'Échange avec la Direction Stratégique & GRC.'],
      ['Formation', 'Parcours certifiant : les 63 outils + le standard APA.'],
      ['Certification', 'Certificat numérique vérifiable + badge officiel.'],
      ['Onboarding', 'Intégration au réseau, accès Intelligence & dashboard.'],
      ['Activation', 'Lancement dans votre pays avec le hub de Dakar.'],
    ],
    map: 'La carte des Champions — 54 nations',
    mapSub: 'Vert : champion en poste · Or : nation prioritaire Atlas en attente de champion · Gris : à conquérir.',
    firstCta: 'Devenez le premier Champion de votre pays →',
    voices: 'Paroles de Champions',
    voicesQuotes: [
      { name: 'Ousmane Diallo', country: 'SN', role: 'Champion Sénégal — hub continental', q: "« Mon engagement : que la conformité UEMOA et le standard APA parlent d'une seule voix, de Dakar à toute la CEDEAO. »" },
      { name: 'Wanjiku Kamau', country: 'KE', role: 'Championne Kenya', q: '« La gouvernance numérique publique que nous avons réformée au Kenya prouve une chose : la redevabilité vérifiable attire le capital. »' },
      { name: 'Claire Uwimana', country: 'RW', role: 'Championne Rwanda', q: "« Le Rwanda a montré que la transformation économique commence par la confiance institutionnelle. APA en fait un actif mesurable. »" },
    ],
    faq: 'Questions fréquentes',
    faqItems: [
      ['Le programme est-il rémunéré ?', "Le mandat est honorifique avec avantages substantiels (formation certifiante, accès Intelligence T2, exposition). Les missions de conseil générées localement sont contractualisées séparément."],
      ['Combien de champions par pays ?', "Un Champion national par pays, appuyé si besoin par des Champions régionaux — les 22 nations Atlas d'abord, puis les 54."],
      ['Quel est l\'engagement de temps ?', '~8h/mois : 2 activations par trimestre, comité mensuel, reporting léger via votre dashboard.'],
      ['Puis-je candidater si mon pays a déjà un Champion ?', 'Oui — les dossiers solides rejoignent le vivier régional et les 5 hubs mondiaux.'],
      ['Comment se déroule la formation ?', 'Parcours en ligne bilingue sur les 63 outils + sessions live avec la Direction GRC, sanctionné par le certificat Champion.'],
      ['Ma candidature est-elle confidentielle ?', "Oui. Données traitées uniquement pour la sélection (déclaration de confidentialité signée à la candidature)."],
    ],
    finalTitle: 'Prêt·e à porter le standard ?',
    finalSub: "L'Afrique n'a pas besoin de plus de rapports. Elle a besoin de champions de la redevabilité.",
    track: 'Suivre ma candidature',
  },
  en: {
    heroKicker: 'APA™ Champions Program',
    heroTitle: 'Become an APA Champion',
    heroSub: 'Lead change across Africa. Help organizations raise their governance, accountability and performance — and join the network turning ethics into competitive advantage.',
    apply: 'Apply now',
    who: 'Who are APA Champions?',
    whoCards: [
      { t: 'Mission', d: 'Carry the APA standard in your country: make verifiable accountability the norm for African institutions.' },
      { t: 'Role', d: 'Official ambassador: deploying the 63 tools, driving the certification pipeline, liaising with DFIs, regulators and enterprises.' },
      { t: 'Impact', d: 'Risk-premium compression (300–500 bps), FDI unlocked, local organizations converted into bankable entities.' },
      { t: 'Responsibilities', d: 'Representation with integrity (mandates #25 & #55), 2 activations/quarter, reporting to the Dakar continental hub.' },
      { t: 'Coverage', d: '22 Atlas priority nations activating M1–M8, 54-nation vision — plus 5 global hubs (Washington, London, Paris, Dubai, New York).' },
    ],
    benefits: 'Benefits',
    benefitsList: [
      'Continental professional recognition', 'Executive & DFI network', 'Exclusive APA training',
      'Official Champion certification', 'Speaking opportunities', 'International exposure',
      'Leadership development', 'Premium resources (Intelligence T2)', 'Career opportunities',
      'Recognition badges', 'Verifiable digital certificate', 'Champion dashboard',
    ],
    eligibility: 'Eligibility criteria',
    eligibilityList: [
      '8+ years of professional experience (governance, compliance, finance, development)',
      'Impeccable integrity — reference checks',
      'Demonstrated leadership in your sector or community',
      'Excellent written and spoken communication',
      'Commitment: renewable 24-month mandate',
      'Availability: ~8h/month (activations, committee, reporting)',
      'Fluent French and/or English (bilingual is a plus)',
      'Relevant expertise: GRC, ESG, audit, public policy, investment',
    ],
    process: 'The selection process',
    processSteps: [
      ['Application', 'Online file — 20 minutes, resumable draft.'],
      ['Screening', 'Committee review within 10 business days.'],
      ['Interview', 'Conversation with Strategic Direction & GRC.'],
      ['Training', 'Certifying pathway: the 63 tools + the APA standard.'],
      ['Certification', 'Verifiable digital certificate + official badge.'],
      ['Onboarding', 'Network integration, Intelligence access & dashboard.'],
      ['Activation', 'Launch in your country with the Dakar hub.'],
    ],
    map: 'The Champions map — 54 nations',
    mapSub: 'Green: champion in place · Gold: Atlas priority nation awaiting its champion · Grey: open.',
    firstCta: 'Become the first Champion in your country →',
    voices: 'Champion voices',
    voicesQuotes: [
      { name: 'Ousmane Diallo', country: 'SN', role: 'Champion Senegal — continental hub', q: '"My commitment: that UEMOA compliance and the APA standard speak with one voice, from Dakar across ECOWAS."' },
      { name: 'Wanjiku Kamau', country: 'KE', role: 'Champion Kenya', q: '"The public digital governance we reformed in Kenya proves one thing: verifiable accountability attracts capital."' },
      { name: 'Claire Uwimana', country: 'RW', role: 'Champion Rwanda', q: '"Rwanda showed that economic transformation starts with institutional trust. APA makes it a measurable asset."' },
    ],
    faq: 'Frequently asked questions',
    faqItems: [
      ['Is the program paid?', 'The mandate is honorific with substantial benefits (certifying training, Intelligence T2 access, exposure). Locally generated advisory work is contracted separately.'],
      ['How many champions per country?', 'One national Champion per country, backed where needed by regional Champions — the 22 Atlas nations first, then all 54.'],
      ['What is the time commitment?', '~8h/month: 2 activations per quarter, monthly committee, light reporting via your dashboard.'],
      ['Can I apply if my country already has a Champion?', 'Yes — strong files join the regional bench and the 5 global hubs.'],
      ['How does training work?', 'Bilingual online pathway across the 63 tools + live sessions with the GRC Direction, leading to the Champion certificate.'],
      ['Is my application confidential?', 'Yes. Data is processed for selection only (privacy declaration signed at application).'],
    ],
    finalTitle: 'Ready to carry the standard?',
    finalSub: 'Africa does not need more reports. It needs accountability champions.',
    track: 'Track my application',
  },
} as const;

const REGION_LABEL: Record<string, { fr: string; en: string }> = {
  West: { fr: "Afrique de l'Ouest", en: 'West Africa' },
  East: { fr: "Afrique de l'Est", en: 'East Africa' },
  Central: { fr: 'Afrique Centrale', en: 'Central Africa' },
  North: { fr: 'Afrique du Nord', en: 'North Africa' },
  Southern: { fr: 'Afrique Australe', en: 'Southern Africa' },
};

export default async function ChampionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = C[locale === 'en' ? 'en' : 'fr'];
  const isFr = locale !== 'en';

  const nations = await prisma.nation.findMany({ orderBy: { nameFr: 'asc' } });
  const withChampion = nations.filter((n) => n.championName).length;
  const priorityOpen = nations.filter((n) => n.isPriority && !n.championName).length;

  return (
    <div>
      {/* 1 · HERO */}
      <section className="apa-gradient text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <span className="apa-badge">{c.heroKicker}</span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            {c.heroTitle}
          </h1>
          <div className="apa-rule mx-auto my-6" />
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-apa-mint">{c.heroSub}</p>
          <Link
            href="/champions/apply"
            className="mt-8 inline-block rounded-md bg-apa-gold-bright px-8 py-3.5 text-base font-bold text-apa-ink transition-colors hover:bg-apa-gold"
          >
            {c.apply} →
          </Link>
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-3">
            {[
              [String(withChampion), isFr ? 'Champions en poste' : 'Champions in place'],
              [String(priorityOpen), isFr ? 'Nations prioritaires ouvertes' : 'Priority nations open'],
              ['54', isFr ? 'Nations — la vision' : 'Nations — the vision'],
            ].map(([n, l]) => (
              <div key={l} className="apa-kpi px-3 py-4 text-center">
                <div className="text-2xl font-extrabold text-apa-gold-bright">{n}</div>
                <div className="mt-1 text-[11px] text-apa-mint">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2 · WHO */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-apa-green">{c.who}</h2>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />
        <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {c.whoCards.map((w) => (
            <div key={w.t} className="apa-box p-5">
              <h3 className="font-bold text-apa-green">{w.t}</h3>
              <p className="mt-2 text-sm leading-relaxed">{w.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3 · BENEFITS */}
      <section className="bg-apa-soft">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold text-apa-green">{c.benefits}</h2>
          <div className="mt-2 h-[3px] w-full bg-apa-gold" />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {c.benefitsList.map((b) => (
              <div key={b} className="flex items-center gap-3 rounded-apa border border-apa-line bg-white px-4 py-3 text-sm font-medium text-apa-ink">
                <span className="text-apa-gold">◆</span>
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · ELIGIBILITY + 5 · PROCESS */}
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-apa-green">{c.eligibility}</h2>
          <div className="mt-2 h-[3px] w-full bg-apa-gold" />
          <ul className="mt-6 space-y-3 text-sm">
            {c.eligibilityList.map((e) => (
              <li key={e} className="flex gap-3">
                <span className="text-apa-green">✓</span>
                {e}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-apa-green">{c.process}</h2>
          <div className="mt-2 h-[3px] w-full bg-apa-gold" />
          <ol className="mt-6 space-y-3">
            {c.processSteps.map(([name, desc], i) => (
              <li key={name} className="flex gap-4">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${i === 6 ? 'bg-apa-gold-bright text-apa-ink' : 'apa-gradient text-white'}`}>
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-bold text-apa-navy">{name}</p>
                  <p className="text-sm text-apa-grey">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 6 · MAP (54 nations, DB-driven) */}
      <section className="bg-apa-soft">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold text-apa-green">{c.map}</h2>
          <div className="mt-2 h-[3px] w-full bg-apa-gold" />
          <p className="mt-4 text-sm text-apa-grey">{c.mapSub}</p>
          <div className="mt-8 space-y-6">
            {REGION_ORDER.map((region) => {
              const list = nations.filter((n) => n.region === region);
              if (!list.length) return null;
              return (
                <div key={region}>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-apa-navy">
                    🌍 {REGION_LABEL[region][isFr ? 'fr' : 'en']}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {list.map((n) => (
                      <span
                        key={n.code}
                        title={n.championName ?? undefined}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          n.championName
                            ? 'border-apa-green bg-apa-green text-white'
                            : n.isPriority
                              ? 'border-apa-gold bg-white text-apa-bronze'
                              : 'border-apa-line bg-white text-apa-grey'
                        }`}
                      >
                        {flagOf(n.code)} {isFr ? n.nameFr : n.nameEn}
                        {n.championName ? ' ★' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <Link
            href="/champions/apply"
            className="mt-8 inline-block rounded-md bg-apa-green px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-apa-green-mid"
          >
            {c.firstCta}
          </Link>
        </div>
      </section>

      {/* 7 · VOICES */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-apa-green">{c.voices}</h2>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {c.voicesQuotes.map((v) => (
            <figure key={v.name} className="rounded-apa-lg border border-apa-line bg-white p-6">
              <blockquote className="text-sm italic leading-relaxed text-apa-ink">{v.q}</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-bold text-apa-navy">{flagOf(v.country)} {v.name}</span>
                <span className="block text-xs text-apa-grey">{v.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 8 · FAQ */}
      <section className="bg-apa-soft">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="text-2xl font-bold text-apa-green">{c.faq}</h2>
          <div className="mt-2 h-[3px] w-full bg-apa-gold" />
          <div className="mt-6 space-y-3">
            {c.faqItems.map(([q, a]) => (
              <details key={q} className="rounded-apa border border-apa-line bg-white px-5 py-4">
                <summary className="cursor-pointer text-sm font-bold text-apa-navy">{q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-apa-ink">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9 · FINAL CTA */}
      <section className="apa-gradient text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold">{c.finalTitle}</h2>
          <p className="mt-3 text-apa-mint">{c.finalSub}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/champions/apply"
              className="rounded-md bg-apa-gold-bright px-8 py-3.5 text-base font-bold text-apa-ink transition-colors hover:bg-apa-gold"
            >
              {c.apply} →
            </Link>
            <Link
              href="/app"
              className="rounded-md border border-apa-gold-bright px-8 py-3.5 text-base font-semibold text-apa-gold-bright transition-colors hover:bg-apa-gold-bright hover:text-apa-ink"
            >
              {c.track}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
