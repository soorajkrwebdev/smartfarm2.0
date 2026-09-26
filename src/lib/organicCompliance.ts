/**
 * Chunk 3 — Organic terminology, claim grades and regulatory source registry.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * "Natural", "organic input", "listed in a standard" and "certified product" are
 * four different statements. Blurring them is the most common compliance failure
 * in organic content, and this app is not allowed to make that mistake: every
 * organic string is graded with the vocabulary below, and every regulatory
 * statement points at a URL that was actually retrieved on the date recorded in
 * ORGANIC_SOURCE_REGISTRY (`retrieved_on`).
 *
 * Nothing in this file — and nothing rendered from it — certifies anything.
 * Organic certification in India is granted only by a certification body
 * accredited by APEDA under NPOP, or by a PGS-India Regional Council.
 */

import type { OrganicClassification, OrganicVerificationStatus } from '../types';

export interface OrganicTermDefinition {
  term: string;
  /** One-line plain-language meaning, shown next to the badge. */
  short: string;
  /** Full explanation used by the terminology guide. */
  detail: string;
  /** What the word legitimately proves when used correctly. */
  proves: string;
  /** What the word must never be used to imply. */
  doesNotProve: string;
  source_name: string;
  source_url?: string;
  verification_status: OrganicVerificationStatus;
}

/**
 * The four regulated terms, plus the `not-established` fallback used for any
 * record whose organic status we cannot evidence.
 */
export const ORGANIC_TERMINOLOGY: Record<OrganicClassification, OrganicTermDefinition> = {
  natural: {
    term: 'Natural',
    short: 'A descriptive/marketing word. It is not an organic certification status.',
    detail:
      'There is no organic certification called "Natural". FSSAI consumer guidance under Jaivik Bharat asks ' +
      'buyers to note that certified organic food carries the word "Organic" on the label and is not sold as a ' +
      '"Natural" or "Green" food. A material can be genuinely natural (mined, plant- or animal-derived) and still ' +
      'be restricted in certified organic production.',
    proves: 'Something about the origin or processing of a material.',
    doesNotProve:
      'That the material is allowed by an organic standard, that it was inspected, or that anything about it was verified by a third party.',
    source_name: 'FSSAI — Jaivik Bharat FAQ',
    source_url: 'https://jaivikbharat.fssai.gov.in/faq.php',
    verification_status: 'Source-backed',
  },
  'organic-input': {
    term: 'Organic input',
    short: 'A material commonly used in organic-style farming (manure, biofertilizer, botanical).',
    detail:
      'This describes the role a material plays in a farming system that avoids most synthetic inputs. It is the ' +
      'level this knowledge library operates at: we describe what a material is and how extension guidance says it ' +
      'is used. Whether a specific branded product may be used on a specific certified holding is a separate ' +
      'decision made by the certification body or Regional Council against the currently applicable standard.',
    proves: 'How a material is used and why, in organic-style production.',
    doesNotProve:
      'That a product is permitted, listed or approved, or that produce from a farm using it can be sold as organic.',
    source_name: 'SmartFarm editorial definition (aligned to NPOP / PGS-India scope)',
    verification_status: 'Educational',
  },
  'listed-in-standard': {
    term: 'Listed in a standard',
    short: 'Named in the input list of an applicable organic standard, subject to conditions.',
    detail:
      'Organic standards such as NPOP govern inputs through lists of materials and conditions, reviewed and ' +
      'republished with each edition of the standard. Listing is conditional and edition-specific, so it must be ' +
      'checked against the edition your certifier applies. This library deliberately marks no record at this ' +
      'level: we do not hold a retrieved current-edition input list, so nothing here claims listing status.',
    proves: 'Only what the specific edition of the specific standard says, about the specific material.',
    doesNotProve:
      'That a branded product containing the material is approved, or that listing carries over between standard editions.',
    source_name: 'APEDA — National Programme for Organic Production (NPOP)',
    source_url: 'https://npop.apeda.gov.in/about-organic-products',
    verification_status: 'Needs Verification',
  },
  'certified-product': {
    term: 'Certified product',
    short: 'A farm, plot or consignment covered by a valid certificate issued by a certification body.',
    detail:
      'Under NPOP an operator is inspected by an APEDA-accredited certification body and issued a Scope ' +
      'Certificate for certified production; sales of organic goods are covered by Transaction Certificates. ' +
      'Under PGS-India a grower group is certified by a PGS-India Regional Council. Only those bodies can grant ' +
      'this status, and only a valid certificate — not this app, not your own logs — lets produce be sold as organic.',
    proves: 'That an accredited third party, or a PGS Regional Council, has certified the operator or consignment.',
    doesNotProve:
      'Nothing is proven here: no record, activity log, input purchase or dashboard in SmartFarm creates certification.',
    source_name: 'MSOCB (APEDA-accredited certification body) FAQ',
    source_url: 'https://msocb.org/faq_page/',
    verification_status: 'Source-backed',
  },
  'not-established': {
    term: 'Not established',
    short: 'We cannot evidence this record against an organic standard, so no organic claim is made.',
    detail:
      'Most library records sit here. The material is described, its agronomic role is explained, and its organic ' +
      'relevance is stated only as: ask your certifier whether this material and this product may be used on your ' +
      'holding, under the edition of the standard you are certified against.',
    proves: 'Agronomic and practical information about the material.',
    doesNotProve: 'Any organic, NPOP, PGS-India or FSSAI status whatsoever.',
    source_name: 'SmartFarm content policy',
    verification_status: 'Educational',
  },
};

