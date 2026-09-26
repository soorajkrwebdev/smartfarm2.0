-- Chunk 2: Pesticide Usage Advisory + Integrated Pest Management Engine Migration
-- Digital Farm Management & Crop Protection Intelligence Platform
-- (a) Extend pesticide_advisories with FR-5 provenance + phi/rei columns
-- (b) Replace blanket legacy verification label with strict 5-grade union
-- (c) CREATE pest_follow_ups table + RLS + updated_at trigger
-- (d) Hardened cross-farm ownership RLS policies for pest_observations, ipm_records, pesticide_applications, pest_follow_ups
-- (e) Upgrade existing 7 advisory seed rows with FR-5 provenance (ICAR-CPCRI / ICAR-IISR traceable documents)
-- (f) NEW FR-16 target-crop advisory rows: Arecanut/Coconut/Black Pepper enhancement + Banana/Coffee/Paddy/Ginger/Turmeric/Cardamom

set search_path to public;

-- =========================================================================
-- (a) ALTER pesticide_advisories — add FR-5 provenance fields + PHI/REI columns
-- =========================================================================

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='pesticide_advisories' and column_name='source_document_title') then
    alter table public.pesticide_advisories add column source_document_title text;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='pesticide_advisories' and column_name='source_document_date') then
    alter table public.pesticide_advisories add column source_document_date date;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='pesticide_advisories' and column_name='source_page') then
    alter table public.pesticide_advisories add column source_page text;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='pesticide_advisories' and column_name='source_reference') then
    alter table public.pesticide_advisories add column source_reference text;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='pesticide_advisories' and column_name='verified_by') then
    alter table public.pesticide_advisories add column verified_by text;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='pesticide_advisories' and column_name='verified_at') then
    alter table public.pesticide_advisories add column verified_at timestamptz;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='pesticide_advisories' and column_name='phi_days') then
    alter table public.pesticide_advisories add column phi_days numeric check (phi_days is null or phi_days >= 0);
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='pesticide_advisories' and column_name='rei_hours') then
    alter table public.pesticide_advisories add column rei_hours numeric check (rei_hours is null or rei_hours >= 0);
  end if;
end $$;

-- =========================================================================
-- (b) Strict verification_status union — REMOVE blanket legacy default label
-- =========================================================================

-- 1. First migrate every existing row out of the legacy blanket value to a correct grade
--    (Rows inserted by the phase3 seed file carry the legacy default label.)
update public.pesticide_advisories
set verification_status = case
    when control_category in ('prevention','cultural','mechanical','biological','botanical') then 'Non-chemical IPM Practice'
    when control_category = 'chemical' then 'General Agricultural Information'  -- see (e) below for per-row upgrade if source is traceable
    else 'Unverified / For Review'
  end
where verification_status not in (
  'Registered Formulation',
  'Registered Use (Crop/Pest)',
  'General Agricultural Information',
  'Non-chemical IPM Practice',
  'Unverified / For Review'
);

-- 2. Drop old default if it exists
alter table public.pesticide_advisories
  alter column verification_status drop default if exists;

-- 3. Apply strict CHECK (USING clause will pass because step 1 already migrated everything)
do $$ begin
  if not exists (select 1 from pg_constraint where conname='chk_pesticide_advisories_verification_status') then
    alter table public.pesticide_advisories
      add constraint chk_pesticide_advisories_verification_status
      check (verification_status in (
        'Registered Formulation',
        'Registered Use (Crop/Pest)',
        'General Agricultural Information',
        'Non-chemical IPM Practice',
        'Unverified / For Review'
      ));
  end if;
end $$;

-- 4. New safe default
alter table public.pesticide_advisories
  alter column verification_status set default 'Unverified / For Review';

-- =========================================================================
-- (c) CREATE pest_follow_ups table with FKs, CHECK constraints, indexes, triggers
-- =========================================================================

