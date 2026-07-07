import { CRITERIA, TIER_RULES } from './methodology';

/**
 * ACRI insight engine — executive narratives computed from live data.
 * Deterministic and traceable: every sentence derives from the rankings
 * passed in. Trend insights activate automatically once a second
 * dataVersion (time series) exists.
 */
export interface RankedNation {
  code: string;
  name: string;
  region: string;
  composite: number;
  tier: string;
  scores: number[]; // criteria 1..7
}

export function generateInsights(rankings: RankedNation[], locale: string): string[] {
  if (rankings.length === 0) return [];
  const fr = locale !== 'en';
  const out: string[] = [];

  const top = rankings[0];
  const topBest = [...top.scores.keys()].sort((a, b) => top.scores[b] - top.scores[a])[0];
  out.push(
    fr
      ? `${top.name} mène l'index (ACRI ${top.composite}) — porté par « ${CRITERIA[topBest].nameFr} » (${top.scores[topBest]}/100). Recommandation : en faire la vitrine continentale des premiers certificats.`
      : `${top.name} leads the index (ACRI ${top.composite}) — driven by "${CRITERIA[topBest].nameEn}" (${top.scores[topBest]}/100). Recommendation: make it the continental showcase for the first certificates.`
  );

  const nearTier1 = rankings
    .filter((r) => r.tier === 'TIER2')
    .map((r) => ({ r, gap: TIER_RULES.TIER1.min - r.composite }))
    .sort((a, b) => a.gap - b.gap)[0];
  if (nearTier1) {
    const weak = [...nearTier1.r.scores.keys()].sort(
      (a, b) => nearTier1.r.scores[a] - nearTier1.r.scores[b]
    )[0];
    out.push(
      fr
        ? `${nearTier1.r.name} est à ${nearTier1.gap} pt${nearTier1.gap > 1 ? 's' : ''} du Tier 1 (sensible au seuil). Le levier le plus efficace : « ${CRITERIA[weak].nameFr} » (${nearTier1.r.scores[weak]}/100) — un gain de +5 pts y déplace le composite de +${(5 * CRITERIA[weak].weight).toFixed(1)} pt.`
        : `${nearTier1.r.name} sits ${nearTier1.gap} pt${nearTier1.gap > 1 ? 's' : ''} from Tier 1 (boundary-sensitive). Highest-leverage lever: "${CRITERIA[weak].nameEn}" (${nearTier1.r.scores[weak]}/100) — a +5 pt gain moves the composite +${(5 * CRITERIA[weak].weight).toFixed(1)} pt.`
    );
  }

  // strongest region by average composite
  const byRegion = new Map<string, number[]>();
  for (const r of rankings) {
    byRegion.set(r.region, [...(byRegion.get(r.region) ?? []), r.composite]);
  }
  const regionAvg = [...byRegion.entries()]
    .map(([region, list]) => ({ region, avg: list.reduce((a, b) => a + b, 0) / list.length, n: list.length }))
    .sort((a, b) => b.avg - a.avg)[0];
  if (regionAvg) {
    out.push(
      fr
        ? `Région la plus prête : ${regionAvg.region} (ACRI moyen ${regionAvg.avg.toFixed(1)} sur ${regionAvg.n} nations) — candidat naturel pour une activation en grappe autour de son hub.`
        : `Readiest region: ${regionAvg.region} (average ACRI ${regionAvg.avg.toFixed(1)} across ${regionAvg.n} nations) — natural candidate for a cluster activation around its hub.`
    );
  }

  // continent-wide weakest criterion
  const critAvg = CRITERIA.map((c, i) => ({
    i,
    avg: rankings.reduce((a, r) => a + r.scores[i], 0) / rankings.length,
  })).sort((a, b) => a.avg - b.avg)[0];
  out.push(
    fr
      ? `Critère le plus faible à l'échelle de la cohorte : « ${CRITERIA[critAvg.i].nameFr} » (moyenne ${critAvg.avg.toFixed(1)}/100) — axe prioritaire des programmes de renforcement (pilier V du framework).`
      : `Weakest criterion cohort-wide: "${CRITERIA[critAvg.i].nameEn}" (average ${critAvg.avg.toFixed(1)}/100) — priority axis for capacity programs (framework pillar V).`
  );

  out.push(
    fr
      ? `Analyse de tendance : s'activera automatiquement à la prochaine version de données (comparaison inter-versions) — la présente édition est ${'illustrative-v1'}.`
      : `Trend analysis: activates automatically at the next data version (cross-version comparison) — current edition is ${'illustrative-v1'}.`
  );

  return out;
}