/** Display order for the terminology guide. */
export const ORGANIC_TERMINOLOGY_ORDER: OrganicClassification[] = [
  'natural',
  'organic-input',
  'listed-in-standard',
  'certified-product',
  'not-established',
];

/**
 * The explanation of the acronym itself, kept in one place so no component can
 * invent a stronger meaning for it.
 */
export const NPOP_MEANING =
  'NPOP is the National Programme for Organic Production — India’s organic production and accreditation ' +
  'programme, implemented by APEDA (Agricultural and Processed Food Products Export Development Authority, ' +
  'under the Ministry of Commerce and Industry). NPOP is the name of the standards and accreditation programme: ' +
  'inspection and certification are carried out by certification bodies accredited by APEDA. APEDA does not ' +
  'visit each farm, and neither does this app.';

export const PGS_INDIA_MEANING =
  'PGS-India is the Participatory Guarantee System for India — a decentralised quality assurance initiative ' +
  'of the Ministry of Agriculture and Farmers Welfare, implemented through the National Centre of Organic ' +
  'Farming (NCOF). It certifies grower groups through PGS-India Regional Councils using stakeholder ' +
  'participation, peer review and internal control systems, operating outside third-party certification. It is ' +
  'based on NPOP standards but is distinct from NPOP in its certification procedure.';

/** The short line rendered inside an input detail sheet. */
export function classificationLabel(classification: OrganicClassification): string {
  return ORGANIC_TERMINOLOGY[classification].term;
}

/**
 * The per-record line explaining why this classification and not a stronger one.
 * Records may carry their own note; this is the fallback derived from the term.
 */
export function classificationNote(classification: OrganicClassification): string {
  const term = ORGANIC_TERMINOLOGY[classification];
  return `${term.short} It proves ${lowerFirst(term.proves)} It does not prove ${lowerFirst(term.doesNotProve)}`;
}

function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

/* ------------------------------------------------------------------ *
 * Verification vocabulary — what each grade entitles the UI to say.
 * ------------------------------------------------------------------ */

export interface VerificationGuide {
  status: OrganicVerificationStatus;
  /** Meaning of the grade. */
  meaning: string;
  /** What a user may conclude from it. */
  allowed_claim: string;
  tone: 'success' | 'info' | 'warning';
}

export const VERIFICATION_GUIDE: VerificationGuide[] = [
  {
    status: 'Verified',
    meaning:
      'The statement was re-checked against a named, retrievable source on the recorded date, and the wording follows that source.',
    allowed_claim:
      'You may act on the stated figures, and re-check them yourself at the linked source. Re-verify before relying on them in a certification context.',
    tone: 'success',
  },
  {
    status: 'Source-backed',
    meaning:
      'The statement restates a specific published position (usually a regulator or programme document) held at the linked URL.',
    allowed_claim:
      'Treat the linked document as the authority. Where it is a rule that affects your certification, confirm the current text with your certification body.',
    tone: 'info',
  },
  {
    status: 'Educational',
    meaning:
      'General agronomic teaching with no specific figure attached. Useful for planning and for asking better questions.',
    allowed_claim:
      'Use it as background. Calibrate any rate, timing or interval to your own conditions and to local extension advice.',
    tone: 'info',
  },
  {
    status: 'Needs Verification',
    meaning:
      'A specific that this library could not link to a retrievable source. It is a question to ask, not a fact to act on.',
    allowed_claim:
      'Do not use it for planning, costing or compliance. Ask your certifier or state extension service and record what they tell you.',
    tone: 'warning',
  },
  {
    status: 'General Agricultural Information',
    meaning:
      'Carried over from the earlier input catalogue. Treated with the same care as the Educational grade.',
    allowed_claim: 'Background only. Confirm specifics before use.',
    tone: 'info',
  },
  {
    status: 'Unverified / For Review',
    meaning: 'The default grade: entered into the catalogue but not yet through the content audit.',
    allowed_claim: 'Nothing yet. Review it, then re-grade it.',
    tone: 'warning',
  },
];

