import 'server-only';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Anthropic SDK adapter. The AI services (guidance, capstone pre-scoring) call
 * through here and automatically switch from the deterministic engines to a
 * live Claude model as soon as ANTHROPIC_API_KEY is present in the environment —
 * no code change, no redeploy of the callers.
 *
 * Model is env-configurable via ANTHROPIC_MODEL. Note: "Claude 3.5 Sonnet" was
 * retired (2025-10-28); its successor is `claude-sonnet-5`, the default here.
 */

const DEFAULT_MODEL = 'claude-sonnet-5';

export function llmAvailable(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim());
}

export function llmModel(): string {
  return process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic(); // reads ANTHROPIC_API_KEY from env
  return client;
}

/** Pull a JSON object out of a model response that may wrap it in prose/fences. */
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf('{');
  const end = body.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) throw new Error('no JSON object in model response');
  return body.slice(start, end + 1);
}

/**
 * Ask Claude for a strictly-JSON answer and parse it. Callers wrap this in a
 * try/catch and fall back to their deterministic engine on any failure, so a
 * transient API error never breaks the feature.
 */
export async function llmJson<T>(params: { system: string; user: string; maxTokens?: number }): Promise<T> {
  const message = await getClient().messages.create({
    model: llmModel(),
    max_tokens: params.maxTokens ?? 1500,
    system: `${params.system}\n\nRespond with ONLY a single JSON object — no prose, no markdown fences.`,
    messages: [{ role: 'user', content: params.user }],
  });
  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n');
  return JSON.parse(extractJson(text)) as T;
}
