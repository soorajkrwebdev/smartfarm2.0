# SmartFarm 2.0 — Chunk 2: Pesticide Usage Advisory + Integrated Pest Management Engine

## Problem

The existing Pest & IPM module is a thin three-tab CRUD surface (observations / IPM records / advisory library) that does not yet embody the project's flagship intelligence identity. It lacks: (a) a proper IPM decision workflow with the Prevent→Monitor→Identify→Assess→Non-chemical→Biological→Botanical→Chemical→Follow-up hierarchy; (b) source-verified chemical advisory provenance (dose, PHI, REI are never invented); (c) pesticide application records separated from advisory knowledge with strict validation; (d) pest observation follow-up outcomes; (e) a crop-protection history timeline; (f) the 7-section module layout the spec requires; (g) target-crop + control-category advisory filtering; and (h) hardened RLS on pest children, plus proper provenance fields so claims are traceable to ICAR / ICAR-CPCRI / ICAR-IISR documents rather than labelled authoritatively by inference.

## Users

- Farmer user (primary): records scouting observations, tracks IPM decisions/applications/follow-ups, and consults source-verified crop protection advice for their Arecanut / Coconut / Black Pepper / Banana / Coffee / Paddy / Ginger / Turmeric / Cardamom crops.
- Agricultural extension officer (secondary, future): uses same knowledge library for grounded source-backed recommendations — NOT in scope for this chunk.

## Goals

1. Make the Pest & IPM page the platform's clearly evident PRIMARY intelligence module with the section layout: Crop/Pest Overview → Record Observation → My Pest History → IPM Decision Workflow → Pesticide Advisory → Pesticide Application Records → Follow-up & Outcome.
2. Model IPM strictly as PREVENT → MONITOR → IDENTIFY → ASSESS → CULTURAL → MECHANICAL → BIOLOGICAL → BOTANICAL → CHEMICAL (last resort, source-verified) → FOLLOW-UP → EVALUATE.
3. Ensure every chemical advisory card displays provenance: Source organization, Document title, Last verified, Verification status; and never fabricates dose / concentration / PHI / REI / tank-mix / registration / compatibility claims when unsupported.
4. Distinguish `PestAdvisory` (agricultural knowledge) from `PesticideApplication` (farmer-recorded action) with mandatory validation for required application fields and non-invented PHI/REI.
5. Add a pest follow-up entity that records post-treatment severity + area + outcome (improved / unchanged / worsened / unknown) without auto-claiming treatment efficacy.
6. Seed target-crop advisory knowledge (Arecanut, Coconut, Black Pepper first; Banana / Coffee / Paddy / Ginger / Turmeric / Cardamom extensible) using ICAR-family sources and clear claim-level verification grades — never blanket "Verified Authoritative" without source traceability.
7. Enforce server-side farm ownership for all new private tables (pest_follow_ups + cross-farm guards on pest_observations / ipm_records / pesticide_applications) and ensure authenticated Supabase is the only data source (no demo/mock/fake fallbacks).
8. 100% TypeScript type-safety from Postgres schema → Supabase result → TS interface → FarmContext → Page → Component; no `any` / `@ts-ignore` / `@ts-expect-error`; `npx tsc --noEmit`, `npm run build`, `npm run lint` all pass.

## Non-Goals

- Building pesticide e-commerce, product purchase, pesticide marketplace, or organic certification features.
- Adding LLM/AI-based diagnosis (this chunk uses the existing knowledge base only).
- Writing a lab-level diagnostic engine; symptom matching uses "Possible causes" + confidence + source wording only.
- Creating standalone e2e browser tests; Test Requirements use static inspection, source grep, TS build, lint, build, policy grep.
- Exposing Supabase `service_role` or any backend-only key in the frontend.
- Replacing React / Supabase architecture or rebuilding from scratch.

## Functional Requirements (FR)

