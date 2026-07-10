import type { LearningPath, Resource } from '@/types/resource';

/**
 * APA Knowledge & Resource Center corpus — grounded in the APA Master Memoire
 * (frameworks, methodologies, certification engine, community verification,
 * Authenticity Premium™, MAE, σ-leakage, C-SPA). Richly structured and
 * interconnected; ready to swap onto a headless CMS with no shape change.
 */

const A = {
  samb: { author: 'Pape Samb', authorTitle: 'CEO & Lead Architect, APA Framework' },
  babangida: { author: 'Aisha Babangida', authorTitle: 'Co-Founder & President, APA' },
  research: { author: 'APA Research Unit', authorTitle: 'Governance Intelligence Division' },
  cert: { author: 'APA Certification Board', authorTitle: 'Standards & Assurance' },
};

export const RESOURCES: Resource[] = [
  {
    id: 'r_apa_master_framework',
    slug: 'apa-governance-framework-overview',
    title: 'The APA Governance Framework: A Made-in-Africa Accountability Standard',
    type: 'Framework',
    executiveSummary:
      'The foundational overview of the APA framework — six governance pillars, the 63-tool suite and the certification engine that convert declared ethics into verifiable, capital-grade trust.',
    executiveOverview:
      'This framework document sets out the architecture of APA accountability: six interlocking pillars (Governance Foundations, Capital Architecture, Legal & Contractual Mandates, Risk & Territory, Ethics & Leadership, Measurement & Certification), operationalized through 63 precision tools and a five-step certification pathway. It explains why Western GRC frameworks under-perform in African contexts and how contextual calibration — community verification, kinship equity, narrative sovereignty — produces trust signals that reprice institutional risk.',
    purpose: 'Give leaders a single map of how APA turns governance intent into a measurable, auditable and bankable standard.',
    businessValue: 'Reduces the risk premium that capital applies to African institutions by making trust verifiable rather than declared.',
    keyInsights: [
      'The 70% project-failure rate begins at the top, with undocumented executive paradigms.',
      'Trust becomes an asset only when it is measured (MAE) and independently verified (CVP).',
      'Certification is a gate, not a badge: the C-SPA diagnostic must pass ≥70 to proceed.',
    ],
    aiSummary:
      'APA replaces "checkbox CSR" with a six-pillar, 63-tool, certification-gated standard. Its edge is contextual calibration: community verification and measurement (MAE) turn governance into a priced, tradeable trust signal.',
    ...A.samb,
    publishedAt: '2026-01-20', updatedAt: '2026-06-15', readingMinutes: 18,
    language: 'English', otherLanguages: ['French'],
    countries: ['Pan-African'], industries: ['Government', 'Finance', 'Development Finance'],
    domains: ['Accountability', 'Transparency', 'Ethics', 'Certification'],
    relatedSolutions: ['s1', 's3'], relatedFrameworks: ['I', 'V', 'VI'], relatedTools: [1, 3, 52],
    relatedJourneys: ['senegal-esg-practitioner-immersion'], relatedCertifications: ['APA Certified Institution'],
    hasPdf: true, fileSizeKb: 4200,
    views: 24800, downloads: 9120, rating: 4.9, ratingCount: 412, featured: true, trending: true,
  },
  {
    id: 'r_authenticity_premium',
    slug: 'authenticity-premium-explained',
    title: 'The Authenticity Premium™: Pricing Verifiable Trust',
    type: 'White Paper',
    executiveSummary:
      'How independently verified governance compresses the cost of capital — the economic mechanism behind APA certification, with the σ-leakage model and worked repricing examples.',
    executiveOverview:
      'The Authenticity Premium™ is the measurable difference in valuation, cost of capital and market access between an entity whose governance is verified and one whose governance is merely declared. This paper formalizes the mechanism: a verified trust signal lowers perceived risk (σ, the value-leakage coefficient), which lowers the discount rate, which raises enterprise value. It includes the repricing model, sensitivity ranges and three worked examples across finance, mining and agriculture.',
    purpose: 'Explain, in CFO language, why verified governance is an asset with a quantifiable return — not a compliance cost.',
    businessValue: 'Positions certification as a value-creation lever: a 1-point σ reduction can move enterprise value by double digits in high-risk markets.',
    keyInsights: [
      'σ (value-leakage coefficient) is the bridge between governance quality and cost of capital.',
      'Verification, not disclosure, is what capital rewards — because it is independently falsifiable.',
      'The premium is largest exactly where perceived country risk is highest.',
    ],
    aiSummary:
      'Verified governance lowers σ (value leakage), which lowers the discount rate and raises valuation. The Authenticity Premium™ is that repricing — biggest in the highest-risk markets.',
    ...A.samb,
    publishedAt: '2026-02-14', updatedAt: '2026-05-30', readingMinutes: 22,
    language: 'English', otherLanguages: ['French'],
    countries: ['Pan-African'], industries: ['Finance', 'Mining', 'Development Finance'],
    domains: ['Authenticity Premium™', 'Accountability', 'ESG'],
    relatedSolutions: ['s3', 's4'], relatedFrameworks: ['II', 'VI'], relatedTools: [3, 21, 28],
    relatedJourneys: ['rwanda-sovereign-capital-co-architecture'], relatedCertifications: ['APA Certified Institution'],
    certificationBadge: 'Authenticity Premium™',
    hasPdf: true, fileSizeKb: 3100,
    views: 19340, downloads: 7640, rating: 4.8, ratingCount: 288, featured: true, trending: true,
  },
  {
    id: 'r_cspa_guide',
    slug: 'c-spa-diagnostic-implementation-guide',
    title: 'C-SPA Diagnostic: Implementation Guide',
    type: 'Implementation Manual',
    executiveSummary:
      'Step-by-step manual to run the Core Strategic Paradigm Audit — the executive-alignment gate that opens the certification pathway. Includes the 6-section rubric and pass thresholds.',
    executiveOverview:
      'The Core Strategic Paradigm Audit (C-SPA) is APA’s executive diagnostic and the first gate of certification. This manual walks facilitators through the six weighted sections, the 18-question instrument, scoring, the ≥70 pass gate and the maturity ladder. It covers evidence collection, interview protocol, calibration between assessors, and how to turn a score into a 90-day trust agenda.',
    purpose: 'Equip facilitators and internal teams to run a defensible C-SPA and produce a board-ready alignment report.',
    businessValue: 'Surfaces paradigm drift before capital is committed, avoiding the most common cause of governance-project failure.',
    keyInsights: [
      'Six weighted sections; the gate is a composite ≥70, not an average of convenience.',
      'Assessor calibration is the single biggest driver of score reliability.',
      'A C-SPA score is only useful if it converts into a dated action agenda.',
    ],
    aiSummary:
      'C-SPA is a 6-section, 18-question executive audit gating certification at ≥70. This manual covers scoring, calibration and turning the result into a 90-day trust agenda.',
    ...A.cert,
    publishedAt: '2026-03-02', updatedAt: '2026-06-28', readingMinutes: 26,
    language: 'English', otherLanguages: ['French'],
    countries: ['Pan-African'], industries: ['Government', 'Finance', 'Infrastructure'],
    domains: ['Certification', 'Accountability', 'Ethics'],
    relatedSolutions: ['s1', 's3'], relatedFrameworks: ['I', 'V'], relatedTools: [3],
    relatedJourneys: ['senegal-esg-practitioner-immersion'], relatedCertifications: ['APA Certified Institution', 'C-SPA Diagnostic'],
    certificationBadge: 'C-SPA',
    hasPdf: true, fileSizeKb: 5600,
    views: 15220, downloads: 8890, rating: 4.7, ratingCount: 341, featured: false, trending: true,
  },
  {
    id: 'r_mae_methodology',
    slug: 'made-in-africa-evaluation-methodology',
    title: 'Made-in-Africa Evaluation (MAE): A Decolonized Measurement Methodology',
    type: 'Research Paper',
    executiveSummary:
      'The measurement methodology that lets communities define, weight and verify impact indicators — moving beyond imported KPIs to contextually valid evidence.',
    executiveOverview:
      'MAE reframes impact measurement around who defines value. Instead of importing donor KPIs, MAE co-constructs indicators with the communities affected, weights them by locally-validated priority, and verifies them through the Community Verification Portal. This paper presents the epistemology, the indicator co-design protocol, inter-rater verification, and how MAE data feeds the Authenticity Premium™.',
    purpose: 'Provide a rigorous, defensible alternative to imported evaluation frameworks that mis-measure African impact.',
    businessValue: 'Produces evidence that both communities and capital trust, cutting disputes and re-work in diligence.',
    keyInsights: [
      'Measurement validity depends on who holds the pen on indicator definition.',
      'Community-weighted indicators predict project durability better than imported KPIs.',
      'MAE is the data layer beneath the Authenticity Premium™.',
    ],
    aiSummary:
      'MAE co-designs and community-weights impact indicators, then verifies them via the CVP. It is the decolonized measurement layer feeding APA’s trust pricing.',
    ...A.research,
    publishedAt: '2026-02-28', updatedAt: '2026-05-10', readingMinutes: 24,
    language: 'English', otherLanguages: ['French', 'Portuguese'],
    countries: ['Pan-African'], industries: ['NGOs', 'Development Finance', 'Agriculture'],
    domains: ['Community Verification', 'Accountability', 'CSV'],
    relatedSolutions: ['s5'], relatedFrameworks: ['IV', 'VI'], relatedTools: [27, 29],
    relatedJourneys: ['ethical-leadership-safari-kenya'], relatedCertifications: ['APA Certified Institution'],
    hasPdf: true, fileSizeKb: 2800,
    views: 12110, downloads: 5230, rating: 4.8, ratingCount: 196, featured: true, trending: false,
  },
  {
    id: 'r_cvp_toolkit',
    slug: 'community-verification-portal-toolkit',
    title: 'Community Verification Portal (CVP): Deployment Toolkit',
    type: 'Toolkit',
    executiveSummary:
      'Everything a field team needs to stand up community verification — co-signature workflows, grievance mechanisms (MGG), anti-retaliation safeguards and evidence capture.',
    executiveOverview:
      'The CVP turns affected communities into an independent verification layer. This toolkit bundles the deployment checklist, co-signature and consent workflows, the grievance-mechanism (MGG) design template, anti-retaliation safeguards (mandate #55 narrative sovereignty), and offline-first evidence capture. It includes facilitator scripts, role definitions and a data-integrity protocol.',
    purpose: 'Let practitioners deploy credible community verification quickly, without reinventing safeguards.',
    businessValue: 'Independent verification is what converts community sentiment into evidence capital will accept.',
    keyInsights: [
      'Co-signature plus grievance mechanism is the minimum viable verification unit.',
      'Anti-retaliation design is a prerequisite, not an add-on.',
      'Offline-first capture is essential for rural deployments.',
    ],
    aiSummary:
      'A field kit to deploy the Community Verification Portal: co-signature, grievance (MGG), anti-retaliation safeguards and offline evidence capture.',
    ...A.research,
    publishedAt: '2026-04-05', updatedAt: '2026-06-20', readingMinutes: 30,
    language: 'English', otherLanguages: ['French'],
    countries: ['Kenya', 'Senegal', 'Ghana'], industries: ['Mining', 'Agriculture', 'Energy'],
    domains: ['Community Verification', 'Transparency', 'Accountability'],
    relatedSolutions: ['s5'], relatedFrameworks: ['IV'], relatedTools: [29, 53, 55],
    relatedJourneys: ['ethical-leadership-safari-kenya'], relatedCertifications: ['APA Certified Institution'],
    hasPdf: true, fileSizeKb: 8100,
    views: 9870, downloads: 6410, rating: 4.6, ratingCount: 154, featured: false, trending: true,
  },
  {
    id: 'r_certification_pathway',
    slug: 'apa-certification-pathway-guide',
    title: 'APA Certification Pathway: The Five Steps to Certified Trust',
    type: 'Certification Guide',
    executiveSummary:
      'The complete candidate guide to APA certification — the five steps from C-SPA diagnostic to certified seal, evidence requirements and timelines.',
    executiveOverview:
      'This guide is the definitive map for institutions seeking certification. It details the five steps — (1) C-SPA diagnostic gate, (2) tool deployment and evidence assembly, (3) community verification, (4) independent assurance review, (5) certification and Authenticity Premium™ seal — with the evidence dossier requirements, expected timelines, common failure points and how to prepare each stage.',
    purpose: 'De-risk the certification journey by making every requirement and gate explicit up front.',
    businessValue: 'Shortens time-to-certification and reduces failed reviews by aligning evidence to the standard early.',
    keyInsights: [
      'Most delays come from evidence assembled after the fact rather than during deployment.',
      'The Digital Portfolio (tool #52) is the backbone of a clean assurance review.',
      'Community verification cannot be retrofitted — plan it into deployment.',
    ],
    aiSummary:
      'Five steps: C-SPA gate → tool deployment/evidence → community verification → assurance review → certified seal. Assemble evidence during deployment, not after.',
    ...A.cert,
    publishedAt: '2026-03-18', updatedAt: '2026-07-01', readingMinutes: 20,
    language: 'English', otherLanguages: ['French'],
    countries: ['Pan-African'], industries: ['Finance', 'Government', 'Manufacturing'],
    domains: ['Certification', 'Authenticity Premium™'],
    relatedSolutions: ['s3'], relatedFrameworks: ['VI'], relatedTools: [3, 52],
    relatedJourneys: ['senegal-esg-practitioner-immersion'], relatedCertifications: ['APA Certified Institution', 'APA Certified Professional'],
    certificationBadge: 'Certification',
    hasPdf: true, fileSizeKb: 3600,
    views: 17650, downloads: 10240, rating: 4.9, ratingCount: 377, featured: true, trending: true,
  },
  {
    id: 'r_esg_africa_report',
    slug: 'esg-in-africa-2026-state-of-trust',
    title: 'ESG in Africa 2026: The State of Trust Report',
    type: 'Report',
    executiveSummary:
      'A continental data report on the trust gap between disclosed and verified governance across 22 priority nations, with sector benchmarks and capital-flow implications.',
    executiveOverview:
      'The State of Trust Report aggregates readiness data across the 22 APA priority nations, benchmarking disclosed versus verified governance by sector. It quantifies the "verification gap," maps where the Authenticity Premium™ is largest, and connects the findings to observed capital flows and diligence costs. Includes methodology, country cards and sector heatmaps.',
    purpose: 'Give investors and policymakers a data baseline for where verified governance moves capital fastest.',
    businessValue: 'Targets certification and capital where the trust gap — and therefore the return — is greatest.',
    keyInsights: [
      'The verification gap is widest in extractives and infrastructure.',
      'Countries closing the gap see measurable diligence-cost compression.',
      'Disclosure volume does not correlate with capital access; verification does.',
    ],
    aiSummary:
      'A 22-nation benchmark of disclosed vs verified governance. The "verification gap" is widest in extractives/infrastructure and predicts where the Authenticity Premium™ pays most.',
    ...A.research,
    publishedAt: '2026-06-01', updatedAt: '2026-06-25', readingMinutes: 34,
    language: 'English', otherLanguages: ['French', 'Portuguese', 'Arabic'],
    countries: ['Pan-African'], industries: ['Finance', 'Mining', 'Infrastructure', 'Development Finance'],
    domains: ['ESG', 'Accountability', 'Transparency'],
    relatedSolutions: ['s2', 's4'], relatedFrameworks: ['IV', 'II'], relatedTools: [10, 21],
    relatedJourneys: ['ghana-afcfta-co-architecture-practicum'], relatedCertifications: [],
    hasPdf: true, fileSizeKb: 9800,
    views: 21300, downloads: 8110, rating: 4.7, ratingCount: 231, featured: true, trending: true,
  },
  {
    id: 'r_csv_playbook',
    slug: 'creating-shared-value-african-playbook',
    title: 'Creating Shared Value: The African Playbook',
    type: 'Guide',
    executiveSummary:
      'A practical guide to designing CSV strategies where business value and community value compound — with local-sourcing, kinship equity and σ-suppression patterns.',
    executiveOverview:
      'This playbook operationalizes Creating Shared Value for African enterprise: identifying the value nodes where community benefit and enterprise return reinforce each other, structuring local-sourcing and kinship-equity instruments, and suppressing value leakage (σ). It includes design patterns, a CSV canvas and worked examples across agriculture and manufacturing.',
    purpose: 'Move CSV from slogan to structured deal design with measurable, mutual returns.',
    businessValue: 'Well-structured CSV lowers σ and community risk while opening new supplier and market access.',
    keyInsights: [
      'CSV works when community value is structured into the deal, not donated after it.',
      'Local sourcing is the highest-leverage CSV instrument for σ-suppression.',
      'Kinship equity aligns incentives that contracts alone cannot.',
    ],
    aiSummary:
      'Design CSV as deal structure, not philanthropy: local sourcing and kinship equity suppress σ and open supplier/market access.',
    ...A.samb,
    publishedAt: '2026-04-22', updatedAt: '2026-06-05', readingMinutes: 19,
    language: 'English', otherLanguages: ['French'],
    countries: ['Ghana', 'Nigeria', 'Côte d’Ivoire'], industries: ['Agriculture', 'Manufacturing'],
    domains: ['CSV', 'Community Verification', 'ESG'],
    relatedSolutions: ['s5'], relatedFrameworks: ['III', 'IV'], relatedTools: [30, 53],
    relatedJourneys: ['ghana-afcfta-co-architecture-practicum'], relatedCertifications: [],
    hasPdf: true, fileSizeKb: 2400,
    views: 8760, downloads: 3980, rating: 4.5, ratingCount: 112, featured: false, trending: false,
  },
  {
    id: 'r_sovereign_capital_case',
    slug: 'rwanda-sovereign-capital-case-study',
    title: 'Case Study: Structuring Sovereign Capital in Rwanda',
    type: 'Case Study',
    executiveSummary:
      'How a co-architected deal applied APA mandates — veto rights, kinship equity and a 10-year dashboard — to convert institutional trust into a bankable structure.',
    executiveOverview:
      'This case study documents a co-architecture practicum in Kigali where a sovereign-to-enterprise deal was structured using the APA mandate suite. It walks through the diligence mapping, mandate architecture (veto rights, parity committees, kinship equity), CVP activation and the 10-year systems-change dashboard, with the governance outcomes and investor-readiness result.',
    purpose: 'Show, concretely, how APA instruments turn institutional trust into a financeable deal.',
    businessValue: 'Demonstrates a replicable path from governance quality to lowered cost of sovereign-linked capital.',
    keyInsights: [
      'Binding mandates, co-drafted with counsel, outperform voluntary commitments.',
      'A 10-year dashboard gives boards visibility consultants rarely deliver.',
      'Community co-ownership de-risks execution, not just optics.',
    ],
    aiSummary:
      'A Kigali deal co-architected with APA mandates (veto rights, kinship equity, 10-year dashboard) that converted institutional trust into a bankable, investor-ready structure.',
    ...A.samb,
    publishedAt: '2026-05-12', updatedAt: '2026-06-18', readingMinutes: 16,
    language: 'English', otherLanguages: ['French'],
    countries: ['Rwanda'], industries: ['Development Finance', 'Infrastructure'],
    domains: ['Accountability', 'ESG', 'Authenticity Premium™'],
    relatedSolutions: ['s4'], relatedFrameworks: ['II', 'III'], relatedTools: [18, 21, 28],
    relatedJourneys: ['rwanda-sovereign-capital-co-architecture'], relatedCertifications: ['APA Co-Architect Certification'],
    hasPdf: true, fileSizeKb: 2100,
    views: 7420, downloads: 2870, rating: 4.6, ratingCount: 88, featured: false, trending: false,
  },
  {
    id: 'r_ethical_leadership_video',
    slug: 'ethical-leadership-masterclass-video',
    title: 'Ethical Leadership in African Institutions (Masterclass)',
    type: 'Video',
    executiveSummary:
      'A 45-minute masterclass on leading with verifiable integrity — narrative sovereignty, anti-retaliation culture and the executive habits that pass a C-SPA.',
    executiveOverview:
      'In this masterclass, APA’s lead architect walks executives through the leadership behaviors that produce verifiable trust: respecting community narrative sovereignty, building anti-retaliation culture, documenting the strategic paradigm, and the daily habits that let an organization pass — and keep passing — the C-SPA diagnostic.',
    purpose: 'Translate the ethics pillar into concrete executive behavior.',
    businessValue: 'Leadership behavior is the leading indicator of certification durability.',
    keyInsights: [
      'Narrative sovereignty is a leadership discipline, not a communications tactic.',
      'Anti-retaliation culture is measurable and auditable.',
      'Paradigm documentation is what keeps alignment from drifting.',
    ],
    aiSummary:
      'A 45-minute executive masterclass on verifiable integrity: narrative sovereignty, anti-retaliation culture and the habits behind a durable C-SPA pass.',
    ...A.samb,
    publishedAt: '2026-05-28', updatedAt: '2026-05-28', readingMinutes: 45,
    language: 'English', otherLanguages: ['French'],
    countries: ['Pan-African'], industries: ['Government', 'Finance', 'Education'],
    domains: ['Ethics', 'Accountability'],
    relatedSolutions: ['s1'], relatedFrameworks: ['V'], relatedTools: [3],
    relatedJourneys: ['ethical-leadership-safari-kenya'], relatedCertifications: ['APA Certified Professional'],
    hasPdf: false, mediaUrl: 'https://www.youtube.com/@theapaafrica',
    views: 13980, downloads: 0, rating: 4.8, ratingCount: 204, featured: false, trending: true,
  },
  {
    id: 'r_governance_podcast',
    slug: 'accountable-africa-podcast-ep1',
    title: 'Accountable Africa — Ep.1: Why Trust Is the Scarcest Capital',
    type: 'Podcast',
    executiveSummary:
      'The launch episode of APA’s podcast: a conversation on why verifiable trust — not more disclosure — is the binding constraint on African capital.',
    executiveOverview:
      'The inaugural episode of Accountable Africa explores the thesis that trust, not information, is the scarce resource. The hosts discuss the verification gap, the psychology of the risk premium, and how community verification changes what capital is willing to price. A practical listen for leaders new to the APA thesis.',
    purpose: 'Introduce the APA thesis to a broad audience in an accessible format.',
    businessValue: 'Builds the shared vocabulary leaders need before engaging the framework.',
    keyInsights: [
      'Information is abundant; verifiable trust is scarce.',
      'The risk premium is a psychological price, and it responds to verification.',
      'Community verification changes the information capital is willing to believe.',
    ],
    aiSummary:
      'Podcast ep.1: trust, not disclosure, is Africa’s scarce capital. Verification — especially community verification — is what actually reprices risk.',
    ...A.babangida,
    publishedAt: '2026-06-10', updatedAt: '2026-06-10', readingMinutes: 38,
    language: 'English', otherLanguages: ['French'],
    countries: ['Pan-African'], industries: ['Finance', 'Development Finance'],
    domains: ['Accountability', 'Transparency'],
    relatedSolutions: ['s2'], relatedFrameworks: ['I'], relatedTools: [],
    relatedJourneys: [], relatedCertifications: [],
    hasPdf: false, mediaUrl: 'https://www.youtube.com/@theapaafrica',
    views: 6540, downloads: 0, rating: 4.4, ratingCount: 61, featured: false, trending: false,
  },
  {
    id: 'r_policy_brief_mining',
    slug: 'policy-brief-mining-community-accountability',
    title: 'Policy Brief: Community Accountability in Mining Concessions',
    type: 'Policy Brief',
    executiveSummary:
      'A concise brief for regulators on embedding community verification and grievance mechanisms into mining concession conditions.',
    executiveOverview:
      'This policy brief argues that concession conditions should require verifiable community accountability — co-signature, functioning grievance mechanisms and independent verification — as a condition of license. It sets out the regulatory design, enforcement levers and the fiscal case: verified concessions attract lower-cost, longer-duration capital.',
    purpose: 'Give regulators a ready design for accountability-linked concession conditions.',
    businessValue: 'Aligns public license conditions with the trust signals that attract patient capital.',
    keyInsights: [
      'License conditions are the highest-leverage point for embedding verification.',
      'Grievance-mechanism functionality should be audited, not assumed.',
      'Verified concessions can be a fiscal advantage, not just a social one.',
    ],
    aiSummary:
      'Regulators should make verifiable community accountability a concession condition. Verified concessions attract cheaper, longer capital — a fiscal case, not just a social one.',
    ...A.research,
    publishedAt: '2026-04-30', updatedAt: '2026-06-12', readingMinutes: 12,
    language: 'English', otherLanguages: ['French', 'Portuguese'],
    countries: ['DR Congo', 'Zambia', 'Ghana'], industries: ['Mining', 'Government'],
    domains: ['Community Verification', 'Accountability', 'Transparency'],
    relatedSolutions: ['s2', 's5'], relatedFrameworks: ['III', 'IV'], relatedTools: [10, 55],
    relatedJourneys: [], relatedCertifications: [],
    hasPdf: true, fileSizeKb: 900,
    views: 5210, downloads: 3120, rating: 4.5, ratingCount: 74, featured: false, trending: false,
  },
  {
    id: 'r_digital_portfolio_manual',
    slug: 'digital-portfolio-evidence-manual',
    title: 'The Digital Portfolio: Evidence Assembly Manual',
    type: 'Implementation Manual',
    executiveSummary:
      'How to assemble a clean, assurance-ready evidence dossier (tool #52) across the certification journey — structure, versioning and chain-of-custody.',
    executiveOverview:
      'The Digital Portfolio is the evidence backbone of certification. This manual specifies the dossier structure, indexing, versioning and chain-of-custody so that an independent assurance review is fast and defensible. It maps each certification requirement to the evidence artifact that satisfies it, and shows how to capture evidence during deployment rather than reconstructing it later.',
    purpose: 'Make assurance review fast and repeatable by standardizing evidence assembly.',
    businessValue: 'A clean portfolio is the difference between a one-pass and a multi-pass review.',
    keyInsights: [
      'Evidence captured in-flow beats evidence reconstructed after the fact.',
      'Chain-of-custody is what makes evidence independently trustable.',
      'Map every requirement to a named artifact before you start.',
    ],
    aiSummary:
      'Assemble certification evidence in the Digital Portfolio (tool #52) during deployment, with versioning and chain-of-custody, so assurance review passes first time.',
    ...A.cert,
    publishedAt: '2026-03-25', updatedAt: '2026-06-30', readingMinutes: 21,
    language: 'English', otherLanguages: ['French'],
    countries: ['Pan-African'], industries: ['Finance', 'Manufacturing', 'Technology'],
    domains: ['Certification', 'Accountability'],
    relatedSolutions: ['s3'], relatedFrameworks: ['VI'], relatedTools: [52],
    relatedJourneys: ['senegal-esg-practitioner-immersion'], relatedCertifications: ['APA Certified Institution'],
    certificationBadge: 'Certification',
    hasPdf: true, fileSizeKb: 4700,
    views: 6890, downloads: 4510, rating: 4.6, ratingCount: 97, featured: false, trending: false,
  },
  {
    id: 'r_investor_webinar',
    slug: 'investor-webinar-repricing-african-risk',
    title: 'Webinar: Repricing African Risk for Investors',
    type: 'Webinar',
    executiveSummary:
      'A recorded investor webinar on using verified governance signals in diligence — with a live walk-through of the σ-repricing model.',
    executiveOverview:
      'This investor webinar demonstrates how to integrate APA verification signals into diligence and valuation. It includes a live walk-through of the σ-repricing model, a Q&A on data reliability, and guidance on structuring Authenticity-Premium-linked terms into deals. Aimed at DFIs, funds and family offices active in African markets.',
    purpose: 'Show investors how to operationalize verified-governance signals in real diligence.',
    businessValue: 'Turns APA data into a diligence shortcut and a pricing lever.',
    keyInsights: [
      'Verified signals compress diligence time and dispute risk.',
      'Authenticity-Premium-linked terms align incentives post-close.',
      'Data reliability is a function of verification design, not volume.',
    ],
    aiSummary:
      'Investor webinar: integrate APA verification into diligence and valuation, with a live σ-repricing walk-through and guidance on Authenticity-Premium-linked deal terms.',
    ...A.samb,
    publishedAt: '2026-06-20', updatedAt: '2026-06-20', readingMinutes: 52,
    language: 'English', otherLanguages: ['French'],
    countries: ['Pan-African'], industries: ['Finance', 'Development Finance'],
    domains: ['Authenticity Premium™', 'ESG', 'Accountability'],
    relatedSolutions: ['s4'], relatedFrameworks: ['II', 'VI'], relatedTools: [21, 28],
    relatedJourneys: ['rwanda-sovereign-capital-co-architecture'], relatedCertifications: [],
    hasPdf: false, mediaUrl: 'https://www.youtube.com/@theapaafrica',
    views: 9120, downloads: 0, rating: 4.7, ratingCount: 118, featured: true, trending: false,
  },
  {
    id: 'r_sme_integrity_toolkit',
    slug: 'sme-integrity-pipeline-toolkit',
    title: 'SME Integrity Pipeline: Supplier Qualification Toolkit',
    type: 'Toolkit',
    executiveSummary:
      'A qualification toolkit (Audit Shield) to bring SMEs and cooperatives to certification-grade governance and into trade-compliant supplier pipelines.',
    executiveOverview:
      'This toolkit helps larger buyers and DFIs qualify SMEs and cooperatives into verified supplier pipelines. It bundles the Audit Shield qualification framework, rules-of-origin governance checks, a right-sized evidence set for smaller entities, and a graduation path from basic compliance to full certification.',
    purpose: 'Bring smaller entities into certified value chains without overwhelming them.',
    businessValue: 'Expands the pool of trade-ready, verifiable suppliers — the AfCFTA opportunity.',
    keyInsights: [
      'Right-size the evidence set or SMEs disengage.',
      'Rules-of-origin governance turns compliance into market access.',
      'A graduation path beats a pass/fail gate for smaller entities.',
    ],
    aiSummary:
      'Qualify SMEs/cooperatives into verified supplier pipelines with the Audit Shield toolkit — right-sized evidence, rules-of-origin governance and a graduation path to certification.',
    ...A.research,
    publishedAt: '2026-05-05', updatedAt: '2026-06-22', readingMinutes: 23,
    language: 'English', otherLanguages: ['French'],
    countries: ['Ghana', 'Nigeria', 'Kenya'], industries: ['Manufacturing', 'Agriculture', 'Finance'],
    domains: ['Certification', 'Accountability', 'ESG'],
    relatedSolutions: ['s3', 's5'], relatedFrameworks: ['III', 'V'], relatedTools: [30, 52, 53],
    relatedJourneys: ['ghana-afcfta-co-architecture-practicum'], relatedCertifications: ['APA Certified Institution'],
    hasPdf: true, fileSizeKb: 5200,
    views: 7010, downloads: 4230, rating: 4.5, ratingCount: 103, featured: false, trending: false,
  },
  {
    id: 'r_diaspora_article',
    slug: 'diaspora-sovereign-capital-pathway',
    title: 'The Diaspora Sovereign Capital Pathway',
    type: 'Article',
    executiveSummary:
      'How the African diaspora can deploy expertise and capital through verifiable, accountable structures rather than opaque remittance channels.',
    executiveOverview:
      'This article maps a structured pathway for diaspora investors to move beyond remittances into accountable, verifiable enterprise stakes. It covers the trust instruments that make cross-border diaspora capital safe to deploy, the role of certification as a shared language, and how kinship equity formalizes what informal networks already do.',
    purpose: 'Give diaspora investors a verifiable alternative to opaque capital channels.',
    businessValue: 'Unlocks patient diaspora capital by making destinations verifiably accountable.',
    keyInsights: [
      'Certification is the shared language that lets diaspora capital travel safely.',
      'Kinship equity formalizes trust that informal networks already rely on.',
      'Verification reduces the "distance discount" diaspora investors apply.',
    ],
    aiSummary:
      'A structured, verifiable pathway for diaspora capital beyond remittances — using certification as shared language and kinship equity to formalize trust.',
    ...A.babangida,
    publishedAt: '2026-06-28', updatedAt: '2026-07-02', readingMinutes: 14,
    language: 'English', otherLanguages: ['French'],
    countries: ['Nigeria', 'Senegal', 'Kenya'], industries: ['Finance', 'Development Finance', 'Technology'],
    domains: ['Accountability', 'CSV'],
    relatedSolutions: ['s6'], relatedFrameworks: ['II'], relatedTools: [18],
    relatedJourneys: [], relatedCertifications: [],
    hasPdf: true, fileSizeKb: 1600,
    views: 4320, downloads: 1510, rating: 4.4, ratingCount: 44, featured: false, trending: true,
  },
  {
    id: 'r_transparency_framework',
    slug: 'radical-transparency-framework',
    title: 'The Radical Transparency Framework',
    type: 'Framework',
    executiveSummary:
      'A framework for transparency that is verifiable and safe — distinguishing performative disclosure from evidence that survives independent challenge.',
    executiveOverview:
      'Radical Transparency reframes disclosure around falsifiability: information counts only if it can be independently challenged and survives. This framework distinguishes performative transparency (volume) from verifiable transparency (evidence), and sets out the safeguards — anti-retaliation, narrative sovereignty — that make openness safe for the people it depends on.',
    purpose: 'Replace disclosure-by-volume with transparency that capital and communities can trust.',
    businessValue: 'Verifiable transparency is what actually moves the risk premium.',
    keyInsights: [
      'Transparency counts only when it is falsifiable.',
      'Openness without anti-retaliation safeguards is unsafe and unreliable.',
      'Volume of disclosure is not a proxy for trust.',
    ],
    aiSummary:
      'Transparency should be judged by falsifiability, not volume. Verifiable, safeguarded disclosure — not more reports — is what moves the risk premium.',
    ...A.samb,
    publishedAt: '2026-02-05', updatedAt: '2026-05-18', readingMinutes: 17,
    language: 'English', otherLanguages: ['French'],
    countries: ['Pan-African'], industries: ['Government', 'Finance', 'NGOs'],
    domains: ['Transparency', 'Accountability', 'Ethics'],
    relatedSolutions: ['s1', 's2'], relatedFrameworks: ['I', 'V'], relatedTools: [1, 55],
    relatedJourneys: [], relatedCertifications: [],
    hasPdf: true, fileSizeKb: 2000,
    views: 8230, downloads: 3340, rating: 4.6, ratingCount: 129, featured: false, trending: false,
  },
];

