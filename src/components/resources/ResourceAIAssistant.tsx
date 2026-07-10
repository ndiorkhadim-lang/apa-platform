'use client';

import { useMemo, useRef, useState } from 'react';
import type { Resource, LearningPath } from '@/types/resource';

/**
 * APA AI Knowledge Assistant — grounded retrieval over the APA corpus only.
 * Rule-based/semantic ranking today (no external model, no hallucination);
 * the same interface swaps onto the AI Concierge backend. It answers with
 * APA knowledge exclusively and always cites resources.
 */

type Msg = { role: 'user' | 'assistant'; text: string; refs?: { slug: string; title: string }[] };

const SUGGESTIONS = [
  'Recommend resources on the Authenticity Premium™',
  'Explain the C-SPA diagnostic',
  'Which certification path should I follow?',
  'Suggest a learning pathway for community verification',
  'Summarize the ESG in Africa report',
];

function score(r: Resource, q: string): number {
  const hay = [r.title, r.executiveSummary, r.aiSummary, r.type, ...r.domains, ...r.industries, ...r.keyInsights, ...r.relatedCertifications].join(' ').toLowerCase();
  const tokens = q.toLowerCase().replace(/[^\w\s™]/g, ' ').split(/\s+/).filter((t) => t.length > 2);
  return tokens.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
}

export function ResourceAIAssistant({ resources, paths, locale = 'en' }: { resources: Resource[]; paths: LearningPath[]; locale?: string }) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', text: 'I’m the APA Knowledge Assistant. Ask me to recommend resources, explain a framework, suggest a tool or certification, or design a learning pathway. I answer using APA knowledge only, and I’ll cite what I reference.' },
  ]);
  const [input, setInput] = useState('');
  const scroller = useRef<HTMLDivElement>(null);

  const byPopularity = useMemo(() => [...resources].sort((a, b) => b.views - a.views), [resources]);

  function answer(q: string): Msg {
    const ranked = [...resources].map((r) => ({ r, s: score(r, q) })).sort((a, b) => b.s - a.s);
    const top = ranked.filter((x) => x.s > 0).slice(0, 3).map((x) => x.r);
    const ql = q.toLowerCase();

    // Learning pathway intent
    if (/(pathway|learning path|where.*start|curriculum|prepare)/.test(ql)) {
      const p = paths.find((pp) => score({ ...resources[0], title: pp.title, executiveSummary: pp.description, aiSummary: pp.tagline } as Resource, q) > 0)
        ?? paths.find((pp) => q.toLowerCase().includes(pp.title.toLowerCase().split(' ')[0])) ?? paths[0];
      const refs = p.resourceSlugs.map((slug) => resources.find((r) => r.slug === slug)).filter(Boolean) as Resource[];
      return {
        role: 'assistant',
        text: `I recommend the “${p.title}” learning path (${p.level}). ${p.description} Work through it in order — each resource sets up the next.`,
        refs: refs.map((r) => ({ slug: r.slug, title: r.title })),
      };
    }

    const picks = top.length ? top : byPopularity.slice(0, 3);
    let lead = 'Here’s what I found in the APA library';
    if (/certif/.test(ql)) lead = 'For certification, start with these';
    else if (/recommend|suggest|resource/.test(ql)) lead = 'Recommended resources';
    else if (/explain|what is|how/.test(ql)) lead = top[0]
      ? `${top[0].title}: ${top[0].aiSummary}`
      : 'Here’s the most relevant APA material';
    else if (/summar/.test(ql) && top[0]) lead = `Summary — ${top[0].title}: ${top[0].aiSummary}`;

    return {
      role: 'assistant',
      text: top.length === 0 && !/summar|explain/.test(ql)
        ? 'I couldn’t find an exact match, so here’s the most-read APA material. Try naming a framework, domain or certification.'
        : lead,
      refs: picks.map((r) => ({ slug: r.slug, title: r.title })),
    };
  }

  function send(q: string) {
    const text = q.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: 'user', text }, answer(text)]);
    setInput('');
    requestAnimationFrame(() => scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' }));
  }

  return (
    <div className="overflow-hidden rounded-apa-lg border border-apa-line bg-white shadow-sm">
      <div className="apa-gradient flex items-center gap-3 px-5 py-4 text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-lg">✦</span>
        <div>
          <div className="text-sm font-bold">APA AI Knowledge Assistant</div>
          <div className="text-[11px] text-apa-sage">Grounded in APA knowledge · cites its sources</div>
        </div>
      </div>

      <div ref={scroller} className="max-h-80 space-y-4 overflow-y-auto p-5">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : ''}>
            <div className={`inline-block max-w-[85%] rounded-apa-lg px-4 py-2.5 text-sm ${m.role === 'user' ? 'bg-apa-green text-white' : 'bg-apa-soft text-apa-ink'}`}>
              {m.text}
            </div>
            {m.refs?.length ? (
              <ul className="mt-2 space-y-1.5">
                {m.refs.map((r) => (
                  <li key={r.slug}>
                    <a href={`/${locale}/resources/${r.slug}`} className="flex items-center gap-2 rounded-md border border-apa-line px-3 py-1.5 text-left text-xs font-semibold text-apa-green hover:border-apa-green hover:bg-apa-soft">
                      📄 {r.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>

      <div className="border-t border-apa-line p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-apa-line px-2.5 py-1 text-[11px] font-semibold text-apa-navy hover:border-apa-green hover:text-apa-green">
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the APA Knowledge Assistant…"
            className="min-w-0 flex-1 rounded-md border border-apa-line px-3 py-2 text-sm outline-none focus:border-apa-green"
          />
          <button type="submit" className="rounded-md bg-apa-green px-4 py-2 text-sm font-bold text-white hover:bg-apa-green-mid">Ask</button>
        </form>
      </div>
    </div>
  );
}
