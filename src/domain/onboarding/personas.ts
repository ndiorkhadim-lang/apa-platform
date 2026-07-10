/**
 * APA onboarding taxonomy — "What is your relationship or interest with APA?"
 *
 * The selection captured at sign-up is a PERSONALIZATION signal, not an
 * authorization grant: it tailors the dashboard and next steps. It NEVER
 * elevates privileges. Team-member / administrator access is granted only by
 * an APA admin (platformRole), so choosing "APA Administrator" here just
 * personalizes onboarding and marks team tooling as "verification pending".
 */

// ── Relationship options (grouped exactly like the onboarding selector) ──
export type PersonaKey =
  | 'PARTICIPANT'
  | 'PARTNER'
  | 'INVESTOR'
  | 'GOVERNMENT'
  | 'COMMUNITY'
  | 'TEAM'
  | 'ALUMNI';

export interface RelationshipOption {
  id: string; // stored on the user (apaRelationship)
  labelEn: string;
  labelFr: string;
  hintEn: string;
  hintFr: string;
  persona: PersonaKey;
  /** Team roles require APA verification before privileged access. */
  requiresVerification?: boolean;
}

export interface RelationshipGroup {
  labelEn: string;
  labelFr: string;
  options: RelationshipOption[];
}

/** Flat default shown first (matches the screenshot). */
export const DEFAULT_RELATIONSHIP = 'prospective_participant';

export const RELATIONSHIP_GROUPS: RelationshipGroup[] = [
  {
    labelEn: '', labelFr: '',
    options: [
      {
        id: 'prospective_participant',
        labelEn: 'Prospective Participant', labelFr: 'Participant potentiel',
        hintEn: 'Apply for transformative, curated African journeys and track your submission status.',
        hintFr: 'Candidatez à des parcours africains transformateurs et suivez le statut de votre dossier.',
        persona: 'PARTICIPANT',
      },
    ],
  },
  {
    labelEn: 'APA Partner', labelFr: 'Partenaire APA',
    options: [
      {
        id: 'business_partner',
        labelEn: 'Business / Corporate Partner', labelFr: 'Partenaire Entreprise',
        hintEn: 'Certify your governance, deploy the 63 tools and earn the Authenticity Premium™.',
        hintFr: 'Certifiez votre gouvernance, déployez les 63 outils et gagnez l’Authenticity Premium™.',
        persona: 'PARTNER',
      },
      {
        id: 'funder_investor',
        labelEn: 'Funder / Investor', labelFr: 'Bailleur / Investisseur',
        hintEn: 'Access verified governance intelligence, the ACRI index and the certified deal pipeline.',
        hintFr: 'Accédez à l’intelligence de gouvernance vérifiée, à l’indice ACRI et au pipeline certifié.',
        persona: 'INVESTOR',
      },
      {
        id: 'government_ngo',
        labelEn: 'Government / NGO Partner', labelFr: 'Partenaire Gouvernement / ONG',
        hintEn: 'Explore national readiness, policy solutions and territory-level accountability.',
        hintFr: 'Explorez la préparation nationale, les solutions politiques et la redevabilité territoriale.',
        persona: 'GOVERNMENT',
      },
      {
        id: 'community_partner',
        labelEn: 'Community Partner', labelFr: 'Partenaire Communautaire',
        hintEn: 'Join the Community Verification Portal and make local impact verifiable.',
        hintFr: 'Rejoignez le Portail de Vérification Communautaire et rendez l’impact local vérifiable.',
        persona: 'COMMUNITY',
      },
    ],
  },
  {
    labelEn: 'APA Team Member (APAer)', labelFr: 'Membre de l’équipe APA (APAer)',
    options: [
      {
        id: 'team_administrator',
        labelEn: 'APA Administrator', labelFr: 'Administrateur APA',
        hintEn: 'Team access to admin consoles — activated after APA verifies your identity.',
        hintFr: 'Accès équipe aux consoles admin — activé après vérification de votre identité par APA.',
        persona: 'TEAM', requiresVerification: true,
      },
      {
        id: 'team_bizdev',
        labelEn: 'Business Development Manager', labelFr: 'Responsable Développement',
        hintEn: 'Partner pipeline, solutions and outreach — team access after verification.',
        hintFr: 'Pipeline partenaires, solutions et prospection — accès équipe après vérification.',
        persona: 'TEAM', requiresVerification: true,
      },
      {
        id: 'team_data_analyst',
        labelEn: 'Data Analyst', labelFr: 'Analyste de Données',
        hintEn: 'ACRI, dashboards and measurement — team access after verification.',
        hintFr: 'ACRI, tableaux de bord et mesure — accès équipe après vérification.',
        persona: 'TEAM', requiresVerification: true,
      },
      {
        id: 'team_project_manager',
        labelEn: 'Project Manager', labelFr: 'Chef de Projet',
        hintEn: 'Journeys, deployments and delivery — team access after verification.',
        hintFr: 'Parcours, déploiements et livraison — accès équipe après vérification.',
        persona: 'TEAM', requiresVerification: true,
      },
      {
        id: 'team_consultant',
        labelEn: 'Expert Consultant', labelFr: 'Consultant Expert',
        hintEn: 'Framework, tools and advisory — team access after verification.',
        hintFr: 'Framework, outils et conseil — accès équipe après vérification.',
        persona: 'TEAM', requiresVerification: true,
      },
      {
        id: 'team_trainer',
        labelEn: 'Trainer / Facilitator', labelFr: 'Formateur / Facilitateur',
        hintEn: 'Learning paths, journeys and facilitation — team access after verification.',
        hintFr: 'Parcours d’apprentissage, journeys et facilitation — accès équipe après vérification.',
        persona: 'TEAM', requiresVerification: true,
      },
      {
        id: 'team_local_lead',
        labelEn: 'Local Partner Lead', labelFr: 'Référent Partenaire Local',
        hintEn: 'National champion network and local deployment — team access after verification.',
        hintFr: 'Réseau de champions nationaux et déploiement local — accès équipe après vérification.',
        persona: 'TEAM', requiresVerification: true,
      },
      {
        id: 'team_auditor',
        labelEn: 'Auditor / Assessor', labelFr: 'Auditeur / Évaluateur',
        hintEn: 'Trust audits and assurance reviews — team access after verification.',
        hintFr: 'Audits de confiance et revues d’assurance — accès équipe après vérification.',
        persona: 'TEAM', requiresVerification: true,
      },
    ],
  },
  {
    labelEn: '', labelFr: '',
    options: [
      {
        id: 'journey_alumni',
        labelEn: 'APA Journey Alumni', labelFr: 'Ancien·ne des Journeys APA',
        hintEn: 'Reconnect with your cohort, continue learning paths and access alumni resources.',
        hintFr: 'Retrouvez votre cohorte, poursuivez vos parcours et accédez aux ressources anciens.',
        persona: 'ALUMNI',
      },
    ],
  },
];

