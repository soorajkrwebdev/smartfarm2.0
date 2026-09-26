# Chunk 2 — Pesticide Usage Advisory + IPM Engine: Implementation Tasks

All tasks map 1:1 or n:1 to Acceptance Criteria in spec.md. Task-local Test Requirements (TRs) are typed strictly as `rule` or `rubric`.

---

## Task 1: Extend Pest Module Schema & Provenance Fields
**Priority:** high
**Status:** pending
**Maps ACs:** AC-5, AC-8, AC-12, AC-13, FR-5, FR-10, FR-13, FR-17
**Depends on:** (none)

### Sub-steps
1.1 Create new migration file `supabase/migrations/20260925000001_chunk2_pest_ipm.sql`.
1.2 In the migration:
  a. `ALTER TABLE public.pesticide_advisories` ADD 6 FR-5 provenance columns + `phi_days` (numeric, nullable) + `rei_hours` (numeric, nullable).
  b. Add Postgres CHECK: `verification_status IN ('Registered Formulation','Registered Use (Crop/Pest)','General Agricultural Information','Non-chemical IPM Practice','Unverified / For Review')`. Use a USING clause to migrate existing values first (downgrade all `'Verified Authoritative'` → appropriate grade via `UPDATE`), then DROP the old default, then add the new CHECK + new default.
  c. `CREATE TABLE public.pest_follow_ups` with all FR-10 columns, CHECK for severity + outcome, FKs, indexes on (user_id, farm_id, pest_observation_id, pesticide_application_id, follow_up_date).
  d. RLS + cross-farm hardened INSERT/UPDATE/SELECT/DELETE policies for `pest_follow_ups`.
  e. Replace chunk1-incomplete policies for `pest_observations`, `ipm_records`, `pesticide_applications` with hardened cross-farm guards using the chunk1 `EXISTS (SELECT 1 FROM farms f ...)` pattern.
  f. `set_updated_at` trigger on `pest_follow_ups` + add triggers on `ipm_records` (currently missing updated_at column? If missing add column + trigger).
  g. Migrate existing 7 pesticide_advisories seed rows to populate FR-5 fields using explicit source_reference / source_document_title per ICAR-CPCRI / ICAR-IISR, and set each row's `verification_status` to the correct union grade. For the 2 chemical rows: if a CIBRC-registered label claim can not be traced exactly, set `phi_days = NULL`, `rei_hours = NULL`, and set verification_status to `'General Agricultural Information'` with the advisory body disclaimer-text.
  h. Append new advisory rows to the migration for FR-16 target-crop coverage (Arecanut / Coconut / Black Pepper enhancement + Banana / Coffee / Paddy / Ginger / Turmeric / Cardamom min 1 non-chemical row each), using ICAR-family sources with traceable source_document_title / source_reference / verification_status grades and NO invented chemical numeric values.

### Task-local Test Requirements
- **TR-1.1 (rule):** Running `grep -E "CREATE TABLE.*pest_follow_ups" *.sql` in migrations folder returns the new table with all FR-10 columns. Evidence: visual inspection of the DDL.
- **TR-1.2 (rule):** All 4 private pest tables have cross-farm policies (EXISTS subquery pattern). Evidence: `grep` returns 8+ matching policy bodies.
- **TR-1.3 (rule):** `grep "Verified Authoritative" supabase/migrations/*.sql` returns 0 matches. Evidence: grep output.
- **TR-1.4 (rule):** Advisory union grades only. Evidence: `grep -E "Registered Formulation|Registered Use \(Crop/Pest\)|General Agricultural Information|Non-chemical IPM Practice|Unverified / For Review" new_migration.sql` shows all 5 values used at least once.
- **TR-1.5 (rule):** Target crop coverage. Evidence: count per-crop insert rows ≥ 9 crops.

---

## Task 2: TypeScript Interfaces — PestAdvisory Enhancement + New PestFollowUp Interface
**Priority:** high
**Status:** pending
**Maps ACs:** AC-5, AC-8, NFR-1
**Depends on:** Task 1