/* ------------------------------------------------------------------ *
 * Source registry — every regulatory statement resolves to one of these,
 * each retrieved on the recorded date.
 * ------------------------------------------------------------------ */

export interface OrganicSourceEntry {
  id: string;
  name: string;
  kind: 'Government Portal' | 'University Portal' | 'Certification Body' | 'Research Institute' | 'Internal Audit';
  url?: string;
  /** The date the URL was actually retrieved for this build. */
  accessed: string;
  /** What this source is relied on for. */
  supports: string[];
  /** What this source cannot be used to conclude. */
  limitation: string;
}

export const ORGANIC_AUDIT_DATE = '2026-09-26';

export const ORGANIC_SOURCE_REGISTRY: OrganicSourceEntry[] = [
  {
    id: 'apeda-npop',
    name: 'APEDA — National Programme for Organic Production (NPOP)',
    kind: 'Government Portal',
    url: 'https://npop.apeda.gov.in/about-organic-products',
    accessed: ORGANIC_AUDIT_DATE,
    supports: [
      'NPOP stands for National Programme for Organic Production and is implemented by APEDA.',
      'APEDA works under the Ministry of Commerce and Industry.',
      'Organic operators are inspected and certified by certification bodies accredited by APEDA.',
    ],
    limitation:
      'Programme overview page. It does not restate input lists, conversion periods or logo rules — those sit in the standard documents and in the guidance of your certification body.',
  },
  {
    id: 'fssai-jaivik-faq',
    name: 'FSSAI — Jaivik Bharat FAQ',
    kind: 'Government Portal',
    url: 'https://jaivikbharat.fssai.gov.in/faq.php',
    accessed: ORGANIC_AUDIT_DATE,
    supports: [
      'Organic food for sale is labelled with the word “Organic”; FSSAI consumer guidance distinguishes it from “Natural” and “Green” food claims.',
      'Consumer label checks: the FSSAI logo and licence number, the India Organic logo with the certification body’s name/logo and accreditation number, and for PGS-India a unique ID code.',
      'Produce sold directly by a primary producer to consumers is treated differently from packaged organic food.',
    ],
    limitation:
      'An FAQ summarising the Food Safety and Standards (Organic Food) Regulations, 2017. The Regulations are the authority, and only FSSAI can rule on a label.',
  },
  {
    id: 'fssai-pgs',
    name: 'FSSAI — Jaivik Bharat, PGS-India',
    kind: 'Government Portal',
    url: 'https://jaivikbharat.fssai.gov.in/standard-pgs.php',
    accessed: ORGANIC_AUDIT_DATE,
    supports: [
      'PGS-India is a decentralised, participatory quality-assurance system implemented through the National Centre of Organic Farming under the Ministry of Agriculture and Farmers Welfare.',
      'PGS-India is based on NPOP standards but is distinct in its certification procedure, using group certification through PGS-India Regional Councils.',
    ],
    limitation:
      'Programme description page. Logo-use and transaction rules for PGS produce sit with NCOF / Regional Council guidance, not with this page.',
  },
  {
    id: 'pgs-ncof',
    name: 'National Centre of Organic Farming — PGS-India',
    kind: 'Government Portal',
    url: 'https://pgsindia-ncof.gov.in/',
    accessed: ORGANIC_AUDIT_DATE,
    supports: ['PGS-India is implemented through NCOF, Regional Councils and group Internal Control Systems.'],
    limitation:
      'Programme landing page. The scheme order, manual and logo guidelines are separate documents that were not retrieved for this build.',
  },
  {
    id: 'msocb-faq',
    name: 'MSOCB — certification body FAQ',
    kind: 'Certification Body',
    url: 'https://msocb.org/faq_page/',
    accessed: ORGANIC_AUDIT_DATE,
    supports: [
      'The terms Scope Certificate (issued to an operator for certified production) and Transaction Certificate (issued for consignment sales).',
      'The general application, inspection and certification sequence an operator goes through.',
    ],
    limitation:
      'The published material of one APEDA-accredited certification body. Wording, forms and intervals differ between certification bodies — your own certifier’s documents prevail.',
  },
  {
    id: 'tnau-vermicompost',
    name: 'TNAU Agritech Portal — Vermicompost production and use',
    kind: 'University Portal',
    url: 'https://agritech.tnau.ac.in/agriculture/agri_horticulture_vermicompost.html',
    accessed: ORGANIC_AUDIT_DATE,
    supports: [
      'The earthworm species used in the TNAU production description and the bedding and feed materials it names.',
      'Maintaining feed moisture at 70–90 percent, and the bed dimensions it gives.',
      'Nutrient composition ranges reported in its “Nutrient composition of vermicompost” table.',
      'Its statement that a vermicompost product marketed as organic falls under FSSAI organic regulation.',
    ],
    limitation:
      'One institution’s measured ranges from its own production units. Your own compost must be tested — the ranges are not a specification. It is not an NPOP input-list statement.',
  },
  {
    id: 'tnau-vermi-faq',
    name: 'TNAU Agritech Portal — Vermicompost FAQ',
    kind: 'University Portal',
    url: 'https://agritech.tnau.ac.in/agrifaq/agri_horticulture_vermi_faq.html',
    accessed: ORGANIC_AUDIT_DATE,
    supports: [
      'Vermicompost improves the physical and biological properties of soil and increases nutrient availability.',
    ],
    limitation:
      'A short FAQ. It carries no application rate and no yield figure, so no number may be attributed to it.',
  },
  {
    id: 'tnau-soil-nourishment',
    name: 'TNAU Agritech Portal — Soil nourishment (Bhumi Upchar) and plant growth promotion',
    kind: 'University Portal',
    url: 'https://agritech.tnau.ac.in/org_farm/orgfarm_ofk_soil.html',
    accessed: ORGANIC_AUDIT_DATE,
    supports: [
      'The Jivamrut recipe: 100 litres of water, 10 kg cow dung, 10 litres cow urine, 2 kg jaggery and 2 kg gram or pulse flour.',
      'Fermenting that mix for 5–7 days and shaking it three times a day.',
      'Three soil applications — before sowing, at 20 days after sowing and at 45 days after sowing — by sprinkling or through irrigation water.',
      'Measured microbial colony counts (cfu/ml) for Panchagavya, Beejamrutha, Jeevamrutha and biodigester in its Table 1.',
    ],
    limitation:
      'A single institutional page in the TNAU organic farming section. Its Table 2 “Total Nitrogen” row carries inconsistent units, so no nitrogen figure is quoted from it; the colony counts are measurements of particular samples, not a specification for your preparation.',
  },
];