const ALL_OPTIONS = RELATIONSHIP_GROUPS.flatMap((g) => g.options);

export function relationshipById(id: string | null | undefined): RelationshipOption {
  return ALL_OPTIONS.find((o) => o.id === id) ?? ALL_OPTIONS[0];
}

// ── Interest areas (personalization step) ────────────────
export interface InterestArea {
  id: string;
  labelEn: string;
  labelFr: string;
  icon: string;
}

export const INTEREST_AREAS: InterestArea[] = [
  { id: 'certification', labelEn: 'Certification & Authenticity Premium™', labelFr: 'Certification & Authenticity Premium™', icon: '🎓' },
  { id: 'journeys', labelEn: 'Immersive Journeys', labelFr: 'Journeys immersifs', icon: '🧭' },
  { id: 'tools', labelEn: 'The 63 GRC Tools', labelFr: 'Les 63 outils GRC', icon: '🧰' },
  { id: 'intelligence', labelEn: 'Governance Intelligence & ACRI', labelFr: 'Intelligence de gouvernance & ACRI', icon: '📊' },
  { id: 'community', labelEn: 'Community Verification', labelFr: 'Vérification communautaire', icon: '🤝' },
  { id: 'investment', labelEn: 'Capital & Investment', labelFr: 'Capital & Investissement', icon: '💠' },
  { id: 'resources', labelEn: 'Knowledge & Resources', labelFr: 'Connaissances & Ressources', icon: '📚' },
  { id: 'champions', labelEn: 'Champions Program', labelFr: 'Programme Champions', icon: '⭐' },
];

// ── Persona dashboard configuration ──────────────────────
export interface DashCard {
  titleEn: string; titleFr: string;
  descEn: string; descFr: string;
  ctaEn: string; ctaFr: string;
  href: string;
  accent?: 'green' | 'gold' | 'navy';
}

export interface PersonaConfig {
  key: PersonaKey;
  icon: string;
  badgeEn: string; badgeFr: string;
  titleEn: string; titleFr: string;
  subtitleEn: string; subtitleFr: string;
  cards: DashCard[];
}

