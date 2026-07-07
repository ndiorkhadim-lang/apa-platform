export const dynamic = 'force-dynamic';
import { setRequestLocale } from 'next-intl/server';
import { prisma } from '@/infrastructure/prisma/client';
import {
  ACRI_VERSION,
  CRITERIA,
  METHODOLOGY,
  TIER_RULES,
  classify,
} from '@/domain/acri/methodology';
import { generateInsights, type RankedNation } from '@/domain/acri/insights';
import { RadarChart } from '@/components/analytics/radar-chart';

function flagOf(code: string): string {
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

/** Heatmap cell color: alpha scales with score. */
function heat(score: number): { background: string; color: string } {
  const a = Math.max(0, Math.min(1, (score - 40) / 58));
  return {
    background: `rgba(10, 92, 54, ${(0.08 + a * 0.92).toFixed(2)})`,
    color: a > 0.45 ? '#fff' : '#1F2933',
  };
}

const TIER_BADGE: Record<string, string> = {
  TIER1: 'bg-apa-green text-white',
  TIER2: 'bg-apa-gold text-apa-ink',
  WATCHLIST: 'bg-apa-soft text-apa-grey border border-apa-line',
};

const FLOW = {
  fr: ['Conformité traditionnelle', 'Transformation de gouvernance', 'Prime d’Authenticité™', 'Risque réduit', 'Confiance investisseur', 'Valeur d’entreprise long terme'],
  en: ['Traditional Compliance', 'Governance Transformation', 'Authenticity Premium™', 'Reduced Risk', 'Investor Confidence', 'Long-Term Enterprise Value'],
};

const COMPONENTS8 = {
  fr: [
    ['Boîte à outils MAE', 'Évaluation Made-in-Africa : dignité, agence, cohésion.'],
    ['Registre de gouvernance blockchain', 'Trace d’audit immuable des engagements & consentements (feuille de route).'],
    ['Protocoles de redevabilité', 'Les 15 mandats contractuels appliqués (outils 18–26).'],
    ['Intelligence de gouvernance', 'Atlas 22 nations, scores ACRI, briefs par tier.'],
    ['Co-propriété communautaire', 'Kinship Equity : instruments juridiques exécutés à l’étape 3.'],
    ['Parité structurelle', 'Comités 50/50, parité salariale, droit de veto local.'],
    ['Licence sociale d’exploitation', 'CVP : la communauté co-signe ou oppose son veto — porte finale.'],
    ['Indice de capital éthique', 'Score de Crédibilité émis à la certification — l’actif négociable.'],
  ],
  en: [
    ['MAE Toolkit', 'Made-in-Africa Evaluation: dignity, agency, cohesion.'],
    ['Blockchain Governance Ledger', 'Immutable audit trail of commitments & consents (roadmap).'],
    ['Accountability Protocols', 'The 15 contractual mandates enforced (tools 18–26).'],
    ['Governance Intelligence', '22-nation atlas, ACRI scores, tiered briefs.'],
    ['Community Co-Ownership', 'Kinship Equity: legal instruments executed at Step 3.'],
    ['Structural Parity', '50/50 committees, salary parity, local veto power.'],
    ['Social License to Operate', 'CVP: the community co-signs or vetoes — the final gate.'],
    ['Ethical Capital Index', 'Credibility Score issued at certification — the tradable asset.'],
  ],
};

export default async function ExecutiveDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const fr = locale !== 'en';

  // ── Data (single source: DB + methodology module) ──
  const [nations, certCount, orgCount, sessionCount, toolCount] = await Promise.all([
    prisma.nation.findMany({
      where: { isPriority: true },
      include: { acriScores: { where: { dataVersion: 'illustrative-v1' }, orderBy: { criterion: 'asc' } } },
    }),
    prisma.certificate.count({ where: { status: 'ACTIVE' } }),
    prisma.organization.count(),
    prisma.toolSession.count(),
    prisma.tool.count(),
  ]);

  const rankings: RankedNation[] = nations
    .map((n) => ({
      code: n.code,
      name: fr ? n.nameFr : n.nameEn,
      region: n.region,
      composite: n.acriScore ?? 0,
      tier: classify(n.acriScore ?? 0),
      scores: n.acriScores.map((s) => s.score),
    }))
    .sort(
      (a, b) =>
        b.composite - a.composite ||
        b.scores[6] - a.scores[6] ||
        b.scores[1] - a.scores[1]
    );

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);
  const cohortAvgByCriterion = CRITERIA.map((_, i) => avg(rankings.map((r) => r.scores[i])));
  const avgComposite = avg(rankings.map((r) => r.composite));
  const tier1 = rankings.filter((r) => r.tier === 'TIER1');
  const tier2 = rankings.filter((r) => r.tier === 'TIER2');

  const requested =
    typeof sp.country === 'string' ? sp.country.toUpperCase() : undefined;
  const selectedCode =
    requested && rankings.some((r) => r.code === requested)
      ? requested
      : rankings[0]?.code;
  const selected = rankings.find((r) => r.code === selectedCode)!;
  const selectedRank = rankings.indexOf(selected) + 1;
  const boundarySensitive =
    Math.abs(selected.composite - TIER_RULES.TIER1.min) < 1 ||
    Math.abs(selected.composite - TIER_RULES.TIER2.min) < 1;

  const regions = [...new Set(rankings.map((r) => r.region))].map((region) => {
    const list = rankings.filter((r) => r.region === region);
    return { region, avg: avg(list.map((r) => r.composite)), n: list.length };
  }).sort((a, b) => b.avg - a.avg);

  const insights = generateInsights(rankings, locale);

  const kpis: [string, string, string][] = [
    [String(rankings.length), fr ? 'Nations évaluées ACRI' : 'ACRI-assessed nations', fr ? `sur 54 — édition ${ACRI_VERSION}` : `of 54 — edition ${ACRI_VERSION}`],
    [avgComposite.toFixed(1), fr ? 'ACRI moyen (cohorte)' : 'Average ACRI (cohort)', fr ? 'composite pondéré Σw·s' : 'weighted composite Σw·s'],
    [`${tier1.length} / ${tier2.length}`, fr ? 'Tier 1 / Tier 2' : 'Tier 1 / Tier 2', fr ? 'lancement M1–4 / M5–8' : 'launch M1–4 / M5–8'],
    [String(toolCount), fr ? 'Outils GRC en catalogue' : 'GRC tools in catalog', fr ? 'canon 22/14/15/12' : 'canon 22/14/15/12'],
    [String(orgCount + sessionCount), fr ? 'Engagements plateforme' : 'Platform engagements', fr ? 'organisations + sessions outils' : 'organizations + tool sessions'],
    [String(certCount), fr ? 'Certificats actifs' : 'Active certificates', fr ? 'registre public /verify' : 'public /verify registry'],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* ═════ HEADER ═════ */}
      <header>
        <span className="apa-secnum text-lg">03</span>
        <h1 className="mt-3 text-3xl font-bold uppercase tracking-wide text-apa-green">
          {fr ? 'Tableau de Bord Analytique Exécutif' : 'Executive Analytics Dashboard'}
        </h1>
        <div className="mt-3 h-[3px] w-full bg-apa-gold" />
        <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-apa-navy">
          {fr
            ? 'Mesurer la performance de gouvernance · Surveiller l’authenticité · Piloter la valeur long terme'
            : 'Measure Governance Performance · Monitor Authenticity · Drive Long-Term Value'}
        </p>
      </header>

      {/* ═════ EXECUTIVE KPI CARDS (live DB) ═════ */}
      <div className="apa-gradient mt-8 grid grid-cols-2 gap-3 rounded-apa-lg p-5 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map(([v, l, s]) => (
          <div key={l} className="apa-kpi px-3 py-4 text-center">
            <div className="text-2xl font-extrabold text-apa-gold-bright">{v}</div>
            <div className="mt-1 text-[11px] font-semibold leading-tight text-white">{l}</div>
            <div className="mt-0.5 text-[9px] leading-tight text-apa-mint">{s}</div>
          </div>
        ))}
      </div>

      {/* ═════ AUTHENTICITY PREMIUM ═════ */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-apa-green">
          {fr ? 'La Prime d’Authenticité™' : 'The Authenticity Premium™'}
        </h2>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />
        <p className="mt-3 text-sm font-semibold text-apa-navy">
          {fr
            ? 'Transformer la gouvernance éthique en valeur d’entreprise mesurable.'
            : 'Turning Ethical Governance into Measurable Enterprise Value.'}
        </p>

        {/* Value flow diagram */}
        <div className="mt-8 flex flex-wrap items-stretch gap-2">
          {FLOW[fr ? 'fr' : 'en'].map((step, i, arr) => (
            <div key={step} className="flex flex-1 items-center gap-2" style={{ minWidth: 150 }}>
              <div
                className={`flex-1 rounded-apa border px-3 py-3 text-center text-xs font-bold transition-transform hover:-translate-y-0.5 ${
                  i === 2
                    ? 'apa-gradient border-transparent text-apa-gold-bright shadow-md'
                    : i < 2
                      ? 'border-apa-line bg-apa-soft text-apa-grey'
                      : 'border-apa-green bg-white text-apa-green'
                }`}
              >
                {step}
              </div>
              {i < arr.length - 1 ? (
                <span aria-hidden className="shrink-0 font-bold text-apa-gold">→</span>
              ) : null}
            </div>
          ))}
        </div>

        {/* 8 framework components */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COMPONENTS8[fr ? 'fr' : 'en'].map(([name, desc]) => (
            <div key={name} className="rounded-apa border border-apa-line bg-white p-4 transition-shadow hover:shadow-md">
              <h3 className="text-sm font-bold text-apa-navy">◆ {name}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-apa-grey">{desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs italic text-apa-grey">
          {fr ? 'Source : Master Memoire APA §III & §VI.' : 'Source: APA Master Memoire §III & §VI.'}
        </p>
      </section>

      {/* ═════ ACRI MODULE ═════ */}
      <section className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-apa-green">
              {fr ? 'Africa Country Readiness Index (ACRI)' : 'Africa Country Readiness Index (ACRI)'}
            </h2>
            <p className="mt-1 text-sm text-apa-grey">
              {fr
                ? '7 critères pondérés · la réponse disciplinée à « où d’abord, et pourquoi » (Master Memoire §V).'
                : '7 weighted criteria · the disciplined answer to “where first, and why” (Master Memoire §V).'}
            </p>
          </div>
          <span className="rounded-full border border-apa-gold bg-apa-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-apa-bronze">
            {fr ? 'Confiance : ILLUSTRATIVE (illustrative-v1) — datasets en connexion' : 'Confidence: ILLUSTRATIVE (illustrative-v1) — datasets connecting'}
          </span>
        </div>
        <div className="mt-2 h-[3px] w-full bg-apa-gold" />

        {/* Country selector + radar + scorecard */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <form method="GET" className="flex items-end gap-2">
              <label className="flex-1 text-xs font-bold uppercase tracking-wide text-apa-grey">
                {fr ? 'Profil pays' : 'Country profile'}
                <select
                  name="country"
                  defaultValue={selected.code}
                  className="mt-1 w-full rounded-md border border-apa-line bg-white px-3 py-2 text-sm font-semibold text-apa-ink"
                >
                  {rankings.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name} — ACRI {r.composite}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className="rounded-md bg-apa-green px-4 py-2 text-sm font-semibold text-white hover:bg-apa-green-mid">
                {fr ? 'Analyser' : 'Analyze'}
              </button>
            </form>

            <div className="mt-4 flex justify-center rounded-apa-lg border border-apa-line bg-white p-4">
              <RadarChart
                labels={CRITERIA.map((c) => `C${c.id}`)}
                seriesA={selected.scores}
                seriesB={cohortAvgByCriterion}
              />
            </div>
            <p className="mt-2 text-center text-xs text-apa-grey">
              <span className="font-bold text-apa-green">■</span> {selected.name} ·{' '}
              <span className="font-bold text-apa-gold">▨</span>{' '}
              {fr ? 'moyenne cohorte' : 'cohort average'}
            </p>
          </div>

          {/* Scorecard — traceable calculation */}
          <div className="rounded-apa-lg border border-apa-line bg-white p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl">{flagOf(selected.code)}</span>
              <h3 className="text-lg font-bold text-apa-navy">{selected.name}</h3>
              <span className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${TIER_BADGE[selected.tier]}`}>
                {selected.tier === 'TIER1'
                  ? `Tier 1 · ${fr ? TIER_RULES.TIER1.monthsFr : TIER_RULES.TIER1.monthsEn}`
                  : selected.tier === 'TIER2'
                    ? `Tier 2 · ${fr ? TIER_RULES.TIER2.monthsFr : TIER_RULES.TIER2.monthsEn}`
                    : 'Watchlist'}
              </span>
              <span className="ml-auto text-sm font-bold text-apa-grey">
                {fr ? 'Rang' : 'Rank'} #{selectedRank}/{rankings.length}
              </span>
            </div>
            {boundarySensitive ? (
              <p className="apa-box apa-box-gold mt-3 p-2 text-xs">
                {fr ? '⚠ Sensible au seuil de tier (±1 pt) — voir analyse de sensibilité.' : '⚠ Tier-boundary sensitive (±1 pt) — see sensitivity analysis.'}
              </p>
            ) : null}

            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase text-apa-grey">
                  <th className="py-1">{fr ? 'Critère' : 'Criterion'}</th>
                  <th className="py-1 text-center">{fr ? 'Poids' : 'Weight'}</th>
                  <th className="py-1 text-center">Score</th>
                  <th className="py-1 text-right">{fr ? 'Contribution' : 'Contribution'}</th>
                </tr>
              </thead>
              <tbody>
                {CRITERIA.map((c, i) => (
                  <tr key={c.id} className="border-t border-apa-mist">
                    <td className="py-1.5 pr-2 text-xs font-semibold text-apa-ink">
                      C{c.id} · {fr ? c.nameFr : c.nameEn}
                    </td>
                    <td className="py-1.5 text-center text-xs text-apa-grey">{(c.weight * 100).toFixed(0)}%</td>
                    <td className="py-1.5 text-center font-bold text-apa-green">{selected.scores[i]}</td>
                    <td className="py-1.5 text-right font-mono text-xs">{(selected.scores[i] * c.weight).toFixed(1)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-apa-gold font-bold">
                  <td className="py-2 text-xs uppercase" colSpan={3}>
                    ACRI = Σ wᵢ·sᵢ
                  </td>
                  <td className="py-2 text-right text-apa-green">
                    {selected.scores.reduce((a, s, i) => a + s * CRITERIA[i].weight, 0).toFixed(1)}
                    <span className="ml-1 text-[10px] text-apa-grey">
                      → {fr ? 'officiel' : 'official'} {selected.composite}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Ranking table + heatmap */}
        <h3 className="mt-12 text-lg font-bold text-apa-green">
          {fr ? 'Classement & carte thermique — 22 nations' : 'Rankings & heatmap — 22 nations'}
        </h3>
        <div className="mt-4 overflow-x-auto rounded-apa-lg border border-apa-line">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-apa-green text-white">
                <th className="px-3 py-2 text-left text-xs">#</th>
                <th className="px-3 py-2 text-left text-xs uppercase">{fr ? 'Nation' : 'Nation'}</th>
                <th className="px-2 py-2 text-center text-xs uppercase">ACRI</th>
                {CRITERIA.map((c) => (
                  <th key={c.id} className="px-2 py-2 text-center text-[10px]" title={fr ? c.nameFr : c.nameEn}>
                    C{c.id}
                    <span className="block text-[8px] font-normal text-apa-mint">{(c.weight * 100).toFixed(0)}%</span>
                  </th>
                ))}
                <th className="px-3 py-2 text-center text-xs uppercase">Tier</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((r, idx) => (
                <tr key={r.code} className={`border-t border-apa-mist ${r.code === selected.code ? 'bg-apa-soft' : ''}`}>
                  <td className="px-3 py-1.5 text-xs font-bold text-apa-grey">{idx + 1}</td>
                  <td className="whitespace-nowrap px-3 py-1.5">
                    <a href={`?country=${r.code}`} className="font-semibold text-apa-navy hover:text-apa-green">
                      {flagOf(r.code)} {r.name}
                    </a>
                  </td>
                  <td className="px-2 py-1.5 text-center font-extrabold text-apa-green">{r.composite}</td>
                  {r.scores.map((s, i) => (
                    <td key={i} className="px-2 py-1.5 text-center text-xs font-semibold" style={heat(s)}>
                      {s}
                    </td>
                  ))}
                  <td className="px-3 py-1.5 text-center">
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-extrabold ${TIER_BADGE[r.tier]}`}>
                      {r.tier === 'TIER1' ? 'T1' : r.tier === 'TIER2' ? 'T2' : 'W'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Regional comparison */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-bold text-apa-green">
              {fr ? 'Comparaison régionale' : 'Regional comparison'}
            </h3>
            <div className="mt-4 space-y-2.5">
              {regions.map((r) => (
                <div key={r.region} className="flex items-center gap-3">
                  <span className="w-36 shrink-0 text-xs font-bold text-apa-navy">
                    {r.region} <span className="font-normal text-apa-grey">({r.n})</span>
                  </span>
                  <div className="h-5 flex-1 overflow-hidden rounded bg-apa-soft">
                    <div className="apa-gradient h-full rounded" style={{ width: `${r.avg}%` }} />
                  </div>
                  <span className="w-12 text-right text-sm font-bold text-apa-green">{r.avg.toFixed(1)}</span>
                </div>
              ))}
            </div>

            {/* Classification rules */}
            <div className="apa-box mt-8 p-4 text-sm">
              <h4 className="font-bold text-apa-green">
                {fr ? 'Règles de classification & priorité de déploiement' : 'Classification rules & deployment priority'}
              </h4>
              <ul className="mt-2 space-y-1 text-xs">
                <li><b className="text-apa-green">Tier 1</b> — ACRI ≥ {TIER_RULES.TIER1.min} · {fr ? 'lancement prioritaire, cycle NIP complet,' : 'priority launch, full NIP lifecycle,'} {fr ? TIER_RULES.TIER1.monthsFr : TIER_RULES.TIER1.monthsEn}.</li>
                <li><b className="text-apa-bronze">Tier 2</b> — ACRI {TIER_RULES.TIER2.min}–{TIER_RULES.TIER1.min - 1} · {fr ? 'activation séquentielle,' : 'sequential activation,'} {fr ? TIER_RULES.TIER2.monthsFr : TIER_RULES.TIER2.monthsEn}.</li>
                <li><b className="text-apa-grey">Watchlist</b> — ACRI &lt; {TIER_RULES.TIER2.min} · {fr ? 'suivi, pas de déploiement actif.' : 'monitored, no active deployment.'}</li>
                <li className="pt-1 text-apa-grey">{fr ? METHODOLOGY.tierMovementFr : METHODOLOGY.tierMovementEn}</li>
              </ul>
            </div>
          </div>

          {/* AI Insights */}
          <div>
            <h3 className="text-lg font-bold text-apa-green">
              {fr ? 'Insights IA — APA Navigator' : 'AI Insights — APA Navigator'}
            </h3>
            <div className="apa-gradient mt-4 rounded-apa-lg p-5 text-white">
              <span className="apa-badge">APA NAVIGATOR</span>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-apa-mint">
                {insights.map((ins) => (
                  <li key={ins.slice(0, 40)} className="flex gap-2">
                    <span className="text-apa-gold-bright">›</span>
                    {ins}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Methodology — full analytical engine docs */}
        <h3 className="mt-12 text-lg font-bold text-apa-green">
          {fr ? 'Méthodologie — moteur analytique documenté' : 'Methodology — documented analytical engine'}
        </h3>
        <div className="apa-box mt-4 p-4 text-xs leading-relaxed">
          <p><b>{fr ? 'Formule composite' : 'Composite formula'} :</b> <span className="font-mono">{METHODOLOGY.compositeFormula}</span> · {fr ? 'bornes' : 'bounds'} [0, 100]</p>
          <p className="mt-1"><b>{fr ? 'Normalisation' : 'Normalization'} :</b> {fr ? METHODOLOGY.normalizationFr : METHODOLOGY.normalizationEn}</p>
          <p className="mt-1"><b>{fr ? 'Classement' : 'Ranking'} :</b> {fr ? METHODOLOGY.rankingFr : METHODOLOGY.rankingEn}</p>
          <p className="mt-1"><b>{fr ? 'Sensibilité' : 'Sensitivity'} :</b> {fr ? METHODOLOGY.sensitivityFr : METHODOLOGY.sensitivityEn}</p>
          <p className="mt-1"><b>{fr ? 'Confiance' : 'Confidence'} :</b> {fr ? METHODOLOGY.confidenceFr : METHODOLOGY.confidenceEn}</p>
        </div>
        <div className="mt-4 space-y-2">
          {CRITERIA.map((c) => (
            <details key={c.id} className="rounded-apa border border-apa-line bg-white px-5 py-3">
              <summary className="cursor-pointer text-sm font-bold text-apa-navy">
                C{c.id} · {fr ? c.nameFr : c.nameEn}
                <span className="ml-2 rounded bg-apa-soft px-2 py-0.5 text-[10px] font-extrabold text-apa-green">
                  {(c.weight * 100).toFixed(0)}%
                </span>
              </summary>
              <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                <div><dt className="font-bold text-apa-grey">{fr ? 'Définition' : 'Definition'}</dt><dd>{fr ? c.definitionFr : c.definitionEn}</dd></div>
                <div><dt className="font-bold text-apa-grey">{fr ? 'Finalité métier' : 'Business purpose'}</dt><dd>{fr ? c.purposeFr : c.purposeEn}</dd></div>
                <div><dt className="font-bold text-apa-grey">{fr ? 'Mesures' : 'Measures'}</dt><dd>{fr ? c.measuresFr : c.measuresEn}</dd></div>
                <div><dt className="font-bold text-apa-grey">{fr ? 'Sources de données' : 'Data sources'}</dt><dd>{fr ? c.dataSourcesFr : c.dataSourcesEn}</dd></div>
                <div className="sm:col-span-2"><dt className="font-bold text-apa-grey">{fr ? 'Guide d’interprétation & seuils' : 'Interpretation guide & thresholds'}</dt><dd>{fr ? c.interpretationFr : c.interpretationEn}</dd></div>
              </dl>
            </details>
          ))}
        </div>

        <p className="mt-6 text-xs italic text-apa-grey">
          {fr
            ? 'Flux de données : acri_scores (versionné) → moteur src/domain/acri → cette page & GET /api/v1/acri. Aucune valeur codée en dur ; les jeux de données live (WGI, IPC, ZLECAf, GSMA…) se branchent par nouvelle dataVersion.'
            : 'Data flow: acri_scores (versioned) → src/domain/acri engine → this page & GET /api/v1/acri. No hardcoded values; live datasets (WGI, CPI, AfCFTA, GSMA…) plug in as a new dataVersion.'}
        </p>
      </section>
    </div>
  );
}