export function getSourceEntry(id: string): OrganicSourceEntry | undefined {
  return ORGANIC_SOURCE_REGISTRY.find(entry => entry.id === id);
}

/* ------------------------------------------------------------------ *
 * Mandatory disclaimers. Rendered verbatim — do not paraphrase them in
 * components, and do not shorten them below the short form.
 * ------------------------------------------------------------------ */

/** The master disclaimer, shown at the foot of every organic screen. */
export const ORGANIC_KNOWLEDGE_DISCLAIMER =
  'This library is educational. It explains what organic inputs are, how they are prepared and how they are ' +
  'commonly used, and it links each specific statement to the source it came from. It is not legal advice, it is ' +
  'not agronomic advice for your specific field, and it does not certify anything. Rules for organic production ' +
  'in India come from the standard your certification body or PGS-India Regional Council applies, and from FSSAI ' +
  'for the labelling and sale of organic food. Confirm every input and every label decision with them in writing ' +
  'before it affects your farm or your produce.';

/** Shown wherever the app mentions certification. */
export const CERTIFICATION_DISCLAIMER =
  'Certification is granted only by a certification body accredited by APEDA under NPOP, or by a PGS-India ' +
  'Regional Council. SmartFarm records what you do and helps you keep the documents an inspector will ask for; ' +
  'it cannot inspect, approve, certify or upgrade your farm, and no record, log or dashboard in this app creates ' +
  'organic status.';

/**
 * Conversion periods: deliberately NOT stated as a number. The widely quoted
 * 24-month / 36-month periods come from NPOP standard text that this build could
 * not retrieve as a source, so the app asks rather than asserts. See
 * docs/specs/organic-awareness-data-audit.md.
 */
export const CONVERSION_DISCLAIMER =
  'A block moving to organic production normally passes a conversion period during which it follows organic ' +
  'practices, and produce from that period cannot be sold as organic. The length depends on the programme ' +
  '(NPOP or PGS-India), on the crop type, and on the history of your block. This app does not state a conversion ' +
  'length, because it must come from the edition of the standard you are certified against. Ask your ' +
  'certification body or Regional Council, and keep the confirmation with your documents.';

