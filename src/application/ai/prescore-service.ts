import 'server-only';
import { buildPrescore, type Prescore } from '@/domain/capstone/prescoring';
import { SECTIONS } from '@/domain/cspa/engine';
import { coverageBand } from '@/domain/enterprise/skills-matrix';
import { llmAvailable, llmJson } from '@/infrastructure/ai/anthropic';

/**
 * Capstone AI pre-scoring — auto-switches. With no ANTHROPIC_API_KEY it returns
 * the deterministic concept-coverage pre-score. With a key it asks Claude to
 * grade the document against the six ISO 37000 / C-SPA domains, then recomputes
 * the composite in code with the fixed C-SPA weights (so the composite stays
 * deterministic and defensible even on the model path). Falls back on any error.
 * Advisory in both modes — a human APA evaluator still decides.
 */
export async function getCapstonePrescore(content: string): Promise<Prescore> {
  const deterministic = buildPrescore(content);
  if (!llmAvailable()) return deterministic;

  try {
    const graded = await llmJson<{ scores: Record<string, number> }>({
      maxTokens: 900,
      system:
        'You grade an institutional-transformation capstone against six governance domains (ISO 37000 / APA Creating-Shared-Value). ' +
        'Domains: ' +
        SECTIONS.map((s) => `${s.code}=${s.nameEn}`).join(', ') +
        '. Return JSON {"scores": {"S1": 0-100, ..., "S6": 0-100}} scoring how well the document evidences each domain. Be rigorous and conservative.',
      user: content.slice(0, 12000),
    });

    const dimensions = SECTIONS.map((s) => {
      const raw = graded?.scores?.[s.code];
      const score = typeof raw === 'number' && Number.isFinite(raw) ? Math.min(100, Math.max(0, Math.round(raw))) : 0;
      return { code: s.code, nameEn: s.nameEn, nameFr: s.nameFr, weight: s.weight, matched: [], total: 0, score };
    });
    const composite = Math.round(dimensions.reduce((acc, d) => acc + (d.score * d.weight) / 100, 0));

    return {
      version: `${deterministic.version}+llm`,
      dimensions,
      composite,
      band: coverageBand(composite),
      wordCount: deterministic.wordCount,
    };
  } catch {
    return deterministic;
  }
}