### FR-1 — Pest Module Page Layout (7 sections)
The `PestPage` MUST render the following seven clearly labelled sections in order with a sticky anchor-navigation sidebar or collapsible section headers:
1. A — Crop/Pest Overview (KPIs: Active observations, High/critical severity, Open follow-ups, Pesticide applications this season; quick action buttons for Record Observation / Open Pesticide Advisory / Explore Organic Inputs).
2. B — Record Observation (modal, inline CTA, or dedicated section form that opens the observation capture flow with all required FR-2 fields).
3. C — My Pest History (grouped timeline: Observation event → IPM Decision event → Control method event → Application event → Follow-up event, all clickable).
4. D — IPM Decision Workflow (9 numbered steps: Verify → Monitor → Prevention → Cultural → Mechanical/Physical → Biological → Botanical → Chemical → Follow-up, each expandable with guidance text and buttons to log an IPM record at the correct level).
5. E — Pesticide Advisory Library (cards with FR-6 provenance + FR-15 crop/pest/control filters + FR-14 professional chemical disclaimer).
6. F — Pesticide Application Records (list of farmer-entered applications with FR-8 fields; edit/delete via existing FarmContext methods; new-application form enforces FR-9 validation).
7. G — Follow-up & Outcome (list of FR-10 follow-up records; CTA to create new follow-up against an observation or application).

### FR-2 — Pest Observation Capture
`PestObservationModal` (or an inline form) MUST collect all fields required by the interface: farm (required), crop (optional), crop growth stage (required, default 'Vegetative'), observation date (required), pest/disease name (required), pest type (insect / disease / nematode / weed / mammal / bird / other), symptoms (required), severity (low / medium / high / critical, required), affected area (%), photos (optional array), notes (optional).

### FR-3 — "Possible Causes" Diagnosis Language
When advisory library cards are shown alongside symptoms (or any user-facing text suggests a cause), UI language MUST use "Possible causes" + suspected pest/disease name + confidence (if available) + source reference. The words "Confirmed diagnosis" MUST NOT appear anywhere in the Pest module UI or seed strings.

### FR-4 — IPM Decision Workflow Steps
Section D MUST render 9 explicitly-numbered steps with brief guidance content and a "Log this level" action for steps 3–8 that pre-fills an `IpmRecordModal` at the matching `AdvisoryLevel` (prevention / cultural / mechanical / biological / botanical / chemical):
- Step 1 — VERIFY: Check symptoms and field conditions (informational only, no log action required, links to Record Observation).
- Step 2 — MONITOR: Record severity and affected area (informational, links to Edit Observation).
- Step 3 — PREVENTION: Crop hygiene, sanitation, resistant varieties (source-backed where applicable), proper spacing, soil health, drainage, balanced nutrition.
- Step 4 — CULTURAL CONTROL (AdvisoryLevel = `cultural`).
- Step 5 — MECHANICAL / PHYSICAL CONTROL (AdvisoryLevel = `mechanical`).
- Step 6 — BIOLOGICAL CONTROL (AdvisoryLevel = `biological`; explicitly cross-links to the biological/biocontrol rows of Organic Input Library where matching ones exist — e.g. Trichoderma, Pseudomonas, Metarhizium).
- Step 7 — BOTANICAL OPTIONS (AdvisoryLevel = `botanical`; e.g. NSKE 5%).
- Step 8 — CHEMICAL CONTROL (AdvisoryLevel = `chemical`; only if justified, with FR-14 disclaimer surfaced inline before any chemical advisory rows render, and source-verified).
- Step 9 — FOLLOW-UP (informational + CTA to create a Pest Follow-up record per FR-10).

### FR-5 — Advisory Provenance Model
The `PestAdvisory` TypeScript interface + the `public.pesticide_advisories` SQL schema MUST be extended with provenance fields:
- `source_document_title` (text, optional)
- `source_document_date` (date, optional)
- `source_page` (text, optional, "p. 42" or "Chapter 3" style)
- `source_reference` (text, optional, e.g. "ICAR-CPCRI Technical Bulletin No. 17/2020")
- `verified_by` (text, optional, person or authority name)
- `verified_at` (timestamptz, optional)
In addition `verification_status` MUST be a strict union (TS + Postgres CHECK) of exactly: `'Registered Formulation' | 'Registered Use (Crop/Pest)' | 'General Agricultural Information' | 'Non-chemical IPM Practice' | 'Unverified / For Review'`. The earlier default blanket value `'Verified Authoritative'` MUST be replaced with the correct granular grade in every seeded row and in the UI display of FR-13.

### FR-6 — Source-Verified Chemical Safety
For `control_category='chemical'` advisories:
- If any of `application_information` / `pre_harvest_interval_days` (new field to add) / `re_entry_interval_hours` (new field to add) / dose / concentration / mixing ratio / spray interval / tank-mix / compatibility claims are absent in the trusted source row, the corresponding card section MUST show: *"Verified chemical application information is not available in the current knowledge base."* instead of filling with generated text.
- The module MUST NOT introduce any AI/generator that synthesises the above values. The codebase MUST be greppable to prove this (no such synthesis logic exists, and static seeded rows only carry values that match their documented source_reference).

