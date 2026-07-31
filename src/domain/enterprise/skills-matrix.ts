/**
 * Enterprise skills matrix — pure aggregation for the B2B governance heatmap.
 *
 * Each C-SPA section (domain/cspa/engine.ts · SECTIONS) is an ISO 37000 -aligned
 * competency domain; its mapped tools are the indicators. A member's coverage of
 * a domain is the share of that domain's tools they have completed. The org row
 * averages members. Pure — the application layer supplies members + completions.
 */

import { SECTIONS, type SectionDef } from '@/domain/cspa/engine';

export type CoverageBand = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'FULL';

export interface MemberInput {
  id: string;
  name: string;
  completedToolNumbers: Iterable<number>;
}

export interface MatrixCell {
  sectionCode: string;
  covered: number; // tools completed in this domain
  total: number; // domain indicator count
  pct: number; // 0..100
  band: CoverageBand;
}

export interface MemberRow {
  id: string;
  name: string;
  cells: MatrixCell[];
  overallPct: number; // mean across domains
}

export interface DomainSummary {
  code: string;
  nameEn: string;
  nameFr: string;
  avgPct: number; // mean member coverage of this domain
  band: CoverageBand;
}

export interface SkillsMatrix {
  domains: { code: string; nameEn: string; nameFr: string }[];
  members: MemberRow[];
  domainSummaries: DomainSummary[];
  orgOverallPct: number;
}

/** Map a coverage percentage to a heatmap band. */
export function coverageBand(pct: number): CoverageBand {
  if (pct <= 0) return 'NONE';
  if (pct < 34) return 'LOW';
  if (pct < 67) return 'MEDIUM';
  if (pct < 100) return 'HIGH';
  return 'FULL';
}

function domainTools(section: SectionDef): number[] {
  return section.tools;
}

function cellFor(section: SectionDef, completed: Set<number>): MatrixCell {
  const tools = domainTools(section);
  const covered = tools.filter((n) => completed.has(n)).length;
  const pct = tools.length ? Math.round((covered / tools.length) * 100) : 0;
  return { sectionCode: section.code, covered, total: tools.length, pct, band: coverageBand(pct) };
}

/** Build the full skills matrix for a cohort. */
export function computeSkillsMatrix(members: MemberInput[]): SkillsMatrix {
  const domains = SECTIONS.map((s) => ({ code: s.code, nameEn: s.nameEn, nameFr: s.nameFr }));

  const rows: MemberRow[] = members.map((m) => {
    const completed = new Set(m.completedToolNumbers);
    const cells = SECTIONS.map((s) => cellFor(s, completed));
    const overallPct = cells.length ? Math.round(cells.reduce((a, c) => a + c.pct, 0) / cells.length) : 0;
    return { id: m.id, name: m.name, cells, overallPct };
  });

  const domainSummaries: DomainSummary[] = SECTIONS.map((s, i) => {
    const pcts = rows.map((r) => r.cells[i].pct);
    const avgPct = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0;
    return { code: s.code, nameEn: s.nameEn, nameFr: s.nameFr, avgPct, band: coverageBand(avgPct) };
  });

  const orgOverallPct = rows.length
    ? Math.round(rows.reduce((a, r) => a + r.overallPct, 0) / rows.length)
    : 0;

  return { domains, members: rows, domainSummaries, orgOverallPct };
}
