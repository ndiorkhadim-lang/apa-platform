#!/usr/bin/env node
/**
 * ACRI per-criterion seed — dataVersion "illustrative-v1".
 *
 * The Atlas gives one official composite per priority nation (ACRI 66–94).
 * Live per-criterion datasets (WB WGI, TI CPI, AfCFTA, GSMA, remittances…)
 * are not connected yet, so this seed derives a DETERMINISTIC, TRACEABLE
 * decomposition: 7 scores whose weighted sum reproduces the official
 * composite (±0.5 before rounding). Replacing this version with a measured
 * dataset is a pure data operation — no schema or code change.
 */
import pg from 'pg';
import 'dotenv/config';

const WEIGHTS = [0.2, 0.2, 0.15, 0.15, 0.15, 0.1, 0.05];
const VERSION = 'illustrative-v1';

// deterministic offset in [-12, +12] from country code + criterion index
function offset(code, i) {
  let h = 0;
  for (const ch of `${code}:${i}`) h = (h * 31 + ch.charCodeAt(0)) % 1000003;
  return (h % 25) - 12;
}
const clamp = (v) => Math.max(42, Math.min(98, v));
const wsum = (s) => s.reduce((acc, v, i) => acc + v * WEIGHTS[i], 0);

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const { rows: nations } = await client.query(
  'SELECT id, code, "acriScore" FROM nations WHERE "isPriority" = true'
);

let inserted = 0;
for (const n of nations) {
  const C = n.acriScore;
  let s = WEIGHTS.map((_, i) => clamp(C + offset(n.code, i)));
  // correction loop: nudge scores until the weighted sum rounds to C
  for (let guard = 0; guard < 60 && Math.round(wsum(s)) !== C; guard++) {
    const diff = C - wsum(s);
    const i = guard % 7;
    const next = clamp(s[i] + Math.sign(diff));
    if (next !== s[i]) s = s.map((v, j) => (j === i ? next : v));
  }
  for (let i = 0; i < 7; i++) {
    await client.query(
      `INSERT INTO acri_scores (id, "nationId", criterion, score, "dataVersion")
       VALUES (gen_random_uuid(), $1, $2, $3, $4)
       ON CONFLICT ("nationId", criterion, "dataVersion")
       DO UPDATE SET score = EXCLUDED.score`,
      [n.id, i + 1, s[i], VERSION]
    );
    inserted++;
  }
  const check = wsum(s).toFixed(1);
  console.log(`${n.code} composite=${C} decomposed=[${s.join(',')}] Σw·s=${check}`);
}

console.log(`✔ ${inserted} criterion scores (${nations.length} nations × 7) — ${VERSION}`);
await client.end();
