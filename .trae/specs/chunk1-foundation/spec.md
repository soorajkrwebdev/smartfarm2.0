# SmartFarm 2.0 — Chunk 1: Foundation, Database Consistency & Core Product Redefinition

## Overview
- **Summary**: Fix all TypeScript build errors, enforce type-safety across all data layers (PostgreSQL → Supabase → TypeScript → Context → Service → Page → Component), remove production demo/fake fallbacks, restructure navigation around two flagship pillars (Crop Protection / IPM + Organic Farming), redesign the dashboard to highlight flagship capabilities, audit & enforce RLS ownership, and ensure no secrets are exposed in frontend code.
- **Purpose**: Establish a reliable, type-safe, farmer-owned foundation for the Digital Farm Management & Crop Protection Intelligence Platform. All subsequent product work depends on this chunk being solid.
- **Target Users**: Authenticated farmers who record their private farm data; anonymous visitors viewing public knowledge pages (Farm Work Board, Knowledge Hub).

## Product Identity
**Positioning**: Digital Farm Management & Crop Protection Intelligence Platform — a knowledge + decision-support + farm-record platform (NOT a pesticide/organic marketplace, NOT a certification platform, NOT e-commerce).

**Two Primary Pillars**:
1. **Pesticide Usage Advisory + Integrated Pest Management (IPM)**
2. **Organic Farming Awareness + Organic Input Knowledge**

Everything else supports these two pillars.

## Goals
- G1: Zero TypeScript errors (`npx tsc --noEmit` passes cleanly; no `any`, no `@ts-ignore`, no `@ts-expect-error` used to suppress real problems).
- G2: Zero build errors (`npm run build` succeeds).
- G3: Every private data table is type-consistent across SQL schema, Supabase query results, TypeScript interfaces, FarmContext state, and consuming components.
- G4: Authenticated farmers see ONLY their own data via Supabase RLS; no fake demo/mock/hardcoded records displayed in production.
- G5: Navigation clearly separates Crop Protection (Pillar 1) and Organic Farming (Pillar 2) into visually prominent flagship sections.
- G6: Dashboard immediately communicates the two flagship purposes with relevant KPIs and quick actions.
- G7: No secrets (API keys, service_role, passwords, tokens, LLM keys) exposed in `src/` code.
- G8: RLS policies verified for SELECT/INSERT/UPDATE/DELETE on every private table; relationships enforced (farm → crop, user → farm) via `with check` on insert/update.

## Non-Goals
- NG1: Do NOT rebuild the project from scratch. Keep the existing React + Supabase + Vite + Tailwind stack.
- NG2: Do NOT create fake/demo/mock production data. Empty states are correct when a farmer has no records.
- NG3: Do NOT build the Reports page or Notifications page beyond wiring them into navigation (they can render ModulePreviewPage for now if no records).
- NG4: Do NOT add new features outside the scope listed (no new modules).
- NG5: Do NOT change the public Supabase tables (organic_inputs, pesticide_advisories, knowledge_articles) — they should remain readable by anon.

## Background & Context
Current state discovered via codebase audit (2026-09-25):

**Type & Build Errors** (from `tsc-out.txt` + `build-check.txt`):
- Modal `maxWidth="max-w-2xl"` invalid in ViewInquiriesModal (enum expects `"2xl"`).
- AnalyticsPage uses `Farm.total_area` (doesn't exist; use `area`) and `Farm.farming_type` (doesn't exist; use `farming_method`; `farming_type` is on `UserProfile`).
- AnalyticsPage compares `activity_type === 'organic_practice'` which is not in `ActivityType` union.
- AnalyticsPage compares waste status to `"recycled"` (not in `WasteStatus`) and compost status to `"completed"` (not in `CompostStatus`).
- Badge variant `"teal"` used in PestPage but not in `BadgeProps.variant` union.
- FarmWorkBoardPage passes `onSuccess` to `JobInquiryModal` but that prop doesn't exist on the component.
- JobStatus in FarmWorkBoardPage comparisons for `"closed"` and `"in-progress"` flagged but exist in the union — investigate (possible stale declaration conflict).

**Missing in FarmContext** (types/interfaces exist, context state/CRUD partially missing):
- `labReports` state and CRUD (`addLabReport`, `deleteLabReport`) — `LabReport` interface exists in `types/index.ts`.
- `refreshJobs` referenced in CreateJobModal (should use existing `onJobCreated` callback + service refresh instead).