### Sub-steps
2.1 Add TS union type `AdvisoryVerificationStatus = 'Registered Formulation' | 'Registered Use (Crop/Pest)' | 'General Agricultural Information' | 'Non-chemical IPM Practice' | 'Unverified / For Review'`.
2.2 Extend `PestAdvisory` to include 6 FR-5 provenance fields + optional `phi_days?: number` + `rei_hours?: number`. Narrow `verification_status: AdvisoryVerificationStatus` (was `string`).
2.3 Add new interface `PestFollowUp` exactly matching FR-10 SQL columns (plus joined helper fields `farm_name?`, `crop_name?`, `pest_name?`, `outcome?: 'improved' | 'unchanged' | 'worsened' | 'unknown'`).
2.4 Add type `PestFollowUpOutcome = 'improved' | 'unchanged' | 'worsened' | 'unknown'`.

### Task-local Test Requirements
- **TR-2.1 (rule):** `npx tsc --noEmit` passes after edits. Evidence: exit code 0.
- **TR-2.2 (rule):** Visual inspection of `PestAdvisory` fields. Evidence: source in types/index.ts shows all 6 provenance + phi/rei fields, narrowed verification_status union.
- **TR-2.3 (rule):** `PestFollowUp` interface declared with all fields. Evidence: grep in types file.

---

## Task 3: Extend FarmContext with PestFollowUp CRUD + Schema-Aligned CRUD for All 4 Entities
**Priority:** high
**Status:** pending
**Maps ACs:** AC-8, NFR-1, NFR-3
**Depends on:** Task 2

### Sub-steps
3.1 Add `pestFollowUps: PestFollowUp[]` state + `loadingPestFollowUps` + `errorPestFollowUps`.
3.2 Implement `loadPestFollowUps()` that fetches joined `farm_name / crop_name / pest_name` (via pest_observation join or application join, null-safe) ordered by `follow_up_date DESC`.
3.3 Implement `addPestFollowUp(data: Omit<PestFollowUp, 'id'|'user_id'|'created_at'|'updated_at'>)`, `updatePestFollowUp(id, patch)` (optional for v1 but declared), `deletePestFollowUp(id)`. Each returns `{data?, error?}` promise shape matching existing conventions. Optimistic UI consistent with current CRUD pattern in FarmContext.
3.4 Re-read the existing 3 pest CRUD implementations in FarmContext to ensure they project the ENTIRE TS interface (including new provenance fields in advisory loader; include `phi_days`/`rei_hours` in SELECT) and Supabase queries select no extra non-interface fields silently ignored. Ensure `selectedFarm` narrowing works for all 4 entities.
3.5 Wire all new state + functions into `FarmContext.Provider` value + `FarmContextType` interface.
3.6 In `refreshData()` append `loadPestFollowUps()`.

### Task-local Test Requirements
- **TR-3.1 (rule):** `npx tsc --noEmit` passes. Evidence: exit 0.
- **TR-3.2 (rule):** `FarmContextType` interface declares `pestFollowUps`, `addPestFollowUp`, `deletePestFollowUp`. Evidence: source grep.
- **TR-3.3 (rule):** advisory loader SELECT explicitly includes the 6 provenance + phi/rei columns. Evidence: `select(...)` arg in FarmContext contains the new column names.

---

## Task 4: Redesign PestPage.tsx — 7 Sections (A–G) + Anchor Navigation + Timeline + IPM Workflow
**Priority:** high
**Status:** pending
**Maps ACs:** AC-1, AC-4, AC-9, AC-11, AC-19 (rubric), NFR-5 (rubric)
**Depends on:** Task 3