/**
 * Logo use: also deliberately silent about logo artwork. The India Organic and
 * PGS-India logos are regulated marks issued through the certification system.
 */
export const LOGO_DISCLAIMER =
  'The India Organic logo and the PGS-India logo are regulated marks controlled by the certification system, ' +
  'not images you may place on a label or a poster. Permission, artwork and conditions come from your ' +
  'certification body or Regional Council. This app deliberately shows no certification logo artwork.';

/** Shown inside the input detail sheet. */
export const INPUT_USE_DISCLAIMER =
  'Naming a material in this library is not permission to use it. What you may apply to a certified or ' +
  'converting block is decided by the standard you are certified against and by your certification body or ' +
  'Regional Council, usually product by product. Ask them in writing, and keep the reply in your records.';

/* ------------------------------------------------------------------ *
 * Claim-boundary linter.
 * ------------------------------------------------------------------ */

export interface ProhibitedPhrase {
  id: string;
  pattern: RegExp;
  /** Why this wording is not allowed. */
  why: string;
  /** The wording the library uses instead. */
  instead: string;
}

/**
 * Wording that would push an educational statement into a certification claim.
 * `assertKnowledgeBaseWithinClaimBoundaries` in
 * docs/specs/organic-awareness-audit.spec.ts runs these against every string in
 * the organic knowledge library.
 */
export const PROHIBITED_PHRASES: ProhibitedPhrase[] = [
  {
    id: 'app-certifies',
    pattern: /smartfarm[\s,]+(can|will|could|automatically)?\s*(be\s+)?(certif|accredit)/i,
    why: 'SmartFarm is not a certification body and cannot grant or imply certification.',
    instead: 'SmartFarm prepares and organises the documents your certification body asks for.',
  },
  {
    id: 'approved-by-regulator',
    pattern: /\b(approved|permitted|listed|accepted)\s+by\s+(npop|apeda|fssai|ncof|nske|icar|the\s+government)/i,
    why: 'We have not retrieved the current list that would make this true, and input lists change with each edition of a standard.',
    instead: 'ask your certification body whether this material and product may be used on your holding',
  },
  {
    id: 'guaranteed-organic',
    pattern: /\b(guaranteed|assured|confirmed)\s+organic\b/i,
    why: 'Only a valid certificate supports an organic statement, and that statement is about an operator or a consignment.',
    instead: 'no organic status is claimed; the material is described as used in organic-style farming',
  },
  {
    id: 'equivalent-to-organic',
    pattern: /\b(same|equivalent|equal)\s+to\s+(certified\s+)?organic\b|natural(ly)?\s*(=|equals)\s*organic/i,
    why: 'It erases the difference between a descriptive word and a regulated term.',
    instead: 'state the material’s role, then say that organic status is a separate certification question',
  },
  {
    id: 'automatic-status',
    pattern: /\bautomatically\s*(become|becomes|certif|convert|qualif)/i,
    why: 'Nothing becomes organic automatically; a programme decision is always required.',
    instead: 'after following the practices, the programme still has to decide',
  },
  {
    id: 'drip-application',
    pattern: /\bfertigation\b|\bdrip\s+(line|system)?\s*(application|injection)\b/i,
    why: 'Home-made liquids are not recommended for drip systems: solids clog emitters, and injection needs a backflow and compatibility check. The verified sources describe sprinkling or applying through irrigation water.',
    instead: 'soil drench or sprinkler application, after straining, after testing on a small area',
  },
  {
    id: 'absolute-claim',
    pattern: /100\s*%|chemical[- ]free|totally\s+safe|harmless\b/i,
    why: 'Absolute claims cannot be substantiated, and this is the wording regulators warn against.',
    instead: 'the specific inputs actually avoided, as recorded in the activity log',
  },
  {
    id: 'invented-area-rate',
    pattern: /\bper\s+(acre|hectare)\b|\bone\s+acre\b|\bper\s+acre\b/i,
    why: 'A rate per unit area must sit beside the source that publishes it. None of our retrieved sources give per-unit-area rates for these preparations.',
    instead: 'the recipe or rate exactly as the linked source states it, with no unit-area conversion invented here',
  },
];

/** Which prohibited-phrase rules a piece of text trips over. */
export function findProhibitedPhrases(text: string): ProhibitedPhrase[] {
  return PROHIBITED_PHRASES.filter(phrase => phrase.pattern.test(text));
}



