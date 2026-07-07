'use client';

import { useState } from 'react';

interface Rule {
  id: string;
  label: string;
  solutionId: string;
  toolNumber: number;
}
interface SolutionLite {
  id: string;
  code: string;
  name: string;
  pillars: string[];
  journeySlug: string;
  certification: string;
}
interface ToolLite {
  number: number;
  slug: string;
  name: string;
  launchPath: string; // locale-aware
}

const L = {
  fr: {
    badge: 'APA NAVIGATOR',
    intro: 'Ne commencez pas par un outil. Dites-moi votre défi, je vous mène à la bonne Solution.',
    q: 'Quel est votre objectif de gouvernance prioritaire ?',
    recSolution: 'Solution recommandée',
    recFramework: 'Frameworks',
    recTool: 'Outil d’entrée',
    recJourney: 'Parcours',
    recCert: 'Certification',
    launch: 'Lancer l’outil',
    explore: 'Explorer la solution',
    reset: 'Recommencer',
  },
  en: {
    badge: 'APA NAVIGATOR',
    intro: 'Don’t start from a tool. Tell me your challenge, I’ll route you to the right Solution.',
    q: 'What is your priority governance objective?',
    recSolution: 'Recommended solution',
    recFramework: 'Frameworks',
    recTool: 'Entry tool',
    recJourney: 'Journey',
    recCert: 'Certification',
    launch: 'Launch tool',
    explore: 'Explore the solution',
    reset: 'Start over',
  },
} as const;

export function AiConcierge({
  locale,
  rules,
  solutions,
  tools,
  journeyLabels,
}: {
  locale: string;
  rules: Rule[];
  solutions: SolutionLite[];
  tools: Record<number, ToolLite>;
  journeyLabels: Record<string, string>;
}) {
  const t = L[locale === 'en' ? 'en' : 'fr'];
  const [choice, setChoice] = useState<Rule | null>(null);

  const solution = choice ? solutions.find((s) => s.id === choice.solutionId) : null;
  const tool = choice ? tools[choice.toolNumber] : null;

  return (
    <div className="apa-gradient rounded-apa-lg p-7 text-white">
      <span className="apa-badge">{t.badge}</span>
      <p className="mt-4 max-w-2xl text-lg italic leading-relaxed text-apa-mint">{t.intro}</p>

      <p className="mt-6 text-xs font-bold uppercase tracking-wide text-apa-gold-bright">{t.q}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {rules.map((r) => (
          <button
            key={r.id}
            type="button"
            aria-pressed={choice?.id === r.id}
            onClick={() => setChoice(r)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              choice?.id === r.id
                ? 'border-apa-gold-bright bg-apa-gold-bright text-apa-ink'
                : 'border-white/30 bg-white/10 text-apa-mint hover:bg-white/20'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {solution && tool ? (
        <div className="mt-6 grid gap-4 rounded-apa-lg bg-white/10 p-5 backdrop-blur md:grid-cols-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-apa-gold-bright">{t.recSolution}</p>
            <p className="mt-1 text-lg font-bold text-white">{solution.code} · {solution.name}</p>
            <dl className="mt-4 space-y-2 text-sm text-apa-mint">
              <div><dt className="inline font-semibold text-apa-sage">{t.recFramework}: </dt><dd className="inline">{solution.pillars.join(' · ')}</dd></div>
              <div><dt className="inline font-semibold text-apa-sage">{t.recJourney}: </dt><dd className="inline">{journeyLabels[solution.journeySlug] ?? solution.journeySlug}</dd></div>
              <div><dt className="inline font-semibold text-apa-sage">{t.recCert}: </dt><dd className="inline">{solution.certification}</dd></div>
            </dl>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-apa-gold-bright">{t.recTool}</p>
              <p className="mt-1 font-bold text-white">
                #{String(tool.number).padStart(2, '0')} · {tool.name}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={tool.launchPath}
                className="rounded-md bg-apa-gold-bright px-5 py-2.5 text-sm font-bold text-apa-ink transition-colors hover:bg-apa-gold"
              >
                {t.launch} →
              </a>
              <a
                href={`#${solution.id}`}
                className="rounded-md border border-apa-gold-bright px-5 py-2.5 text-sm font-semibold text-apa-gold-bright transition-colors hover:bg-apa-gold-bright hover:text-apa-ink"
              >
                {t.explore}
              </a>
              <button
                type="button"
                onClick={() => setChoice(null)}
                className="px-3 py-2.5 text-sm text-apa-sage underline"
              >
                {t.reset}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
