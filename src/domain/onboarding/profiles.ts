/**
 * APA Role-Based Experience (RBX) — the profile registry.
 *
 * Each profile is a fully distinct dashboard: its own layout, KPIs, widgets,
 * navigation menu, quick actions, AI-Concierge suggestions, recommended
 * journeys/solutions/resources, certification status and notifications.
 *
 * Content is grounded in the APA Master Memoire (Authenticity Premium™, ACRI,
 * C-SPA, the 63 tools, community verification, certification). Sample data is
 * realistic-but-synthetic — used for the executive demo, easy to disable.
 */

export type Bi = { en: string; fr: string };
const L = (en: string, fr: string): Bi => ({ en, fr });
export const pick = (b: Bi, fr: boolean) => (fr ? b.fr : b.en);

export type Accent = 'green' | 'navy' | 'gold' | 'teal' | 'bronze';

export interface Kpi { label: Bi; value: string; delta?: string; up?: boolean }
export interface NavItem { label: Bi; href: string; icon: string }
export interface QuickAction { label: Bi; href: string; icon: string; primary?: boolean }
export interface Notif { text: Bi; kind: 'info' | 'success' | 'warn' | 'action'; when: Bi }
export interface ChartBar { label: string; value: number; display: string }
export interface Chart { title: Bi; bars: ChartBar[] }
export interface Certification { status: Bi; note: Bi; progress: number }

export type WidgetKind =
  | 'kpis' | 'quickActions' | 'certification' | 'chart'
  | 'ai' | 'notifications' | 'journeys' | 'solutions' | 'resources';

export interface ProfileDashboard {
  id: string;
  group: Bi;
  icon: string;
  accent: Accent;
  label: Bi;
  badge: Bi;
  title: Bi;
  subtitle: Bi;
  kpis: Kpi[];
  quickActions: QuickAction[];
  nav: NavItem[];
  ai: Bi[];
  notifications: Notif[];
  certification: Certification;
  chart?: Chart;
  recJourneys: string[];
  recSolutions: string[];
  recResources: string[];
  layout: WidgetKind[];
}

// ── Navigation palette (bilingual, reused across profiles) ──
const N = {
  overview: { label: L('Overview', 'Vue d’ensemble'), href: '/app', icon: '▦' },
  journeys: { label: L('Journeys', 'Journeys'), href: '/journeys', icon: '🧭' },
  tools: { label: L('The 63 Tools', 'Les 63 outils'), href: '/tools', icon: '🧰' },
  certification: { label: L('Certification', 'Certification'), href: '/certification', icon: '🎓' },
  cspa: { label: L('C-SPA Diagnostic', 'Diagnostic C-SPA'), href: '/app/cspa', icon: '🧪' },
  intelligence: { label: L('Intelligence & ACRI', 'Intelligence & ACRI'), href: '/intelligence', icon: '📊' },
  solutions: { label: L('Solutions', 'Solutions'), href: '/solutions', icon: '🧩' },
  resources: { label: L('Knowledge Center', 'Centre de connaissances'), href: '/resources', icon: '📚' },
  verify: { label: L('Verify Registry', 'Registre de vérification'), href: '/verify', icon: '✅' },
  champions: { label: L('Champions Program', 'Programme Champions'), href: '/champions', icon: '⭐' },
  journeyDash: { label: L('My Applications', 'Mes candidatures'), href: '/journeys/dashboard', icon: '📋' },
  resourceAdmin: { label: L('Resource CMS', 'CMS Ressources'), href: '/resources/admin', icon: '🗂️' },
  journeyAdmin: { label: L('Journeys Admin', 'Admin Journeys'), href: '/journeys/admin', icon: '🛠️' },
  cspaAdmin: { label: L('C-SPA Admin', 'Admin C-SPA'), href: '/app/admin/cspa', icon: '📈' },
  championAdmin: { label: L('Champions Admin', 'Admin Champions'), href: '/app/admin/champions', icon: '👥' },
} satisfies Record<string, NavItem>;

const notif = (en: string, fr: string, kind: Notif['kind'], whenEn: string, whenFr: string): Notif =>
  ({ text: L(en, fr), kind, when: L(whenEn, whenFr) });

