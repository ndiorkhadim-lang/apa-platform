/**
 * AI Concierge — contextual guidance engine for the LMS player dock.
 *
 * Deterministic and grounded: guidance is derived from the lesson's context
 * (kind, linked tool category, C-SPA domain, completion state) and the APA
 * framework, not from a live model. It is intentionally pluggable — a real LLM
 * can replace `buildLessonGuidance` behind the same interface without changing
 * callers. Pure: no I/O.
 */

import type { LessonKind, LessonState } from '@/domain/learning/curriculum';
import type { ToolCategory } from '@/generated/prisma/client';

export interface ConciergeContext {
  locale: string;
  lessonTitle: string;
  lessonKind: LessonKind;
  lessonState: LessonState;
  toolCategory?: ToolCategory;
  toolNumber?: number;
  domainName?: string; // C-SPA section name
}

export interface Guidance {
  headline: string;
  steps: string[];
  tip: string;
}

const CATEGORY_ACTION: Record<ToolCategory, { en: string; fr: string }> = {
  FORM: { en: 'answer each item honestly — partial credit is scored, and a pass needs ≥ 70', fr: 'répondez honnêtement à chaque item — les réponses partielles comptent, le seuil de réussite est ≥ 70' },
  GUIDE: { en: 'work through each step and capture your decisions as you go', fr: 'parcourez chaque étape en consignant vos décisions au fil de l’eau' },
  LEGAL: { en: 'enter the parties and negotiated parameters, then export the draft clause for counsel', fr: 'saisissez les parties et les paramètres négociés, puis exportez la clause pour revue juridique' },
  METRIC: { en: 'enter the measured values with their method so the baseline is defensible', fr: 'saisissez les valeurs mesurées et leur méthode pour une référence défendable' },
};

/** Build grounded, contextual guidance for the current lesson. */
export function buildLessonGuidance(ctx: ConciergeContext): Guidance {
  const fr = ctx.locale !== 'en';

  if (ctx.lessonState === 'LOCKED') {
    return {
      headline: fr ? 'Cette leçon est verrouillée' : 'This lesson is locked',
      steps: fr
        ? ['Terminez la leçon précédente pour déverrouiller celle-ci.', 'Les leçons s’ouvrent dans l’ordre pour construire une preuve cohérente.']
        : ['Complete the previous lesson to unlock this one.', 'Lessons open in sequence to build coherent evidence.'],
      tip: fr ? 'Astuce : appuyez sur B pour revoir le curriculum.' : 'Tip: press B to review the curriculum.',
    };
  }

  if (ctx.lessonKind === 'TOOL') {
    const action = ctx.toolCategory ? CATEGORY_ACTION[ctx.toolCategory] : null;
    const domain = ctx.domainName ? (fr ? ` (domaine « ${ctx.domainName} »)` : ` (domain “${ctx.domainName}”)`) : '';
    return {
      headline: fr
        ? `Verrou pratique — Outil #${ctx.toolNumber}${domain}`
        : `Practical lock — Tool #${ctx.toolNumber}${domain}`,
      steps: fr
        ? [
            `Ouvrez l’atelier de l’outil et ${action?.fr ?? 'complétez le travail requis'}.`,
            'Générez le rapport pour figer votre résultat — c’est lui qui lève le verrou.',
            'Votre résultat devient une preuve vérifiable et alimente votre score C-SPA.',
          ]
        : [
            `Open the tool workspace and ${action?.en ?? 'complete the required work'}.`,
            'Generate the report to freeze your result — that is what clears the lock.',
            'Your result becomes verifiable evidence and feeds your C-SPA score.',
          ],
      tip: fr ? 'Astuce : le dock T garde vos outils à portée de main.' : 'Tip: the T dock keeps your tools within reach.',
    };
  }

  // READING / ASSESSMENT
  return {
    headline: fr ? `Orientation — ${ctx.lessonTitle}` : `Orientation — ${ctx.lessonTitle}`,
    steps: fr
      ? ['Lisez l’orientation en gardant votre institution à l’esprit.', 'Notez les décisions à porter dans les outils qui suivent.', 'Marquez la leçon comme lue pour continuer.']
      : ['Read the orientation with your own institution in mind.', 'Note the decisions to carry into the tools that follow.', 'Mark the lesson as read to continue.'],
    tip: fr ? 'Astuce : appuyez sur F pour un mode sans distraction.' : 'Tip: press F for a distraction-free mode.',
  };
}
