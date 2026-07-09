import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Avatar } from '@/components/about/avatar';
import {
  FOUNDERS,
  ADVISORS,
  CHAMPIONS_SHOWCASE,
  CAREER_PATH,
} from '@/domain/about/leadership';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const fr = locale !== 'en';
  return {
    title: fr ? 'À propos — APA™' : 'About — APA™',
    description: fr
      ? 'Direction, gouvernance et communauté d’Accountable Partners for Africa : fondateurs, conseil consultatif mondial et réseau de champions.'
      : 'The leadership, governance and community of Accountable Partners for Africa: founders, global advisory board and champions network.',
  };
}

const T = {
  fr: {
    heroKicker: 'Institution · Panafricaine · Bilingue',
    heroTitle: 'Une institution panafricaine de gouvernance, bâtie sur la redevabilité.',
    heroLead:
      'APA construit la confiance et garantit un impact mesurable dans le développement africain — par des partenariats équitables, l’autonomisation des femmes et une gouvernance éthique érigée en standard.',
    leadershipTitle: 'Direction & Double Leadership',
    leadershipSub:
      'APA est co-dirigée par deux figures complémentaires : la vision humanitaire et l’architecture stratégique de la gouvernance.',
    keyThemes: 'Axes clés',
    mvvTitle: 'Mission, Vision & Proposition de Valeur',
    mission: 'Mission',
    missionBody:
      'Bâtir la confiance et livrer un impact mesurable dans le développement africain en menant des projets qui autonomisent les femmes, défendent une conduite d’affaires éthique et décolonisent les modèles d’aide traditionnels.',
    vision: 'Vision',
    visionBody:
      'Une Afrique où le développement est porté par des partenariats équitables, où les femmes sont à l’avant-garde de l’autonomisation économique, et où l’éthique des affaires est le standard d’une croissance durable.',
    valueProp: 'Proposition de Valeur',
    valuePropBody:
      'Agence de mise en œuvre spécialisée, APA bâtit la confiance et garantit un impact mesurable en livrant des initiatives de développement complexes dans les délais et le budget. Notre méthodologie d’investissement systémique permet de comprendre les systèmes sous-jacents, d’identifier les points de levier stratégiques et d’engager gouvernements, communautés, investisseurs et institutions pour des résultats collectifs durables.',
    boardTitle: 'Conseil Consultatif Mondial',
    boardSub:
      'Un conseil de dirigeants issus des institutions qui façonnent la gouvernance et le capital en Afrique.',
    advisorRecruitTitle: 'Devenir Membre du Conseil Consultatif Mondial',
    advisorWhy: 'Pourquoi rejoindre',
    advisorWhyBody:
      'Orienter la stratégie d’une institution panafricaine de gouvernance et prêter votre expertise à un standard continental reconnu des gouvernements, DFI et BMD.',
    advisorResp: 'Responsabilités',
    advisorRespBody:
      'Conseil stratégique trimestriel, revue des cadres méthodologiques, mise en relation institutionnelle et parrainage des champions nationaux.',
    advisorContribution: 'Contribution attendue',
    advisorContributionBody:
      'Expertise sectorielle (gouvernance, finance, droit, politique publique), crédibilité institutionnelle et disponibilité pour ~6h/mois.',
    advisorBenefits: 'Bénéfices',
    advisorBenefitsBody:
      'Reconnaissance de premier plan, accès à l’Intelligence APA, participation aux briefings exécutifs et rayonnement continental.',
    advisorProcess: 'Processus de sélection',
    advisorProcessBody:
      'Candidature → présélection sous 10 jours ouvrés → entretien avec la Direction → nomination.',
    advisorCta: 'Candidater au Conseil Consultatif Mondial',
    championsShowcaseTitle: 'Le Réseau des Champions APA',
    championsShowcaseSub:
      'Nos champions portent le standard APA dans leur pays. Profils illustratifs répartis sur le continent — remplaçables par de vrais profils.',
    championBadge: 'Champion APA',
    demoNote: 'Démonstration visuelle · profils illustratifs',
    becomeChampionTitle: 'Devenir Champion APA',
    championMission: 'Mission',
    championMissionBody: 'Porter le standard APA dans votre pays et animer le pipeline de certification.',
    championResp: 'Responsabilités',
    championRespBody: 'Déploiement des 63 outils, mobilisation institutionnelle, reporting au hub continental.',
    championBenefits: 'Bénéfices',
    championBenefitsBody: 'Formation certifiante, réseau DFI, accès Intelligence, badge & certificat numérique.',
    championCriteria: 'Critères de sélection',
    championCriteriaBody: '8+ ans d’expérience, intégrité, leadership, bilinguisme FR/EN, expertise pertinente.',
    careerTitle: 'Progression de carrière',
    careerNote:
      '« Une fois approuvés comme Champions APA, les membres deviennent éligibles pour évoluer vers les rôles de Facilitateur, Master Trainer et Auditeur Global, via les parcours de certification et de leadership d’APA. »',
    championCta: 'Candidater — Devenir Champion APA',
    discoverProgram: 'Découvrir le programme',
  },
  en: {
    heroKicker: 'Institution · Pan-African · Bilingual',
    heroTitle: 'A Pan-African governance institution, built on accountability.',
    heroLead:
      'APA builds trust and guarantees measurable impact in African development — through equitable partnerships, women’s empowerment and ethical business set as the standard.',
    leadershipTitle: 'Leadership & Dual Direction',
    leadershipSub:
      'APA is co-led by two complementary figures: humanitarian vision and strategic governance architecture.',
    keyThemes: 'Key themes',
    mvvTitle: 'Mission, Vision & Value Proposition',
    mission: 'Mission',
    missionBody:
      'To build trust and deliver measurable impact in African development by implementing projects that empower women, champion ethical business, and decolonize traditional aid models.',
    vision: 'Vision',
    visionBody:
      'An Africa where development is driven by equitable partnerships, women are at the forefront of economic empowerment, and ethical business is the standard for sustainable growth.',
    valueProp: 'Value Proposition',
    valuePropBody:
      'As a specialized implementing agency, Accountable Partners for Africa (APA) builds trust and guarantees measurable impact by delivering complex development initiatives on time and within budget. Our systemic investing methodology enables us to understand underlying systems, identify strategic leverage points and engage governments, communities, investors and institutions to achieve sustainable collective outcomes.',
    boardTitle: 'Global Advisory Board',
    boardSub:
      'A board of leaders drawn from the institutions that shape governance and capital in Africa.',
    advisorRecruitTitle: 'Become a Member of the Global Advisory Board',
    advisorWhy: 'Why join',
    advisorWhyBody:
      'Steer the strategy of a Pan-African governance institution and lend your expertise to a continental standard recognized by governments, DFIs and MDBs.',
    advisorResp: 'Responsibilities',
    advisorRespBody:
      'Quarterly strategic counsel, review of methodological frameworks, institutional introductions and sponsorship of national champions.',
    advisorContribution: 'Expected contribution',
    advisorContributionBody:
      'Sector expertise (governance, finance, law, public policy), institutional credibility and availability of ~6h/month.',
    advisorBenefits: 'Benefits',
    advisorBenefitsBody:
      'Premier recognition, APA Intelligence access, participation in executive briefings and continental reach.',
    advisorProcess: 'Selection process',
    advisorProcessBody:
      'Application → screening within 10 business days → interview with the Direction → appointment.',
    advisorCta: 'Apply to Join the Global Advisory Board',
    championsShowcaseTitle: 'The APA Champions Network',
    championsShowcaseSub:
      'Our champions carry the APA standard in their country. Illustrative profiles spread across the continent — replaceable with real profiles.',
    championBadge: 'APA Champion',
    demoNote: 'Visual demonstration · placeholder profiles',
    becomeChampionTitle: 'Become an APA Champion',
    championMission: 'Mission',
    championMissionBody: 'Carry the APA standard in your country and drive the certification pipeline.',
    championResp: 'Responsibilities',
    championRespBody: 'Deploying the 63 tools, institutional mobilization, reporting to the continental hub.',
    championBenefits: 'Benefits',
    championBenefitsBody: 'Certifying training, DFI network, Intelligence access, digital badge & certificate.',
    championCriteria: 'Selection criteria',
    championCriteriaBody: '8+ years of experience, integrity, leadership, FR/EN bilingualism, relevant expertise.',
    careerTitle: 'Career progression',
    careerNote:
      '“Once approved as an APA Champion, members become eligible to progress toward Facilitator, Master Trainer and Global Auditor roles through APA’s certification and leadership pathways.”',
    championCta: 'Apply to Become an APA Champion',
    discoverProgram: 'Discover the program',
  },
} as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';
  const t = T[fr ? 'fr' : 'en'];

  return (
    <div>
      {/* ═════ HERO (compact) ═════ */}
      <section className="apa-gradient text-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <span className="apa-badge">{t.heroKicker}</span>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
            {t.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-apa-mint">{t.heroLead}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {[
              ['54', fr ? 'nations — la vision' : 'nations — the vision'],
              ['63', fr ? 'outils GRC propriétaires' : 'proprietary GRC tools'],
              ['22', fr ? 'nations prioritaires' : 'priority nations'],
              ['5', fr ? 'hubs de capital mondiaux' : 'global capital hubs'],
            ].map(([n, l]) => (
              <div key={l}>
                <span className="text-xl font-extrabold text-apa-gold-bright">{n}</span>
                <span className="ml-2 text-apa-mint">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════ SECTION — MISSION / VISION / VALUE (premium, first) ═════ */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-apa-green">{t.mvvTitle}</h2>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { key: 'M', title: t.mission, body: t.missionBody, accent: 'apa-gradient text-white', label: fr ? 'text-apa-gold-bright' : 'text-apa-gold-bright', text: 'text-apa-mint' },
            { key: 'V', title: t.vision, body: t.visionBody, accent: 'bg-white ring-2 ring-apa-gold', label: 'text-apa-green', text: 'text-apa-ink' },
            { key: 'P', title: t.valueProp, body: t.valuePropBody, accent: 'bg-white ring-1 ring-apa-line', label: 'text-apa-green', text: 'text-apa-ink' },
          ].map((c) => (
            <article
              key={c.key}
              className={`relative overflow-hidden rounded-apa-lg p-7 shadow-sm transition-transform hover:-translate-y-1 ${c.accent}`}
            >
              <span className="absolute -right-3 -top-4 text-7xl font-black opacity-10">{c.key}</span>
              <h3 className={`text-lg font-bold ${c.label}`}>{c.title}</h3>
              <div className={`mt-2 h-0.5 w-10 ${c.key === 'M' ? 'bg-apa-gold-bright' : 'bg-apa-gold'}`} />
              <p className={`mt-4 text-sm leading-relaxed ${c.text}`}>{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ═════ SECTION 1 — FOUNDERS ═════ */}
      <section className="bg-apa-soft">
       <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-apa-green">{t.leadershipTitle}</h2>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />
        <p className="mt-3 max-w-2xl text-sm text-apa-grey">{t.leadershipSub}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {FOUNDERS.map((f) => (
            <article
              key={f.slug}
              className="group rounded-apa-lg border border-apa-line bg-white p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-start gap-5">
                <Avatar name={f.name} photo={f.photo} size={104} />
                <div>
                  <h3 className="text-xl font-bold text-apa-navy">{f.name}</h3>
                  <p className="text-sm font-semibold text-apa-gold">{fr ? f.roleFr : f.roleEn}</p>
                  {f.email ? (
                    <a href={`mailto:${f.email}`} className="mt-2 inline-block text-xs font-semibold text-apa-green hover:underline">
                      {f.email}
                    </a>
                  ) : null}
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-apa-ink">{fr ? f.bioFr : f.bioEn}</p>

              <div className="apa-box mt-5 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-apa-grey">Vision</p>
                <p className="mt-1 text-sm text-apa-navy">{fr ? f.visionFr : f.visionEn}</p>
              </div>
              <blockquote className="mt-3 border-l-4 border-apa-gold pl-4 text-sm italic text-apa-ink">
                {fr ? f.messageFr : f.messageEn}
              </blockquote>

              <p className="mt-5 text-[11px] font-bold uppercase tracking-wide text-apa-grey">{t.keyThemes}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {f.expertise.map((e) => (
                  <span key={e} className="rounded-full border border-apa-sage bg-apa-soft px-2.5 py-0.5 text-[11px] font-semibold text-apa-green">
                    {e}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
       </div>
      </section>

      {/* ═════ SECTION 3 — GLOBAL ADVISORY BOARD ═════ */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-apa-green">{t.boardTitle}</h2>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />
        <p className="mt-3 max-w-2xl text-sm text-apa-grey">{t.boardSub}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADVISORS.map((a) => (
            <article key={a.name} className="rounded-apa-lg border border-apa-line bg-white p-5 transition-shadow hover:shadow-md">
              <div className="flex items-center gap-4">
                <Avatar name={a.name} photo={a.photo} size={64} />
                <div>
                  <h3 className="font-bold text-apa-navy">{a.name}</h3>
                  <p className="text-xs font-semibold text-apa-grey">
                    {a.flag} {a.country} · {a.region}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-apa-green">{fr ? a.titleFr : a.titleEn}</p>
              <p className="text-xs text-apa-grey">{a.organization}</p>
              <p className="mt-2 text-sm leading-relaxed text-apa-ink">{fr ? a.expertiseFr : a.expertiseEn}</p>
              {a.linkedin ? (
                <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs font-semibold text-apa-green hover:underline">
                  LinkedIn ↗
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {/* ═════ SECTION 4 — BECOME A GLOBAL ADVISOR ═════ */}
      <section className="apa-gradient text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <span className="apa-badge">{fr ? 'Conseil Consultatif Mondial' : 'Global Advisory Board'}</span>
          <h2 className="mt-5 text-3xl font-bold">{t.advisorRecruitTitle}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              [t.advisorWhy, t.advisorWhyBody],
              [t.advisorResp, t.advisorRespBody],
              [t.advisorContribution, t.advisorContributionBody],
              [t.advisorBenefits, t.advisorBenefitsBody],
              [t.advisorProcess, t.advisorProcessBody],
            ].map(([h, b]) => (
              <div key={h} className="rounded-apa border border-white/20 bg-white/10 p-4">
                <h3 className="font-bold text-apa-gold-bright">{h}</h3>
                <p className="mt-1.5 text-sm text-apa-mint">{b}</p>
              </div>
            ))}
          </div>
          <Link
            href="/champions/apply?type=advisor"
            className="mt-8 inline-block rounded-md bg-apa-gold-bright px-8 py-3.5 text-base font-bold text-apa-ink transition-colors hover:bg-apa-gold"
          >
            {t.advisorCta} →
          </Link>
        </div>
      </section>

      {/* ═════ SECTION 5 — APA CHAMPIONS SHOWCASE ═════ */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-apa-green">{t.championsShowcaseTitle}</h2>
            <p className="mt-1 text-sm text-apa-grey">{t.championsShowcaseSub}</p>
          </div>
          <span className="rounded-full border border-apa-line bg-apa-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-apa-grey">
            {t.demoNote}
          </span>
        </div>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHAMPIONS_SHOWCASE.map((ch) => (
            <article key={ch.name} className="rounded-apa-lg border border-apa-line bg-white p-5 transition-shadow hover:shadow-md">
              <div className="flex items-center gap-4">
                <Avatar name={ch.name} size={64} />
                <div>
                  <h3 className="font-bold text-apa-navy">{ch.name}</h3>
                  <p className="text-xs font-semibold text-apa-grey">
                    {ch.flag} {ch.country} · {ch.region}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-apa-green px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-white">
                  ★ {t.championBadge}
                </span>
                <span className="text-sm font-semibold text-apa-green">{fr ? ch.roleFr : ch.roleEn}</span>
              </div>
              <p className="text-xs text-apa-grey">{ch.organization}</p>
              <p className="mt-2 text-sm leading-relaxed text-apa-ink">{fr ? ch.bioFr : ch.bioEn}</p>
              <p className="mt-2 text-xs font-semibold text-apa-navy">{fr ? ch.expertiseFr : ch.expertiseEn}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ═════ SECTION 6 — BECOME AN APA CHAMPION ═════ */}
      <section className="apa-gradient text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <span className="apa-badge">{fr ? 'Programme Champions APA™' : 'APA™ Champions Program'}</span>
          <h2 className="mt-5 text-3xl font-bold">{t.becomeChampionTitle}</h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [t.championMission, t.championMissionBody],
              [t.championResp, t.championRespBody],
              [t.championBenefits, t.championBenefitsBody],
              [t.championCriteria, t.championCriteriaBody],
            ].map(([h, b]) => (
              <div key={h} className="rounded-apa border border-white/20 bg-white/10 p-4">
                <h3 className="font-bold text-apa-gold-bright">{h}</h3>
                <p className="mt-1.5 text-sm text-apa-mint">{b}</p>
              </div>
            ))}
          </div>

          {/* Career pathway */}
          <h3 className="mt-10 text-lg font-bold text-apa-gold-bright">{t.careerTitle}</h3>
          <div className="mt-4 flex flex-wrap items-stretch gap-2">
            {CAREER_PATH.map((step, i, arr) => (
              <div key={step.code} className="flex flex-1 items-center gap-2" style={{ minWidth: 130 }}>
                <div
                  className={`flex-1 rounded-apa px-3 py-3 text-center text-xs font-bold ${
                    i === 0
                      ? 'border border-white/25 bg-white/10 text-apa-mint'
                      : 'bg-white/12 text-white ring-1 ring-apa-gold-bright/40'
                  }`}
                >
                  <span className="block text-[9px] font-normal text-apa-sage">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {fr ? step.fr : step.en}
                </div>
                {i < arr.length - 1 ? <span aria-hidden className="text-apa-gold-bright">→</span> : null}
              </div>
            ))}
          </div>
          <p className="apa-box apa-box-gold mt-5 bg-white/10 p-4 text-sm text-apa-mint">{t.careerNote}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/champions/apply"
              className="rounded-md bg-apa-gold-bright px-8 py-3.5 text-base font-bold text-apa-ink transition-colors hover:bg-apa-gold"
            >
              {t.championCta} →
            </Link>
            <Link
              href="/champions"
              className="rounded-md border border-apa-gold-bright px-8 py-3.5 text-base font-semibold text-apa-gold-bright transition-colors hover:bg-apa-gold-bright hover:text-apa-ink"
            >
              {t.discoverProgram}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