### Sub-steps
4.1 Rewrite the 3-tab layout to be a single-page scroll with 7 anchor sections: `#overview`, `#record-observation`, `#pest-history`, `#ipm-workflow`, `#advisory`, `#application-records`, `#follow-up-outcome`. Provide a sticky left sub-nav (or collapsible-accordion style) to jump between sections.
4.2 Section A Overview: Four KPI cards using existing `StatCard` component (1) Active observations `pestObservations.length`; (2) High/critical severity (count filter); (3) Open follow-ups (count of `pestFollowUps` whose outcome is 'unknown' + app follow-ups with empty date); (4) Applications this season (count pesticideApplications where application_date in current 6 months). Show three quick-action buttons: Record Observation / Open Pesticide Advisory (scroll to `#advisory`) / Explore Organic Inputs (navigate to organic-farming route via React Router or routes helper).
4.3 Section B Record Observation: CTA block + inline quick summary of the last 3 observations with "Record new" button that opens PestObservationModal. Section anchor exists, heading rendered.
4.4 Section C My Pest History — Timeline implementation: Aggregate into `Array<{date: string, type: 'observation'|'ipm'|'control'|'application'|'followup', title, subtitle, icon, refId?}>` one source per entity, sorted ascending by date, grouped into a vertical timeline. Each item is clickable and scrolls the user to the referenced section + opens details if applicable.
4.5 Section D IPM Decision Workflow: Render the 9 steps (Verify→Monitor→Prevention→Cultural→Mechanical→Biological→Botanical→Chemical→Follow-up) as an accordion. Steps 3–8 each contain: guidance bullets (per FR-4 descriptions), plus a "Log this IPM level" button that sets state to pre-open `IpmRecordModal` with the correct pre-filled `AdvisoryLevel` value (prevention/cultural/mechanical/biological/botanical/chemical) and pest_name + farm pre-filled from the most recent observation if one is selected. Step 8 (chemical) MUST include the FR-14 exact disclaimer as a styled subtle callout box. Steps 6–7 add Related Organic Input chips (FR-12) that navigate to organic farming section or scroll to organic page (e.g., match rows by name like 'Trichoderma', 'Pseudomonas', 'Neem Seed Kernel Extract' in the organicInputs list).
4.6 Section E Pesticide Advisory: Insert the exact FR-14 disclaimer callout at the top of this section as well (requirement for 2 occurrences total). Keep the existing search+filters layout and enhance per Task 6.
4.7 Section F Pesticide Application Records: CTA "Record pesticide application" to open ApplicationForm (Task 5). List card for each application.
4.8 Section G Follow-up & Outcome: CTA "Log follow-up" that opens the FollowUpModal (Task 7). List cards for each follow-up.
4.9 Use only the 7 section headings — do not split into sub-pages or routes.
4.10 Ensure the page uses no `any` or `@ts-ignore`.

### Task-local Test Requirements
- **TR-4.1 (rule):** All 7 section anchor `id=` present. Evidence: grep `id="overview"|id="record-observation"|...` returns 7 unique IDs.
- **TR-4.2 (rule):** Timeline map produces all 5 event types. Evidence: `type:` literal appears 5 times in timeline aggregation source.
- **TR-4.3 (rule):** 9 IPM steps present in order. Evidence: text of 9 step headings.
- **TR-4.4 (rule):** Exact FR-14 disclaimer string occurs exactly 2 times on page. Evidence: grep count = 2.
- **TR-4.5 (rule):** tsc + lint pass after page is written. Evidence: exit 0 both.

---

## Task 5: Pesticide Application Record Form / Modal + Validation + Distinct Badges
**Priority:** high
**Status:** pending
**Maps ACs:** AC-7, FR-8, FR-9, FR-10
**Depends on:** Task 3

### Sub-steps
5.1 Create `src/components/pest-ipm/PesticideApplicationModal.tsx`. Accept props `{ isOpen, onClose, preselectedObservation?: PestObservation | null, preselectedFarmId?: string | null }`.
5.2 Form fields (all required except where noted):
  - farm_id (select, required)
  - crop_id (select, required)
  - pest_observation_id (optional select; if chosen, auto-fills pest target name display)
  - product_name (text, required)
  - active_ingredient (text, optional)
  - application_date (date, required)
  - quantity + unit (numeric + select: ml/L/g/kg — required)
  - area + area_unit (numeric + select: acres/cent/ha — required)
  - application_method (select: Foliar spray / Soil drench / Broadcast / Crown application / Basal / Injection — required)
  - source_reference (text, optional)
  - PHI days + REI hours (info-only readouts: show "PHI not verified" if advisory source missing verified value; editable only if the farmer wants to record the label value they used — text says "As per product label you applied")
  - follow_up_date (date, optional)
  - notes (textarea, optional)