### FR-7 — Pesticide Application Records (ADVISORY vs. APPLICATION separation)
Section F list MUST clearly label each record type: "ADVISORY — [source-backed recommendation]" and "APPLICATION RECORD — Farmer action on [date]". These are visually distinct badges.

### FR-8 — Application Record Fields
A farmer-entered `PesticideApplication` MUST be validated on save to require: product_name, active_ingredient (optional? No — required per FR-9 crop/pest/product, so product required; active_ingredient optional), crop (via crop_id, required), pest/disease (via pest_observation_id or free-text pest_name equivalent — existing DB has no direct pest_name FK column, keep required via `pest_observation_id` presence OR a new `pest_name_target` if needed, but this chunk prefers existing schema: require pest_observation_id OR at minimum show advisory source_reference from the matching advisory), date = application_date (required), quantity & unit (required), area & area_unit (required), application_method (required). Optional fields: source_reference, PHI (if verified), REI (if verified), follow_up_date, notes.

### FR-9 — Application Validation on Save
Before calling `addPesticideApplication`, the form MUST validate all required fields from FR-8 are present and surface an inline error otherwise. If a matching source-verified advisory exists for (crop, pest, chemical category) it MUST display "Source: [source_name] — [source_document_title]" inline; if PHI / REI are not present on that advisory row, the form MUST explicitly show "PHI not verified" / "REI not verified" and NOT default to any invented number.

### FR-10 — Pest Follow-up Entity (NEW)
Introduce a new `pest_follow_ups` SQL table (with RLS + chunk1-style cross-farm ownership guards + updated_at trigger) and matching TypeScript + FarmContext CRUD. Fields:
- id (uuid PK), user_id, farm_id, crop_id (nullable FK), pest_observation_id (nullable FK), pesticide_application_id (nullable FK)
- follow_up_date (date, required)
- severity_after_treatment (PestSeverity union, required)
- affected_area_after_percent (numeric 0..100, optional)
- outcome: `'improved' | 'unchanged' | 'worsened' | 'unknown'` — Postgres CHECK + TS union
- notes (text, optional), photos (text[], optional)
- created_at, updated_at (timestamptz)
UI MUST show a "Create Follow-up" CTA in Section G and from timeline cards. Follow-up cards MUST use cautious language: they record *what was observed* post-treatment, never auto-conclude "treatment was effective".

### FR-11 — IPM History Timeline
Section C timeline MUST, for a selected pest-observation group (or globally if none selected), render ordered date-tagged events with icons + titles + links into the respective section:
- `Observation` (from `pest_observations.observation_date`)
- `IPM Decision` (from `ipm_records.created_at`)
- `Control method` (derived from `ipm_records.advisory_level` + `recommendation`)
- `Application` (from `pesticide_applications.application_date`)
- `Follow-up` (from `pest_follow_ups.follow_up_date`)

### FR-12 — Organic / IPM Cross-connection
In Steps 6 (biological) and 7 (botanical) of the IPM workflow, when the advisory library rows for the (crop, pest) pair match an `organic_inputs` row by name or category, the UI MUST surface a clickable chip: "Related organic input: [Trichoderma / NSKE / Pseudomonas / ...] → opens Organic Input Library tab pre-filtered to that input". This MUST NOT label the input "Organic Certified" — only the existing `organic_relevance` text is shown.

### FR-13 — Source UI on Every Advisory Card
Every `PestAdvisory` card in Section E MUST show a dedicated footer block with labelled fields:
- Source: [source_name]
- Document: [source_document_title] (fallback to source_reference if no title)
- Last verified: [last_verified || 'Not verified']
- Verification: [verification_status using the FR-5 union badges]
If a `source_url` exists, a "Open source (external)" link is shown; otherwise the row is clearly "Direct internal document reference only — no URL available". No generic "https://example.org" placeholder links are permitted in seed data.

### FR-14 — Professional High-Risk Warning
Section E (advisory library) and Section D Step 8 (chemical) MUST both render the following exact disclaimer compactly, styled professionally (not an alarm banner):
> *"Use only according to the applicable registered label and official agricultural guidance. This platform does not replace product labels, qualified agricultural advice, or regulatory requirements."*

### FR-15 — Search / Filter Advisory Library
Section E MUST expose three explicit filter controls, all free-text or `<select>` populated from actual distinct values in `pesticide_advisories`:
- Crop filter (select; includes at minimum Arecanut, Coconut, Black Pepper; others if seeded)
- Pest/Disease filter (select; values = distinct `pest_or_disease` within selected crop, or "All")
- Control method / Category filter (select; AdvisoryControlCategory union + "All")