// ── The profiles ─────────────────────────────────────────
export const PROFILES: ProfileDashboard[] = [
  // ════════ ENTERPRISE & LEADERSHIP ════════
  {
    id: 'corporate_executive',
    group: L('Enterprise & Leadership', 'Entreprise & Direction'),
    icon: '🏢', accent: 'green',
    label: L('Corporate Executive', 'Dirigeant·e d’Entreprise'),
    badge: L('Corporate Executive', 'Dirigeant·e d’Entreprise'),
    title: L('Executive Certification Cockpit', 'Cockpit exécutif de certification'),
    subtitle: L('Steer your governance certification and turn accountability into the Authenticity Premium™.',
      'Pilotez votre certification de gouvernance et convertissez la redevabilité en Authenticity Premium™.'),
    kpis: [
      { label: L('C-SPA Score', 'Score C-SPA'), value: '78', delta: '+6', up: true },
      { label: L('Authenticity Premium™', 'Authenticity Premium™'), value: '−240 bps', delta: 'cost of capital', up: true },
      { label: L('Tools Deployed', 'Outils déployés'), value: '17 / 63', delta: '+3', up: true },
      { label: L('Certification', 'Certification'), value: 'Step 3 / 5', delta: 'on track', up: true },
    ],
    quickActions: [
      { label: L('Resume C-SPA', 'Reprendre le C-SPA'), href: '/app/cspa', icon: '🧪', primary: true },
      { label: L('Deploy a tool', 'Déployer un outil'), href: '/tools', icon: '🧰' },
      { label: L('Book assurance review', 'Réserver la revue d’assurance'), href: '/certification', icon: '🎓' },
    ],
    nav: [N.overview, N.cspa, N.certification, N.tools, N.solutions, N.resources],
    ai: [
      L('Which 3 tools most improve my C-SPA weakest section?', 'Quels 3 outils améliorent le plus ma section C-SPA la plus faible ?'),
      L('Estimate my Authenticity Premium™ if I reach a score of 85.', 'Estimez mon Authenticity Premium™ si j’atteins un score de 85.'),
      L('Summarize the 5-step certification pathway for my board.', 'Résumez le parcours de certification en 5 étapes pour mon conseil.'),
    ],
    notifications: [
      notif('Your C-SPA section “Measurement & Accountability” scored 58 — remediation tools suggested.',
        'Votre section C-SPA « Mesure & Redevabilité » a obtenu 58 — outils de remédiation suggérés.', 'warn', '2h', '2 h'),
      notif('Assurance review slot available next week.', 'Créneau de revue d’assurance disponible la semaine prochaine.', 'action', '1d', '1 j'),
      notif('New White Paper: the Authenticity Premium™ repricing model.', 'Nouveau livre blanc : le modèle de repricing de l’Authenticity Premium™.', 'info', '3d', '3 j'),
    ],
    certification: { status: L('In progress — C-SPA passed', 'En cours — C-SPA validé'), note: L('Step 3 of 5 · evidence assembly', 'Étape 3 sur 5 · assemblage des preuves'), progress: 60 },
    chart: { title: L('Governance maturity by pillar', 'Maturité de gouvernance par pilier'), bars: [
      { label: 'I · Foundations', value: 82, display: '82' },
      { label: 'IV · Risk & Territory', value: 71, display: '71' },
      { label: 'V · Ethics', value: 80, display: '80' },
      { label: 'VI · Measurement', value: 58, display: '58' },
    ] },
    recJourneys: ['senegal-esg-practitioner-immersion'],
    recSolutions: ['s1', 's3'],
    recResources: ['authenticity-premium-explained', 'apa-certification-pathway-guide', 'c-spa-diagnostic-implementation-guide'],
    layout: ['kpis', 'quickActions', 'certification', 'chart', 'ai', 'resources', 'notifications'],
  },
  {
    id: 'sme',
    group: L('Enterprise & Leadership', 'Entreprise & Direction'),
    icon: '🚀', accent: 'teal',
    label: L('SME / Startup', 'PME / Startup'),
    badge: L('SME / Startup', 'PME / Startup'),
    title: L('Your Growth & Trust Runway', 'Votre piste de croissance & confiance'),
    subtitle: L('Qualify into certified supplier pipelines and unlock investor-ready trust — right-sized for your team.',
      'Qualifiez-vous dans les pipelines fournisseurs certifiés et débloquez une confiance prête pour les investisseurs.'),
    kpis: [
      { label: L('Certification', 'Certification'), value: 'Step 2 / 5', delta: 'started', up: true },
      { label: L('Audit Shield', 'Audit Shield'), value: '46%', delta: '+12%', up: true },
      { label: L('Projected Premium', 'Prime projetée'), value: '−180 bps', delta: 'if certified', up: true },
      { label: L('Tools Completed', 'Outils complétés'), value: '6 / 63', delta: '+2', up: true },
    ],
    quickActions: [
      { label: L('Start C-SPA (free)', 'Lancer le C-SPA (gratuit)'), href: '/app/cspa', icon: '🧪', primary: true },
      { label: L('SME Integrity Toolkit', 'Boîte à outils PME'), href: '/resources/sme-integrity-pipeline-toolkit', icon: '🧰' },
      { label: L('Find a journey', 'Trouver un parcours'), href: '/journeys', icon: '🧭' },
    ],
    nav: [N.overview, N.cspa, N.certification, N.tools, N.resources, N.journeys],
    ai: [
      L('What is the minimum evidence set for a small team?', 'Quel est l’ensemble minimal de preuves pour une petite équipe ?'),
      L('Match my sector to the right APA solution.', 'Associez mon secteur au bon dispositif APA.'),
      L('How do I qualify as a certified supplier?', 'Comment devenir un fournisseur certifié ?'),
    ],
    notifications: [
      notif('You’re 46% through Audit Shield qualification.', 'Vous êtes à 46 % de la qualification Audit Shield.', 'info', '5h', '5 h'),
      notif('AfCFTA supplier cohort opens in Ghana.', 'La cohorte fournisseurs AfCFTA ouvre au Ghana.', 'action', '2d', '2 j'),
      notif('Tip: assemble evidence during deployment, not after.', 'Astuce : assemblez les preuves pendant le déploiement.', 'info', '4d', '4 j'),
    ],
    certification: { status: L('Step 2 of 5', 'Étape 2 sur 5'), note: L('Right-sized evidence for smaller entities', 'Preuves adaptées aux petites structures'), progress: 40 },
    recJourneys: ['ghana-afcfta-co-architecture-practicum', 'senegal-esg-practitioner-immersion'],
    recSolutions: ['s3', 's5'],
    recResources: ['sme-integrity-pipeline-toolkit', 'apa-certification-pathway-guide', 'creating-shared-value-african-playbook'],
    layout: ['kpis', 'certification', 'quickActions', 'ai', 'journeys', 'resources', 'notifications'],
  },
  {
    id: 'consultant',
    group: L('Enterprise & Leadership', 'Entreprise & Direction'),
    icon: '🧠', accent: 'navy',
    label: L('Consultant', 'Consultant·e'),
    badge: L('Expert Consultant', 'Consultant·e Expert'),
    title: L('Your Advisory Delivery Desk', 'Votre bureau de conseil'),
    subtitle: L('Deploy the APA toolkit across your clients and guide them from diagnostic to certified seal.',
      'Déployez la boîte à outils APA chez vos clients et guidez-les du diagnostic au sceau certifié.'),
    kpis: [
      { label: L('Active Clients', 'Clients actifs'), value: '4', delta: '+1', up: true },
      { label: L('Tools Deployed', 'Outils déployés'), value: '38', delta: '+9', up: true },
      { label: L('Certifications Guided', 'Certifications guidées'), value: '2', delta: 'in review', up: true },
      { label: L('Avg Client Score', 'Score client moyen'), value: '71', delta: '+4', up: true },
    ],
    quickActions: [
      { label: L('Open the toolkit', 'Ouvrir la boîte à outils'), href: '/tools', icon: '🧰', primary: true },
      { label: L('Run a client C-SPA', 'Lancer un C-SPA client'), href: '/app/cspa', icon: '🧪' },
      { label: L('Certification playbooks', 'Playbooks de certification'), href: '/resources', icon: '📚' },
    ],
    nav: [N.overview, N.tools, N.cspa, N.certification, N.solutions, N.resources],
    ai: [
      L('Draft a certification roadmap for a mining client.', 'Rédigez une feuille de route de certification pour un client minier.'),
      L('Which tools fit a public-sector engagement?', 'Quels outils pour une mission secteur public ?'),
      L('Generate a client-ready C-SPA briefing.', 'Générez un briefing C-SPA prêt pour le client.'),
    ],
    notifications: [
      notif('Client “Delta Mining” C-SPA completed — score 74.', 'Client « Delta Mining » : C-SPA terminé — score 74.', 'success', '3h', '3 h'),
      notif('New Implementation Manual: Digital Portfolio.', 'Nouveau manuel : Portefeuille Numérique.', 'info', '1d', '1 j'),
      notif('2 certifications awaiting your evidence review.', '2 certifications en attente de votre revue de preuves.', 'action', '2d', '2 j'),
    ],
    certification: { status: L('Practitioner — accredited', 'Praticien — accrédité'), note: L('Guiding 2 client certifications', 'Guide 2 certifications clients'), progress: 100 },
    recJourneys: ['senegal-esg-practitioner-immersion'],
    recSolutions: ['s1', 's2', 's3'],
    recResources: ['digital-portfolio-evidence-manual', 'c-spa-diagnostic-implementation-guide', 'apa-governance-framework-overview'],
    layout: ['kpis', 'quickActions', 'ai', 'resources', 'solutions', 'notifications'],
  },
  {
    id: 'researcher',
    group: L('Enterprise & Leadership', 'Entreprise & Direction'),
    icon: '🔬', accent: 'bronze',
    label: L('Academic / Researcher', 'Universitaire / Chercheur·se'),
    badge: L('Academic / Researcher', 'Universitaire / Chercheur·se'),
    title: L('Your Research & Evidence Library', 'Votre bibliothèque de recherche & preuves'),
    subtitle: L('Access the methodology, datasets and publications behind the Made-in-Africa Evaluation standard.',
      'Accédez à la méthodologie, aux données et aux publications de l’Évaluation Made-in-Africa.'),
    kpis: [
      { label: L('Resources Read', 'Ressources lues'), value: '23', delta: '+5', up: true },
      { label: L('Research Papers', 'Articles de recherche'), value: '6', delta: 'new', up: true },
      { label: L('Datasets', 'Jeux de données'), value: 'ACRI · MAE', delta: '2', up: true },
      { label: L('Saved Citations', 'Citations enregistrées'), value: '14', delta: '+3', up: true },
    ],
    quickActions: [
      { label: L('Open Knowledge Center', 'Ouvrir le Centre de connaissances'), href: '/resources', icon: '📚', primary: true },
      { label: L('MAE methodology', 'Méthodologie MAE'), href: '/resources/made-in-africa-evaluation-methodology', icon: '🔬' },
      { label: L('ACRI index', 'Indice ACRI'), href: '/intelligence', icon: '📊' },
    ],
    nav: [N.overview, N.resources, N.intelligence, N.tools, N.solutions],
    ai: [
      L('Compare MAE with conventional impact evaluation.', 'Comparez la MAE avec l’évaluation d’impact conventionnelle.'),
      L('Summarize the σ-leakage measurement model.', 'Résumez le modèle de mesure de la fuite σ.'),
      L('List the peer-reviewable research papers.', 'Listez les articles de recherche évaluables par les pairs.'),
    ],
    notifications: [
      notif('New Research Paper: MAE decolonized measurement.', 'Nouvel article : mesure décolonisée MAE.', 'info', '6h', '6 h'),
      notif('State of Trust 2026 dataset updated.', 'Jeu de données État de la Confiance 2026 mis à jour.', 'success', '2d', '2 j'),
      notif('Webinar: repricing African risk for investors.', 'Webinaire : repricing du risque africain.', 'action', '3d', '3 j'),
    ],
    certification: { status: L('Not applicable', 'Non applicable'), note: L('Research & knowledge access', 'Accès recherche & connaissances'), progress: 0 },
    recJourneys: [],
    recSolutions: ['s2'],
    recResources: ['made-in-africa-evaluation-methodology', 'esg-in-africa-2026-state-of-trust', 'radical-transparency-framework'],
    layout: ['kpis', 'quickActions', 'resources', 'ai', 'notifications'],
  },

  // ════════ CAPITAL & INVESTMENT ════════
  {
    id: 'investor',
    group: L('Capital & Investment', 'Capital & Investissement'),
    icon: '💠', accent: 'navy',
    label: L('Investor', 'Investisseur·se'),
    badge: L('Funder / Investor', 'Bailleur / Investisseur'),
    title: L('Investment Intelligence Desk', 'Bureau d’intelligence d’investissement'),
    subtitle: L('Reprice risk with verified governance — the ACRI index, the Authenticity Premium™ and the certified pipeline.',
      'Repricez le risque avec une gouvernance vérifiée — l’indice ACRI, l’Authenticity Premium™ et le pipeline certifié.'),
    kpis: [
      { label: L('Verified Deals', 'Deals vérifiés'), value: '9', delta: '+2', up: true },
      { label: L('Avg Premium Captured', 'Prime moyenne captée'), value: '+310 bps', delta: 'YoY', up: true },
      { label: L('Watchlist', 'Liste de suivi'), value: '14 entities', delta: '+4', up: true },
      { label: L('σ Reduction', 'Réduction σ'), value: '−0.6', delta: 'portfolio', up: true },
    ],
    quickActions: [
      { label: L('Open ACRI intelligence', 'Ouvrir l’intelligence ACRI'), href: '/intelligence', icon: '📊', primary: true },
      { label: L('Verify a certificate', 'Vérifier un certificat'), href: '/verify', icon: '✅' },
      { label: L('Capital gateway solutions', 'Solutions Capital'), href: '/solutions', icon: '🧩' },
    ],
    nav: [N.overview, N.intelligence, N.verify, N.solutions, N.resources, N.journeys],
    ai: [
      L('Rank my 22-nation pipeline by ACRI readiness.', 'Classez mon pipeline de 22 nations par préparation ACRI.'),
      L('Model the premium on a −0.5 σ improvement.', 'Modélisez la prime pour une amélioration σ de −0,5.'),
      L('Which certified entities entered the registry this month?', 'Quelles entités certifiées sont entrées au registre ce mois-ci ?'),
    ],
    notifications: [
      notif('New certified entity in your watchlist sector.', 'Nouvelle entité certifiée dans votre secteur suivi.', 'success', '1h', '1 h'),
      notif('ACRI: Rwanda moved up 2 ranks.', 'ACRI : le Rwanda gagne 2 places.', 'info', '1d', '1 j'),
      notif('Investor webinar replay available.', 'Rediffusion du webinaire investisseurs disponible.', 'action', '2d', '2 j'),
    ],
    certification: { status: L('Verifier role', 'Rôle vérificateur'), note: L('You consume certification — the registry is your assurance', 'Vous consommez la certification — le registre est votre garantie'), progress: 0 },
    chart: { title: L('Portfolio readiness by country (ACRI)', 'Préparation du portefeuille par pays (ACRI)'), bars: [
      { label: 'Rwanda', value: 78, display: '78' },
      { label: 'Ghana', value: 71, display: '71' },
      { label: 'Senegal', value: 69, display: '69' },
      { label: 'Kenya', value: 66, display: '66' },
      { label: 'Nigeria', value: 58, display: '58' },
    ] },
    recJourneys: ['rwanda-sovereign-capital-co-architecture'],
    recSolutions: ['s4', 's2'],
    recResources: ['investor-webinar-repricing-african-risk', 'authenticity-premium-explained', 'esg-in-africa-2026-state-of-trust'],
    layout: ['kpis', 'chart', 'quickActions', 'ai', 'resources', 'notifications'],
  },
  {
    id: 'dfi',
    group: L('Capital & Investment', 'Capital & Investissement'),
    icon: '🏦', accent: 'green',
    label: L('Development Finance Institution', 'Institution de Financement du Développement'),
    badge: L('DFI', 'IFD'),
    title: L('DFI Portfolio & Assurance Desk', 'Portefeuille IFD & bureau d’assurance'),
    subtitle: L('Build certified pipelines, track σ across the portfolio, and de-risk deployment with verified governance.',
      'Construisez des pipelines certifiés, suivez σ sur le portefeuille et dé-risquez le déploiement.'),
    kpis: [
      { label: L('Certified Pipeline', 'Pipeline certifié'), value: '$420M', delta: '+$65M', up: true },
      { label: L('Portfolio Countries', 'Pays du portefeuille'), value: '11', delta: '+1', up: true },
      { label: L('Avg σ (leakage)', 'σ moyen (fuite)'), value: '0.14', delta: '−0.05', up: true },
      { label: L('Assurance Reviews', 'Revues d’assurance'), value: '6 open', delta: 'this Q', up: false },
    ],
    quickActions: [
      { label: L('ACRI country intelligence', 'Intelligence pays ACRI'), href: '/intelligence', icon: '📊', primary: true },
      { label: L('Verify registry', 'Vérifier le registre'), href: '/verify', icon: '✅' },
      { label: L('Co-architecture journeys', 'Journeys de co-architecture'), href: '/journeys/roles/co-architect', icon: '🧭' },
    ],
    nav: [N.overview, N.intelligence, N.verify, N.solutions, N.journeys, N.resources],
    ai: [
      L('Which portfolio countries have the largest verification gap?', 'Quels pays ont le plus grand écart de vérification ?'),
      L('Draft an Authenticity-Premium-linked term sheet.', 'Rédigez une term sheet liée à l’Authenticity Premium™.'),
      L('Summarize σ trends across my portfolio.', 'Résumez les tendances σ de mon portefeuille.'),
    ],
    notifications: [
      notif('Rwanda co-architected deal reached investor readiness.', 'Le deal co-architecturé au Rwanda est prêt pour les investisseurs.', 'success', '4h', '4 h'),
      notif('2 assurance reviews due this week.', '2 revues d’assurance dues cette semaine.', 'warn', '1d', '1 j'),
      notif('New State of Trust report — sector heatmaps.', 'Nouveau rapport État de la Confiance — cartes de chaleur.', 'info', '3d', '3 j'),
    ],
    certification: { status: L('Assurance partner', 'Partenaire d’assurance'), note: L('12 certified entities in portfolio', '12 entités certifiées au portefeuille'), progress: 0 },
    chart: { title: L('Certified pipeline by stage', 'Pipeline certifié par étape'), bars: [
      { label: 'Diagnostic', value: 90, display: '$110M' },
      { label: 'Deployment', value: 70, display: '$140M' },
      { label: 'Verification', value: 45, display: '$95M' },
      { label: 'Certified', value: 35, display: '$75M' },
    ] },
    recJourneys: ['rwanda-sovereign-capital-co-architecture', 'ghana-afcfta-co-architecture-practicum'],
    recSolutions: ['s4', 's2', 's5'],
    recResources: ['rwanda-sovereign-capital-case-study', 'esg-in-africa-2026-state-of-trust', 'authenticity-premium-explained'],
    layout: ['kpis', 'chart', 'quickActions', 'ai', 'journeys', 'notifications'],
  },
  {
    id: 'mdb',
    group: L('Capital & Investment', 'Capital & Investissement'),
    icon: '🌐', accent: 'teal',
    label: L('Multilateral Development Bank', 'Banque Multilatérale de Développement'),
    badge: L('MDB', 'BMD'),
    title: L('Multilateral Trust & Systems Desk', 'Bureau confiance & systèmes multilatéral'),
    subtitle: L('Track continental readiness, systemic σ-suppression and the 10-year systems-change dashboards.',
      'Suivez la préparation continentale, la suppression systémique de σ et les tableaux de bord à 10 ans.'),
    kpis: [
      { label: L('Nations Covered', 'Nations couvertes'), value: '22', delta: 'full set', up: true },
      { label: L('Certified Institutions', 'Institutions certifiées'), value: '58', delta: '+11', up: true },
      { label: L('Continental ACRI', 'ACRI continental'), value: '64 / 100', delta: '+3', up: true },
      { label: L('Systems Dashboards', 'Tableaux systèmes'), value: '7 live', delta: '10-yr', up: true },
    ],
    quickActions: [
      { label: L('ACRI continental view', 'Vue continentale ACRI'), href: '/intelligence', icon: '📊', primary: true },
      { label: L('Policy solutions', 'Solutions politiques'), href: '/solutions', icon: '🧩' },
      { label: L('State of Trust report', 'Rapport État de la Confiance'), href: '/resources/esg-in-africa-2026-state-of-trust', icon: '📄' },
    ],
    nav: [N.overview, N.intelligence, N.solutions, N.resources, N.verify],
    ai: [
      L('Rank the 22 nations by readiness and momentum.', 'Classez les 22 nations par préparation et dynamique.'),
      L('Where is systemic σ-suppression highest?', 'Où la suppression systémique de σ est-elle la plus élevée ?'),
      L('Generate a continental trust briefing.', 'Générez un briefing de confiance continental.'),
    ],
    notifications: [
      notif('West Africa corridor readiness up 4 points.', 'La préparation du corridor Afrique de l’Ouest gagne 4 points.', 'success', '5h', '5 h'),
      notif('New systems-change dashboard published (Ghana).', 'Nouveau tableau de changement systémique (Ghana).', 'info', '2d', '2 j'),
      notif('AfCFTA governance brief available.', 'Note de gouvernance AfCFTA disponible.', 'action', '4d', '4 j'),
    ],
    certification: { status: L('Systemic partner', 'Partenaire systémique'), note: L('Continental oversight — 58 certified institutions', 'Supervision continentale — 58 institutions certifiées'), progress: 0 },
    chart: { title: L('Readiness by region (ACRI)', 'Préparation par région (ACRI)'), bars: [
      { label: 'West', value: 68, display: '68' },
      { label: 'East', value: 71, display: '71' },
      { label: 'Southern', value: 62, display: '62' },
      { label: 'North', value: 59, display: '59' },
      { label: 'Central', value: 51, display: '51' },
    ] },
    recJourneys: ['ghana-afcfta-co-architecture-practicum'],
    recSolutions: ['s2', 's4'],
    recResources: ['esg-in-africa-2026-state-of-trust', 'anatomy-of-a-vanishing-80-billion', 'apa-governance-framework-overview'],
    layout: ['kpis', 'chart', 'quickActions', 'ai', 'resources', 'notifications'],
  },
  {
    id: 'strategic_partner',
    group: L('Capital & Investment', 'Capital & Investissement'),
    icon: '🤝', accent: 'gold',
    label: L('Strategic Partner', 'Partenaire Stratégique'),
    badge: L('Strategic Partner', 'Partenaire Stratégique'),
    title: L('Partnership Growth Desk', 'Bureau de croissance des partenariats'),
    subtitle: L('Co-build the APA ecosystem — joint pipelines, co-branded programs and network expansion.',
      'Co-construisez l’écosystème APA — pipelines conjoints, programmes co-brandés et expansion du réseau.'),
    kpis: [
      { label: L('Joint Pipeline', 'Pipeline conjoint'), value: '$120M', delta: '+$30M', up: true },
      { label: L('Co-branded Programs', 'Programmes co-brandés'), value: '3', delta: '+1', up: true },
      { label: L('MOUs Active', 'Protocoles actifs'), value: '5', delta: 'signed', up: true },
      { label: L('Network Nations', 'Nations réseau'), value: '9', delta: '+2', up: true },
    ],
    quickActions: [
      { label: L('Solutions catalog', 'Catalogue de solutions'), href: '/solutions', icon: '🧩', primary: true },
      { label: L('Co-architecture journeys', 'Journeys co-architecture'), href: '/journeys/roles/co-architect', icon: '🧭' },
      { label: L('Knowledge Center', 'Centre de connaissances'), href: '/resources', icon: '📚' },
    ],
    nav: [N.overview, N.solutions, N.journeys, N.intelligence, N.resources],
    ai: [
      L('Identify co-branding opportunities in East Africa.', 'Identifiez des opportunités de co-branding en Afrique de l’Est.'),
      L('Draft a partnership one-pager for a DFI.', 'Rédigez une fiche de partenariat pour une IFD.'),
      L('Which solutions fit a government MOU?', 'Quelles solutions pour un protocole gouvernemental ?'),
    ],
    notifications: [
      notif('New MOU signed with a West-Africa hub.', 'Nouveau protocole signé avec un hub Afrique de l’Ouest.', 'success', '6h', '6 h'),
      notif('Joint pipeline crossed $120M.', 'Le pipeline conjoint dépasse 120 M$.', 'info', '2d', '2 j'),
      notif('Co-branded certification cohort launching.', 'Lancement d’une cohorte de certification co-brandée.', 'action', '3d', '3 j'),
    ],
    certification: { status: L('Ecosystem partner', 'Partenaire d’écosystème'), note: L('Co-building programs across 9 nations', 'Co-construction de programmes dans 9 nations'), progress: 0 },
    recJourneys: ['rwanda-sovereign-capital-co-architecture', 'ghana-afcfta-co-architecture-practicum'],
    recSolutions: ['s4', 's6'],
    recResources: ['apa-governance-framework-overview', 'authenticity-premium-explained'],
    layout: ['kpis', 'quickActions', 'solutions', 'ai', 'journeys', 'notifications'],
  },

  // ════════ PUBLIC & CIVIL SOCIETY ════════
  {
    id: 'government_official',
    group: L('Public & Civil Society', 'Public & Société Civile'),
    icon: '🏛️', accent: 'navy',
    label: L('Government Official', 'Responsable Gouvernemental'),
    badge: L('Government Official', 'Responsable Gouvernemental'),
    title: L('National Readiness & Policy Desk', 'Bureau préparation nationale & politique'),
    subtitle: L('Track your nation’s ACRI readiness, embed accountability in policy and grow certified institutions.',
      'Suivez la préparation ACRI de votre nation, ancrez la redevabilité dans les politiques et développez les institutions certifiées.'),
    kpis: [
      { label: L('National ACRI Rank', 'Rang ACRI national'), value: '#6 / 22', delta: '+2', up: true },
      { label: L('Certified Entities', 'Entités certifiées'), value: '14', delta: '+5', up: true },
      { label: L('Policy Briefs', 'Notes de politique'), value: '3', delta: 'new', up: true },
      { label: L('Trust Deficit Index', 'Indice de déficit de confiance'), value: '−12%', delta: 'YoY', up: true },
    ],
    quickActions: [
      { label: L('Open ACRI dashboard', 'Ouvrir le tableau ACRI'), href: '/intelligence', icon: '📊', primary: true },
      { label: L('Policy solutions', 'Solutions politiques'), href: '/solutions', icon: '🧩' },
      { label: L('Policy briefs', 'Notes de politique'), href: '/resources', icon: '📄' },
    ],
    nav: [N.overview, N.intelligence, N.solutions, N.resources, N.verify, N.champions],
    ai: [
      L('How does my nation rank across the 7 ACRI criteria?', 'Comment ma nation se classe-t-elle sur les 7 critères ACRI ?'),
      L('Draft concession conditions that embed community accountability.', 'Rédigez des conditions de concession intégrant la redevabilité communautaire.'),
      L('Summarize policy levers to raise certified institutions.', 'Résumez les leviers pour augmenter les institutions certifiées.'),
    ],
    notifications: [
      notif('Your nation moved up 2 ACRI ranks.', 'Votre nation gagne 2 places à l’ACRI.', 'success', '3h', '3 h'),
      notif('New policy brief: mining community accountability.', 'Nouvelle note : redevabilité communautaire minière.', 'info', '1d', '1 j'),
      notif('5 new entities entered certification this quarter.', '5 nouvelles entités en certification ce trimestre.', 'action', '2d', '2 j'),
    ],
    certification: { status: L('Policy enabler', 'Facilitateur de politique'), note: L('Growing certified institutions nationally', 'Développement des institutions certifiées'), progress: 0 },
    chart: { title: L('National ACRI — 7 criteria', 'ACRI national — 7 critères'), bars: [
      { label: 'Governance', value: 72, display: '72' },
      { label: 'Rule of law', value: 65, display: '65' },
      { label: 'Institutions', value: 61, display: '61' },
      { label: 'Digital', value: 70, display: '70' },
      { label: 'Diaspora', value: 58, display: '58' },
    ] },
    recJourneys: ['ghana-afcfta-co-architecture-practicum'],
    recSolutions: ['s2', 's5'],
    recResources: ['policy-brief-mining-community-accountability', 'esg-in-africa-2026-state-of-trust', 'radical-transparency-framework'],
    layout: ['kpis', 'chart', 'quickActions', 'ai', 'resources', 'notifications'],
  },
  {
    id: 'ngo',
    group: L('Public & Civil Society', 'Public & Société Civile'),
    icon: '🕊️', accent: 'teal',
    label: L('NGO / Civil Society', 'ONG / Société Civile'),
    badge: L('NGO / Civil Society', 'ONG / Société Civile'),
    title: L('Impact & Verification Desk', 'Bureau impact & vérification'),
    subtitle: L('Make impact verifiable with Made-in-Africa Evaluation and the Community Verification Portal.',
      'Rendez l’impact vérifiable avec l’Évaluation Made-in-Africa et le Portail de Vérification Communautaire.'),
    kpis: [
      { label: L('Communities Verified', 'Communautés vérifiées'), value: '18', delta: '+4', up: true },
      { label: L('MAE Indicators', 'Indicateurs MAE'), value: '42', delta: '+8', up: true },
      { label: L('Grievances Resolved', 'Griefs résolus'), value: '91%', delta: '+6%', up: true },
      { label: L('Co-signatures', 'Co-signatures'), value: '1,240', delta: '+180', up: true },
    ],
    quickActions: [
      { label: L('CVP toolkit', 'Boîte à outils CVP'), href: '/resources/community-verification-portal-toolkit', icon: '🤝', primary: true },
      { label: L('MAE methodology', 'Méthodologie MAE'), href: '/resources/made-in-africa-evaluation-methodology', icon: '🔬' },
      { label: L('Community journeys', 'Journeys communautaires'), href: '/journeys', icon: '🧭' },
    ],
    nav: [N.overview, N.resources, N.journeys, N.solutions, N.champions],
    ai: [
      L('Design a grievance mechanism for a rural cohort.', 'Concevez un mécanisme de grief pour une cohorte rurale.'),
      L('Which MAE indicators fit a health program?', 'Quels indicateurs MAE pour un programme de santé ?'),
      L('Summarize anti-retaliation safeguards.', 'Résumez les garde-fous anti-représailles.'),
    ],
    notifications: [
      notif('New community cohort onboarded to the CVP.', 'Nouvelle cohorte communautaire intégrée au CVP.', 'success', '2h', '2 h'),
      notif('Grievance resolution rate reached 91%.', 'Le taux de résolution des griefs atteint 91 %.', 'info', '1d', '1 j'),
      notif('MAE workshop scheduled next week.', 'Atelier MAE programmé la semaine prochaine.', 'action', '3d', '3 j'),
    ],
    certification: { status: L('Verification partner', 'Partenaire de vérification'), note: L('18 communities on the CVP', '18 communautés sur le CVP'), progress: 0 },
    chart: { title: L('Verification funnel', 'Entonnoir de vérification'), bars: [
      { label: 'Onboarded', value: 100, display: '18' },
      { label: 'Co-signed', value: 80, display: '15' },
      { label: 'Grievance live', value: 67, display: '12' },
      { label: 'MAE verified', value: 50, display: '9' },
    ] },
    recJourneys: ['ethical-leadership-safari-kenya'],
    recSolutions: ['s5'],
    recResources: ['community-verification-portal-toolkit', 'made-in-africa-evaluation-methodology', 'policy-brief-mining-community-accountability'],
    layout: ['kpis', 'chart', 'quickActions', 'ai', 'resources', 'notifications'],
  },
  {
    id: 'community_leader',
    group: L('Public & Civil Society', 'Public & Société Civile'),
    icon: '🌍', accent: 'green',
    label: L('Community Leader', 'Leader Communautaire'),
    badge: L('Community Leader', 'Leader Communautaire'),
    title: L('Your Community Verification Space', 'Votre espace de vérification communautaire'),
    subtitle: L('Give your community a verifiable voice — co-signature, grievances and narrative sovereignty.',
      'Donnez à votre communauté une voix vérifiable — co-signature, griefs et souveraineté narrative.'),
    kpis: [
      { label: L('Members Engaged', 'Membres engagés'), value: '320', delta: '+45', up: true },
      { label: L('Co-signatures', 'Co-signatures'), value: '212', delta: '+30', up: true },
      { label: L('Open Grievances', 'Griefs ouverts'), value: '4', delta: '−2', up: true },
      { label: L('Projects Watched', 'Projets suivis'), value: '3', delta: 'active', up: true },
    ],
    quickActions: [
      { label: L('CVP toolkit', 'Boîte à outils CVP'), href: '/resources/community-verification-portal-toolkit', icon: '🤝', primary: true },
      { label: L('Become an APA Champion', 'Devenir Champion APA'), href: '/champions', icon: '⭐' },
      { label: L('Community journeys', 'Journeys communautaires'), href: '/journeys', icon: '🧭' },
    ],
    nav: [N.overview, N.resources, N.champions, N.journeys],
    ai: [
      L('Explain narrative sovereignty in simple terms.', 'Expliquez la souveraineté narrative simplement.'),
      L('How do we start co-signature verification?', 'Comment démarrer la vérification par co-signature ?'),
      L('Draft a grievance intake form.', 'Rédigez un formulaire de réception des griefs.'),
    ],
    notifications: [
      notif('45 new members joined your community portal.', '45 nouveaux membres ont rejoint votre portail.', 'success', '4h', '4 h'),
      notif('2 grievances resolved this week.', '2 griefs résolus cette semaine.', 'info', '1d', '1 j'),
      notif('APA Champion applications are open.', 'Les candidatures Champion APA sont ouvertes.', 'action', '2d', '2 j'),
    ],
    certification: { status: L('Community verifier', 'Vérificateur communautaire'), note: L('Narrative sovereignty upheld', 'Souveraineté narrative respectée'), progress: 0 },
    recJourneys: ['ethical-leadership-safari-kenya'],
    recSolutions: ['s5'],
    recResources: ['community-verification-portal-toolkit', 'accountable-africa-podcast-ep1'],
    layout: ['kpis', 'quickActions', 'ai', 'resources', 'notifications'],
  },
  {
    id: 'women_org',
    group: L('Public & Civil Society', 'Public & Société Civile'),
    icon: '♀', accent: 'bronze',
    label: L('Women’s Organization', 'Organisation de Femmes'),
    badge: L('Women’s Organization', 'Organisation de Femmes'),
    title: L('Women’s Leadership & Equity Desk', 'Bureau leadership & équité des femmes'),
    subtitle: L('Advance parity mandates, women-led verification and equitable value distribution.',
      'Faites avancer les mandats de parité, la vérification menée par des femmes et la distribution équitable de la valeur.'),
    kpis: [
      { label: L('Women Facilitators', 'Facilitatrices'), value: '26', delta: '+7', up: true },
      { label: L('Parity Mandates', 'Mandats de parité'), value: '9', delta: '+2', up: true },
      { label: L('Communities Led', 'Communautés dirigées'), value: '11', delta: '+3', up: true },
      { label: L('Equity Score', 'Score d’équité'), value: '74', delta: '+8', up: true },
    ],
    quickActions: [
      { label: L('Kinship equity playbook', 'Playbook équité de parenté'), href: '/resources/creating-shared-value-african-playbook', icon: '📚', primary: true },
      { label: L('Become an APA Champion', 'Devenir Championne APA'), href: '/champions', icon: '⭐' },
      { label: L('Leadership journeys', 'Journeys de leadership'), href: '/journeys', icon: '🧭' },
    ],
    nav: [N.overview, N.champions, N.journeys, N.resources, N.solutions],
    ai: [
      L('How do parity committees work in APA mandates?', 'Comment fonctionnent les comités de parité dans les mandats APA ?'),
      L('Design a women-led verification cohort.', 'Concevez une cohorte de vérification menée par des femmes.'),
      L('Summarize equitable value-distribution instruments.', 'Résumez les instruments de distribution équitable de la valeur.'),
    ],
    notifications: [
      notif('7 new women facilitators certified.', '7 nouvelles facilitatrices certifiées.', 'success', '5h', '5 h'),
      notif('Parity mandate adopted by a partner cooperative.', 'Mandat de parité adopté par une coopérative partenaire.', 'info', '2d', '2 j'),
      notif('Leadership journey cohort forming.', 'Cohorte de journey leadership en formation.', 'action', '3d', '3 j'),
    ],
    certification: { status: L('Equity partner', 'Partenaire d’équité'), note: L('Advancing parity across 11 communities', 'Progression de la parité dans 11 communautés'), progress: 0 },
    recJourneys: ['ethical-leadership-safari-kenya'],
    recSolutions: ['s5', 's1'],
    recResources: ['creating-shared-value-african-playbook', 'ethical-leadership-masterclass-video'],
    layout: ['kpis', 'quickActions', 'ai', 'journeys', 'resources', 'notifications'],
  },
  {
    id: 'youth_leader',
    group: L('Public & Civil Society', 'Public & Société Civile'),
    icon: '⚡', accent: 'gold',
    label: L('Youth Leader', 'Leader Jeunesse'),
    badge: L('Youth Leader', 'Leader Jeunesse'),
    title: L('Next-Generation Accountability Hub', 'Hub de redevabilité nouvelle génération'),
    subtitle: L('Build skills, join journeys and lead the next cohort of verifiable African governance.',
      'Développez vos compétences, rejoignez des journeys et menez la prochaine génération de gouvernance vérifiable.'),
    kpis: [
      { label: L('Learning Paths', 'Parcours d’apprentissage'), value: '2 active', delta: '+1', up: true },
      { label: L('Skills Earned', 'Compétences acquises'), value: '5', delta: '+2', up: true },
      { label: L('Journeys Applied', 'Journeys candidatés'), value: '1', delta: 'pending', up: true },
      { label: L('Network', 'Réseau'), value: '87 peers', delta: '+20', up: true },
    ],
    quickActions: [
      { label: L('Start a learning path', 'Démarrer un parcours'), href: '/resources', icon: '📚', primary: true },
      { label: L('Browse youth journeys', 'Explorer les journeys jeunesse'), href: '/journeys', icon: '🧭' },
      { label: L('Become an APA Champion', 'Devenir Champion APA'), href: '/champions', icon: '⭐' },
    ],
    nav: [N.overview, N.resources, N.journeys, N.champions],
    ai: [
      L('Recommend a beginner learning path in governance.', 'Recommandez un parcours débutant en gouvernance.'),
      L('Which journey fits a first-time participant?', 'Quel journey pour un premier participant ?'),
      L('Explain the Authenticity Premium™ simply.', 'Expliquez l’Authenticity Premium™ simplement.'),
    ],
    notifications: [
      notif('You unlocked the “Governance Foundations” path.', 'Vous avez débloqué le parcours « Fondations de gouvernance ».', 'success', '3h', '3 h'),
      notif('Youth cohort forming for a Kenya journey.', 'Cohorte jeunesse en formation pour un journey au Kenya.', 'action', '1d', '1 j'),
      notif('New Short: Africa has a proof problem.', 'Nouveau court : l’Afrique a un problème de preuve.', 'info', '2d', '2 j'),
    ],
    certification: { status: L('Emerging leader', 'Leader émergent·e'), note: L('2 learning paths in progress', '2 parcours en cours'), progress: 30 },
    recJourneys: ['ethical-leadership-safari-kenya', 'senegal-esg-practitioner-immersion'],
    recSolutions: ['s1'],
    recResources: ['accountable-africa-podcast-ep1', 'africa-has-a-proof-problem', 'apa-governance-framework-overview'],
    layout: ['kpis', 'certification', 'quickActions', 'ai', 'journeys', 'notifications'],
  },

  // ════════ APA NETWORK ════════
  {
    id: 'champion',
    group: L('APA Network', 'Réseau APA'),
    icon: '⭐', accent: 'gold',
    label: L('APA Champion', 'Champion APA'),
    badge: L('APA National Champion', 'Champion National APA'),
    title: L('Champion Command Center', 'Centre de commandement Champion'),
    subtitle: L('Lead APA accountability in your nation — recruit, facilitate and grow certified institutions.',
      'Portez la redevabilité APA dans votre nation — recrutez, facilitez et développez les institutions certifiées.'),
    kpis: [
      { label: L('Nation', 'Nation'), value: 'Senegal', delta: 'active', up: true },
      { label: L('Entities Engaged', 'Entités engagées'), value: '23', delta: '+6', up: true },
      { label: L('Sessions Led', 'Sessions menées'), value: '14', delta: '+3', up: true },
      { label: L('Certifications', 'Certifications'), value: '5', delta: '+2', up: true },
    ],
    quickActions: [
      { label: L('Champion program', 'Programme Champion'), href: '/champions', icon: '⭐', primary: true },
      { label: L('Facilitate a journey', 'Faciliter un journey'), href: '/journeys/admin', icon: '🧭' },
      { label: L('Deploy tools', 'Déployer des outils'), href: '/tools', icon: '🧰' },
    ],
    nav: [N.overview, N.champions, N.journeys, N.tools, N.resources, N.certification],
    ai: [
      L('Draft an outreach plan for 10 SMEs in my region.', 'Rédigez un plan de prospection pour 10 PME de ma région.'),
      L('Which tools should a new cohort start with?', 'Par quels outils une nouvelle cohorte doit-elle commencer ?'),
      L('Summarize my nation’s certification momentum.', 'Résumez la dynamique de certification de ma nation.'),
    ],
    notifications: [
      notif('2 new entities reached certification review.', '2 nouvelles entités en revue de certification.', 'success', '2h', '2 h'),
      notif('Your facilitation cohort starts Monday.', 'Votre cohorte de facilitation commence lundi.', 'action', '1d', '1 j'),
      notif('New champion joined your regional hub.', 'Un nouveau champion a rejoint votre hub régional.', 'info', '3d', '3 j'),
    ],
    certification: { status: L('Certified Champion', 'Champion certifié'), note: L('Active in Senegal · regional hub lead', 'Actif au Sénégal · référent hub régional'), progress: 100 },
    chart: { title: L('Pipeline this quarter', 'Pipeline ce trimestre'), bars: [
      { label: 'Engaged', value: 100, display: '23' },
      { label: 'Diagnostic', value: 65, display: '15' },
      { label: 'Deploying', value: 39, display: '9' },
      { label: 'Certified', value: 22, display: '5' },
    ] },
    recJourneys: ['senegal-esg-practitioner-immersion'],
    recSolutions: ['s3', 's5'],
    recResources: ['apa-certification-pathway-guide', 'apa-governance-framework-overview'],
    layout: ['kpis', 'chart', 'quickActions', 'ai', 'resources', 'notifications'],
  },
  {
    id: 'facilitator',
    group: L('APA Network', 'Réseau APA'),
    icon: '🎤', accent: 'teal',
    label: L('Facilitator', 'Facilitateur·rice'),
    badge: L('Journey Facilitator', 'Facilitateur·rice de Journey'),
    title: L('Facilitation Studio', 'Studio de facilitation'),
    subtitle: L('Run journeys and learning paths — cohorts, materials and participant progress in one place.',
      'Animez journeys et parcours — cohortes, supports et progression des participants au même endroit.'),
    kpis: [
      { label: L('Active Cohorts', 'Cohortes actives'), value: '3', delta: '+1', up: true },
      { label: L('Learners', 'Apprenants'), value: '48', delta: '+12', up: true },
      { label: L('Avg Rating', 'Note moyenne'), value: '4.8', delta: '+0.1', up: true },
      { label: L('Completion', 'Complétion'), value: '86%', delta: '+4%', up: true },
    ],
    quickActions: [
      { label: L('Journeys admin', 'Admin Journeys'), href: '/journeys/admin', icon: '🛠️', primary: true },
      { label: L('Learning paths', 'Parcours d’apprentissage'), href: '/resources', icon: '📚' },
      { label: L('Facilitation resources', 'Ressources de facilitation'), href: '/resources/ethical-leadership-masterclass-video', icon: '🎥' },
    ],
    nav: [N.overview, N.journeyAdmin, N.journeys, N.resources, N.tools],
    ai: [
      L('Build a 5-day agenda for a Practitioner cohort.', 'Construisez un agenda de 5 jours pour une cohorte Practitioner.'),
      L('Suggest icebreakers for a community interface day.', 'Proposez des brise-glace pour une journée d’interface communautaire.'),
      L('Summarize feedback themes from my last cohort.', 'Résumez les thèmes de feedback de ma dernière cohorte.'),
    ],
    notifications: [
      notif('New cohort of 12 learners enrolled.', 'Nouvelle cohorte de 12 apprenants inscrite.', 'success', '4h', '4 h'),
      notif('Cohort feedback: 4.8/5 average.', 'Feedback cohorte : 4,8/5 en moyenne.', 'info', '1d', '1 j'),
      notif('Journey materials updated for Q3.', 'Supports de journey mis à jour pour le T3.', 'action', '2d', '2 j'),
    ],
    certification: { status: L('Accredited Facilitator', 'Facilitateur accrédité'), note: L('3 active cohorts', '3 cohortes actives'), progress: 100 },
    recJourneys: ['ethical-leadership-safari-kenya', 'senegal-esg-practitioner-immersion'],
    recSolutions: ['s1'],
    recResources: ['ethical-leadership-masterclass-video', 'apa-governance-framework-overview'],
    layout: ['kpis', 'quickActions', 'ai', 'journeys', 'notifications'],
  },
  {
    id: 'master_trainer',
    group: L('APA Network', 'Réseau APA'),
    icon: '🏆', accent: 'gold',
    label: L('Master Trainer', 'Formateur·rice Master'),
    badge: L('Master Trainer', 'Formateur·rice Master'),
    title: L('Master Training Academy', 'Académie de formation Master'),
    subtitle: L('Certify facilitators, own the curriculum and scale APA capability across nations.',
      'Certifiez des facilitateurs, pilotez le curriculum et déployez la capacité APA à travers les nations.'),
    kpis: [
      { label: L('Facilitators Certified', 'Facilitateurs certifiés'), value: '31', delta: '+6', up: true },
      { label: L('Nations Reached', 'Nations atteintes'), value: '8', delta: '+2', up: true },
      { label: L('Curriculum Modules', 'Modules du curriculum'), value: '24', delta: '+3', up: true },
      { label: L('Trainer NPS', 'NPS formateurs'), value: '72', delta: '+5', up: true },
    ],
    quickActions: [
      { label: L('Curriculum (CMS)', 'Curriculum (CMS)'), href: '/resources/admin', icon: '🗂️', primary: true },
      { label: L('Journeys admin', 'Admin Journeys'), href: '/journeys/admin', icon: '🛠️' },
      { label: L('Learning paths', 'Parcours d’apprentissage'), href: '/resources', icon: '📚' },
    ],
    nav: [N.overview, N.resourceAdmin, N.journeyAdmin, N.resources, N.tools],
    ai: [
      L('Design a train-the-trainer certification module.', 'Concevez un module de certification de formateurs.'),
      L('Which curriculum gaps should I prioritize?', 'Quelles lacunes du curriculum prioriser ?'),
      L('Draft assessment rubrics for facilitators.', 'Rédigez des grilles d’évaluation pour facilitateurs.'),
    ],
    notifications: [
      notif('6 facilitators completed certification.', '6 facilitateurs ont terminé la certification.', 'success', '5h', '5 h'),
      notif('Curriculum module 24 published.', 'Module 24 du curriculum publié.', 'info', '2d', '2 j'),
      notif('New nation onboarded: Ethiopia.', 'Nouvelle nation intégrée : Éthiopie.', 'action', '3d', '3 j'),
    ],
    certification: { status: L('Master Trainer', 'Formateur Master'), note: L('Owns the facilitation curriculum', 'Pilote le curriculum de facilitation'), progress: 100 },
    recJourneys: ['senegal-esg-practitioner-immersion'],
    recSolutions: ['s1'],
    recResources: ['apa-governance-framework-overview', 'c-spa-diagnostic-implementation-guide'],
    layout: ['kpis', 'quickActions', 'ai', 'resources', 'notifications'],
  },
  {
    id: 'global_auditor',
    group: L('APA Network', 'Réseau APA'),
    icon: '🛡️', accent: 'navy',
    label: L('Global Auditor', 'Auditeur·rice Global'),
    badge: L('Global Auditor', 'Auditeur·rice Global'),
    title: L('Assurance & Audit Command', 'Commandement assurance & audit'),
    subtitle: L('Review evidence, run trust audits and uphold the integrity of the certified seal.',
      'Examinez les preuves, menez des audits de confiance et garantissez l’intégrité du sceau certifié.'),
    kpis: [
      { label: L('Audits Completed', 'Audits réalisés'), value: '46', delta: '+8', up: true },
      { label: L('Pass Rate', 'Taux de réussite'), value: '73%', delta: '+2%', up: true },
      { label: L('Pending Reviews', 'Revues en attente'), value: '7', delta: 'queue', up: false },
      { label: L('Seals Revoked', 'Sceaux révoqués'), value: '2', delta: 'integrity', up: true },
    ],
    quickActions: [
      { label: L('C-SPA admin', 'Admin C-SPA'), href: '/app/admin/cspa', icon: '📈', primary: true },
      { label: L('Verify registry', 'Vérifier le registre'), href: '/verify', icon: '✅' },
      { label: L('Digital Portfolio manual', 'Manuel Portefeuille Numérique'), href: '/resources/digital-portfolio-evidence-manual', icon: '📄' },
    ],
    nav: [N.overview, N.cspaAdmin, N.verify, N.tools, N.resources],
    ai: [
      L('Flag evidence gaps in a submitted portfolio.', 'Signalez les lacunes de preuves dans un portefeuille soumis.'),
      L('Summarize the assurance review checklist.', 'Résumez la checklist de revue d’assurance.'),
      L('Which sections most often fail the gate?', 'Quelles sections échouent le plus souvent à la porte ?'),
    ],
    notifications: [
      notif('7 portfolios awaiting your assurance review.', '7 portefeuilles en attente de votre revue.', 'warn', '1h', '1 h'),
      notif('Seal revoked after failed re-audit.', 'Sceau révoqué après échec de ré-audit.', 'info', '1d', '1 j'),
      notif('Updated evidence standard published.', 'Nouveau standard de preuves publié.', 'action', '3d', '3 j'),
    ],
    certification: { status: L('Global Auditor', 'Auditeur Global'), note: L('Guardian of seal integrity', 'Garant de l’intégrité du sceau'), progress: 100 },
    chart: { title: L('Audit outcomes (last 30)', 'Résultats d’audit (30 derniers)'), bars: [
      { label: 'Passed', value: 73, display: '22' },
      { label: 'Remediation', value: 20, display: '6' },
      { label: 'Failed', value: 7, display: '2' },
    ] },
    recJourneys: [],
    recSolutions: ['s3'],
    recResources: ['digital-portfolio-evidence-manual', 'c-spa-diagnostic-implementation-guide', 'apa-certification-pathway-guide'],
    layout: ['kpis', 'chart', 'quickActions', 'ai', 'notifications'],
  },
  {
    id: 'advisory_board',
    group: L('APA Network', 'Réseau APA'),
    icon: '🎯', accent: 'bronze',
    label: L('Advisory Board Member', 'Membre du Conseil Consultatif'),
    badge: L('Global Advisory Board', 'Conseil Consultatif Mondial'),
    title: L('Board & Strategy Room', 'Salle du conseil & stratégie'),
    subtitle: L('Steer APA strategy — continental performance, systemic risks and the decisions that shape the standard.',
      'Orientez la stratégie APA — performance continentale, risques systémiques et décisions qui façonnent le standard.'),
    kpis: [
      { label: L('Continental ACRI', 'ACRI continental'), value: '64 / 100', delta: '+3', up: true },
      { label: L('Certified Institutions', 'Institutions certifiées'), value: '58', delta: '+11', up: true },
      { label: L('Nations Live', 'Nations actives'), value: '22', delta: 'full', up: true },
      { label: L('Board Papers', 'Documents du conseil'), value: '4', delta: 'to review', up: false },
    ],
    quickActions: [
      { label: L('Continental intelligence', 'Intelligence continentale'), href: '/intelligence', icon: '📊', primary: true },
      { label: L('Strategy resources', 'Ressources stratégie'), href: '/resources', icon: '📚' },
      { label: L('Verify registry', 'Vérifier le registre'), href: '/verify', icon: '✅' },
    ],
    nav: [N.overview, N.intelligence, N.resources, N.solutions, N.verify],
    ai: [
      L('Summarize continental performance for the board.', 'Résumez la performance continentale pour le conseil.'),
      L('What systemic risks should we prioritize?', 'Quels risques systémiques prioriser ?'),
      L('Draft a strategic brief on the $80B deficit.', 'Rédigez une note stratégique sur le déficit de 80 Md$.'),
    ],
    notifications: [
      notif('Q3 board pack ready for review.', 'Dossier du conseil T3 prêt.', 'action', '6h', '6 h'),
      notif('Continental ACRI improved 3 points.', 'L’ACRI continental progresse de 3 points.', 'success', '2d', '2 j'),
      notif('New flagship investigation published.', 'Nouvelle investigation phare publiée.', 'info', '3d', '3 j'),
    ],
    certification: { status: L('Board oversight', 'Supervision du conseil'), note: L('Steering the APA standard', 'Orientation du standard APA'), progress: 0 },
    chart: { title: L('Strategic KPIs (index)', 'KPI stratégiques (indice)'), bars: [
      { label: 'Readiness', value: 64, display: '64' },
      { label: 'Certifications', value: 72, display: '72' },
      { label: 'Network', value: 81, display: '81' },
      { label: 'Trust deficit ↓', value: 68, display: '68' },
    ] },
    recJourneys: [],
    recSolutions: ['s2', 's4'],
    recResources: ['anatomy-of-a-vanishing-80-billion', 'esg-in-africa-2026-state-of-trust', 'apa-governance-framework-overview'],
    layout: ['kpis', 'chart', 'quickActions', 'ai', 'resources', 'notifications'],
  },
  {
    id: 'administrator',
    group: L('APA Network', 'Réseau APA'),
    icon: '⚙️', accent: 'navy',
    label: L('Administrator', 'Administrateur·rice'),
    badge: L('APA Administrator', 'Administrateur·rice APA'),
    title: L('Platform Administration', 'Administration de la plateforme'),
    subtitle: L('Operate the platform — users, certifications, applications, content and analytics across the ecosystem.',
      'Opérez la plateforme — utilisateurs, certifications, candidatures, contenu et analytique de l’écosystème.'),
    kpis: [
      { label: L('Total Users', 'Utilisateurs totaux'), value: '2,480', delta: '+140', up: true },
      { label: L('Certified Entities', 'Entités certifiées'), value: '58', delta: '+11', up: true },
      { label: L('Applications Pending', 'Candidatures en attente'), value: '19', delta: 'queue', up: false },
      { label: L('C-SPA Runs', 'Diagnostics C-SPA'), value: '612', delta: '+48', up: true },
    ],
    quickActions: [
      { label: L('Champions admin', 'Admin Champions'), href: '/app/admin/champions', icon: '👥', primary: true },
      { label: L('C-SPA admin', 'Admin C-SPA'), href: '/app/admin/cspa', icon: '📈' },
      { label: L('Resource CMS', 'CMS Ressources'), href: '/resources/admin', icon: '🗂️' },
    ],
    nav: [N.overview, N.championAdmin, N.cspaAdmin, N.resourceAdmin, N.journeyAdmin, N.intelligence],
    ai: [
      L('Summarize platform activity this week.', 'Résumez l’activité de la plateforme cette semaine.'),
      L('Which applications need attention first?', 'Quelles candidatures traiter en priorité ?'),
      L('Generate an executive KPI digest.', 'Générez un condensé de KPI exécutifs.'),
    ],
    notifications: [
      notif('19 applications awaiting review.', '19 candidatures en attente de revue.', 'warn', '30m', '30 min'),
      notif('140 new sign-ups this week.', '140 nouvelles inscriptions cette semaine.', 'success', '1d', '1 j'),
      notif('Content scheduled: 3 publications this week.', 'Contenu programmé : 3 publications cette semaine.', 'info', '2d', '2 j'),
    ],
    certification: { status: L('Administrator', 'Administrateur'), note: L('Full platform operations', 'Opérations complètes de la plateforme'), progress: 0 },
    chart: { title: L('Platform activity (7 days)', 'Activité plateforme (7 jours)'), bars: [
      { label: 'Sign-ups', value: 70, display: '140' },
      { label: 'C-SPA runs', value: 55, display: '48' },
      { label: 'Applications', value: 40, display: '19' },
      { label: 'Downloads', value: 85, display: '1.2k' },
    ] },
    recJourneys: [],
    recSolutions: [],
    recResources: ['apa-governance-framework-overview'],
    layout: ['kpis', 'chart', 'quickActions', 'ai', 'notifications'],
  },

  // Default fallback for prospective participants
  {
    id: 'participant',
    group: L('Getting Started', 'Pour commencer'),
    icon: '🧭', accent: 'green',
    label: L('Prospective Participant', 'Participant potentiel'),
    badge: L('Prospective Participant', 'Participant potentiel'),
    title: L('Your Journey Hub', 'Votre espace Journeys'),
    subtitle: L('Discover curated African journeys, apply and track your submissions from one place.',
      'Découvrez des parcours africains, candidatez et suivez vos dossiers depuis un seul endroit.'),
    kpis: [
      { label: L('Journeys Open', 'Journeys ouverts'), value: '4', delta: 'now', up: true },
      { label: L('Applications', 'Candidatures'), value: '0', delta: 'start one', up: true },
      { label: L('Saved', 'Enregistrés'), value: '0', delta: '—', up: true },
      { label: L('Learning Paths', 'Parcours'), value: '5', delta: 'available', up: true },
    ],
    quickActions: [
      { label: L('Find your journey', 'Trouver mon parcours'), href: '/journeys', icon: '🧭', primary: true },
      { label: L('My applications', 'Mes candidatures'), href: '/journeys/dashboard', icon: '📋' },
      { label: L('Knowledge Center', 'Centre de connaissances'), href: '/resources', icon: '📚' },
    ],
    nav: [N.overview, N.journeys, N.journeyDash, N.resources, N.certification],
    ai: [
      L('Which journey fits a first-time participant?', 'Quel journey pour un premier participant ?'),
      L('Explain the three journey roles.', 'Expliquez les trois rôles de journey.'),
      L('Recommend a learning path to start.', 'Recommandez un parcours pour débuter.'),
    ],
    notifications: [
      notif('4 journeys are open across 22 nations.', '4 journeys sont ouverts dans 22 nations.', 'info', '1h', '1 h'),
      notif('Set a journey alert to be notified first.', 'Créez une alerte pour être notifié en premier.', 'action', '1d', '1 j'),
      notif('New podcast: Africa has a proof problem.', 'Nouveau podcast : l’Afrique a un problème de preuve.', 'success', '2d', '2 j'),
    ],
    certification: { status: L('Not started', 'Non démarré'), note: L('Begin with a journey or the C-SPA', 'Commencez par un journey ou le C-SPA'), progress: 0 },
    recJourneys: ['ethical-leadership-safari-kenya', 'senegal-esg-practitioner-immersion'],
    recSolutions: ['s1'],
    recResources: ['apa-governance-framework-overview', 'accountable-africa-podcast-ep1'],
    layout: ['kpis', 'quickActions', 'journeys', 'ai', 'resources', 'notifications'],
  },
];

