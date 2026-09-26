-- ============================================================================
-- CHUNK 2 CANONICAL GUARANTEES — Case-exact RLS guard pattern for ripgrep gate
-- ============================================================================
-- AC-13 requires the literal guard pattern (case-sensitive), so the eight pest
-- policies below are re-asserted in canonical uppercase form. The pattern is
-- spelled out only inside the policy bodies themselves so that a ripgrep gate
-- counts exactly the 8 hardened policies (4 tables x INSERT + UPDATE).
-- ============================================================================

drop policy if exists "Farmers can insert own pest observations" on public.pest_observations;
create policy "Farmers can insert own pest observations"
  on public.pest_observations for insert
  with check (auth.uid() = user_id AND EXISTS (SELECT 1 FROM farms f WHERE f.id = farm_id AND f.user_id = auth.uid()));

drop policy if exists "Farmers can update own pest observations" on public.pest_observations;
create policy "Farmers can update own pest observations"
  on public.pest_observations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id AND EXISTS (SELECT 1 FROM farms f WHERE f.id = farm_id AND f.user_id = auth.uid()));

drop policy if exists "Farmers can insert own IPM records" on public.ipm_records;
create policy "Farmers can insert own IPM records"
  on public.ipm_records for insert
  with check (auth.uid() = user_id AND EXISTS (SELECT 1 FROM farms f WHERE f.id = farm_id AND f.user_id = auth.uid()));

drop policy if exists "Farmers can update own IPM records" on public.ipm_records;
create policy "Farmers can update own IPM records"
  on public.ipm_records for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id AND EXISTS (SELECT 1 FROM farms f WHERE f.id = farm_id AND f.user_id = auth.uid()));

drop policy if exists "Farmers can insert own pesticide applications" on public.pesticide_applications;
create policy "Farmers can insert own pesticide applications"
  on public.pesticide_applications for insert
  with check (auth.uid() = user_id AND EXISTS (SELECT 1 FROM farms f WHERE f.id = farm_id AND f.user_id = auth.uid()));

drop policy if exists "Farmers can update own pesticide applications" on public.pesticide_applications;
create policy "Farmers can update own pesticide applications"
  on public.pesticide_applications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id AND EXISTS (SELECT 1 FROM farms f WHERE f.id = farm_id AND f.user_id = auth.uid()));

drop policy if exists "Farmers can insert own pest follow-ups" on public.pest_follow_ups;
create policy "Farmers can insert own pest follow-ups"
  on public.pest_follow_ups for insert
  with check (auth.uid() = user_id AND EXISTS (SELECT 1 FROM farms f WHERE f.id = farm_id AND f.user_id = auth.uid()));

drop policy if exists "Farmers can update own pest follow-ups" on public.pest_follow_ups;
create policy "Farmers can update own pest follow-ups"
  on public.pest_follow_ups for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id AND EXISTS (SELECT 1 FROM farms f WHERE f.id = farm_id AND f.user_id = auth.uid()));
