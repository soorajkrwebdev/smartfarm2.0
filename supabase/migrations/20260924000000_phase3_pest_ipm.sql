-- Phase 3: Pest Monitoring & IPM Advisory System
-- Digital Farm Management & Sustainable Agriculture Intelligence Platform

-- 1. PEST OBSERVATIONS (Farmer pest/disease monitoring records)
create table if not exists public.pest_observations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  crop_id uuid references public.farm_crops(id) on delete set null,
  pest_name text not null,
  pest_type text not null default 'insect' check (pest_type in ('insect', 'disease', 'nematode', 'weed', 'mammal', 'bird', 'other')),
  symptoms text not null,
  growth_stage text,
  severity text not null default 'low' check (severity in ('low', 'medium', 'high', 'critical')),
  affected_area_percent numeric check (affected_area_percent >= 0 and affected_area_percent <= 100),
  observation_date date not null default current_date,
  photos text[],
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. IPM RECORDS (Advisory decisions and recommendations)
create table if not exists public.ipm_records (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  crop_id uuid references public.farm_crops(id) on delete set null,
  pest_observation_id uuid references public.pest_observations(id) on delete set null,
  pest_name text not null,
  advisory_level text not null check (advisory_level in ('monitoring', 'prevention', 'cultural', 'mechanical', 'biological', 'botanical', 'chemical')),
  recommendation text not null,
  rationale text not null,
  source_name text not null,
  source_url text,
  created_at timestamptz default now() not null
);

-- 3. PESTICIDE APPLICATIONS (Record of pesticide/chemical applications with safety info)
create table if not exists public.pesticide_applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  crop_id uuid references public.farm_crops(id) on delete set null,
  pest_observation_id uuid references public.pest_observations(id) on delete set null,
  product_name text not null,
  active_ingredient text,
  application_date date not null default current_date,
  quantity numeric not null check (quantity > 0),
  unit text not null default 'ml',
  area numeric not null check (area > 0),
  area_unit text not null default 'acres',
  application_method text not null,
  source_reference text,
  pre_harvest_interval_days numeric check (pre_harvest_interval_days >= 0),
  re_entry_interval_hours numeric check (re_entry_interval_hours >= 0),
  notes text,
  follow_up_date date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 4. PESTICIDE ADVISORIES (Authoritative agricultural advisory knowledge base)
create table if not exists public.pesticide_advisories (
  id uuid primary key default uuid_generate_v4(),
  crop text not null,
  pest_or_disease text not null,
  control_category text not null check (control_category in ('prevention', 'cultural', 'mechanical', 'biological', 'botanical', 'chemical')),
  recommendation text not null,
  active_ingredient text,
  product_information text,
  application_information text,
  safety_information text,
  source_name text not null,
  source_url text,
  last_verified date default current_date,
  verification_status text default 'General Agricultural Information',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_pest_obs_user on public.pest_observations(user_id);
create index if not exists idx_pest_obs_farm on public.pest_observations(farm_id);
create index if not exists idx_pest_obs_crop on public.pest_observations(crop_id);
create index if not exists idx_pest_obs_date on public.pest_observations(observation_date desc);
create index if not exists idx_ipm_records_user on public.ipm_records(user_id);
create index if not exists idx_ipm_records_farm on public.ipm_records(farm_id);
create index if not exists idx_pesticide_apps_user on public.pesticide_applications(user_id);
create index if not exists idx_pesticide_apps_farm on public.pesticide_applications(farm_id);
create index if not exists idx_pesticide_advisories_crop on public.pesticide_advisories(crop);
create index if not exists idx_pesticide_advisories_pest on public.pesticide_advisories(pest_or_disease);

-- ROW LEVEL SECURITY
alter table public.pest_observations enable row level security;
alter table public.ipm_records enable row level security;
alter table public.pesticide_applications enable row level security;
alter table public.pesticide_advisories enable row level security;

-- Pest Observations Policies (Private to Farmer)
create policy "Farmers can view own pest observations"
  on public.pest_observations for select
  using (auth.uid() = user_id);

create policy "Farmers can insert own pest observations"
  on public.pest_observations for insert
  with check (auth.uid() = user_id);

create policy "Farmers can update own pest observations"
  on public.pest_observations for update
  using (auth.uid() = user_id);

create policy "Farmers can delete own pest observations"
  on public.pest_observations for delete
  using (auth.uid() = user_id);

-- IPM Records Policies (Private to Farmer)
create policy "Farmers can view own IPM records"
  on public.ipm_records for select
  using (auth.uid() = user_id);

create policy "Farmers can insert own IPM records"
  on public.ipm_records for insert
  with check (auth.uid() = user_id);

create policy "Farmers can update own IPM records"
  on public.ipm_records for update
  using (auth.uid() = user_id);

create policy "Farmers can delete own IPM records"
  on public.ipm_records for delete
  using (auth.uid() = user_id);

-- Pesticide Applications Policies (Private to Farmer)
create policy "Farmers can view own pesticide applications"
  on public.pesticide_applications for select
  using (auth.uid() = user_id);

create policy "Farmers can insert own pesticide applications"
  on public.pesticide_applications for insert
  with check (auth.uid() = user_id);

create policy "Farmers can update own pesticide applications"
  on public.pesticide_applications for update
  using (auth.uid() = user_id);

create policy "Farmers can delete own pesticide applications"
  on public.pesticide_applications for delete
  using (auth.uid() = user_id);

-- Pesticide Advisories Policies (Public Read Access for all)
create policy "Public can view pesticide advisories"
  on public.pesticide_advisories for select
  using (true);

-- Updated-at Triggers
create trigger tr_pest_observations_updated_at before update on public.pest_observations
  for each row execute procedure public.set_updated_at();

create trigger tr_pesticide_applications_updated_at before update on public.pesticide_applications
  for each row execute procedure public.set_updated_at();

create trigger tr_pesticide_advisories_updated_at before update on public.pesticide_advisories
  for each row execute procedure public.set_updated_at();