5.3 On submit validate required fields per FR-9, show inline rose error panel if missing.
5.4 If matching advisory is found for crop + pest + 'chemical' category, show a fixed callout: "Matching source: [source_name] — [source_document_title]". If no match, show a softer callout: "No source-verified advisory for this crop/pest/chemical combination was found in the current library. Always follow the product label and agricultural extension guidance." NEVER auto-populate PHI/REI from a non-verified row — keep them blank.
5.5 Call `addPesticideApplication()` from FarmContext; handle loading state on submit button; on success close.
5.6 In Section F list rendering, each record has 2 badges:
  - `APPLICATION RECORD` blue/slate badge to indicate farmer-entered (not platform advice)
  - if source_reference is present, a small badge "Source: [X]" with the reference text

### Task-local Test Requirements
- **TR-5.1 (rule):** 8 required fields (farm, crop, product, date, quantity+unit, area+area_unit, application_method) — all have `required` pattern or equivalent inline validation + submission blocked if missing. Evidence: form JSX + handleSubmit validation.
- **TR-5.2 (rule):** Distinct "APPLICATION RECORD" badge in Section F. Evidence: badge label text present in section F render.
- **TR-5.3 (rule):** No default `?? 30` / invented PHI/REI numbers anywhere in modal. Evidence: grep source of the modal file.
- **TR-5.4 (rule):** tsc passes. Evidence: exit 0.

---

## Task 6: Advisory Library (Section E) — 3 Explicit Filters + Provenance UI on Every Card + Placeholder Logic
**Priority:** high
**Status:** pending
**Maps ACs:** AC-6, AC-10, AC-11, AC-20 (rubric), FR-6, FR-13, FR-15
**Depends on:** Task 3

### Sub-steps
6.1 Replace the single generic search with three explicit filters in Section E: Crop (select), Pest/Disease (select, filtered by selected crop), Control Method (select with all AdvisoryControlCategory plus "All"). Build the select-options list dynamically from `pesticideAdvisories` unique values (seeded ones for FR-16 = Arecanut/Coconut/Black Pepper etc.).
6.2 Re-write advisory card rendering:
  a. Show 4 line provenance footer (FR-13: Source, Document, Last verified, Verification).
  b. Badge `verification_status` using Badge variants: Non-chemical IPM Practice=emerald, General=slate, Registered Use=rose, Registered Formulation=amber, Unverified=gray.
  c. For `control_category==='chemical'` rows: if ANY of application_information (not empty) + phi_days (not null) + rei_hours (not null) are missing: render the exact FR-6 placeholder message (quote) in a callout box style with `Info` icon, and DO NOT render any partial invented information for the missing fields.
  d. If source_url exists show "Open source (external)" link with ExternalLink icon. Else render "Direct internal document reference only — no URL available" in small text.
6.3 Apply FR-3 language: any symptom-matching helper text on the page (if exists) uses "Possible causes / suspected pest …" etc. Confirm "Confirmed diagnosis" occurs nowhere (AC-3).
6.4 Badge/color scheme consistent with Dashboard chips (rose for chemical/registered risk, emerald for bio, slate general).

### Task-local Test Requirements
- **TR-6.1 (rule):** Three distinct selects with exact label texts "Crop", "Pest/Disease", "Control method". Evidence: JSX `<label>` children strings.
- **TR-6.2 (rule):** Exact FR-6 placeholder string appears in card render logic. Evidence: grep `PestPage.tsx` / new card component for the string.
- **TR-6.3 (rule):** Exact "Confirmed diagnosis" grep returns 0 across src + supabase. Evidence: grep output.
- **TR-6.4 (rule):** All 5 verification_status union values each have a Badge variant mapping. Evidence: `switch/map` in card JSX with all 5.
- **TR-6.5 (rule):** No invented URLs (grep `https://example.org` or `example.com` in seed/migrations returns 0 after Task 1 runs). Evidence: grep.
- **TR-6.6 (rule):** tsc + lint pass. Evidence: exit 0.

