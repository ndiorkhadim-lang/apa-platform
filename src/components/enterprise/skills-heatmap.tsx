import type { SkillsMatrix, CoverageBand } from '@/domain/enterprise/skills-matrix';

/** Thermal cell styling per coverage band (dark canvas). */
const BAND_CLASS: Record<CoverageBand, string> = {
  NONE: 'bg-neutral-900 text-neutral-600',
  LOW: 'bg-red-950 text-red-300',
  MEDIUM: 'bg-amber-950 text-amber-300',
  HIGH: 'bg-lime-950 text-lime-300',
  FULL: 'bg-emerald-900 text-emerald-100',
};

const LINE = 'border-[#262626]';

/**
 * ISO 37000 competency heatmap — members × C-SPA domains, cells colored by
 * coverage. Pure server render; horizontally scrollable, no page overflow.
 */
export function SkillsHeatmap({ matrix, locale }: { matrix: SkillsMatrix; locale: string }) {
  const fr = locale !== 'en';
  const domainLabel = (d: { nameEn: string; nameFr: string }) => (fr ? d.nameFr : d.nameEn);

  return (
    <div className={`overflow-x-auto rounded-xl border ${LINE}`}>
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className={`border-b ${LINE}`}>
            <th className="sticky left-0 bg-black px-4 py-3 font-semibold text-neutral-300">{fr ? 'Membre' : 'Member'}</th>
            {matrix.domains.map((d) => (
              <th key={d.code} className="px-3 py-3 text-center font-medium text-neutral-400" title={domainLabel(d)}>
                <span className="font-mono text-apa-gold-bright">{d.code}</span>
              </th>
            ))}
            <th className="px-3 py-3 text-center font-semibold text-neutral-300">{fr ? 'Global' : 'Overall'}</th>
          </tr>
        </thead>
        <tbody>
          {matrix.members.map((m) => (
            <tr key={m.id} className={`border-b ${LINE}`}>
              <td className="sticky left-0 bg-black px-4 py-2.5 font-medium text-neutral-200">{m.name}</td>
              {m.cells.map((c) => (
                <td key={c.sectionCode} className="p-1 text-center">
                  <span className={`inline-block w-full rounded px-2 py-1.5 font-mono font-semibold ${BAND_CLASS[c.band]}`} title={`${c.covered}/${c.total}`}>
                    {c.pct}
                  </span>
                </td>
              ))}
              <td className="px-3 py-2.5 text-center font-mono font-bold text-neutral-100">{m.overallPct}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-neutral-950">
            <td className="sticky left-0 bg-neutral-950 px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-neutral-500">
              {fr ? 'Moyenne cohorte' : 'Cohort average'}
            </td>
            {matrix.domainSummaries.map((d) => (
              <td key={d.code} className="p-1 text-center">
                <span className={`inline-block w-full rounded px-2 py-1.5 font-mono font-bold ${BAND_CLASS[d.band]}`}>{d.avgPct}</span>
              </td>
            ))}
            <td className="px-3 py-3 text-center font-mono font-black text-apa-gold-bright">{matrix.orgOverallPct}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
