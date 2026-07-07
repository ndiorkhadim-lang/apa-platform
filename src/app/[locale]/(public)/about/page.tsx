import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Avatar } from '@/components/about/avatar';
import { FOUNDERS, ADVISORS, CAREER_PATH } from '@/domain/about/leadership';

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
      ? 'Mission, direction et ambition d’Accountable Partners for Africa : la gouvernance vérifiable comme standard continental.'
      : 'The mission, leadership and ambition of Accountable Partners for Africa: verifiable governance as a continental standard.',
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const fr = locale !== 'en';
  const t = await getTranslations('About');

  const values = t.raw('values') as { name: string; desc: string }[];

  return (
    <div>
      {/* ═════ HERO ═════ */}
      <section className="apa-gradient text-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <span className="apa-badge">
            {fr ? 'Institution · Panafricaine · Bilingue' : 'Institution · Pan-African · Bilingual'}
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            {fr
              ? 'Faire de la redevabilité vérifiable le standard de l’Afrique.'
              : 'Making verifiable accountability Africa’s standard.'}
          </h1>
          <div className="apa-rule my-6" />
          <p className="max-w-2xl text-base leading-relaxed text-apa-mint">
            {fr ? t('mission') : t('mission')}
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            {[
              ['54', fr ? 'nations — la vision' : 'nations — the vision'],
              ['63', fr ? 'outils GRC propriétaires' : 'proprietary GRC tools'],
              ['22', fr ? 'nations prioritaires' : 'priority nations'],
              ['5', fr ? 'hubs de capital mondiaux' : 'global capital hubs'],
            ].map(([n, l]) => (
              <div key={l}>
                <span className="text-2xl font-extrabold text-apa-gold-bright">{n}</span>
                <span className="ml-2 text-apa-mint">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════ SECTION 1 — FOUNDERS (top of page) ═════ */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-apa-green">
          {fr ? 'Direction & Double Leadership' : 'Leadership & Dual Direction'}
        </h2>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />
        <p className="mt-3 max-w-2xl text-sm text-apa-grey">
          {fr
            ? 'APA est co-dirigée par deux figures complémentaires : la vision humanitaire et l’architecture stratégique.'
            : 'APA is co-led by two complementary figures: humanitarian vision and strategic architecture.'}
        </p>

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
                <p className="text-[11px] font-bold uppercase tracking-wide text-apa-grey">
                  {fr ? 'Vision' : 'Vision'}
                </p>
                <p className="mt-1 text-sm text-apa-navy">{fr ? f.visionFr : f.visionEn}</p>
              </div>
              <blockquote className="mt-3 border-l-4 border-apa-gold pl-4 text-sm italic text-apa-ink">
                {fr ? f.messageFr : f.messageEn}
              </blockquote>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {f.expertise.map((e) => (
                  <span key={e} className="rounded-full border border-apa-sage bg-apa-soft px-2.5 py-0.5 text-[11px] font-semibold text-apa-green">
                    {e}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ═════ MISSION / VISION / VALUES ═════ */}
      <section className="bg-apa-soft">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-bold text-apa-green">
            {fr ? 'Mission, Vision & Valeurs' : 'Mission, Vision & Values'}
          </h2>
          <div className="mt-2 h-[3px] w-full bg-apa-gold" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="apa-box bg-white p-5">
              <h3 className="font-bold text-apa-green">{t('missionTitle')}</h3>
              <p className="mt-2 text-sm leading-relaxed">{t('mission')}</p>
            </div>
            <div className="apa-box apa-box-gold bg-white p-5">
              <h3 className="font-bold text-apa-green">{t('visionTitle')}</h3>
              <p className="mt-2 text-sm leading-relaxed">{t('vision')}</p>
            </div>
            <div className="apa-box apa-box-navy bg-white p-5">
              <h3 className="font-bold text-apa-green">{t('valuePropTitle')}</h3>
              <p className="mt-2 text-sm leading-relaxed">{t('valueProp')}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.name} className="rounded-apa border border-apa-line bg-white p-4">
                <span className="font-bold text-apa-navy">{v.name}</span>
                <p className="mt-1 text-sm text-apa-grey">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════ SECTION 2 — GLOBAL ADVISORY BOARD ═════ */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-apa-green">
          {fr ? 'Conseil Consultatif Mondial' : 'Global Advisory Board'}
        </h2>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />
        <p className="mt-3 max-w-2xl text-sm text-apa-grey">
          {fr
            ? 'Un conseil de dirigeants issus des institutions qui façonnent la gouvernance et le capital en Afrique.'
            : 'A board of leaders drawn from the institutions that shape governance and capital in Africa.'}
        </p>

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
              <p className="mt-3 text-sm font-semibold text-apa-green">
                {fr ? a.titleFr : a.titleEn}
              </p>
              <p className="text-xs text-apa-grey">{a.organization}</p>
              <p className="mt-2 text-sm leading-relaxed text-apa-ink">
                {fr ? a.expertiseFr : a.expertiseEn}
              </p>
              {a.linkedin ? (
                <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs font-semibold text-apa-green hover:underline">
                  LinkedIn ↗
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {/* ═════ SECTION 3 — BECOME AN APA CHAMPION ═════ */}
      <section className="apa-gradient text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <span className="apa-badge">{fr ? 'Programme Champions APA™' : 'APA™ Champions Program'}</span>
          <h2 className="mt-5 text-3xl font-bold">
            {fr ? 'Devenez Champion APA' : 'Become an APA Champion'}
          </h2>
          <p className="mt-3 max-w-2xl text-apa-mint">
            {fr
              ? 'Portez le standard APA dans votre pays. Menez le changement de gouvernance, ouvrez le capital, et bâtissez une carrière au sein d’un réseau continental.'
              : 'Carry the APA standard in your country. Lead governance change, unlock capital, and build a career inside a continental network.'}
          </p>

          {/* Career progression timeline */}
          <h3 className="mt-10 text-lg font-bold text-apa-gold-bright">
            {fr ? 'Progression de carrière' : 'Career progression'}
          </h3>
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
          <p className="apa-box apa-box-gold mt-5 bg-white/10 p-4 text-sm text-apa-mint">
            {fr
              ? '« Une fois approuvés comme Champions APA, les membres deviennent éligibles pour évoluer vers les rôles de Facilitateur, Master Trainer et Auditeur Global, via les parcours de certification et de leadership d’APA. »'
              : '“Once approved as an APA Champion, members become eligible to progress toward Facilitator, Master Trainer and Global Auditor roles through APA’s certification and leadership pathways.”'}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              [fr ? 'Rôle' : 'Role', fr ? 'Ambassadeur officiel : déploiement des 63 outils, animation du pipeline de certification.' : 'Official ambassador: deploying the 63 tools, driving the certification pipeline.'],
              [fr ? 'Impact' : 'Impact', fr ? 'Compression de la prime de risque (300–500 pb), déblocage d’IDE, entités locales rendues bancables.' : 'Risk-premium compression (300–500 bps), FDI unlocked, local entities made bankable.'],
              [fr ? 'Bénéfices' : 'Benefits', fr ? 'Formation certifiante, réseau DFI, accès Intelligence, badge & certificat numérique.' : 'Certifying training, DFI network, Intelligence access, digital badge & certificate.'],
            ].map(([h, d]) => (
              <div key={h} className="rounded-apa border border-white/20 bg-white/10 p-4">
                <h4 className="font-bold text-apa-gold-bright">{h}</h4>
                <p className="mt-1 text-sm text-apa-mint">{d}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/champions/apply"
              className="rounded-md bg-apa-gold-bright px-8 py-3.5 text-base font-bold text-apa-ink transition-colors hover:bg-apa-gold"
            >
              {fr ? 'Candidater — Devenir Champion APA' : 'Apply to Become an APA Champion'} →
            </Link>
            <Link
              href="/champions"
              className="rounded-md border border-apa-gold-bright px-8 py-3.5 text-base font-semibold text-apa-gold-bright transition-colors hover:bg-apa-gold-bright hover:text-apa-ink"
            >
              {fr ? 'Découvrir le programme' : 'Discover the program'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