// ── Learning paths ───────────────────────────────────────
export const LEARNING_PATHS: LearningPath[] = [
  {
    slug: 'governance-foundations',
    title: 'Governance Foundations',
    tagline: 'Start here — the APA thesis, framework and vocabulary.',
    description: 'The essential on-ramp: understand why trust is the scarce capital, how the six pillars fit together, and the language the rest of the ecosystem speaks.',
    level: 'Foundation', icon: '🏛️', accent: 'apa-gradient',
    resourceSlugs: ['accountable-africa-podcast-ep1', 'apa-governance-framework-overview', 'radical-transparency-framework'],
    outcomes: ['Explain the APA thesis in one paragraph', 'Name the six pillars and what each does', 'Distinguish verifiable from performative governance'],
  },
  {
    slug: 'authenticity-premium',
    title: 'Authenticity Premium™',
    tagline: 'The economics of verifiable trust.',
    description: 'How verified governance reprices risk and raises valuation — the σ model, the investor view, and a worked sovereign case.',
    level: 'Intermediate', icon: '💠', accent: 'bg-apa-navy',
    resourceSlugs: ['authenticity-premium-explained', 'investor-webinar-repricing-african-risk', 'rwanda-sovereign-capital-case-study'],
    outcomes: ['Explain σ and its link to cost of capital', 'Structure Authenticity-Premium-linked terms', 'Read a repricing model'],
  },
  {
    slug: 'certification-preparation',
    title: 'Certification Preparation',
    tagline: 'From C-SPA gate to certified seal.',
    description: 'Everything a candidate institution needs: the pathway, the C-SPA diagnostic, and clean evidence assembly for a one-pass assurance review.',
    level: 'Intermediate', icon: '🎓', accent: 'bg-apa-gold-bright',
    resourceSlugs: ['apa-certification-pathway-guide', 'c-spa-diagnostic-implementation-guide', 'digital-portfolio-evidence-manual'],
    outcomes: ['Map the five certification steps', 'Run a defensible C-SPA', 'Assemble an assurance-ready Digital Portfolio'],
  },
  {
    slug: 'community-verification',
    title: 'Community Verification',
    tagline: 'Turn communities into an independent verification layer.',
    description: 'Deploy the CVP, co-design grievance mechanisms and measure impact with MAE — the field discipline behind verifiable trust.',
    level: 'Advanced', icon: '🤝', accent: 'bg-apa-green',
    resourceSlugs: ['community-verification-portal-toolkit', 'made-in-africa-evaluation-methodology', 'policy-brief-mining-community-accountability'],
    outcomes: ['Stand up a Community Verification Portal', 'Co-design a grievance mechanism (MGG)', 'Run community-weighted MAE indicators'],
  },
  {
    slug: 'shared-value-and-capital',
    title: 'Shared Value & Capital',
    tagline: 'Structure deals where community and enterprise value compound.',
    description: 'CSV design, SME integrity pipelines and diaspora capital — the instruments that connect verified governance to real capital flows.',
    level: 'Advanced', icon: '📈', accent: 'bg-apa-teal',
    resourceSlugs: ['creating-shared-value-african-playbook', 'sme-integrity-pipeline-toolkit', 'diaspora-sovereign-capital-pathway'],
    outcomes: ['Design a CSV deal structure', 'Qualify SMEs into verified pipelines', 'Structure accountable diaspora capital'],
  },
];

// ── Helpers ──────────────────────────────────────────────
export function getResourceBySlug(slug: string): Resource | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}
export function getLearningPathBySlug(slug: string): LearningPath | undefined {
  return LEARNING_PATHS.find((p) => p.slug === slug);
}