---

## Task 7: Pest Follow-up Modal + Section G List + Cautious Language
**Priority:** high
**Status:** pending
**Maps ACs:** AC-8, AC-21 (rubric), FR-10
**Depends on:** Task 3

### Sub-steps
7.1 Create `src/components/pest-ipm/PestFollowUpModal.tsx` with fields:
  - farm_id (required)
  - crop_id (optional)
  - pest_observation_id (optional select; OR) pesticide_application_id (optional select; at least one recommended but not strictly required)
  - follow_up_date (required, default today)
  - severity_after_treatment (PestSeverity select, required)
  - affected_area_after_percent (0–100, optional)
  - outcome ('improved' | 'unchanged' | 'worsened' | 'unknown' select, required)
  - notes (optional textarea)
  - photos (optional comma-sep or simple text array input — upload out of scope)
7.2 On submit, validate required fields, call `addPestFollowUp()`, handle loading.
7.3 Section G renders a list of existing follow-ups. Each card shows the union `outcome` label as a colored Badge. Avoids any text containing "effective", "cured", "successful", "treatment worked", "pesticide worked" etc. Use only the 4 outcome labels + severity-after-treatment caption.
7.4 Section G CTA "Log follow-up" opens the modal.
7.5 Timeline (Task 4.4) should show follow-up events when they exist (cross-reference).

### Task-local Test Requirements
- **TR-7.1 (rule):** Outcome labels only — `grep -iE "effective|cured|successful treatment|worked"` in the modal/list source returns 0 matches. Evidence: grep.
- **TR-7.2 (rule):** All 4 outcome options present as select options. Evidence: JSX `<option>` values.
- **TR-7.3 (rule):** tsc passes. Evidence: exit 0.

---

## Task 8: Seed Audit + Upgrade + Unsupported Claims Removal
**Priority:** high
**Status:** pending
**Maps ACs:** AC-5, AC-12, AC-13, AC-17, NFR-7 (rubric), FR-16, FR-17
**Depends on:** Task 1 (migration), but migration SQL can be authored in tandem with this task as long as the final migration contains the audited seeds.

### Sub-steps
8.1 Audit existing 7 pesticide_advisories rows in the seed file (20260924000003):
  - d003 Arecanut Koleroga — chemical row (Bordeaux 1%): review application_information "1% Bordeaux... spray 40–45 days later" — if source is ICAR-CPCRI Technical Bulletin, provide source_document_title / source_reference matching. Ensure verification_status downgraded from blanket to appropriate grade. If Bordeaux PHI/REI are NOT in a CIBRC-registered source, do NOT invent them: keep phi_days null and let FR-6 placeholder render.
  - d002 poly-covering physical protection: `Non-chemical IPM Practice`.
  - d001 prevention sanitation: `Non-chemical IPM Practice`.
  - d004 coconut rhino beetle mechanical hooking: `Non-chemical IPM Practice`.
  - d005 rhino Metarhizium: `Non-chemical IPM Practice` with source_document_title = "ICAR-CPCRI Bio-suppression Technical Bulletin".
  - d006 pepper quick-wilt prevention drainage: `Non-chemical IPM Practice`.
  - d007 pepper Trichoderma: `Non-chemical IPM Practice`.
8.2 Move the final audited UPDATEs / INSERTs of the 7 existing rows into the NEW migration file of Task 1 (NOT in the old seed file — preserves idempotency because Task 1.2g UPDATEs them).
8.3 Add NEW advisory seed rows per FR-16 for Banana, Coffee, Paddy, Ginger, Turmeric, Cardamom: at least 1 non-chemical prevention/cultural/biological row each, source-referenced ICAR.
8.4 Confirm NONE of the new chemical rows (if any are added) contain exact dose / concentration / PHI / REI without a traceable source_reference + source_document_title. If unverifiable, either leave the numeric field null (so FR-6 placeholder renders) OR delete the chemical insert and keep only non-chemical — prefer the latter.
8.5 Finally, run the source grep to ensure no invented chemical numbers slipped through.

