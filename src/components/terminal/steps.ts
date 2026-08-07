/** The 5-step Verification Circuit — shared metadata for Option B nav + cards. */
export interface CircuitStep {
  n: number;
  slug: string;
  titleEn: string;
  titleFr: string;
  taglineEn: string;
  taglineFr: string;
  glyph: string;
  accent: 'amber' | 'emerald' | 'cyan' | 'violet' | 'gold';
}

export const CIRCUIT_STEPS: CircuitStep[] = [
  { n: 1, slug: 'cspa', titleEn: 'C-SPA Engine', titleFr: 'Moteur C-SPA', taglineEn: 'Strategic paradigm audit', taglineFr: 'Audit du paradigme stratégique', glyph: '◎', accent: 'amber' },
  { n: 2, slug: 'trust-audit', titleEn: 'Trust Audit', titleFr: 'Audit de Confiance', taglineEn: 'Stakeholder & grievance map', taglineFr: 'Cartographie parties-prenantes', glyph: '⬡', accent: 'cyan' },
  { n: 3, slug: 'contracts', titleEn: 'Kinship Contracts', titleFr: 'Contrats de Parenté', taglineEn: 'Live cryptographic e-signature', taglineFr: 'E-signature cryptographique', glyph: '✎', accent: 'violet' },
  { n: 4, slug: 'cvp', titleEn: 'CVP Live Consent', titleFr: 'Consentement CVP', taglineEn: 'Leakage coefficient σ telemetry', taglineFr: 'Télémétrie du coefficient σ', glyph: '∿', accent: 'emerald' },
  { n: 5, slug: 'seal', titleEn: 'Authenticity Seal™', titleFr: 'Sceau d’Authenticité™', taglineEn: 'Verifiable credential + DFI export', taglineFr: 'Titre vérifiable + export DFI', glyph: '❖', accent: 'gold' },
];