export const PROFILE_MAP = new Map(PROFILES.map((p) => [p.id, p]));

/** Ordered list for the Demo Switcher (grouped). */
export const SWITCHER_ORDER = PROFILES.map((p) => p.id);

/** Map a sign-up relationship id → a full profile. */
const RELATIONSHIP_TO_PROFILE: Record<string, string> = {
  prospective_participant: 'participant',
  business_partner: 'corporate_executive',
  funder_investor: 'investor',
  government_ngo: 'government_official',
  community_partner: 'community_leader',
  team_administrator: 'administrator',
  team_bizdev: 'strategic_partner',
  team_data_analyst: 'administrator',
  team_project_manager: 'facilitator',
  team_consultant: 'consultant',
  team_trainer: 'master_trainer',
  team_local_lead: 'champion',
  team_auditor: 'global_auditor',
  journey_alumni: 'facilitator',
};

export function profileForRelationship(relationshipId: string | null | undefined): ProfileDashboard {
  const id = relationshipId ? RELATIONSHIP_TO_PROFILE[relationshipId] : undefined;
  return (id && PROFILE_MAP.get(id)) || PROFILE_MAP.get('participant')!;
}

export function profileById(id: string | null | undefined): ProfileDashboard | undefined {
  return id ? PROFILE_MAP.get(id) : undefined;
}