### FR-16 — Target-Crop Seeded Knowledge
The advisory seed file (`20260924000003_seed_authoritative_agricultural_data.sql`) MUST add the following new rows to cover the primary 3 + 6 secondary crops with a prevention/mechanical/biological row each (chemical rows only when source-referenced with exact FR-5 provenance + FR-6 safety-verified claims):
- Primary: Arecanut, Coconut, Black Pepper (already partially seeded; verify/upgrade each with FR-5 provenance fields + correct `verification_status` grade)
- Secondary (minimum 1 non-chemical row each): Banana, Coffee, Paddy, Ginger, Turmeric, Cardamom

### FR-17 — Audit / Remove Unsupported Existing Claims
For every existing `pesticide_advisories` seed row, audit chemical-claim columns (`Bordeaux 1%`, `Metarhizium dosage`, etc.). Any exact dose / concentration / PHI / REI / chemical / safety claim that does not have a FR-5 `source_reference` + `source_document_title` trace MUST be either:
- (a) removed from that column (set to `null`), or
- (b) downgraded by moving the exact numeric claim into `recommendation` text as a general-agricultural-information statement alongside explicit "Source: ..." attribution, and marking `verification_status = 'General Agricultural Information'`; or
- (c) if source is ICAR-family technical bulletin verifiable by specific bulletin ref and the value is the EXACT bulletin figure, upgrade to `'Registered Use (Crop/Pest)'` or `'Non-chemical IPM Practice'` as appropriate.
Blanket `'Verified Authoritative'` MUST be removed from every seeded row (per FR-5).

### FR-18 — Security / Secrets
No frontend file under `src/` may contain `service_role`, regex `sk-[A-Za-z0-9]{10,}`, `VITE_*_SECRET`, or hard-coded passwords/tokens. This chunk introduces no new secrets. Existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are acceptable because anon role is by-design.

## Non-Functional Requirements (NFR)

### NFR-1 — Type System Consistency (rule)
Postgres table DDL → Supabase `select()` projections (in FarmContext) → `src/types/index.ts` interfaces → Page props → Component props MUST be consistent. `npx tsc --noEmit` MUST exit 0 with zero `any`, `@ts-ignore`, or `@ts-expect-error` introduced.

### NFR-2 — Build Quality (rule)
`npm run build` MUST exit 0. `npm run lint` MUST exit 0 with 0 errors. Style-only warnings allowed only if they pre-exist this chunk.

### NFR-3 — Farm Ownership & RLS (rule)
All private tables (`pest_observations`, `ipm_records`, `pesticide_applications`, new `pest_follow_ups`) MUST have:
- SELECT / INSERT / UPDATE / DELETE policies scoped to `auth.uid() = user_id`;
- INSERT WITH CHECK (and UPDATE) hardened with the cross-farm guard from chunk1: the row's `farm_id` points to a farm whose `user_id = auth.uid()`, preventing `{my user_id + another user's farm_id}` injection.
A new migration SQL file MUST be introduced in this chunk that: (a) ALTERs pesticide_advisories for FR-5 + new chemical columns; (b) CREATEs `pest_follow_ups` with RLS; (c) replaces chunk1-incomplete pest policies with the hardened cross-farm versions if missing; (d) UPDATEs existing pesticide_advisories seed data with correct FR-5 provenance and FR-17 downgrades where needed.

### NFR-4 — No Demo Fallbacks in Production (rule)
Grep of `src/` for `DemoStorage`, `demo`, `DEMO`, `mock`, `fallback`, `sample`, `fake` in any import path or variable used as a data source MUST return 0 matches that could feed production UI. Fixtures in `src/lib/demoStorage.ts` may exist only if 0 pages/components import them (already true per chunk1; re-verify).

### NFR-5 — Accessibility & Visual Hierarchy (rubric)
Section labels MUST be readable, flagship sections visually distinct. Score ≥ 1.5 / 2:
- 2: every one of the 7 sections has a heading + anchor, Crop Protection flagship accent rose/emerald color scheme used consistently;
- 1.5: 6/7 sections have headings and only one is missing clear CTA;
- ≤ 1: section structure is unclear.

### NFR-6 — Performance (rule)
Advisory filters MUST operate client-side via `Array.filter` (the dataset is small; ≤ 500 rows) and never re-query Supabase per keystroke. Page MUST NOT have more than 4 top-level `useEffect` hooks that each trigger network calls (idle is fine).

### NFR-7 — Source Traceability (rubric)
Every chemical advisory card has populated FR-5 provenance. Score ≥ 1.5 / 2:
- 2: at least 90% of seed rows have source_reference + source_document_title, and 100% of control_category='chemical' rows have either explicit verified PHI/REI or the FR-6 "unavailable" placeholder rendered;
- 1.5: ≥ 70% of seed rows have source_reference and placeholder logic works;
- ≤ 1: multiple rows still display unverified numeric chemical claims without a source trace.

## Constraints & Dependencies

- The React + Vite + Supabase architecture is preserved. No migrations away from existing tech.
- Depends on `FarmContext` already existing (Chunk 1) and providing `add/delete` for all 4 pest entities. Extend it minimally only for the new `pest_follow_ups` CRUD.
- Depends on the existing Sidebar navigation item order: Crop Protection section is already first-class. This chunk modifies NO Sidebar structure.
- Target-crop list priorities are fixed per Chunk 2 FR-16. Crops not listed are forward-compatible but not required to be seeded now.
- No new npm dependencies are introduced unless absolutely necessary; `lucide-react`, existing UI components are re-used.

## Assumptions

- A Supabase project exists (per Chunk 1's verified configuration) and migrations are run via `supabase db push` or an equivalent admin flow outside the UI. The dev server is already running at `http://localhost:5173/`.
- A logged-in user exists with at least 1 farm and 1 crop; empty states are acceptable and explicitly shown (per Chunk 1).

