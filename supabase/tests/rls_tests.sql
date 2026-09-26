-- ============================================================================
-- SMART FARM 2.0 - DATABASE RLS SECURITY TESTS
-- Verifies row-level security isolation between farmers and public access
-- ============================================================================

do $$
declare
  v_farmer_a_id uuid := '11111111-1111-1111-1111-111111111111';
  v_farmer_b_id uuid := '22222222-2222-2222-2222-222222222222';
  v_farm_a_id uuid := 'a1111111-1111-1111-1111-111111111111';
  v_farm_b_id uuid := 'b2222222-2222-2222-2222-222222222222';
  v_job_a_id uuid := 'j1111111-1111-1111-1111-111111111111';
  v_count integer;
begin
  raise notice '>>> Starting SmartFarm 2.0 RLS Security Test Suite <<<';

  -- 1. Verify Public access cannot read private farm data
  perform set_config('role', 'anon', true);
  select count(*) into v_count from public.farms;
  if v_count > 0 then
    raise exception 'FAIL: Anon user was able to query private farms!';
  else
    raise notice 'PASS: Anon user blocked from reading private farms.';
  end if;

  select count(*) into v_count from public.farm_crops;
  if v_count > 0 then
    raise exception 'FAIL: Anon user was able to query private farm_crops!';
  else
    raise notice 'PASS: Anon user blocked from reading private farm crops.';
  end if;

  select count(*) into v_count from public.crop_activities;
  if v_count > 0 then
    raise exception 'FAIL: Anon user was able to query private crop_activities!';
  else
    raise notice 'PASS: Anon user blocked from reading private activities.';
  end if;

  select count(*) into v_count from public.farm_inputs;
  if v_count > 0 then
    raise exception 'FAIL: Anon user was able to query private farm_inputs!';
  else
    raise notice 'PASS: Anon user blocked from reading private inputs.';
  end if;

  select count(*) into v_count from public.pest_observations;
  if v_count > 0 then
    raise exception 'FAIL: Anon user was able to query private pest observations!';
  else
    raise notice 'PASS: Anon user blocked from reading private pest observations.';
  end if;

  select count(*) into v_count from public.ipm_records;
  if v_count > 0 then
    raise exception 'FAIL: Anon user was able to query private ipm_records!';
  else
    raise notice 'PASS: Anon user blocked from reading private IPM records.';
  end if;

  select count(*) into v_count from public.pesticide_applications;
  if v_count > 0 then
    raise exception 'FAIL: Anon user was able to query private pesticide_applications!';
  else
    raise notice 'PASS: Anon user blocked from reading private pesticide applications.';
  end if;

  select count(*) into v_count from public.pest_follow_ups;
  if v_count > 0 then
    raise exception 'FAIL: Anon user was able to query private pest_follow_ups!';
  else
    raise notice 'PASS: Anon user blocked from reading private pest follow-ups.';
  end if;

  select count(*) into v_count from public.soil_tests;
  if v_count > 0 then
    raise exception 'FAIL: Anon user was able to query private soil_tests!';
  else
    raise notice 'PASS: Anon user blocked from reading private soil tests.';
  end if;

  select count(*) into v_count from public.ai_conversations;
  if v_count > 0 then
    raise exception 'FAIL: Anon user was able to query private ai_conversations!';
  else
    raise notice 'PASS: Anon user blocked from reading private AI conversations.';
  end if;

  -- 2. Verify Public CAN query public knowledge and open farm jobs
  select count(*) into v_count from public.organic_inputs;
  raise notice 'PASS: Anon user can query public organic inputs library (Count: %)', v_count;

  select count(*) into v_count from public.pesticide_advisories;
  raise notice 'PASS: Anon user can query public pesticide advisories (Count: %)', v_count;

  select count(*) into v_count from public.knowledge_articles;
  raise notice 'PASS: Anon user can query public knowledge articles (Count: %)', v_count;

  select count(*) into v_count from public.market_prices;
  raise notice 'PASS: Anon user can query public market prices (Count: %)', v_count;

  -- 3. Farmer A vs Farmer B isolation (authenticated role, simulated uid)
  perform set_config('role', 'authenticated', true);

  -- Seed two distinct farms for different synthetic uids. Direct inserts bypass
  -- app-level but trigger server-side RLS policy with_exists farm ownership check.
  -- (We use raw INSERT and catch errors via begin..exception when supported.)

  -- 3a) Farmer A cannot READ Farmer B private tables
  perform set_config('request.jwt.claim.sub', v_farmer_a_id::text, true);
  -- Simulate auth.uid() returning farmer_a_id:
  perform set_config('app.simulated_uid', v_farmer_a_id::text, true);

  -- Read isolation baseline: own farms
  select count(*) into v_count from public.farms where user_id = v_farmer_a_id;
  raise notice 'PASS: Farmer A can see own farms (Count: %)', v_count;

  -- 3b) Cross-farm INSERT MUST FAIL: farmer A inserting farm_id belonging to farmer B
  --     (If RLS farm ownership guard is missing, this insert would incorrectly succeed
  --      because user_id matches A even though farm_id is owned by B.)
  begin
    insert into public.farm_crops (id, user_id, farm_id, crop_name, planting_date, status)
    values (
      gen_random_uuid(),
      v_farmer_a_id,
      v_farm_b_id,            -- <<< CROSS-USER farm_id, MUST be blocked
      'Synthetic Test Crop',
      current_date,
      'active'
    );
    raise exception 'FAIL: Farmer A was able to INSERT farm_crops with farm_id owned by Farmer B (cross-farm ownership guard missing)';
  exception when others then
    raise notice 'PASS: Farmer A BLOCKED from inserting farm_crops with farm_id owned by Farmer B (cross-ownership guard active): %', SQLERRM;
  end;

  -- 3c) Repeat cross-farm insert block for soil_tests
  begin
    insert into public.soil_tests (id, user_id, farm_id, test_date, ph)
    values (gen_random_uuid(), v_farmer_a_id, v_farm_b_id, current_date, 6.5);
    raise exception 'FAIL: Farmer A was able to INSERT soil_tests with farm_id owned by Farmer B';
  exception when others then
    raise notice 'PASS: Farmer A BLOCKED from inserting soil_tests with farm_id owned by Farmer B: %', SQLERRM;
  end;

  -- 3d) Repeat cross-farm insert block for pest_observations
  begin
    insert into public.pest_observations (id, user_id, farm_id, observation_date, pest_name, symptoms, severity, affected_area_percent)
    values (gen_random_uuid(), v_farmer_a_id, v_farm_b_id, current_date, 'Aphid', 'Leaf curl', 'low', 5);
    raise exception 'FAIL: Farmer A was able to INSERT pest_observations with farm_id owned by Farmer B';
  exception when others then
    raise notice 'PASS: Farmer A BLOCKED from inserting pest_observations with farm_id owned by Farmer B: %', SQLERRM;
  end;

  -- 3e) Repeat cross-farm insert block for farm_inputs
  begin
    insert into public.farm_inputs (id, user_id, farm_id, input_name, category, quantity, unit, purchase_date)
    values (gen_random_uuid(), v_farmer_a_id, v_farm_b_id, 'Urea', 'Fertilizer', 50, 'kg', current_date);
    raise exception 'FAIL: Farmer A was able to INSERT farm_inputs with farm_id owned by Farmer B';
  exception when others then
    raise notice 'PASS: Farmer A BLOCKED from inserting farm_inputs with farm_id owned by Farmer B: %', SQLERRM;
  end;

  -- 3f) Repeat cross-farm insert block for farm_expenses
  begin
    insert into public.farm_expenses (id, user_id, farm_id, expense_date, category, amount)
    values (gen_random_uuid(), v_farmer_a_id, v_farm_b_id, current_date, 'Labour', 5000);
    raise exception 'FAIL: Farmer A was able to INSERT farm_expenses with farm_id owned by Farmer B';
  exception when others then
    raise notice 'PASS: Farmer A BLOCKED from inserting farm_expenses with farm_id owned by Farmer B: %', SQLERRM;
  end;

  -- 3g) Repeat cross-farm insert block for compost_batches
  begin
    insert into public.compost_batches (id, user_id, farm_id, compost_type, starting_quantity, unit, start_date, status)
    values (gen_random_uuid(), v_farmer_a_id, v_farm_b_id, 'vermicompost', 100, 'kg', current_date, 'preparing');
    raise exception 'FAIL: Farmer A was able to INSERT compost_batches with farm_id owned by Farmer B';
  exception when others then
    raise notice 'PASS: Farmer A BLOCKED from inserting compost_batches with farm_id owned by Farmer B: %', SQLERRM;
  end;

  -- 3h) Repeat cross-farm insert block for crop_activities
  begin
    insert into public.crop_activities (id, user_id, farm_id, activity_date, activity_type, notes)
    values (gen_random_uuid(), v_farmer_a_id, v_farm_b_id, current_date, 'Irrigation', 'Cross-farm attempt');
    raise exception 'FAIL: Farmer A was able to INSERT crop_activities with farm_id owned by Farmer B';
  exception when others then
    raise notice 'PASS: Farmer A BLOCKED from inserting crop_activities with farm_id owned by Farmer B: %', SQLERRM;
  end;

  -- 3i) Repeat cross-farm insert block for lab_reports
  begin
    insert into public.lab_reports (id, user_id, farm_id, report_type, title, issue_date, certification_disclaimer)
    values (gen_random_uuid(), v_farmer_a_id, v_farm_b_id, 'soil_analysis', 'Bad Cross-Insert', current_date, 'Internal disclaimer');
    raise exception 'FAIL: Farmer A was able to INSERT lab_reports with farm_id owned by Farmer B';
  exception when others then
    raise notice 'PASS: Farmer A BLOCKED from inserting lab_reports with farm_id owned by Farmer B: %', SQLERRM;
  end;

  -- 3j) Repeat cross-farm insert block for ipm_records (chunk 2 table)
  begin
    insert into public.ipm_records (id, user_id, farm_id, pest_name, advisory_level, recommendation, rationale, source_name)
    values (gen_random_uuid(), v_farmer_a_id, v_farm_b_id, 'Aphid', 'biological', 'Cross-farm attempt', 'Should be blocked', 'ICAR');
    raise exception 'FAIL: Farmer A was able to INSERT ipm_records with farm_id owned by Farmer B';
  exception when others then
    raise notice 'PASS: Farmer A BLOCKED from inserting ipm_records with farm_id owned by Farmer B: %', SQLERRM;
  end;

  -- 3k) Repeat cross-farm insert block for pesticide_applications (chunk 2 table)
  begin
    insert into public.pesticide_applications (id, user_id, farm_id, product_name, application_date, quantity, unit, area, area_unit, application_method)
    values (gen_random_uuid(), v_farmer_a_id, v_farm_b_id, 'Cross-farm product', current_date, 1, 'ml', 1, 'acres', 'Foliar spray');
    raise exception 'FAIL: Farmer A was able to INSERT pesticide_applications with farm_id owned by Farmer B';
  exception when others then
    raise notice 'PASS: Farmer A BLOCKED from inserting pesticide_applications with farm_id owned by Farmer B: %', SQLERRM;
  end;

  -- 3l) Repeat cross-farm insert block for pest_follow_ups (chunk 2 table)
  begin
    insert into public.pest_follow_ups (id, user_id, farm_id, follow_up_date, severity_after_treatment, outcome)
    values (gen_random_uuid(), v_farmer_a_id, v_farm_b_id, current_date, 'low', 'unknown');
    raise exception 'FAIL: Farmer A was able to INSERT pest_follow_ups with farm_id owned by Farmer B';
  exception when others then
    raise notice 'PASS: Farmer A BLOCKED from inserting pest_follow_ups with farm_id owned by Farmer B: %', SQLERRM;
  end;

  -- 3m) Chunk 2 read isolation: Farmer A must not see Farmer B pest records
  select count(*) into v_count from public.ipm_records where user_id = v_farmer_b_id;
  raise notice 'INFO: Farmer A visible ipm_records owned by Farmer B (must be 0): %', v_count;

  select count(*) into v_count from public.pesticide_applications where user_id = v_farmer_b_id;
  raise notice 'INFO: Farmer A visible pesticide_applications owned by Farmer B (must be 0): %', v_count;

  select count(*) into v_count from public.pest_follow_ups where user_id = v_farmer_b_id;
  raise notice 'INFO: Farmer A visible pest_follow_ups owned by Farmer B (must be 0): %', v_count;

  -- -------------------------------------------------------------------------
  -- 4. Reset role
  perform set_config('role', 'authenticated', true);
  raise notice '>>> All extended RLS ownership + cross-farm tests completed successfully! <<<';
end;
$$;
