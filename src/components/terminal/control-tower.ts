/**
 * Certification Control Tower — the exhaustive Option B application navigation.
 * Five functional groups, every item a real certification-centric module. No
 * generic corporate links (no About / Framework / Resources): this is a
 * governance terminal, not a marketing site.
 */

export interface TowerItem {
  slug: string;
  href: string;
  titleEn: string;
  titleFr: string;
  subEn: string;
  subFr: string;
  tools?: number[];
  glyph: string;
}

export interface TowerGroup {
  id: string;
  titleEn: string;
  titleFr: string;
  glyph: string;
  items: TowerItem[];
}

export const CONTROL_TOWER: TowerGroup[] = [
  {
    id: 'workspace',
    titleEn: 'Workspace',
    titleFr: 'Espace de travail',
    glyph: '▦',
    items: [
      { slug: 'dashboard', href: '/certification', titleEn: 'Executive Dashboard', titleFr: 'Tableau de Bord Exécutif', subEn: 'Standing, score & next action', subFr: 'Statut, score & action suivante', glyph: '◧' },
      { slug: 'learning', href: '/learn/cits-executive-pathway', titleEn: 'Learning Journey', titleFr: 'Parcours d’Apprentissage', subEn: 'LMS player · CITS pathway', subFr: 'Player LMS · parcours CITS', glyph: '▷' },
      { slug: 'capstone', href: '/learn/cits-executive-pathway/capstone', titleEn: 'Capstone Workbench', titleFr: 'Atelier Capstone', subEn: 'Transformation project', subFr: 'Projet de transformation', glyph: '◈' },
      { slug: 'enterprise', href: '/enterprise', titleEn: 'B2B Enterprise Cohort', titleFr: 'Cohorte B2B Entreprise', subEn: 'Members · skills matrix', subFr: 'Membres · matrice de compétences', glyph: '⛨' },
      { slug: 'admin', href: '/app/admin/capstone', titleEn: 'Certification Admin', titleFr: 'Administration Certification', subEn: 'Committee · review queue', subFr: 'Comité · file de revue', glyph: '⚑' },
    ],
  },
  {
    id: 'circuit',
    titleEn: 'Verification Circuit',
    titleFr: 'Circuit de Vérification',
    glyph: '◉',
    items: [
      { slug: 'cspa', href: '/certify-v2/cspa', titleEn: 'C-SPA Diagnostic Engine', titleFr: 'Moteur de Diagnostic C-SPA', subEn: 'Gate ≥ 70.0 / 100', subFr: 'Seuil ≥ 70,0 / 100', tools: [3], glyph: '◎' },
      { slug: 'trust-audit', href: '/certify-v2/trust-audit', titleEn: 'Trust Audit & Mapping', titleFr: 'Audit de Confiance & Cartographie', subEn: 'TDI Index', subFr: 'Indice TDI', tools: [2], glyph: '⬡' },
      { slug: 'contracts', href: '/certify-v2/contracts', titleEn: 'Kinship Equity Contracts', titleFr: 'Contrats de Parenté', subEn: 'Builder & e-Sign', subFr: 'Constructeur & e-Signature', tools: [18, 19, 20], glyph: '✎' },
      { slug: 'cvp', href: '/certify-v2/cvp', titleEn: 'CVP Live Consent Telemetry', titleFr: 'Télémétrie de Consentement CVP', subEn: 'Veto Matrix & σ', subFr: 'Matrice de Veto & σ', tools: [27], glyph: '∿' },
      { slug: 'seal', href: '/certify-v2/seal', titleEn: 'Authenticity Premium™ Seal', titleFr: 'Sceau Prime d’Authenticité™', subEn: 'Verifiable badge & QR', subFr: 'Badge vérifiable & QR', glyph: '❖' },
    ],
  },
  {
    id: 'grc',
    titleEn: 'GRC Suite Workspace',
    titleFr: 'Atelier Suite GRC',
    glyph: '⚙',
    items: [
      { slug: 'pillar-1', href: '/certify-v2/grc/pillar-1', titleEn: 'Pillar I · Foundational Diagnostics', titleFr: 'Pilier I · Diagnostics Fondamentaux', subEn: 'Tools #1–9 · LVC #5 · C-SPA #3', subFr: 'Outils #1–9 · LVC #5 · C-SPA #3', tools: [1, 2, 3, 4, 5, 6, 7, 8, 9], glyph: 'Ⅰ' },
      { slug: 'pillar-2', href: '/certify-v2/grc/pillar-2', titleEn: 'Pillar II · Power-Sharing & Governance', titleFr: 'Pilier II · Partage du Pouvoir', subEn: 'Tools #10–17 · GRM #10', subFr: 'Outils #10–17 · GRM #10', tools: [10, 11, 12, 13, 14, 15, 16, 17], glyph: 'Ⅱ' },
      { slug: 'pillar-3', href: '/certify-v2/grc/pillar-3', titleEn: 'Pillar III · Enforceable Contracts', titleFr: 'Pilier III · Contrats Exécutoires', subEn: 'Veto #18 · Parity #19 · Sunset #20', subFr: 'Veto #18 · Parité #19 · Sunset #20', tools: [18, 19, 20, 21, 22, 23, 24, 25, 26], glyph: 'Ⅲ' },
      { slug: 'pillar-4', href: '/certify-v2/grc/pillar-4', titleEn: 'Pillar IV · Metrics & Verification', titleFr: 'Pilier IV · Mesure & Vérification', subEn: 'MAE #29 · PQI #31', subFr: 'MAE #29 · PQI #31', tools: [27, 28, 29, 30, 31, 32, 33, 34, 35], glyph: 'Ⅳ' },
      { slug: 'pillar-5', href: '/certify-v2/grc/pillar-5', titleEn: 'Pillar V · Specialised & AI Governance', titleFr: 'Pilier V · Gouvernance IA & Spécialisée', subEn: 'AI Prevention #36 · SDG #44', subFr: 'Prévention IA #36 · ODD #44', tools: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50], glyph: 'Ⅴ' },
      { slug: 'pillar-6', href: '/certify-v2/grc/pillar-6', titleEn: 'Pillar VI · Operational Mandates', titleFr: 'Pilier VI · Mandats Opérationnels', subEn: 'Local Quota 40% #53 · Raw Data #59', subFr: 'Quota Local 40% #53 · Données Brutes #59', tools: [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63], glyph: 'Ⅵ' },
    ],
  },
  {
    id: 'telemetry',
    titleEn: 'Governance Telemetry',
    titleFr: 'Télémétrie de Gouvernance',
    glyph: '∆',
    items: [
      { slug: 'sigma', href: '/certify-v2/telemetry/sigma', titleEn: 'Leakage Coefficient σ', titleFr: 'Coefficient de Fuite σ', subEn: 'Live suppression · target ≤ 0.05', subFr: 'Suppression live · cible ≤ 0,05', glyph: '∿' },
      { slug: 'pqi', href: '/certify-v2/telemetry/pqi', titleEn: 'Partnership Quality Index', titleFr: 'Indice de Qualité du Partenariat', subEn: '360° feedback · target > 4.0/5', subFr: 'Feedback 360° · cible > 4,0/5', tools: [31], glyph: '◐' },
      { slug: 'systems-change', href: '/certify-v2/telemetry/systems-change', titleEn: '10-Year Systems Change', titleFr: 'Changement Systémique 10 ans', subEn: 'Policy permanence #28, #33', subFr: 'Permanence des politiques #28, #33', tools: [28, 33], glyph: '↗' },
      { slug: 'grievance', href: '/certify-v2/telemetry/grievance', titleEn: 'Grievance & Anti-Retaliation', titleFr: 'Griefs & Anti-Représailles', subEn: 'Trend synthesis #25, #58', subFr: 'Synthèse des tendances #25, #58', tools: [25, 58], glyph: '⚑' },
    ],
  },
  {
    id: 'community',
    titleEn: 'Community Sovereignty & CVP',
    titleFr: 'Souveraineté Communautaire & CVP',
    glyph: '⛨',
    items: [
      { slug: 'cvp-matrix', href: '/certify-v2/community/cvp-matrix', titleEn: 'CVP Community Co-Sign Matrix', titleFr: 'Matrice de Co-Signature CVP', subEn: 'Pape Samb Veto Protocol #27', subFr: 'Protocole de Veto Pape Samb #27', tools: [27], glyph: '⛨' },
      { slug: 'data-vault', href: '/certify-v2/community/data-vault', titleEn: 'Raw Data Decolonization Vault', titleFr: 'Coffre de Décolonisation des Données', subEn: 'Read-only community access #59', subFr: 'Accès communautaire lecture seule #59', tools: [59], glyph: '⛁' },
      { slug: 'repair-protocol', href: '/certify-v2/community/repair-protocol', titleEn: 'Relational Repair Protocol', titleFr: 'Protocole de Réparation Relationnelle', subEn: '90-day protocol #56', subFr: 'Protocole 90 jours #56', tools: [56], glyph: '♺' },
      { slug: 'veto-settings', href: '/certify-v2/community/veto-settings', titleEn: 'Veto Threshold Policy', titleFr: 'Politique de Seuil de Veto', subEn: 'Threshold settings #62', subFr: 'Réglages de seuil #62', tools: [62], glyph: '⚖' },
    ],
  },
  {
    id: 'export',
    titleEn: 'Institutional Export & API',
    titleFr: 'Export Institutionnel & API',
    glyph: '⇪',
    items: [
      { slug: 'dfi', href: '/certify-v2/export/dfi', titleEn: 'DFI & Rating Agency Export', titleFr: 'Export DFI & Agences de Notation', subEn: 'IFC PS1 · EU CSDDD · UK Bribery Act', subFr: 'IFC PS1 · CSDDD UE · UK Bribery Act', glyph: '⇪' },
      { slug: 'ratings', href: '/certify-v2/export/ratings', titleEn: 'MSCI & Moody’s Credibility Stream', titleFr: 'Flux de Crédibilité MSCI & Moody’s', subEn: 'Credibility score stream', subFr: 'Flux de score de crédibilité', glyph: '≣' },
      { slug: 'blockchain', href: '/certify-v2/export/blockchain', titleEn: 'Cryptographic Hash Registry', titleFr: 'Registre de Hachage Cryptographique', subEn: 'ZKP attestation proofs', subFr: 'Preuves d’attestation ZKP', glyph: '⛓' },
    ],
  },
  {
    id: 'reference',
    titleEn: 'Reference & Registry',
    titleFr: 'Référence & Registre',
    glyph: '§',
    items: [
      { slug: 'glossary', href: '/glossary', titleEn: 'Sovereign Glossary', titleFr: 'Glossaire Souverain', subEn: 'The controlled lexicon', subFr: 'Le lexique de référence', glyph: '§' },
      { slug: 'registry', href: '/verify', titleEn: 'Sovereign Registry', titleFr: 'Registre Souverain', subEn: 'Public credential verification', subFr: 'Vérification publique des titres', glyph: '❖' },
      { slug: 'my-credentials', href: '/verify/APA-2026-SN-000001', titleEn: 'My Credentials', titleFr: 'Mes Titres', subEn: 'Issued & verifiable', subFr: 'Émis & vérifiables', glyph: '◆' },
    ],
  },
];

/** Flat lookup for active-state + breadcrumbs. */
export const TOWER_ITEMS: TowerItem[] = CONTROL_TOWER.flatMap((g) => g.items);