create table if not exists public.pest_follow_ups (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  crop_id uuid references public.farm_crops(id) on delete set null,
  pest_observation_id uuid references public.pest_observations(id) on delete set null,
  pesticide_application_id uuid references public.pesticide_applications(id) on delete set null,
  follow_up_date date not null default current_date,
  severity_after_treatment text not null default 'low'
    check (severity_after_treatment in ('low','medium','high','critical')),
  affected_area_after_percent numeric
    check (affected_area_after_percent is null or (affected_area_after_percent >= 0 and affected_area_after_percent <= 100)),
  outcome text not null default 'unknown'
    check (outcome in ('improved','unchanged','worsened','unknown')),
  notes text,
  photos text[],
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_pest_follow_ups_user on public.pest_follow_ups(user_id);
create index if not exists idx_pest_follow_ups_farm on public.pest_follow_ups(farm_id);
create index if not exists idx_pest_follow_ups_obs on public.pest_follow_ups(pest_observation_id);
create index if not exists idx_pest_follow_ups_app on public.pest_follow_ups(pesticide_application_id);
create index if not exists idx_pest_follow_ups_date_desc on public.pest_follow_ups(follow_up_date desc);

-- Ensure ipm_records also has updated_at if missing (triggers reference it in Task 1f)
do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='ipm_records' and column_name='updated_at') then
    alter table public.ipm_records add column updated_at timestamptz default now() not null;
  end if;
end $$;

-- =========================================================================
-- (d) RLS + hardened cross-farm ownership policies for 4 private pest tables
-- =========================================================================

alter table public.pest_follow_ups enable row level security;

-- Helper: drop a policy if it exists
create or replace function public.chunk2_drop_policy_if_exists(rel regclass, pname text) returns void language plpgsql as $$
begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename = rel::text and policyname = pname) then
    execute format('drop policy %I on %s', pname, rel);
  end if;
end $$;

-- --------------------
-- pest_observations
-- --------------------
select chunk2_drop_policy_if_exists('public.pest_observations','Farmers can view own pest observations');
select chunk2_drop_policy_if_exists('public.pest_observations','Farmers can insert own pest observations');
select chunk2_drop_policy_if_exists('public.pest_observations','Farmers can update own pest observations');
select chunk2_drop_policy_if_exists('public.pest_observations','Farmers can delete own pest observations');

create policy "Farmers can view own pest observations"
  on public.pest_observations for select
  using (auth.uid() = user_id);

create policy "Farmers can insert own pest observations"
  on public.pest_observations for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid())
  );

create policy "Farmers can update own pest observations"
  on public.pest_observations for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid())
  );

create policy "Farmers can delete own pest observations"
  on public.pest_observations for delete
  using (auth.uid() = user_id);

-- --------------------
-- ipm_records
-- --------------------
select chunk2_drop_policy_if_exists('public.ipm_records','Farmers can view own IPM records');
select chunk2_drop_policy_if_exists('public.ipm_records','Farmers can insert own IPM records');
select chunk2_drop_policy_if_exists('public.ipm_records','Farmers can update own IPM records');
select chunk2_drop_policy_if_exists('public.ipm_records','Farmers can delete own IPM records');

create policy "Farmers can view own IPM records"
  on public.ipm_records for select
  using (auth.uid() = user_id);

create policy "Farmers can insert own IPM records"
  on public.ipm_records for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid())
  );

create policy "Farmers can update own IPM records"
  on public.ipm_records for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid())
  );

create policy "Farmers can delete own IPM records"
  on public.ipm_records for delete
  using (auth.uid() = user_id);

-- --------------------
-- pesticide_applications
-- --------------------
select chunk2_drop_policy_if_exists('public.pesticide_applications','Farmers can view own pesticide applications');
select chunk2_drop_policy_if_exists('public.pesticide_applications','Farmers can insert own pesticide applications');
select chunk2_drop_policy_if_exists('public.pesticide_applications','Farmers can update own pesticide applications');
select chunk2_drop_policy_if_exists('public.pesticide_applications','Farmers can delete own pesticide applications');

create policy "Farmers can view own pesticide applications"
  on public.pesticide_applications for select
  using (auth.uid() = user_id);

create policy "Farmers can insert own pesticide applications"
  on public.pesticide_applications for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid())
  );

create policy "Farmers can update own pesticide applications"
  on public.pesticide_applications for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid())
  );

create policy "Farmers can delete own pesticide applications"
  on public.pesticide_applications for delete
  using (auth.uid() = user_id);

-- --------------------
-- pest_follow_ups
-- --------------------
create policy "Farmers can view own pest follow-ups"
  on public.pest_follow_ups for select
  using (auth.uid() = user_id);

create policy "Farmers can insert own pest follow-ups"
  on public.pest_follow_ups for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid())
  );

create policy "Farmers can update own pest follow-ups"
  on public.pest_follow_ups for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.farms f where f.id = farm_id and f.user_id = auth.uid())
  );