**demoStorage.ts**:
- Contains `@ts-nocheck` at top, claims "retained for reference only / no longer used".
- Filled with hardcoded fake farms/crops/activities.
- Not imported by FarmContext (good), but file is present with TS errors internally.

**Navigation**:
- Sidebar has "Core Operations" and "Intelligence & Modules" flat groups.
- Missing `reports`, `notifications`, `expenses`, `harvests` navigation items present in `routes.ts`.
- Does not visually elevate the two flagship pillars.

**Dashboard**:
- Quick actions are "Add Input", "Record Activity", "Add Crop" — none reflect the two flagship pillars.
- KPIs are "Total Farms", "Active Crops", "Sustainable Practices", "Operations Cost" — no Pest Observations, IPM, or Organic Input focus.
- Missing "Pest & IPM Attention" and "Organic Farming Progress" sections.

**RLS Policies**:
- `phase1_core_schema.sql` enables RLS and writes policies for profiles, farms, farm_crops, crop_activities.
- Need to verify that phase2–phase5 migrations do the same for farm_inputs, pest_observations, ipm_records, pesticide_applications, soil_tests, water_tests, lab_reports, farm_waste, compost_batches, farm_expenses, crop_harvests, ai_conversations, reports, notifications, farm_jobs, job_inquiries.
- `rls_tests.sql` covers a subset (anon blocked for private tables, anon allowed for organic_inputs/pesticide_advisories/knowledge_articles). Need broader coverage for INSERT/UPDATE/DELETE ownership.

**Security**:
- `supabase.ts` uses `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (anon key is correct for frontend).
- No `service_role` found in `src/` (verify).

## Functional Requirements

### FR-1: Type System Consistency
Every private data entity has matching:
- PostgreSQL column names (migrations).
- Supabase `select()` result shape (no invalid snake_case↔camelCase mismatches).
- TypeScript interface field names/types in `types/index.ts`.
- FarmContext state array type and CRUD function signatures.
- Component prop types and access patterns in pages.

Entities covered: `Farm`, `FarmCrop`, `CropActivity`, `FarmInput`, `OrganicInput`, `CropOrganicInput`, `PestObservation`, `IPMRecord`, `PesticideApplication`, `PestAdvisory`, `SoilTest`, `WaterTest`, `LabReport`, `FarmWaste`, `CompostBatch`, `FarmJob`, `JobInquiry`, `FarmExpense`, `CropHarvest`, `WeatherData`, `MarketPriceRecord`, `KnowledgeArticleRecord`, `NotificationItem`, `AiConversationRecord`, `FarmReportRecord`.

### FR-2: FarmContext Complete
For every entity in FR-1 (excluding public knowledge), `FarmContextType` must expose:
- Typed state array (e.g. `labReports: LabReport[]`).
- Create / Update / Delete functions where appropriate, each returning `{ data?: T; error?: string }`.
- `loading`, `error`, and `refreshData()` with consistent behavior.
- `selectedFarmId` + `selectedFarm` semantics preserved.

New methods to add that components currently error on destructuring:
- `labReports: LabReport[]`, `addLabReport`, `updateLabReport`, `deleteLabReport`.

### FR-3: No Demo/Fake Production Fallbacks
- Authenticated mode uses ONLY Supabase. No `DemoStorage` import/usage in production path.
- Empty records → empty state UI. No fallback sample farms/crops.
- `demoStorage.ts` may remain only if clearly isolated (kept as-is with its `@ts-nocheck` header and "reference only" comment; do not import it).

### FR-4: Database Ownership (RLS + With Check)
Every private table:
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
- SELECT: `auth.uid() = user_id` (or through owning farm).
- INSERT `WITH CHECK`: inserted `user_id` = `auth.uid()`; where applicable, inserted `farm_id` must belong to `auth.uid()`.
- UPDATE: `auth.uid() = user_id` using `USING` AND `WITH CHECK`.
- DELETE: `auth.uid() = user_id`.

Public tables (`organic_inputs`, `pesticide_advisories`, `organic_practices`, `crop_organic_inputs`, `knowledge_articles`, `knowledge_sources`, `market_prices`, `public_farm_jobs` view):
- SELECT permitted to anon and authenticated.
- INSERT/UPDATE/DELETE restricted to service role (or not exposed via anon).

### FR-5: Navigation Redesign
Sidebar structure (logged-in view) restructured into grouped sections:
```
OVERVIEW
└─ Dashboard