## Open Questions

Resolved at Spec time:
1. Q: Do we need a global AI diagnosis box in this chunk? A: No, non-goal.
2. Q: Are we adding product-marketplace / pesticide-buy links? A: No, non-goal / anti-identity.
3. Q: Do we add images / photo uploads for follow-ups / observations? A: Interface adds `photos?: string[]` column type already exists; upload plumbing is out of scope, URL-entry is fine.

## Acceptance Criteria

All Acceptance Criteria (AC) below are typed strictly as `rule` or `rubric`.

### Rule ACs (binary pass/fail with observable evidence)

- **AC-1 (rule):** `PestPage` renders all 7 sections (A–G) with visible headings/anchor IDs: `overview`, `record-observation`, `pest-history`, `ipm-workflow`, `advisory`, `application-records`, `follow-up-outcome`. Evidence: static grep of `PestPage.tsx` returns 7 unique anchor `id=` matches plus 7 `<h2>` headings.
- **AC-2 (rule):** `PestObservationModal` collects all 11 FR-2 fields and submit handler validates farm + pest_name + symptoms. Evidence: source inspection of `PestObservationModal.tsx` `handleSubmit` + form JSX.
- **AC-3 (rule):** "Possible causes" / suspected cause wording exists in the advisory section. The exact string "Confirmed diagnosis" has 0 occurrences anywhere in `src/` and `supabase/migrations/*.sql`. Evidence: ripgrep for the exact phrase.
- **AC-4 (rule):** IPM Workflow (Section D) renders 9 numbered steps with the correct names, and steps 4–8 have a Log action that opens `IpmRecordModal` pre-filled with the matching `AdvisoryLevel` value. Evidence: static inspection + exact text match for all 9 step titles in the rendered source.
- **AC-5 (rule):** `PestAdvisory` TS interface + SQL schema include the 6 FR-5 provenance fields and `verification_status` is a strict 5-member union. Existing seed rows are UPDATEd in a migration to drop `'Verified Authoritative'` and use the new union only. Evidence: grep of SQL schema file + grep of seed SQL for `Verified Authoritative` returns 0 matches after migration.
- **AC-6 (rule):** All chemical advisory cards either show verified PHI/REI/app-info from the row OR the exact FR-6 fallback text. No synthesis code path exists. Evidence: source inspection of the advisory card render function for the fallback string, plus a repo grep returns 0 results for PHI/REI/dose defaulting outside static seed data (i.e. no `?? 30` style defaulting).
- **AC-7 (rule):** A separate `PesticideApplication` record form exists with required FR-8 fields validated per FR-9 (shows inline error on submit-attempt if any required field missing), and form surface clearly labels ADVISORY source vs. APPLICATION record with distinct badges. Evidence: form `required` attribute pattern + inline validation code + badge classnames.
- **AC-8 (rule):** New `pest_follow_ups` table created in a new `supabase/migrations/*.sql` migration for this chunk, with the 9 FR-10 columns + Postgres CHECK constraints for severity/outcome + RLS enabled + cross-farm ownership INSERT/UPDATE guard + `set_updated_at` trigger. Matching `PestFollowUp` TS interface + FarmContext `{addPestFollowUp, updatePestFollowUp?, deletePestFollowUp, pestFollowUps}` exist. Evidence: grep of migration file for the table name + TS interface declaration + FarmContext destructuring.
- **AC-9 (rule):** Timeline (Section C) renders Observation / IPM Decision / Control / Application / Follow-up events sorted by date. Evidence: source inspection of the timeline component or map.
- **AC-10 (rule):** Section E exposes three filters (Crop, Pest/Disease, Control method) populated from distinct advisory values. Evidence: three distinct JSX `<select>` or equivalent components with the three labels.
- **AC-11 (rule):** FR-14 disclaimer appears exactly 2 times on the page (once above Section E library, once above Step 8 chemical rows). The rendered text is an exact character match of the FR-14 quote. Evidence: ripgrep of `PestPage.tsx` for the quoted string returns 2 matches.
- **AC-12 (rule):** New seed rows in advisory cover at minimum Arecanut / Coconut / Black Pepper / Banana / Coffee / Paddy / Ginger / Turmeric / Cardamom. Arecanut, Coconut, Black Pepper each have at least one prevention + one biological or mechanical row. Evidence: count rows per crop in advisory seed SQL.
- **AC-13 (rule):** RLS: pest_observations, ipm_records, pesticide_applications, pest_follow_ups all have hardened cross-farm INSERT WITH CHECK and UPDATE policies. Evidence: ripgrep of all migration SQL files for the exact `EXISTS (SELECT 1 FROM farms f WHERE f.id = farm_id AND f.user_id = auth.uid())` pattern returns 4 table names × (insert+update) = 8 matches.
- **AC-14 (rule):** `npx tsc --noEmit` exits 0. Evidence: build output.
- **AC-15 (rule):** `npm run build` exits 0. Evidence: build output.
- **AC-16 (rule):** `npm run lint` exits 0 with 0 errors (style-only warnings allowed only if pre-existing). Evidence: lint output.
- **AC-17 (rule):** Grep of `src/` returns 0 matches for `DemoStorage|import.*demoStorage|\bdemo\b.*fallback|\bmock\b.*source`, excluding any purely-dev fixtures (e.g. test-only) that are not imported by pages.
- **AC-18 (rule):** Grep of `src/` returns 0 matches for `service_role|sk-[A-Za-z0-9]{10,}|VITE_.*_SECRET|password.*=.*['"][^'"]{4,}` (anonymizing VITE_SUPABASE_URL/ANON which are by-design public). Only existing env variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` allowed.

### Rubric ACs (evaluative score with threshold)

- **AC-19 (rubric) — IPM Hierarchy Fidelity (0–2):**
  - **2:** 9-step order is exactly Prevent→Monitor→Verify→Assess→Cultural→Mechanical→Biological→Botanical→Chemical→Follow-up (note: Verify and Monitor are swapped 1/2 positions vs FR-4 labels; FR-4 says Step 1=Verify, Step 2=Monitor which is acceptable as long as hierarchy flow appears); each step has 2–4 concise guidance bullet points; chemical step is last and shown as "last resort" inline copy.
  - **1:** Steps are present but hierarchy order is partially wrong OR 1 step missing guidance bullets.
  - **0:** 3+ steps missing / chemical step rendered before non-chemical.
  - **Pass threshold:** ≥ 1.5.

- **AC-20 (rubric) — Source UI Card Quality (0–2):**
  - **2:** Every advisory card shows all 4 FR-13 source blocks; verification badges are colored per union (green for non-chemical, amber for general, rose for registered-formulation / registered-use); no placeholder external URLs.
  - **1.5:** 3/4 source blocks present on every card; badges are styled adequately; no fake links.
  - **1 or less:** cards omit source_document_title entirely OR have placeholder URLs.
  - **Pass threshold:** ≥ 1.5.

- **AC-21 (rubric) — Follow-up Cautious Language (0–2):**
  - **2:** All follow-up cards use only the 4 allowed outcome labels (`improved`/`unchanged`/`worsened`/`unknown`) and never contain words "effective", "cured", "successful treatment", "worked" anywhere in follow-up rendering or empty copy.
  - **1.5:** One minor off-phrase appears but outcomes are correct union.
  - **1 or less:** outcome labels are a free-text or overclaiming language present.
  - **Pass threshold:** ≥ 1.5.
