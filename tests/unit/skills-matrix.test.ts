import { describe, it, expect } from 'vitest';
import { computeSkillsMatrix, coverageBand } from '@/domain/enterprise/skills-matrix';
import { SECTIONS } from '@/domain/cspa/engine';

describe('coverageBand', () => {
  it('maps percentages to bands', () => {
    expect(coverageBand(0)).toBe('NONE');
    expect(coverageBand(20)).toBe('LOW');
    expect(coverageBand(50)).toBe('MEDIUM');
    expect(coverageBand(80)).toBe('HIGH');
    expect(coverageBand(100)).toBe('FULL');
  });
});

describe('computeSkillsMatrix', () => {
  it('exposes one domain per C-SPA section', () => {
    const m = computeSkillsMatrix([]);
    expect(m.domains.map((d) => d.code)).toEqual(SECTIONS.map((s) => s.code));
  });

  it('scores an empty cohort at zero', () => {
    const m = computeSkillsMatrix([]);
    expect(m.orgOverallPct).toBe(0);
    expect(m.domainSummaries.every((d) => d.avgPct === 0 && d.band === 'NONE')).toBe(true);
  });

  it('computes a member’s per-domain coverage from completed tools', () => {
    // S1 tools are SECTIONS[0].tools; complete them all → S1 = 100%.
    const s1 = SECTIONS[0];
    const m = computeSkillsMatrix([{ id: 'u1', name: 'A', completedToolNumbers: s1.tools }]);
    const row = m.members[0];
    const s1cell = row.cells.find((c) => c.sectionCode === s1.code)!;
    expect(s1cell.pct).toBe(100);
    expect(s1cell.band).toBe('FULL');
    expect(s1cell.covered).toBe(s1.tools.length);
    // Other domains untouched.
    expect(row.cells.filter((c) => c.sectionCode !== s1.code).every((c) => c.pct === 0)).toBe(true);
  });

  it('computes partial coverage and its band', () => {
    const s1 = SECTIONS[0]; // 3 tools
    const m = computeSkillsMatrix([{ id: 'u1', name: 'A', completedToolNumbers: [s1.tools[0]] }]);
    const cell = m.members[0].cells[0];
    expect(cell.covered).toBe(1);
    expect(cell.pct).toBe(Math.round((1 / s1.tools.length) * 100)); // 33
    expect(cell.band).toBe('LOW');
  });

  it('averages members into the domain summary', () => {
    const s1 = SECTIONS[0];
    const m = computeSkillsMatrix([
      { id: 'u1', name: 'A', completedToolNumbers: s1.tools }, // 100%
      { id: 'u2', name: 'B', completedToolNumbers: [] }, // 0%
    ]);
    expect(m.domainSummaries[0].avgPct).toBe(50);
    expect(m.domainSummaries[0].band).toBe('MEDIUM');
  });

  it('ignores tool numbers outside any domain', () => {
    const m = computeSkillsMatrix([{ id: 'u1', name: 'A', completedToolNumbers: [9999] }]);
    expect(m.orgOverallPct).toBe(0);
  });
});
