import type { ToolCategory } from '@/generated/prisma/client';

/**
 * Category blueprints — each of the 63 tools renders a real workspace derived
 * from its official V3 category. This keeps one honest, maintainable interaction
 * model across all tools instead of 63 bespoke forms, while every tool still
 * produces a saveable, exportable report.
 */
export interface FormField {
  name: string;
  labelEn: string;
  labelFr: string;
  type: 'text' | 'textarea' | 'scale' | 'choice';
  choicesEn?: string[];
  choicesFr?: string[];
}

export interface Blueprint {
  benefitsEn: string[];
  benefitsFr: string[];
  instructionsEn: string[];
  instructionsFr: string[];
  fields: FormField[];
  /** How the result panel frames the output. */
  outputKind: 'score' | 'document' | 'clause' | 'metric';
}

const YESNO = {
  choicesEn: ['Yes — in place', 'Partial', 'Not yet'],
  choicesFr: ['Oui — en place', 'Partiel', 'Pas encore'],
};

export const BLUEPRINTS: Record<ToolCategory, Blueprint> = {
  FORM: {
    benefitsEn: [
      'Structured self-assessment scored against the APA standard.',
      'Immediate alignment score (0–100) with a pass gate at 70.',
      'Feeds directly into your certification journey evidence.',
    ],
    benefitsFr: [
      'Auto-évaluation structurée notée selon le standard APA.',
      "Score d'alignement immédiat (0–100), seuil de réussite à 70.",
      'Alimente directement les preuves de votre parcours de certification.',
    ],
    instructionsEn: [
      'Answer each item honestly — partial credit is scored.',
      'Save your progress at any time and resume later.',
      'Generate a report to freeze and export your result.',
    ],
    instructionsFr: [
      'Répondez honnêtement — les réponses partielles sont notées.',
      'Enregistrez votre progression à tout moment et reprenez plus tard.',
      'Générez un rapport pour figer et exporter votre résultat.',
    ],
    fields: [
      { name: 'q1', labelEn: 'Leadership has explicitly committed to power-sharing.', labelFr: 'La direction s’est explicitement engagée au partage du pouvoir.', type: 'choice', ...YESNO },
      { name: 'q2', labelEn: 'Community co-ownership mechanisms are legally binding.', labelFr: 'Les mécanismes de co-propriété communautaire sont juridiquement contraignants.', type: 'choice', ...YESNO },
      { name: 'q3', labelEn: 'Impact is measured with local dignity & cohesion indicators.', labelFr: 'L’impact est mesuré via des indicateurs locaux de dignité & cohésion.', type: 'choice', ...YESNO },
      { name: 'q4', labelEn: 'A grievance mechanism is co-designed with the community.', labelFr: 'Un mécanisme de griefs est co-conçu avec la communauté.', type: 'choice', ...YESNO },
      { name: 'context', labelEn: 'Context & evidence (optional)', labelFr: 'Contexte & preuves (facultatif)', type: 'textarea' },
    ],
    outputKind: 'score',
  },
  GUIDE: {
    benefitsEn: [
      'Step-by-step implementation playbook tailored to your context.',
      'Reusable working notes saved to your workspace.',
      'Exportable action plan for your team.',
    ],
    benefitsFr: [
      'Guide de mise en œuvre étape par étape adapté à votre contexte.',
      'Notes de travail réutilisables enregistrées dans votre espace.',
      "Plan d'action exportable pour votre équipe.",
    ],
    instructionsEn: [
      'Describe your project scope and the outcome you want.',
      'Work through each guidance step, capturing decisions.',
      'Export the completed plan as your working document.',
    ],
    instructionsFr: [
      'Décrivez le périmètre de votre projet et le résultat visé.',
      'Parcourez chaque étape en consignant vos décisions.',
      'Exportez le plan complété comme document de travail.',
    ],
    fields: [
      { name: 'scope', labelEn: 'Project scope', labelFr: 'Périmètre du projet', type: 'textarea' },
      { name: 'stakeholders', labelEn: 'Key stakeholders', labelFr: 'Parties prenantes clés', type: 'textarea' },
      { name: 'outcome', labelEn: 'Target outcome', labelFr: 'Résultat visé', type: 'textarea' },
    ],
    outputKind: 'document',
  },
  LEGAL: {
    benefitsEn: [
      'Generates a first-draft binding clause aligned to APA mandates.',
      'Captures the negotiated parameters for the record.',
      'Exportable for legal review and signature.',
    ],
    benefitsFr: [
      'Génère un premier projet de clause contraignante aligné sur les mandats APA.',
      "Consigne les paramètres négociés pour l'archive.",
      'Exportable pour revue juridique et signature.',
    ],
    instructionsEn: [
      'Enter the parties and the parameters of the mandate.',
      'Review the generated clause language.',
      'Export for counsel review — this is a draft, not legal advice.',
    ],
    instructionsFr: [
      'Saisissez les parties et les paramètres du mandat.',
      'Relisez la formulation de la clause générée.',
      "Exportez pour revue par un conseil — ceci est un projet, pas un avis juridique.",
    ],
    fields: [
      { name: 'partyA', labelEn: 'International partner', labelFr: 'Partenaire international', type: 'text' },
      { name: 'partyB', labelEn: 'Local partner', labelFr: 'Partenaire local', type: 'text' },
      { name: 'terms', labelEn: 'Negotiated parameters', labelFr: 'Paramètres négociés', type: 'textarea' },
    ],
    outputKind: 'clause',
  },
  METRIC: {
    benefitsEn: [
      'Turns raw inputs into a tracked APA metric over time.',
      'Baseline captured for longitudinal comparison.',
      'Exportable metric snapshot for dashboards.',
    ],
    benefitsFr: [
      'Transforme des données brutes en une métrique APA suivie dans le temps.',
      'Référence de départ capturée pour comparaison longitudinale.',
      'Instantané de métrique exportable pour les tableaux de bord.',
    ],
    instructionsEn: [
      'Enter the current measured values.',
      'Add context for how the measurement was taken.',
      'Generate a snapshot to track this metric over time.',
    ],
    instructionsFr: [
      'Saisissez les valeurs mesurées actuelles.',
      'Ajoutez le contexte de la mesure.',
      'Générez un instantané pour suivre cette métrique dans le temps.',
    ],
    fields: [
      { name: 'value', labelEn: 'Measured value', labelFr: 'Valeur mesurée', type: 'text' },
      { name: 'period', labelEn: 'Measurement period', labelFr: 'Période de mesure', type: 'text' },
      { name: 'method', labelEn: 'Measurement method', labelFr: 'Méthode de mesure', type: 'textarea' },
    ],
    outputKind: 'metric',
  },
};

/** FORM scoring: choice answers → 0–100 alignment score, gate at 70. */
export function scoreFormAnswers(answers: Record<string, unknown>): number {
  const weights: Record<string, number> = { '0': 1, '1': 0.5, '2': 0 };
  const keys = Object.keys(answers).filter((k) => k.startsWith('q'));
  if (keys.length === 0) return 0;
  const total = keys.reduce((sum, k) => sum + (weights[String(answers[k])] ?? 0), 0);
  return Math.round((total / keys.length) * 100);
}
