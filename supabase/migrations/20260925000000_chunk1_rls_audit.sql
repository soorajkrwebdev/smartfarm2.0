-- ============================================================================
-- CHUNK 1 — RLS OWNERSHIP AUDIT & CROSS-FARM INSERT/UPDATE HARDENING
-- ============================================================================
-- Purpose:
--   Every private table that carries a farm_id FK must assert (at INSERT/UPDATE
--   time) that the referenced farm BELONGS to the authenticated user_id.
--   This blocks a malicious client from submitting user_id=me + farm_id=someone_else
--   even though they own the user_id column.
--
--   SELECT/DELETE policies continue to rely on user_id=auth.uid() which already
--   provides read/delete isolation (since the inserted row is correctly owned).
--
-- Rollout: Appended migration. Existing policies are DROPPED and recreated with
-- the hardened WITH CHECK clauses. All tables already have RLS ENABLEd from their
-- phase migration, so no duplicate enable.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Helper: Farm ownership guard used for every WITH CHECK below
--   TRUE  <=> auth.uid() owns NEW.farm_id
--   FALSE <=> cross-user farm insert => policy violation => statement rejected
-- ---------------------------------------------------------------------------

-- ============================================================================
-- 1. FARM_CROPS (farm_id FK — user inserts crops for a farm they must own)
-- ============================================================================
drop policy if exists "Farmers can insert own crops" on public.farm_crops;
create policy "Farmers can insert own crops"
  on public.farm_crops for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

drop policy if exists "Farmers can update own crops" on public.farm_crops;
create policy "Farmers can update own crops"
  on public.farm_crops for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 2. CROP_ACTIVITIES
-- ============================================================================
drop policy if exists "Farmers can insert own activities" on public.crop_activities;
create policy "Farmers can insert own activities"
  on public.crop_activities for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

drop policy if exists "Farmers can update own activities" on public.crop_activities;
create policy "Farmers can update own activities"
  on public.crop_activities for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 3. FARM_INPUTS
-- ============================================================================
drop policy if exists "Farmers can insert own inputs" on public.farm_inputs;
create policy "Farmers can insert own inputs"
  on public.farm_inputs for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

drop policy if exists "Farmers can update own inputs" on public.farm_inputs;
create policy "Farmers can update own inputs"
  on public.farm_inputs for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 4. PEST_OBSERVATIONS
-- ============================================================================
drop policy if exists "Farmers can insert own pest observations" on public.pest_observations;
create policy "Farmers can insert own pest observations"
  on public.pest_observations for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

drop policy if exists "Farmers can update own pest observations" on public.pest_observations;
create policy "Farmers can update own pest observations"
  on public.pest_observations for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 5. IPM_RECORDS
-- ============================================================================
drop policy if exists "Farmers can insert own ipm records" on public.ipm_records;
create policy "Farmers can insert own ipm records"
  on public.ipm_records for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

drop policy if exists "Farmers can update own ipm records" on public.ipm_records;
create policy "Farmers can update own ipm records"
  on public.ipm_records for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 6. PESTICIDE_APPLICATIONS
-- ============================================================================
drop policy if exists "Farmers can insert own pesticide applications" on public.pesticide_applications;
create policy "Farmers can insert own pesticide applications"
  on public.pesticide_applications for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

drop policy if exists "Farmers can update own pesticide applications" on public.pesticide_applications;
create policy "Farmers can update own pesticide applications"
  on public.pesticide_applications for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 7. SOIL_TESTS
-- ============================================================================
drop policy if exists "Farmers can insert own soil tests" on public.soil_tests;
create policy "Farmers can insert own soil tests"
  on public.soil_tests for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

drop policy if exists "Farmers can update own soil tests" on public.soil_tests;
create policy "Farmers can update own soil tests"
  on public.soil_tests for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 8. WATER_TESTS
-- ============================================================================
drop policy if exists "Farmers can insert own water tests" on public.water_tests;
create policy "Farmers can insert own water tests"
  on public.water_tests for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

drop policy if exists "Farmers can update own water tests" on public.water_tests;
create policy "Farmers can update own water tests"
  on public.water_tests for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 9. LAB_REPORTS
-- ============================================================================
drop policy if exists "Farmers can insert own lab reports" on public.lab_reports;
create policy "Farmers can insert own lab reports"
  on public.lab_reports for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

drop policy if exists "Farmers can update own lab reports" on public.lab_reports;
create policy "Farmers can update own lab reports"
  on public.lab_reports for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 10. FARM_WASTE
-- ============================================================================
drop policy if exists "Farmers can insert own farm waste" on public.farm_waste;
create policy "Farmers can insert own farm waste"
  on public.farm_waste for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

drop policy if exists "Farmers can update own farm waste" on public.farm_waste;
create policy "Farmers can update own farm waste"
  on public.farm_waste for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 11. COMPOST_BATCHES
-- ============================================================================
drop policy if exists "Farmers can insert own compost batches" on public.compost_batches;
create policy "Farmers can insert own compost batches"
  on public.compost_batches for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

drop policy if exists "Farmers can update own compost batches" on public.compost_batches;
create policy "Farmers can update own compost batches"
  on public.compost_batches for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 12. FARM_EXPENSES (phase5 policy currently simple auth.uid check)
-- ============================================================================
drop policy if exists "Farmers can insert own expenses" on public.farm_expenses;
create policy "Farmers can insert own expenses"
  on public.farm_expenses for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

drop policy if exists "Farmers can update own expenses" on public.farm_expenses;
create policy "Farmers can update own expenses"
  on public.farm_expenses for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 13. CROP_HARVESTS (phase5 policy currently simple auth.uid check)
-- ============================================================================
drop policy if exists "Farmers can insert own harvests" on public.crop_harvests;
create policy "Farmers can insert own harvests"
  on public.crop_harvests for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

drop policy if exists "Farmers can update own harvests" on public.crop_harvests;
create policy "Farmers can update own harvests"
  on public.crop_harvests for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.farms f
      where f.id = farm_id and f.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 14. NOTIFICATIONS (no farm_id; user_id-only check is sufficient)
-- 15. AI_CONVERSATIONS (user_id only, no farm_id column — retained as-is)
-- ============================================================================
-- No farm_id => no cross-farm ownership issue possible; existing user_id checks
-- are sufficient and intentionally retained unmodified.

-- ============================================================================
-- PUBLIC READ TABLE CONFIRMATION (sanity re-assertions to keep these explicit)
-- ============================================================================
-- organic_inputs          -> already public select via phase2
-- pesticide_advisories    -> already public select via phase3
-- knowledge_articles      -> already public select via phase5
-- market_prices           -> already public select via phase5
-- farm_jobs (open only)   -> already public select via phase5
-- ============================================================================
