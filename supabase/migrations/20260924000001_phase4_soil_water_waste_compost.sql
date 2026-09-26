-- Phase 4: Soil, Water, Lab Reports, Farm Waste & Compost Management
-- Digital Farm Management & Sustainable Agriculture Intelligence Platform

-- 1. SOIL TESTS
create table if not exists public.soil_tests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  test_date date not null default current_date,
  lab_name text,
  ph numeric(4, 2),
  nitrogen numeric(8, 2),
  phosphorus numeric(8, 2),
  potassium numeric(8, 2),
  organic_carbon numeric(5, 2),
  electrical_conductivity numeric(6, 2),
  micronutrients text,
  texture text,
  moisture numeric(5, 2),
  other_parameters text,
  report_url text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. WATER TESTS
create table if not exists public.water_tests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  test_date date not null default current_date,
  lab_name text,
  ph numeric(4, 2),
  ec numeric(6, 2),
  hardness numeric(8, 2),
  alkalinity numeric(8, 2),
  sodium numeric(8, 2),
  calcium numeric(8, 2),
  magnesium numeric(8, 2),
  chloride numeric(8, 2),
  sulfate numeric(8, 2),
  nitrate numeric(8, 2),
  boron numeric(8, 2),
  iron numeric(8, 2),
  other_parameters text,
  suitability text default 'good' check (suitability in ('excellent', 'good', 'marginal', 'poor', 'unsuitable')),
  report_url text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. LAB REPORTS
create table if not exists public.lab_reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  report_type text not null check (report_type in ('soil', 'water', 'input_analysis', 'residue_report', 'certification', 'other')),
  title text not null,
  lab_name text,
  issue_date date not null default current_date,
  document_url text,
  certification_disclaimer text not null default 'Farmer record only. Uploaded documents do not constitute official platform certification.',
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 4. FARM WASTE
create table if not exists public.farm_waste (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  waste_type text not null check (waste_type in ('crop_residue', 'leaves', 'weeds', 'animal_waste', 'organic_household_farm_waste', 'other')),
  quantity numeric not null check (quantity >= 0),
  unit text not null default 'kg',
  collection_date date not null default current_date,
  source_location text,
  status text not null default 'collected' check (status in ('collected', 'processing', 'composted', 'applied', 'disposed')),
  processed_crop_id uuid references public.farm_crops(id) on delete set null,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 5. COMPOST BATCHES
create table if not exists public.compost_batches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  compost_type text not null default 'compost' check (compost_type in ('vermicompost', 'farmyard_manure', 'green_manure', 'compost', 'biological_strain', 'other')),
  starting_quantity numeric not null check (starting_quantity >= 0),
  unit text not null default 'kg',
  start_date date not null default current_date,
  processing_method text,
  status text not null default 'active' check (status in ('preparing', 'active', 'curing', 'finished', 'used', 'failed')),
  finished_quantity numeric check (finished_quantity >= 0),
  completion_date date,
  applied_to_crop_id uuid references public.farm_crops(id) on delete set null,
  quality_rating text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_soil_tests_user on public.soil_tests(user_id);
create index if not exists idx_soil_tests_farm on public.soil_tests(farm_id);
create index if not exists idx_water_tests_user on public.water_tests(user_id);
create index if not exists idx_water_tests_farm on public.water_tests(farm_id);
create index if not exists idx_lab_reports_user on public.lab_reports(user_id);
create index if not exists idx_lab_reports_farm on public.lab_reports(farm_id);
create index if not exists idx_farm_waste_user on public.farm_waste(user_id);
create index if not exists idx_farm_waste_farm on public.farm_waste(farm_id);
create index if not exists idx_compost_batches_user on public.compost_batches(user_id);
create index if not exists idx_compost_batches_farm on public.compost_batches(farm_id);

-- ROW LEVEL SECURITY
alter table public.soil_tests enable row level security;
alter table public.water_tests enable row level security;
alter table public.lab_reports enable row level security;
alter table public.farm_waste enable row level security;
alter table public.compost_batches enable row level security;

-- Policies (Private to Farmer)
create policy "Farmers can view own soil tests"
  on public.soil_tests for select using (auth.uid() = user_id);
create policy "Farmers can insert own soil tests"
  on public.soil_tests for insert with check (auth.uid() = user_id);
create policy "Farmers can update own soil tests"
  on public.soil_tests for update using (auth.uid() = user_id);
create policy "Farmers can delete own soil tests"
  on public.soil_tests for delete using (auth.uid() = user_id);

create policy "Farmers can view own water tests"
  on public.water_tests for select using (auth.uid() = user_id);
create policy "Farmers can insert own water tests"
  on public.water_tests for insert with check (auth.uid() = user_id);
create policy "Farmers can update own water tests"
  on public.water_tests for update using (auth.uid() = user_id);
create policy "Farmers can delete own water tests"
  on public.water_tests for delete using (auth.uid() = user_id);

create policy "Farmers can view own lab reports"
  on public.lab_reports for select using (auth.uid() = user_id);
create policy "Farmers can insert own lab reports"
  on public.lab_reports for insert with check (auth.uid() = user_id);
create policy "Farmers can update own lab reports"
  on public.lab_reports for update using (auth.uid() = user_id);
create policy "Farmers can delete own lab reports"
  on public.lab_reports for delete using (auth.uid() = user_id);

create policy "Farmers can view own farm waste"
  on public.farm_waste for select using (auth.uid() = user_id);
create policy "Farmers can insert own farm waste"
  on public.farm_waste for insert with check (auth.uid() = user_id);
create policy "Farmers can update own farm waste"
  on public.farm_waste for update using (auth.uid() = user_id);
create policy "Farmers can delete own farm waste"
  on public.farm_waste for delete using (auth.uid() = user_id);

create policy "Farmers can view own compost batches"
  on public.compost_batches for select using (auth.uid() = user_id);
create policy "Farmers can insert own compost batches"
  on public.compost_batches for insert with check (auth.uid() = user_id);
create policy "Farmers can update own compost batches"
  on public.compost_batches for update using (auth.uid() = user_id);
create policy "Farmers can delete own compost batches"
  on public.compost_batches for delete using (auth.uid() = user_id);

-- Triggers for updated_at
create trigger tr_soil_tests_updated_at before update on public.soil_tests
  for each row execute procedure public.set_updated_at();
create trigger tr_water_tests_updated_at before update on public.water_tests
  for each row execute procedure public.set_updated_at();
create trigger tr_lab_reports_updated_at before update on public.lab_reports
  for each row execute procedure public.set_updated_at();
create trigger tr_farm_waste_updated_at before update on public.farm_waste
  for each row execute procedure public.set_updated_at();
create trigger tr_compost_batches_updated_at before update on public.compost_batches
  for each row execute procedure public.set_updated_at();
