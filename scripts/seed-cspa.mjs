#!/usr/bin/env node
/**
 * C-SPA question bank — version cspa-v1.
 * Grounded in the Master Memoire & the 63-tool corpus (tool #3 paradigm
 * choice, mandates #18–26, Kinship Equity, MAE, MRG, sunset clause, σ).
 * Regenerating from the Master Document = inserting a new version.
 */
import pg from 'pg';
import 'dotenv/config';

const V = 'cspa-v1';

// [section, order, textEn, textFr, [optEn×4], [optFr×4]] — option index = score 0..3
const Q = [
  // S1 — Strategic Paradigm (tool #3, #9)
  ['S1', 1,
    'How does executive leadership formally define social engagement?',
    'Comment la direction définit-elle formellement l’engagement social ?',
    ['CSR as a cost centre / philanthropy', 'Reputational investment', 'Emerging shared-value pilots', 'CSV as documented core strategy'],
    ['RSE comme centre de coût / philanthropie', 'Investissement réputationnel', 'Pilotes de valeur partagée émergents', 'CSV = stratégie cœur documentée']],
  ['S1', 2,
    'Is the paradigm choice (transactional vs shared value) documented and board-approved?',
    'Le choix de paradigme (transactionnel vs valeur partagée) est-il documenté et approuvé par le conseil ?',
    ['Never discussed', 'Informal discussions', 'Documented, pending approval', 'Board-ratified & published'],
    ['Jamais discuté', 'Discussions informelles', 'Documenté, en attente d’approbation', 'Ratifié par le conseil & publié']],
  ['S1', 3,
    'Do budget allocations match the declared values from day one?',
    'Les allocations budgétaires correspondent-elles aux valeurs déclarées dès le premier jour ?',
    ['No link budget/values', 'Ad-hoc allocations', 'Partial alignment reviewed yearly', 'Structural alignment, audited'],
    ['Aucun lien budget/valeurs', 'Allocations ad hoc', 'Alignement partiel, revu annuellement', 'Alignement structurel, audité']],
  // S2 — Power-Sharing & Governance (mandates #18, #22, #12)
  ['S2', 1,
    'Do local partners hold decisive authority (veto/co-signature) on critical decisions?',
    'Les partenaires locaux détiennent-ils une autorité décisive (veto/co-signature) sur les décisions critiques ?',
    ['Consultation only', 'Advisory committees', 'Co-signature on some decisions', 'Contractual veto power (mandate #18)'],
    ['Consultation seulement', 'Comités consultatifs', 'Co-signature sur certaines décisions', 'Droit de veto contractuel (mandat #18)']],
  ['S2', 2,
    'Are steering structures composed with 50/50 parity?',
    'Les structures de pilotage sont-elles composées à parité 50/50 ?',
    ['External-led governance', 'Minority local seats', 'Near-parity, no mandate', '50/50 contractual committees (#22)'],
    ['Gouvernance pilotée de l’extérieur', 'Sièges locaux minoritaires', 'Quasi-parité, sans mandat', 'Comités 50/50 contractuels (#22)']],
  ['S2', 3,
    'Can local partners audit the international partner’s commitment to ceding power?',
    'Les partenaires locaux peuvent-ils auditer l’engagement du partenaire international à céder le pouvoir ?',
    ['No reciprocal vetting', 'One-way due diligence', 'Informal reciprocal review', 'Structured reciprocal vetting (#12)'],
    ['Aucun vetting réciproque', 'Diligence à sens unique', 'Revue réciproque informelle', 'Vetting réciproque structuré (#12)']],
  // S3 — Community Co-Ownership (Kinship, #21, #27, #52)
  ['S3', 1,
    'Does your project include a legally binding community co-ownership mechanism?',
    'Votre projet inclut-il un mécanisme de co-propriété communautaire juridiquement contraignant ?',
    ['Not yet', 'MOU only', 'Drafted, unsigned instruments', 'Kinship Equity executed'],
    ['Pas encore', 'MOU seulement', 'Instruments rédigés, non signés', 'Kinship Equity exécuté']],
  ['S3', 2,
    'Who owns co-created IP, data and technology?',
    'Qui détient la PI, les données et la technologie co-créées ?',
    ['External partner owns all', 'Licences granted locally', 'Case-by-case co-ownership', 'Joint ownership by contract (#21)'],
    ['Le partenaire externe détient tout', 'Licences accordées localement', 'Co-propriété au cas par cas', 'Copropriété contractuelle (#21)']],
  ['S3', 3,
    'Can the community co-sign or veto audit conclusions about your project?',
    'La communauté peut-elle co-signer ou opposer un veto aux conclusions d’audit de votre projet ?',
    ['No community role', 'Comments collected', 'Formal review, non-binding', 'CVP authority accepted (#27)'],
    ['Aucun rôle communautaire', 'Commentaires collectés', 'Revue formelle, non contraignante', 'Autorité CVP acceptée (#27)']],
  // S4 — Measurement & Accountability (MAE #29, MRG #10, #25)
  ['S4', 1,
    'How is impact measured?',
    'Comment l’impact est-il mesuré ?',
    ['Not measured', 'Imported/generic KPIs only', 'Mixed local indicators', 'MAE toolbox: dignity, agency, cohesion (#29)'],
    ['Non mesuré', 'KPI importés/génériques seulement', 'Indicateurs locaux mixtes', 'Boîte MAE : dignité, agence, cohésion (#29)']],
  ['S4', 2,
    'Is there a grievance mechanism co-designed WITH the community?',
    'Existe-t-il un mécanisme de griefs co-conçu AVEC la communauté ?',
    ['None', 'Internal complaints box', 'External hotline, imposed', 'Co-designed MRG, restorative (#10)'],
    ['Aucun', 'Boîte à plaintes interne', 'Ligne externe, imposée', 'MRG co-conçu, restauratif (#10)']],
  ['S4', 3,
    'Are grievance filers protected by a formal anti-retaliation policy?',
    'Les déposants de griefs sont-ils protégés par une politique anti-représailles formelle ?',
    ['No protection', 'Verbal assurances', 'Policy drafted, not enforced', 'Enforced policy, legal protection (#25)'],
    ['Aucune protection', 'Assurances verbales', 'Politique rédigée, non appliquée', 'Politique appliquée, protection juridique (#25)']],
  // S5 — Capital & Value Distribution (#24, #5, #53)
  ['S5', 1,
    'What share of project costs is contractually reserved for trust-building and capacity transfer?',
    'Quelle part des coûts projet est contractuellement réservée à la confiance et au transfert de capacités ?',
    ['0% — none reserved', 'Discretionary, cut under pressure', '<10%, protected', '≥10% contractual (#24)'],
    ['0 % — rien de réservé', 'Discrétionnaire, coupé sous pression', '<10 %, protégé', '≥10 % contractuel (#24)']],
  ['S5', 2,
    'Do you quantify and mitigate structural value leakage (tied aid, profit repatriation, σ)?',
    'Quantifiez-vous et atténuez-vous la fuite structurelle de valeur (aide liée, rapatriement, σ) ?',
    ['Never assessed', 'Anecdotal awareness', 'Measured, no targets', 'σ tracked with reduction targets (#5)'],
    ['Jamais évaluée', 'Conscience anecdotique', 'Mesurée, sans cibles', 'σ suivi avec cibles de réduction (#5)']],
  ['S5', 3,
    'Is local procurement mandated with quotas?',
    'L’approvisionnement local est-il imposé par quotas ?',
    ['No local sourcing policy', 'Preference, no quota', 'Quota targets, unenforced', 'Binding quotas, audited (#53)'],
    ['Aucune politique locale', 'Préférence, sans quota', 'Cibles de quotas, non appliquées', 'Quotas contraignants, audités (#53)']],
  // S6 — Exit & Continuity (#20, #57, #28)
  ['S6', 1,
    'Is a managed exit (sunset clause) with full sovereign transfer contractual from day one?',
    'Une sortie maîtrisée (clause sunset) avec transfert souverain complet est-elle contractuelle dès le premier jour ?',
    ['No exit design', 'Vague intent', 'Exit plan, no timeline', 'Fixed-timeline sunset clause (#20)'],
    ['Aucune conception de sortie', 'Intention vague', 'Plan de sortie, sans échéance', 'Clause sunset à échéance fixe (#20)']],
  ['S6', 2,
    'Does skills investment build sovereign local institutions rather than project-tied training?',
    'L’investissement en compétences bâtit-il des institutions locales souveraines plutôt que des formations liées au projet ?',
    ['Project-tied training only', 'Occasional local partnerships', 'Co-delivered programs', 'Decoupled, institution-based (#57)'],
    ['Formations liées au projet', 'Partenariats locaux occasionnels', 'Programmes co-délivrés', 'Découplé, institutionnel (#57)']],
  ['S6', 3,
    'Do you track outcomes beyond the project cycle (10-year horizon)?',
    'Suivez-vous les résultats au-delà du cycle projet (horizon 10 ans) ?',
    ['No post-project tracking', 'Final evaluation only', 'Ad-hoc follow-ups', '10-year dashboard commitment (#28)'],
    ['Aucun suivi post-projet', 'Évaluation finale seulement', 'Suivis ad hoc', 'Engagement dashboard 10 ans (#28)']],
];

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
let n = 0;
for (const [section, order, textEn, textFr, optionsEn, optionsFr] of Q) {
  await client.query(
    `INSERT INTO cspa_questions (id, version, section, "order", "textEn", "textFr", "optionsEn", "optionsFr")
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (version, section, "order")
     DO UPDATE SET "textEn"=EXCLUDED."textEn", "textFr"=EXCLUDED."textFr",
                   "optionsEn"=EXCLUDED."optionsEn", "optionsFr"=EXCLUDED."optionsFr"`,
    [V, section, order, textEn, textFr, JSON.stringify(optionsEn), JSON.stringify(optionsFr)]
  );
  n++;
}
console.log(`✔ ${n} C-SPA questions seeded (${V})`);
await client.end();