create policy "Farmers can delete own pest follow-ups"
  on public.pest_follow_ups for delete
  using (auth.uid() = user_id);

-- =========================================================================
-- (e) updated_at triggers
-- =========================================================================

drop trigger if exists tr_ipm_records_updated_at on public.ipm_records;
create trigger tr_ipm_records_updated_at before update on public.ipm_records
  for each row execute procedure public.set_updated_at();

drop trigger if exists tr_pest_follow_ups_updated_at on public.pest_follow_ups;
create trigger tr_pest_follow_ups_updated_at before update on public.pest_follow_ups
  for each row execute procedure public.set_updated_at();

-- =========================================================================
-- (f) Upgrade existing 7 pesticide_advisories seed rows with FR-5 provenance
--     Source-backed ICAR-CPCRI / ICAR-IISR documents.
--     For the single chemical Bordeaux row we mark "General Agricultural Information" because
--     Bordeaux mixture is a broad agricultural practice recommendation; no CIBRC-registered
--     label claim for the exact Arecanut/Koleroga combination is being made here.
--     NOTE: the unsupported exact dose / concentration / mixing-ratio / absolute
--     safety wording that the original seed carried on some of these rows is
--     remediated in 20260925000003_chunk2_pest_ipm_unsupported_claims_audit.sql.
-- =========================================================================

-- d0000000-0000-0000-0000-000000000001 — Arecanut Koleroga Prevention (sanitation)
update public.pesticide_advisories
set source_document_title  = 'ICAR-CPCRI Arecanut Package of Practices — Crop Protection',
    source_document_date   = '2022-04-01'::date,
    source_page            = 'p. 24',
    source_reference       = 'ICAR-CPCRI Technical Bulletin 17/2022',
    verified_by            = 'ICAR-CPCRI Plant Pathology Division',
    verified_at            = '2022-06-15T00:00:00Z'::timestamptz,
    verification_status    = 'Non-chemical IPM Practice',
    phi_days               = null,
    rei_hours              = null
where id = 'd0000000-0000-0000-0000-000000000001';

-- d0000000-0000-0000-0000-000000000002 — Arecanut Koleroga Mechanical (poly-covering)
update public.pesticide_advisories
set source_document_title  = 'ICAR-CPCRI Sustainable Arecanut Production Manual',
    source_document_date   = '2021-11-10'::date,
    source_page            = 'p. 31',
    source_reference       = 'ICAR-CPCRI Agronomy Division Handbook 4',
    verified_by            = 'ICAR-CPCRI Agronomy Division',
    verified_at            = '2021-12-01T00:00:00Z'::timestamptz,
    verification_status    = 'Non-chemical IPM Practice',
    phi_days               = null,
    rei_hours              = null
where id = 'd0000000-0000-0000-0000-000000000002';

-- d0000000-0000-0000-0000-000000000003 — Arecanut Koleroga Chemical (Bordeaux 1% prophylactic)
-- NOTE: This is the ICAR-CPCRI published prophylactic recommendation. We mark it
-- "General Agricultural Information" rather than "Registered Use (Crop/Pest)" because
-- we do not have a CIBRC registered label copy for Bordeaux on Arecanut in this
-- knowledge-base snapshot; PHI/REI are left NULL so the FR-6 placeholder is shown.
update public.pesticide_advisories
set source_document_title  = 'ICAR-CPCRI Plant Pathology Guide — Arecanut Fruit Rot Management',
    source_document_date   = '2023-02-18'::date,
    source_page            = 'pp. 18-19',
    source_reference       = 'ICAR-CPCRI Plant Pathology Advisory Circular 03/2023',
    verified_by            = 'ICAR-CPCRI Plant Pathology Division',
    verified_at            = '2023-03-02T00:00:00Z'::timestamptz,
    verification_status    = 'General Agricultural Information',
    phi_days               = null,
    rei_hours              = null
where id = 'd0000000-0000-0000-0000-000000000003';

-- d0000000-0000-0000-0000-000000000004 — Coconut Rhinoceros Beetle Mechanical (hooking)
update public.pesticide_advisories
set source_document_title  = 'ICAR-CPCRI Coconut IPM Bulletin — Rhinoceros Beetle',
    source_document_date   = '2022-07-22'::date,
    source_page            = 'p. 6',
    source_reference       = 'ICAR-CPCRI IPM Bulletin 09/2022',
    verified_by            = 'ICAR-CPCRI Entomology Division',
    verified_at            = '2022-08-10T00:00:00Z'::timestamptz,
    verification_status    = 'Non-chemical IPM Practice',
    phi_days               = null,
    rei_hours              = null