export const PERSONAS: Record<PersonaKey, PersonaConfig> = {
  PARTICIPANT: {
    key: 'PARTICIPANT', icon: '🧭',
    badgeEn: 'Prospective Participant', badgeFr: 'Participant potentiel',
    titleEn: 'Your Journey Hub', titleFr: 'Votre espace Journeys',
    subtitleEn: 'Discover curated African journeys, apply, and track your submissions from one place.',
    subtitleFr: 'Découvrez des parcours africains, candidatez et suivez vos dossiers depuis un seul endroit.',
    cards: [
      { titleEn: 'Browse Journeys', titleFr: 'Explorer les Journeys', descEn: 'Observer, Practitioner and Co-Architect journeys across 22 nations.', descFr: 'Parcours Observer, Practitioner et Co-Architect dans 22 nations.', ctaEn: 'Find your journey', ctaFr: 'Trouver mon parcours', href: '/journeys', accent: 'green' },
      { titleEn: 'My Applications', titleFr: 'Mes candidatures', descEn: 'Track application status, upcoming sessions and saved journeys.', descFr: 'Suivez vos candidatures, sessions à venir et journeys enregistrés.', ctaEn: 'Open my dashboard', ctaFr: 'Ouvrir mon tableau de bord', href: '/journeys/dashboard', accent: 'gold' },
      { titleEn: 'Set a Journey Alert', titleFr: 'Créer une alerte', descEn: 'Get notified when a matching opportunity opens in your country.', descFr: 'Soyez notifié dès qu’une opportunité correspond à votre pays.', ctaEn: 'Notify me', ctaFr: 'Me notifier', href: '/journeys', accent: 'navy' },
      { titleEn: 'Knowledge Center', titleFr: 'Centre de connaissances', descEn: 'Frameworks, guides and the APA thesis to prepare your journey.', descFr: 'Frameworks, guides et la thèse APA pour préparer votre parcours.', ctaEn: 'Explore resources', ctaFr: 'Explorer les ressources', href: '/resources' },
    ],
  },
  PARTNER: {
    key: 'PARTNER', icon: '🏛️',
    badgeEn: 'Business / Corporate Partner', badgeFr: 'Partenaire Entreprise',
    titleEn: 'Your Certification Cockpit', titleFr: 'Votre cockpit de certification',
    subtitleEn: 'Certify your governance, deploy the toolkit and turn accountability into the Authenticity Premium™.',
    subtitleFr: 'Certifiez votre gouvernance, déployez la boîte à outils et convertissez la redevabilité en Authenticity Premium™.',
    cards: [
      { titleEn: 'Start the C-SPA Diagnostic', titleFr: 'Lancer le diagnostic C-SPA', descEn: 'The certification gate — score ≥ 70 to proceed. ~15 minutes.', descFr: 'La porte de la certification — score ≥ 70 pour continuer. ~15 min.', ctaEn: 'Begin diagnostic', ctaFr: 'Commencer le diagnostic', href: '/app/cspa', accent: 'green' },
      { titleEn: 'The Certification Pathway', titleFr: 'Le parcours de certification', descEn: 'The 5 steps from diagnostic to certified seal.', descFr: 'Les 5 étapes du diagnostic au sceau certifié.', ctaEn: 'See the pathway', ctaFr: 'Voir le parcours', href: '/certification', accent: 'gold' },
      { titleEn: 'Deploy the 63 Tools', titleFr: 'Déployer les 63 outils', descEn: 'Forms, guides, legal instruments and metrics for your governance.', descFr: 'Formulaires, guides, instruments juridiques et métriques.', ctaEn: 'Open the catalog', ctaFr: 'Ouvrir le catalogue', href: '/tools', accent: 'navy' },
      { titleEn: 'Solutions for Enterprise', titleFr: 'Solutions Entreprise', descEn: 'Match your business challenge to the right APA solution.', descFr: 'Associez votre enjeu au bon dispositif APA.', ctaEn: 'Explore solutions', ctaFr: 'Explorer les solutions', href: '/solutions' },
    ],
  },
  INVESTOR: {
    key: 'INVESTOR', icon: '💠',
    badgeEn: 'Funder / Investor', badgeFr: 'Bailleur / Investisseur',
    titleEn: 'Your Investment Intelligence Desk', titleFr: 'Votre bureau d’intelligence d’investissement',
    subtitleEn: 'Reprice risk with verified governance: the ACRI index, the Authenticity Premium™ and the certified pipeline.',
    subtitleFr: 'Repricez le risque avec une gouvernance vérifiée : l’indice ACRI, l’Authenticity Premium™ et le pipeline certifié.',
    cards: [
      { titleEn: 'Governance Intelligence', titleFr: 'Intelligence de gouvernance', descEn: 'ACRI country readiness across 22 nations, tiered access.', descFr: 'Préparation ACRI de 22 nations, accès par palier.', ctaEn: 'Open intelligence', ctaFr: 'Ouvrir l’intelligence', href: '/intelligence', accent: 'green' },
      { titleEn: 'The Authenticity Premium™', titleFr: 'L’Authenticity Premium™', descEn: 'How verified governance compresses the cost of capital.', descFr: 'Comment la gouvernance vérifiée comprime le coût du capital.', ctaEn: 'Read the paper', ctaFr: 'Lire le livre blanc', href: '/resources/authenticity-premium-explained', accent: 'gold' },
      { titleEn: 'Verify a Certificate', titleFr: 'Vérifier un certificat', descEn: 'The public registry — check any certified entity.', descFr: 'Le registre public — vérifiez toute entité certifiée.', ctaEn: 'Open the registry', ctaFr: 'Ouvrir le registre', href: '/verify', accent: 'navy' },
      { titleEn: 'Capital Gateway Solutions', titleFr: 'Solutions Capital', descEn: 'The certified deal pipeline and sovereign partnership architecture.', descFr: 'Le pipeline certifié et l’architecture de partenariat souverain.', ctaEn: 'Explore solutions', ctaFr: 'Explorer les solutions', href: '/solutions' },
    ],
  },
  GOVERNMENT: {
    key: 'GOVERNMENT', icon: '🏛️',
    badgeEn: 'Government / NGO Partner', badgeFr: 'Partenaire Gouvernement / ONG',
    titleEn: 'Your Territory & Policy Desk', titleFr: 'Votre bureau Territoire & Politique',
    subtitleEn: 'National readiness, policy-grade solutions and territory-level accountability — in one workspace.',
    subtitleFr: 'Préparation nationale, solutions de niveau politique et redevabilité territoriale — dans un seul espace.',
    cards: [
      { titleEn: 'ACRI — Country Readiness', titleFr: 'ACRI — Préparation pays', descEn: '7-criteria readiness index across the 22 priority nations.', descFr: 'Indice de préparation à 7 critères sur 22 nations prioritaires.', ctaEn: 'Open the index', ctaFr: 'Ouvrir l’indice', href: '/intelligence', accent: 'green' },
      { titleEn: 'Policy Solutions', titleFr: 'Solutions politiques', descEn: 'Risk & territory intelligence and community verification.', descFr: 'Intelligence risque & territoire et vérification communautaire.', ctaEn: 'Explore solutions', ctaFr: 'Explorer les solutions', href: '/solutions', accent: 'gold' },
      { titleEn: 'The APA Framework', titleFr: 'Le Framework APA', descEn: 'Six governance pillars and the 63-tool suite.', descFr: 'Six piliers de gouvernance et la suite de 63 outils.', ctaEn: 'Open the framework', ctaFr: 'Ouvrir le framework', href: '/tools', accent: 'navy' },
      { titleEn: 'Policy Briefs & Reports', titleFr: 'Notes & rapports', descEn: 'Regulator-ready briefs and the State of Trust report.', descFr: 'Notes prêtes pour les régulateurs et le rapport État de la Confiance.', ctaEn: 'Read resources', ctaFr: 'Lire les ressources', href: '/resources' },
    ],
  },
  COMMUNITY: {
    key: 'COMMUNITY', icon: '🤝',
    badgeEn: 'Community Partner', badgeFr: 'Partenaire Communautaire',
    titleEn: 'Your Community Verification Space', titleFr: 'Votre espace de vérification communautaire',
    subtitleEn: 'Make local impact verifiable — grievance mechanisms, co-signature and Made-in-Africa Evaluation.',
    subtitleFr: 'Rendez l’impact local vérifiable — mécanismes de grief, co-signature et Évaluation Made-in-Africa.',
    cards: [
      { titleEn: 'Community Verification Toolkit', titleFr: 'Boîte à outils CVP', descEn: 'Deploy the CVP: co-signature, grievance and safeguards.', descFr: 'Déployez le CVP : co-signature, griefs et garde-fous.', ctaEn: 'Open the toolkit', ctaFr: 'Ouvrir la boîte à outils', href: '/resources/community-verification-portal-toolkit', accent: 'green' },
      { titleEn: 'Made-in-Africa Evaluation', titleFr: 'Évaluation Made-in-Africa', descEn: 'Community-weighted, verifiable impact indicators.', descFr: 'Indicateurs d’impact pondérés et vérifiables.', ctaEn: 'Read the methodology', ctaFr: 'Lire la méthodologie', href: '/resources/made-in-africa-evaluation-methodology', accent: 'gold' },
      { titleEn: 'Community Journeys', titleFr: 'Journeys communautaires', descEn: 'Field journeys with a direct community interface.', descFr: 'Parcours de terrain avec interface communautaire directe.', ctaEn: 'Browse journeys', ctaFr: 'Explorer les journeys', href: '/journeys', accent: 'navy' },
      { titleEn: 'Become an APA Champion', titleFr: 'Devenir Champion APA', descEn: 'Lead APA accountability in your community.', descFr: 'Portez la redevabilité APA dans votre communauté.', ctaEn: 'Apply', ctaFr: 'Candidater', href: '/champions' },
    ],
  },
  TEAM: {
    key: 'TEAM', icon: '⚙️',
    badgeEn: 'APA Team Member', badgeFr: 'Membre de l’équipe APA',
    titleEn: 'Your Team Workspace', titleFr: 'Votre espace équipe',
    subtitleEn: 'Welcome to the APA team. Privileged consoles unlock once an administrator verifies your role.',
    subtitleFr: 'Bienvenue dans l’équipe APA. Les consoles privilégiées s’activent après vérification par un administrateur.',
    cards: [
      { titleEn: 'Admin Consoles (Preview)', titleFr: 'Consoles admin (aperçu)', descEn: 'C-SPA and Champion pipelines — full access after verification.', descFr: 'Pipelines C-SPA et Champions — accès complet après vérification.', ctaEn: 'Preview admin', ctaFr: 'Aperçu admin', href: '/app/admin/cspa', accent: 'navy' },
      { titleEn: 'Resource Management', titleFr: 'Gestion des ressources', descEn: 'The Knowledge Center CMS — publish, feature, analyze.', descFr: 'Le CMS du Centre de connaissances — publier, mettre en avant, analyser.', ctaEn: 'Open the CMS', ctaFr: 'Ouvrir le CMS', href: '/resources/admin', accent: 'green' },
      { titleEn: 'Journeys Admin', titleFr: 'Admin Journeys', descEn: 'Create journeys, manage applications and reports.', descFr: 'Créer des journeys, gérer candidatures et rapports.', ctaEn: 'Open console', ctaFr: 'Ouvrir la console', href: '/journeys/admin', accent: 'gold' },
      { titleEn: 'The 63 Tools', titleFr: 'Les 63 outils', descEn: 'The full framework you will help partners deploy.', descFr: 'Le framework complet que vous aiderez à déployer.', ctaEn: 'Open the catalog', ctaFr: 'Ouvrir le catalogue', href: '/tools' },
    ],
  },
  ALUMNI: {
    key: 'ALUMNI', icon: '🎖️',
    badgeEn: 'APA Journey Alumni', badgeFr: 'Ancien·ne des Journeys',
    titleEn: 'Your Alumni Space', titleFr: 'Votre espace anciens',
    subtitleEn: 'Continue the work: advance your learning paths, reconnect with your cohort and go deeper.',
    subtitleFr: 'Poursuivez le travail : avancez vos parcours, retrouvez votre cohorte et allez plus loin.',
    cards: [
      { titleEn: 'My Learning Paths', titleFr: 'Mes parcours d’apprentissage', descEn: 'Continue curated paths — each recommends the next resource.', descFr: 'Poursuivez des parcours — chacun recommande la ressource suivante.', ctaEn: 'Resume learning', ctaFr: 'Reprendre l’apprentissage', href: '/resources', accent: 'green' },
      { titleEn: 'Advance to Practitioner', titleFr: 'Passer Practitioner', descEn: 'Take the next journey tier and apply the toolkit hands-on.', descFr: 'Passez au palier suivant et appliquez la boîte à outils.', ctaEn: 'Explore journeys', ctaFr: 'Explorer les journeys', href: '/journeys/roles/practitioner', accent: 'gold' },
      { titleEn: 'Get Certified', titleFr: 'Se faire certifier', descEn: 'Convert your experience into a certified credential.', descFr: 'Convertissez votre expérience en certification.', ctaEn: 'Start certification', ctaFr: 'Démarrer la certification', href: '/certification', accent: 'navy' },
      { titleEn: 'Become an APA Champion', titleFr: 'Devenir Champion APA', descEn: 'Lead the next cohort as a facilitator or champion.', descFr: 'Guidez la prochaine cohorte comme facilitateur ou champion.', ctaEn: 'Apply', ctaFr: 'Candidater', href: '/champions' },
    ],
  },
};
