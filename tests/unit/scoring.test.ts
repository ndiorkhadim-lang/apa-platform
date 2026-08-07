import { describe, it, expect } from 'vitest';
import {
  computeScore,
  computePoints,
  earnedBadges,
  POINTS,
  LEVELS,
  BADGES,
  type ScoringInput,
} from '@/domain/scoring/scoring';

const EMPTY: ScoringInput = {
  toolsCompleted: 0,
  lessonsRead: 0,
  cspaPassed: false,
  capstoneApproved: false,
  certified: false,
};

describe('computePoints', () => {
  it('is zero for no activity', () => {
    expect(computePoints(EMPTY)).toBe(0);
  });
  it('sums each activity by its rubric weight', () => {
    const input: ScoringInput = { toolsCompleted: 3, lessonsRead: 4, cspaPassed: true, capstoneApproved: true, certified: true };
    const expected = 3 * POINTS.toolCompleted + 4 * POINTS.lessonRead + POINTS.cspaPassed + POINTS.capstoneApproved + POINTS.certificationIssued;
    expect(computePoints(input)).toBe(expected);
  });
  it('ignores negative / non-finite counts', () => {
    expect(computePoints({ ...EMPTY, toolsCompleted: -5, lessonsRead: Number.NaN })).toBe(0);
  });
  it('floors fractional counts', () => {
    expect(computePoints({ ...EMPTY, toolsCompleted: 2.9 })).toBe(2 * POINTS.toolCompleted);
  });
});

describe('levels', () => {
  it('starts at Practitioner with zero points', () => {
    const r = computeScore(EMPTY);
    expect(r.level.id).toBe('PRACTITIONER');
    expect(r.levelIndex).toBe(0);
    expect(r.nextLevel?.id).toBe('STRATEGIST');
    expect(r.pointsToNext).toBe(LEVELS[1].min);
  });
  it('promotes to the highest level whose threshold is met', () => {
    const certified = computeScore({ ...EMPTY, certified: true }); // 100 pts
    expect(certified.level.id).toBe('STRATEGIST');
    const fellow = computeScore({ toolsCompleted: 50, lessonsRead: 0, cspaPassed: true, capstoneApproved: true, certified: true });
    // 500 + 25 + 40 + 100 = 665 → Fellow
    expect(fellow.level.id).toBe('FELLOW');
    expect(fellow.nextLevel).toBeNull();
    expect(fellow.pointsToNext).toBeNull();
    expect(fellow.progressPct).toBe(100);
  });
  it('reports progress within the current band', () => {
    // 150 pts → Strategist (100..250), halfway → 33% of the way to Leader
    const r = computeScore({ ...EMPTY, toolsCompleted: 15 }); // 150
    expect(r.level.id).toBe('STRATEGIST');
    expect(r.progressPct).toBe(Math.round(((150 - 100) / (250 - 100)) * 100)); // 33
  });
});

describe('badges', () => {
  it('awards none for no activity', () => {
    expect(earnedBadges(EMPTY)).toEqual([]);
  });
  it('awards diagnostic / capstone / certified / csv-leader by milestone', () => {
    const b = earnedBadges({ ...EMPTY, cspaPassed: true, capstoneApproved: true, certified: true, cspaMaturity: 'CSV_LEADER' });
    expect(b.map((x) => x.id)).toEqual(['diagnostic', 'capstone', 'certified', 'csv-leader']);
  });
  it('does not award csv-leader below that maturity', () => {
    const b = earnedBadges({ ...EMPTY, cspaPassed: true, cspaMaturity: 'TRANSFORMATIONAL' });
    expect(b.map((x) => x.id)).toEqual(['diagnostic']);
  });
  it('inserts the pathway badge after diagnostic when pathway is complete', () => {
    const r = computeScore({ ...EMPTY, cspaPassed: true, certified: true }, true);
    expect(r.badges.map((x) => x.id)).toEqual(['diagnostic', 'pathway', 'certified']);
  });
  it('every badge id has bilingual name + description', () => {
    for (const b of Object.values(BADGES)) {
      expect(b.nameEn && b.nameFr && b.descEn && b.descFr).toBeTruthy();
    }
  });
});

describe('determinism', () => {
  it('same input → identical result', () => {
    const input: ScoringInput = { toolsCompleted: 7, lessonsRead: 3, cspaPassed: true, capstoneApproved: false, certified: false, cspaMaturity: 'TRANSFORMATIONAL' };
    expect(computeScore(input, true)).toEqual(computeScore(input, true));
  });
});