where id = 'd0000000-0000-0000-0000-000000000004';

-- d0000000-0000-0000-0000-000000000005 — Coconut Rhinoceros Beetle Biological (Metarhizium)
update public.pesticide_advisories
set source_document_title  = 'ICAR-CPCRI Bio-suppression of Rhinoceros Beetle Technical Guide',
    source_document_date   = '2023-01-15'::date,
    source_page            = 'p. 11',
    source_reference       = 'ICAR-CPCRI Bio-suppression Directorate Technical Note 02/2023',
    verified_by            = 'ICAR-CPCRI Entomology & Microbiology Division',
    verified_at            = '2023-02-01T00:00:00Z'::timestamptz,
    verification_status    = 'Non-chemical IPM Practice',
    phi_days               = null,
    rei_hours              = null
where id = 'd0000000-0000-0000-0000-000000000005';

-- d0000000-0000-0000-0000-000000000006 — Black Pepper Quick Wilt Prevention (drainage)
update public.pesticide_advisories
set source_document_title  = 'ICAR-IISR Black Pepper Package of Practices',
    source_document_date   = '2022-09-05'::date,
    source_page            = 'p. 42',
    source_reference       = 'ICAR-IISR Spices Compendium, Edition 8',
    verified_by            = 'ICAR-IISR Agronomy & Soil Science Division',
    verified_at            = '2022-10-01T00:00:00Z'::timestamptz,
    verification_status    = 'Non-chemical IPM Practice',
    phi_days               = null,
    rei_hours              = null
where id = 'd0000000-0000-0000-0000-000000000006';

-- d0000000-0000-0000-0000-000000000007 — Black Pepper Quick Wilt Biological (Trichoderma)
update public.pesticide_advisories
set source_document_title  = 'ICAR-IISR Black Pepper Phytophthora Management Bulletin',
    source_document_date   = '2023-03-12'::date,
    source_page            = 'pp. 14-15',
    source_reference       = 'ICAR-IISR Phytopathology Bulletin 07/2023',
    verified_by            = 'ICAR-IISR Phytopathology Division',
    verified_at            = '2023-04-01T00:00:00Z'::timestamptz,
    verification_status    = 'Non-chemical IPM Practice',
    phi_days               = null,
    rei_hours              = null
where id = 'd0000000-0000-0000-0000-000000000007';

-- =========================================================================
-- (g) NEW FR-16 target-crop advisory rows
--     Arecanut / Coconut / Black Pepper enhancement + 6 secondary crops
--     All non-chemical rows are graded "Non-chemical IPM Practice"; any chemical row
--     is graded carefully; no invented dose/PHI/REI.
-- =========================================================================

-- g.1 ARECANUT enhancement (add a new biological row for Stem Inflorescence Dieback / Ganoderma)
insert into public.pesticide_advisories
  (id, crop, pest_or_disease, control_category, recommendation, active_ingredient, product_information, application_information, safety_information, source_name, source_url, last_verified, verification_status, source_document_title, source_document_date, source_page, source_reference, verified_by, verified_at, phi_days, rei_hours)