### Task-local Test Requirements
- **TR-8.1 (rule):** All 7 old rows have FR-5 fields populated in the migration UPDATE; 0 left with generic verification_status. Evidence: grep migration file UPDATE sets.
- **TR-8.2 (rule):** 9 crops present in pesticide_advisories insert rows. Evidence: count per-crop.
- **TR-8.3 (rule):** 0 new standalone chemical rows without traceable source_reference + source_document_title. Evidence: review each insert where control_category='chemical'.
- **TR-8.4 (rule):** NFR-7 rubric: at least 90% of seed rows have source_reference + source_document_title populated. Evidence: count rows / populated fields.

---

## Task 9: Wire All Modals Into PestPage + Routes Integration + "Open Pesticide Advisory" Link
**Priority:** medium
**Status:** pending
**Maps ACs:** AC-1, FR-1, FR-12
**Depends on:** Tasks 4, 5, 7

### Sub-steps
9.1 Add state hooks for new modals: `isAppModalOpen`, `isFollowUpModalOpen`, `preselectedObs`, `preselectAdvisoryLevelForIpm`.
9.2 Wire Section A "Explore Organic Inputs" button to `navigate` (or window hash) to routes' `'organic-farming'` path — use existing `NAV_TABS` / `NavigationTab` + routes mapping.
9.3 Ensure `IpmRecordModal` accepts preselected `defaultLevel` or use wrapper state to initialize it; pass preselected pest.
9.4 Mount all 4 modals (PestObservation, IpmRecord, PesticideApplication, PestFollowUp) at the bottom of PestPage's return JSX.
9.5 No "Organic Certified" label anywhere on FR-12 chips; use only existing `organic_relevance` from organicInputs if shown in the cross-link.

### Task-local Test Requirements
- **TR-9.1 (rule):** 4 modals mounted at root of PestPage render. Evidence: 4 `<XModal>` JSX tags.
- **TR-9.2 (rule):** Organic cross-link navigates to organic-farming route OR opens with pre-filter query if direct navigation not implemented; at minimum click handler exists. Evidence: onClick JSX.
- **TR-9.3 (rule):** "Organic Certified" text in pest module files = 0. Evidence: grep across `src/pages/pest-ipm`, `src/components/pest-ipm`.

---

## Task 10: Final Build, Lint, TSC, Grep Gates
**Priority:** high
**Status:** pending
**Maps ACs:** AC-14, AC-15, AC-16, AC-17, AC-18, NFR-2, NFR-3, NFR-4, NFR-6
**Depends on:** Tasks 1–9 inclusive

### Sub-steps
10.1 Run `npx tsc --noEmit` until 0 errors; fix any TS errors found (without any/ts-ignore).
10.2 Run `npm run lint` until 0 errors. Fix simple auto-fixables with eslint or editor-based fix if available; else manually.
10.3 Run `npm run build` until 0 errors; ensure Vite produces dist/.
10.4 Grep for:
  - "Confirmed diagnosis" (must be 0)
  - "Verified Authoritative" (must be 0 across all migrations/sql + src/)
  - "Organic Certified" in pest module (must be 0)
  - Demo imports / fake sources: 0 in src/ production paths
  - Secrets: 0 service_role / sk-xxx etc. in src/
  - "https://example.org" placeholder URLs in seed/migration: 0
  - RLS EXISTS farm ownership guards: at least 8 policy matches
10.5 For any failing grep, fix in the relevant task file before marking Task 10 complete.

### Task-local Test Requirements
- **TR-10.1 (rule):** tsc exit 0.
- **TR-10.2 (rule):** lint exit 0 (0 errors; style warnings allowed if pre-existing).
- **TR-10.3 (rule):** build exit 0.
- **TR-10.4 (rule):** all 7 grep patterns above pass with their required counts. Evidence: terminal grep output captured during run.
