import 'server-only';
import { buildLessonGuidance, type ConciergeContext, type Guidance } from '@/domain/learning/concierge';
import { llmAvailable, llmJson } from '@/infrastructure/ai/anthropic';

/**
 * AI Concierge guidance — auto-switches. With no ANTHROPIC_API_KEY it returns
 * the deterministic, framework-grounded guidance (instant, offline). With a key
 * it asks Claude for richer, context-specific guidance, and falls back to the
 * deterministic engine on any error. Same Guidance shape either way.
 */
export async function getLessonGuidance(ctx: ConciergeContext): Promise<Guidance> {
  const deterministic = buildLessonGuidance(ctx);
  if (!llmAvailable()) return deterministic;

  try {
    const fr = ctx.locale !== 'en';
    const result = await llmJson<Guidance>({
      maxTokens: 700,
      system:
        'You are the APA AI Concierge, a governance-training copilot grounded in ISO 37000 and the APA framework (Creating Shared Value paradigm). ' +
        `Reply in ${fr ? 'French' : 'English'}. ` +
        'Return JSON {"headline": string, "steps": string[3], "tip": string}. Keep steps concrete and actionable.',
      user: JSON.stringify({
        lessonTitle: ctx.lessonTitle,
        lessonKind: ctx.lessonKind,
        lessonState: ctx.lessonState,
        toolCategory: ctx.toolCategory,
        toolNumber: ctx.toolNumber,
        domain: ctx.domainName,
      }),
    });
    // Guard the shape; fall back if the model returned something unusable.
    if (result && typeof result.headline === 'string' && Array.isArray(result.steps) && typeof result.tip === 'string') {
      return { headline: result.headline, steps: result.steps.map(String), tip: result.tip };
    }
    return deterministic;
  } catch {
    return deterministic;
  }
}