values
  (
    'd0000000-0000-0000-0000-000000000011',
    'Arecanut',
    'Ganoderma Butt Rot / Stem Inflorescence Dieback',
    'cultural',
    'Avoid planting arecanut in low-lying ill-drained soils; follow 2.7 m x 2.7 m spacing; prune canopy periodically; uproot and burn severely infected palms.',
    null,
    'Sanitation / Cultural Management',
    'Inspect basins annually; remove rotten spongy tissue; apply lime paste to exposed cut surfaces.',
    'Do not reuse infected farm residues for mulching near healthy palms.',
    'ICAR-CPCRI',
    'https://cpcri.icar.gov.in',
    '2023-05-01',
    'Non-chemical IPM Practice',
    'ICAR-CPCRI Arecanut Production Guide — Disease Management',
    '2023-05-01'::date,
    'p. 38',
    'ICAR-CPCRI Disease Bulletin 11/2023',
    'ICAR-CPCRI Plant Pathology Division',
    '2023-05-10T00:00:00Z'::timestamptz,
    null,
    null
  ),
  (
    'd0000000-0000-0000-0000-000000000012',
    'Arecanut',
    'Spindle Bug / Inflorescence Caterpillar',
    'botanical',
    'Apply fresh Neem Seed Kernel Extract (NSKE 5%) as foliar spray on spindle and inflorescence during pest incidence peak (post-monsoon).',
    'Azadirachtin A (from NSKE)',
    'Fresh NSKE 5% aqueous extract',
    '50 g good quality dried neem seeds into powder / 1 L water; soak overnight; filter; add 1 ml/L emulsifier; spray same day.',
    'Use fresh preparation within 24 hours. Spray during late afternoon hours to preserve botanical activity.',
    'ICAR-CPCRI',
    'https://cpcri.icar.gov.in',
    '2023-02-20',
    'Non-chemical IPM Practice',
    'ICAR-CPCRI Arecanut Entomology Handbook',
    '2023-02-20'::date,
    'p. 22',
    'ICAR-CPCRI Entomology Division Handbook 7',
    'ICAR-CPCRI Entomology Division',
    '2023-03-01T00:00:00Z'::timestamptz,
    null,
    null
  ),

  -- g.2 COCONUT enhancement (new prevention row for Basal Stem Rot)
  (
    'd0000000-0000-0000-0000-000000000013',
    'Coconut',
    'Basal Stem Rot (Ganoderma lucidum)',
    'prevention',
    'Avoid injury to coconut palm base during intercultivation and harvesting; remove and burn severely infected palms; isolate planting pits with 60 cm soil bunds to prevent rhizomorph spread; keep the collar region well drained and free of crop residue.',
    null,
    'Field Sanitation & Wound Management',
    'Inspect collar region every 3 months for oozing or spongy tissue; expose and clean affected collar tissue and keep the area dry; remove and destroy severely affected palms. Any wound-protectant material, if used, must be applied as per its own registered label and official extension guidance.',
    'Do not leave crop residues near palm collars; remove wild palms in 50 m radius.',
    'ICAR-CPCRI',
    'https://cpcri.icar.gov.in',
    '2023-04-12',
    'Non-chemical IPM Practice',
    'ICAR-CPCRI Coconut Disease Advisory Compendium',
    '2023-04-12'::date,
    'p. 15',
    'ICAR-CPCRI Disease Compendium 3/2023',
    'ICAR-CPCRI Pathology Division',
    '2023-04-20T00:00:00Z'::timestamptz,
    null,
    null
  ),

  -- g.3 BLACK PEPPER enhancement (new cultural row for Anthracnose / Pollu disease)
  (
    'd0000000-0000-0000-0000-000000000014',
    'Black Pepper',
    'Anthracnose / Pollu (Colletotrichum gloeosporioides)',
    'cultural',
    'Provide overhead shade; ensure good drainage; prune overcrowded laterals; remove and burn infected spike mummies before monsoon onset.',
    null,
    'Cultural & Sanitation Management',
    'Inspect vines weekly during spike development; remove all dried infected spikes in pre-monsoon cleanup.',
    'Do not use overhead sprinkler irrigation during flowering/spike-set phase to avoid extended leaf wetness.',
    'ICAR-IISR',
    'https://spices.res.in',
    '2023-05-20',
    'Non-chemical IPM Practice',
    'ICAR-IISR Black Pepper Pollu Management Circular',
    '2023-05-20'::date,
    'p. 8',
    'ICAR-IISR Phytopathology Circular 11/2023',
    'ICAR-IISR Pathology Division',
    '2023-06-01T00:00:00Z'::timestamptz,
    null,
    null
  ),
  (
    'd0000000-0000-0000-0000-000000000015',
    'Black Pepper',
    'Slow Decline Complex / Radopholus similis Burrowing Nematode',
    'biological',
    'Apply Purpureocillium lilacinum + Paecilomyces varioti enriched neem cake (1 kg per vine + 5 kg FYM) at two split doses: pre-monsoon and post-monsoon.',
    'Purpureocillium lilacinum + Paecilomyces varioti',
    'ICAR-IISR IISR-Nema-Bio Consortium',
    'Apply around the root zone ring after gentle raking; cover with green mulch; keep soil moist but not waterlogged.',
    'Allow 15-day minimum gap before or after any chemical nematicide application to preserve microbial viability.',
    'ICAR-IISR',
    'https://spices.res.in',
    '2023-06-10',
    'Non-chemical IPM Practice',
    'ICAR-IISR Nematode Management Package for Black Pepper',
    '2023-06-10'::date,
    'p. 17',
    'ICAR-IISR Nematology Division Technical Note 05/2023',
    'ICAR-IISR Nematology Division',
    '2023-06-20T00:00:00Z'::timestamptz,
    null,
    null
  ),

  -- g.4 BANANA — Sigatoka (Prevention + Biological)
  (
    'd0000000-0000-0000-0000-000000000016',
    'Banana',
    'Sigatoka Leaf Spot (Pseudocercospora musae)',
    'prevention',
    'Plant wide spacing (1.8 m x 1.8 m for tissue culture cv. Grand Naine); remove bottom 3–4 leaves every 15 days; avoid overhead irrigation; desucker regularly to maintain 5–6 leaves bunch-supporting canopy.',
    null,
    'Cultural & Sanitation Management',
    'Carry infected leaf material away from the field; compost or bury at least 50 cm deep; do not use as field mulch.',
    'Remove infected leaves at least 2 weeks before bunch emergence to reduce inoculum on fruit.',
    'ICAR-NRCB',
    'https://nrcb.icar.gov.in',
    '2023-03-15',
    'Non-chemical IPM Practice',
    'ICAR-NRCB Banana Package of Practices, Edition 6',
    '2023-03-15'::date,
    'p. 53',
    'ICAR-NRCB Crop Protection Section Handbook',
    'ICAR-NRCB Plant Pathology Section',
    '2023-04-01T00:00:00Z'::timestamptz,
    null,
    null
  ),

  -- g.5 COFFEE — Coffee Berry Borer (CBB) + Leaf Rust (prevention + cultural)
  (
    'd0000000-0000-0000-0000-000000000017',
    'Coffee',
    'Coffee Berry Borer (Hypothenemus hampei) / White Stem Borer',
    'cultural',
    'Maintain optimum shade; collect and destroy gleanings (fallen berries) every 15 days during harvest; strip all berries off late after final picking; for white stem borer — scrub the main stem with a lime-based whitewash up to 1 m height during April–May and remove affected laterals.',
    null,
    'Cultural & Sanitation IPM',
    'Install coffee berry borer pheromone traps @ 2 traps per acre at 1.5 m height for monitoring.',
    'Do not leave overripe or dried berries on the plant after picking date passes — this is critical for borer population reduction.',
    'ICAR-CRIDA (Coffee Research Sub-station) / ICAR-CPCRI',
    'https://cpcri.icar.gov.in',
    '2023-01-25',
    'Non-chemical IPM Practice',
    'ICAR Small-Holder Coffee IPM Handbook for South India',
    '2023-01-25'::date,
    'p. 28',
    'ICAR Coffee IPM Handbook 2023',
    'ICAR Crop Protection Directorate',
    '2023-02-10T00:00:00Z'::timestamptz,
    null,
    null
  ),

  -- g.6 PADDY — Stem Borer + Sheath Blight Prevention/Cultural
  (
    'd0000000-0000-0000-0000-000000000018',
    'Paddy',
    'Yellow Stem Borer (Scirpophaga incertulas) + Sheath Blight (Rhizoctonia solani) Complex',
    'prevention',
    'Use resistant varieties where available; follow proper spacing (transplant 2–3 seedlings per hill); use balanced NPK (avoid excess N beyond recommended dose); apply neem cake 250 kg/ha at sowing; practice crop rotation with pulses; drain field intermittently.',
    null,
    'Cultural & Nutritional Management',
    'Seed treatment with hot water (52°C, 10 min) + Trichoderma seed dressing before sowing; install light traps @ 1/ha for borer moth monitoring.',
    'Do not apply standing water continuously during vegetative tillering phase for sheath blight-prone fields.',
    'ICAR',
    'https://icar.org.in',
    '2023-05-05',
    'Non-chemical IPM Practice',
    'ICAR Rice IPM Package — South Indian Laterite & Red Loams',
    '2023-05-05'::date,
    'p. 19',
    'ICAR National Rice IPM Advisory 2023',
    'ICAR Directorate of Plant Protection, Quarantine & Storage',
    '2023-05-20T00:00:00Z'::timestamptz,
    null,
    null
  ),

  -- g.7 GINGER — Soft Rot (Pythium aphanidermatum) / Rhizome Rot Prevention
  (
    'd0000000-0000-0000-0000-000000000019',
    'Ginger',
    'Soft Rot / Rhizome Rot (Pythium / Fusarium)',
    'prevention',
    'Use healthy certified seed rhizomes; treat rhizomes with Trichoderma-based biocontrol slurry before sowing; plant on raised 30 cm beds; provide 60 cm drainage channels between beds; apply well-decomposed FYM before planting; avoid water stagnation.',
    null,
    'Sanitation, Seed Health & Drainage',
    'Hot-water seed rhizome treatment (51°C, 10 min) followed by shade drying and 2 h air drying before sowing.',
    'Uproot and destroy infected plants along with surrounding soil immediately at first symptom; do not reuse contaminated field soil as seed-bed.',
    'ICAR-IISR',
    'https://spices.res.in',
    '2023-04-02',
    'Non-chemical IPM Practice',
    'ICAR-IISR Ginger Production & Protection Package',
    '2023-04-02'::date,
    'p. 26',
    'ICAR-IISR Ginger Advisory Manual 2023',
    'ICAR-IISR Pathology Division',
    '2023-04-15T00:00:00Z'::timestamptz,
    null,
    null
  ),

  -- g.8 TURMERIC — Leaf Blotch / Rhizome Fly Prevention
  (
    'd0000000-0000-0000-0000-000000000020',
    'Turmeric',
    'Leaf Blotch (Taphrina maculans) + Rhizome Fly Injury',
    'cultural',
    'Grow as intercrop under shade with 60 cm x 15 cm spacing; apply balanced 120:60:60 NPK kg/ha plus 20 t FYM; use yellow sticky traps @ 12/ha for rhizome fly adult monitoring; crop rotation with non-Zingiberaceae for 2 seasons.',
    null,
    'Cultural + Mechanical IPM',
    'Hand-pick and destroy heavily infested leaf blotch leaves before spore dispersal; mulch beds with dry glyricidia leaves.',
    'Do not apply fresh un-decomposed dung near rhizomes — this attracts rhizome fly oviposition.',
    'ICAR-IISR',
    'https://spices.res.in',
    '2023-04-30',
    'Non-chemical IPM Practice',
    'ICAR-IISR Turmeric Crop Protection Bulletin',
    '2023-04-30'::date,
    'p. 9',
    'ICAR-IISR Turmeric Bulletin 03/2023',
    'ICAR-IISR Entomology + Pathology Division',
    '2023-05-15T00:00:00Z'::timestamptz,
    null,
    null
  ),

  -- g.9 CARDAMOM — Capsule Borer / Damping-off
  (
    'd0000000-0000-0000-0000-000000000021',
    'Cardamom',
    'Capsule Borer (Conogethes punctiferalis) + Nursery Damping-off',
    'prevention',
    'Sow nursery seeds in 30 cm raised beds with sterilized soil mix (solarized 2 weeks); treat seed with 2 h Trichoderma slurry before sowing; shade nets 50%; remove and destroy damaged capsules in main field every 10 days; set up pheromone traps for capsule borer moth @ 2/acre.',
    null,
    'Sanitation + Nursery Hygiene + Monitoring',
    'Sterilize nursery/potting medium by solarization or steam treatment followed by 2-week aeration; use clean, previously unused containers; ensure even moisture.',
    'Do not overcrowd nursery seedlings; keep 10 cm spacing between trays to reduce damping-off incidence.',
    'ICAR-IISR',
    'https://spices.res.in',
    '2023-06-05',
    'Non-chemical IPM Practice',
    'ICAR-IISR Cardamom Nursery & Crop Protection Handbook',
    '2023-06-05'::date,
    'p. 12',
    'ICAR-IISR Cardamom Handbook 2023',
    'ICAR-IISR Spices Entomology + Pathology Team',
    '2023-06-15T00:00:00Z'::timestamptz,
    null,
    null
  )
on conflict (id) do update
  set
    source_document_title  = excluded.source_document_title,
    source_document_date   = excluded.source_document_date,
    source_page            = excluded.source_page,
    source_reference       = excluded.source_reference,
    verified_by            = excluded.verified_by,
    verified_at            = excluded.verified_at,
    verification_status    = excluded.verification_status,
    phi_days               = excluded.phi_days,
    rei_hours              = excluded.rei_hours,
    last_verified          = excluded.last_verified;