FARM MANAGEMENT
├─ My Farms
├─ Crops
├─ Activities
└─ Inputs

CROP PROTECTION            (FLAGSHIP PILLAR 1 — visually prominent)
├─ 🐛 Pest & Disease Monitoring
└─ 🛡 IPM & Pesticide Advisory

ORGANIC FARMING            (FLAGSHIP PILLAR 2 — visually prominent)
├─ 🌿 Organic Farming
└─ 🧪 Organic Input Library

FARM INTELLIGENCE
├─ Soil & Water
├─ Weather
├─ Market
└─ Analytics

SUSTAINABILITY
├─ Waste & Compost
└─ Sustainability

TOOLS
├─ Farm AI
├─ Knowledge
├─ Reports
└─ Notifications

PUBLIC
└─ Farm Work
```

Implementation notes:
- Both flagship sections use visual highlighting (distinct section headers + icons).
- `NavigationTab` type in `Sidebar.tsx` must add `reports` and `notifications` (they already exist in `routes.ts`).
- "Soil & Water" maps to existing `tests` tab; "Waste & Compost" maps to existing `waste` tab.
- The two Crop Protection items and two Organic Farming items can resolve to the same existing pages internally (PestPage tabs for observations/ipm/advisories; OrganicPage for practices + inputs library).

### FR-6: Dashboard Redesign
Dashboard `DashboardPage.tsx` must immediately show the two flagship purposes:

**Top KPI row (4 cards)**:
1. Active Farms
2. Active Crops
3. Pest Observations
4. Open Follow-ups (pest observations not yet 'controlled'/'failed', or follow-up dates upcoming)

**Body sections** (grid layout):
- Pest & IPM Attention — list active/high-severity pest observations, count of IPM records, link to Pest & IPM page.
- Organic Farming Progress — organic method %, organic input count, compost progress, link to Organic page.
- Weather widget (existing).
- Recent Activities (existing).
- Recent Farm Inputs (new card — list 3 most recent inputs).
- Soil Test Status (card — count of tests, most recent date).

**Prominent quick actions (new)**:
- "Record Pest Observation" → opens PestObservationModal.
- "Open Pesticide Advisory" → navigates to pest-ipm tab with advisories filter.
- "Explore Organic Inputs" → navigates to organic tab.

(Dashboard receives `onOpenAddPestObservation`, `onOpenPesticideAdvisory`, `onOpenOrganicInputs` props from AppShell/App.tsx, similar to existing farm/crop/activity/input modals.)

### FR-7: Security
- No service_role key, LLM sk- keys, passwords, or bearer tokens hardcoded anywhere in `src/`.
- All external API URLs (Open-Meteo, etc.) are public endpoints with no embedded auth.
- `aiService.ts` must not bake in a real LLM key (leave it as env-driven or throw when not configured, never commit a key).

### FR-8: Pass Builds
- `npx tsc --noEmit` exits with code 0.
- `npm run build` exits with code 0.
- `npm run lint` exits with code 0 (or only pre-existing, unrelated warnings).

## Non-Functional Requirements
- **NFR-1 (No suppression)**: No file may use `any`, `@ts-ignore`, or `@ts-expect-error` to circumvent a real type mismatch. `demoStorage.ts` is the sole exception because its header already marks it reference-only.
- **NFR-2 (No demo data in UI)**: An authenticated farmer with zero Supabase records must see only empty-state components and zero sample/fake records.
- **NFR-3 (RLS server-side)**: Ownership is enforced server-side by Postgres RLS, not only frontend checks.
- **NFR-4 (No API drift)**: All public knowledge tables remain publicly readable by `anon` role.

## Constraints
- **Technical**: React 19 + Supabase JS v2 + Vite + Tailwind 4. Do not add new routing libraries (keep the custom router). Do not add state libraries beyond Context.
- **Business**: Never position the app as a pesticide marketplace, organic marketplace, or certification platform. All pesticide/organic content is advisory + knowledge + record keeping.
- **Dependencies**: No new npm install unless absolutely required. Prefer fixing types over adding packages.

## Dependencies
- Supabase project migrations must already be applied (they exist in the repo; code assumes they ran). RLS policy fixes should be a new migration file appended to the chain, not an edit of existing ones.

## Assumptions
- A1: Supabase migrations for phases 1–5 already define all tables; RLS gaps are addressed via a new appended migration.
- A2: Modal `PestObservationModal` exists and can be wired as a dashboard quick-action (it already exists in `components/pest-ipm/`).
- A3: `reports` and `notifications` tabs may render `ModulePreviewPage` for now (no full page built in this chunk).
- A4: The existing `WasteStatus` union (`'collected' | 'processing' | 'composted' | 'applied' | 'disposed'`) and `CompostStatus` union (`'preparing' | 'active' | 'curing' | 'finished' | 'used' | 'failed'`) are the authoritative values — pages must align to them, not invent synonyms.

## Acceptance Criteria

### AC-1: TypeScript type-check passes with zero errors
- **Type**: `rule`
- **Given**: A clean checkout at the commit post-this-chunk, with npm dependencies installed.
- **When**: Run `npx tsc --noEmit` from the project root.
- **Then**: The command exits with code 0 and prints no errors.
- **Pass Condition**: Exit code 0; stderr/stdout empty of `error TS`.
- **Evidence**: Terminal output of `npx tsc --noEmit`.

### AC-2: Build succeeds with zero errors
- **Type**: `rule`
- **Given**: Same as AC-1.
- **When**: Run `npm run build`.
- **Then**: Vite build produces `dist/` and exits 0.
- **Pass Condition**: Exit code 0; dist/index.html exists.
- **Evidence**: Terminal output of `npm run build` and `ls dist/`.

### AC-3: Lint succeeds with zero new errors
- **Type**: `rule`
- **Given**: Same as AC-1.
- **When**: Run `npm run lint`.
- **Then**: No new lint errors introduced by this chunk.
- **Pass Condition**: Exit code 0.
- **Evidence**: Terminal output of `npm run lint`.

### AC-4: Every private module accesses correct fields on its types
- **Type**: `rubric`
- **Dimension**: Field-name / type correctness across all pages consuming context state.
- **Scale**: 1-5
- **Anchors**: 1 = multiple pages access nonexistent fields or misuse union values (TS would fail); 3 = all TS errors fixed via direct type/usage alignment, no `any`; 5 = every page's destructuring from `useFarmData()` is present in `FarmContextType` interface and each accessed field is present in the TS interface exactly as named.
- **Pass Threshold**: >= 4
- **Evidence**: Spot checks of `AnalyticsPage`, `PestPage`, `TestsPage`, `WastePage`, `FarmWorkBoardPage`, `CompostBatchModal`, `ViewInquiriesModal`, `CreateJobModal`, and `FarmContextType` interface.

### AC-5: FarmContext includes labReports state and complete CRUD
- **Type**: `rule`
- **Given**: An authenticated session, Typescript compiler enabled.
- **When**: A consumer destructures `{ labReports, addLabReport, updateLabReport, deleteLabReport }` from `useFarmData()`.
- **Then**: No TS error; each function exists and matches the `(Omit<T, ...>) => Promise<{ data?: T; error?: string }>` signature pattern used by peers.
- **Pass Condition**: Destructuring compiles, method signatures match pattern, refreshData fetches them.
- **Evidence**: `FarmContext.tsx` diff and `TestsPage.tsx` (it currently stubs labReports as `[]`; it should now use the context).

### AC-6: No demo/mock/fake data loaded for authenticated users
- **Type**: `rule`
- **Given**: Fresh Supabase user with zero farm records.
- **When**: User signs in and views Dashboard, Farms, Crops, Activities, Inputs, Pest, Organic, Tests, Waste, Analytics.
- **Then**: Every module shows empty-state components. No sample farm names like "Green Canopy Organic Homestead" appear anywhere in the logged-in UI unless the farmer actually created them.
- **Pass Condition**: DOM + page state contains no demoStorage names/ids; empty states render.
- **Evidence**: Screenshots or server-rendered HTML showing empty states for a zero-record farmer; grep of `src/` showing `DemoStorage` is not imported by any page, context, or App.tsx.

### AC-7: RLS enforces private ownership on every private table
- **Type**: `rule`
- **Given**: Two users A and B, each with their own farm records.
- **When**: Simulate (via SQL `set role authenticated; set request.jwt.claim.sub = A`) and SELECT from B's rows; attempt INSERT with wrong user_id; attempt UPDATE/DELETE of another user's row.
- **Then**: SELECT returns 0 rows, INSERT fails with `violates row-level security`, UPDATE/DELETE affect 0 rows. Also, INSERT of crop with a farm_id that does NOT belong to the current user must fail via `with check`.
- **Pass Condition**: All four operations (S/I/U/D) blocked for non-owners. Farm↔User relationship enforced on inserts.
- **Evidence**: Output of appended migration SQL; contents of updated `rls_tests.sql` covering at minimum farms, farm_crops, farm_inputs, pest_observations, soil_tests, compost_batches, farm_expenses, ai_conversations.

### AC-8: Public tables remain readable by anon
- **Type**: `rule`
- **Given**: `anon` role (`set role anon`).
- **When**: SELECT from organic_inputs, pesticide_advisories, organic_practices, knowledge_articles, market_prices, public_farm_jobs view.
- **Then**: No RLS violation; rows are returned if they exist.
- **Pass Condition**: 0 rows returned is acceptable if seed data hasn't run; the query must not throw a permissions error.
- **Evidence**: `rls_tests.sql` assertions.

### AC-9: Navigation restructures to group the two flagship pillars prominently
- **Type**: `rubric`
- **Dimension**: Navigation grouping & flagship prominence.
- **Scale**: 1-5
- **Anchors**: 1 = flat list unchanged; 3 = sections exist but Pillar 1/Pillar 2 look the same as any other item; 5 = sidebar uses the exact section structure from FR-5, Crop Protection and Organic Farming are titled section groups with their 2 sub-items each rendered visibly (emoji/icons present, section header styling distinct), Reports + Notifications appear in TOOLS group, labels match the spec names (e.g. "Soil & Water" not "Tests").
- **Pass Threshold**: >= 4
- **Evidence**: Sidebar screenshot and diff of `Sidebar.tsx` nav items.

### AC-10: Dashboard highlights the two flagship pillars
- **Type**: `rubric`
- **Dimension**: Dashboard flagship clarity.
- **Scale**: 1-5
- **Anchors**: 1 = dashboard unchanged; 3 = at least one flagship quick-action added and one new KPI; 5 = all of FR-6 present (4 new KPIs including Pest Observations + Open Follow-ups, Pest & IPM Attention section, Organic Farming Progress section, Recent Farm Inputs card, Soil Test Status card, and 3 flagship quick actions).
- **Pass Threshold**: >= 4
- **Evidence**: Dashboard screenshot and `DashboardPage.tsx` diff.

### AC-11: No secrets exposed in src/
- **Type**: `rule`
- **Given**: All files under `src/`.
- **When**: Grep for `service_role`, `sk-` (live LLM keys), `password:` with a hardcoded literal value, any `VITE_*_SECRET`.
- **Then**: No matches found (supabase anon key is the only VITE key allowed).
- **Pass Condition**: 0 matches after excluding placeholder comments.
- **Evidence**: grep output of the secret patterns across `src/`.

### AC-12: Modal and component prop types align to actual usage
- **Type**: `rule`
- **Given**: All modals/components currently reporting TS2322/TS2339/TS2353 errors.
- **When**: Open each modal that had errors (CompostBatchModal, ViewInquiriesModal, CreateJobModal, LabReportModal, SoilTestModal, WaterTestModal, FarmWasteModal, PestPage badges).
- **Then**: Every prop used by the parent is present in the child's prop interface; every accessed field exists in the Omit type passed to add/update helpers.
- **Pass Condition**: Zero TS errors specifically in these files.
- **Evidence**: Individual file TS diagnostics via `GetDiagnostics` or `tsc --noEmit`.

## Open Questions
- OQ1: For the "Pest & Disease Monitoring" vs "IPM & Pesticide Advisory" split — should these be two separate tabs with new dedicated pages, or two tab-links that both route to the existing `PestPage` but with a `?tab=` param that pre-selects observations vs ipm vs advisories? (Plan uses the latter: same page, pre-select internal tab.)
- OQ2: Same for Organic Farming vs Organic Input Library — split pages or same OrganicPage with anchor/target? (Plan uses same page with internal sections/scroll-to.)
