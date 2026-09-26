-- Phase 1: Core Foundation Schema
-- Digital Farm Management & Sustainable Agriculture Intelligence Platform

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Farmers)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  phone text,
  state text,
  district text,
  village text,
  preferred_language text default 'en',
  farming_type text default 'mixed' check (farming_type in ('organic', 'conventional', 'transitioning', 'mixed')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. FARMS
create table if not exists public.farms (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  location text not null,
  area numeric not null check (area > 0),
  area_unit text not null default 'acres' check (area_unit in ('acres', 'hectares', 'cents', 'bigha', 'guntha')),
  soil_type text,
  irrigation_type text,
  farming_method text default 'organic' check (farming_method in ('organic', 'natural', 'conventional', 'regenerative', 'integrated', 'mixed')),
  organic_status text default 'in_conversion' check (organic_status in ('certified_organic', 'in_conversion', 'non_certified_organic', 'conventional')),
  current_season text default 'Kharif',
  description text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. FARM CROPS
create table if not exists public.farm_crops (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  crop_name text not null,
  variety text,
  area numeric check (area > 0),
  area_unit text default 'acres',
  planting_date date not null,
  expected_harvest_date date,
  growth_stage text not null default 'Vegetative' check (growth_stage in (
    'Nursery / Land Prep',
    'Vegetative',
    'Flowering',
    'Fruiting / Podding',
    'Maturity / Ripening',
    'Harvesting',
    'Post-Harvest'
  )),
  soil_type text,
  irrigation text,
  farming_method text default 'organic',
  status text not null default 'active' check (status in ('active', 'harvested', 'fallow', 'failed')),
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 4. CROP ACTIVITIES
create table if not exists public.crop_activities (
  id uuid primary key default uuid_generate_v4(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  crop_id uuid references public.farm_crops(id) on delete set null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_type text not null check (activity_type in (
    'Planting',
    'Irrigation',
    'Fertilization',
    'Organic manure',
    'Biofertilizer application',
    'Weeding',
    'Mulching',
    'Pruning',
    'Pest monitoring',
    'Spraying',
    'Harvest',
    'Labour',
    'Custom activity'
  )),
  activity_date date not null default current_date,
  quantity numeric check (quantity >= 0),
  unit text,
  cost numeric default 0 check (cost >= 0),
  area numeric check (area >= 0),
  area_unit text default 'acres',
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Performance Indexes
create index if not exists idx_farms_user on public.farms(user_id);
create index if not exists idx_crops_farm on public.farm_crops(farm_id);
create index if not exists idx_crops_user on public.farm_crops(user_id);
create index if not exists idx_crops_status on public.farm_crops(status);
create index if not exists idx_activities_farm on public.crop_activities(farm_id);
create index if not exists idx_activities_crop on public.crop_activities(crop_id);
create index if not exists idx_activities_user on public.crop_activities(user_id);
create index if not exists idx_activities_date on public.crop_activities(activity_date desc);

-- ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.farms enable row level security;
alter table public.farm_crops enable row level security;
alter table public.crop_activities enable row level security;

-- Profiles Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Farms Policies
create policy "Farmers can view own farms"
  on public.farms for select
  using (auth.uid() = user_id);

create policy "Farmers can insert own farms"
  on public.farms for insert
  with check (auth.uid() = user_id);

create policy "Farmers can update own farms"
  on public.farms for update
  using (auth.uid() = user_id);

create policy "Farmers can delete own farms"
  on public.farms for delete
  using (auth.uid() = user_id);

-- Crops Policies
create policy "Farmers can view own crops"
  on public.farm_crops for select
  using (auth.uid() = user_id);

create policy "Farmers can insert own crops"
  on public.farm_crops for insert
  with check (auth.uid() = user_id);

create policy "Farmers can update own crops"
  on public.farm_crops for update
  using (auth.uid() = user_id);

create policy "Farmers can delete own crops"
  on public.farm_crops for delete
  using (auth.uid() = user_id);

-- Activities Policies
create policy "Farmers can view own activities"
  on public.crop_activities for select
  using (auth.uid() = user_id);

create policy "Farmers can insert own activities"
  on public.crop_activities for insert
  with check (auth.uid() = user_id);

create policy "Farmers can update own activities"
  on public.crop_activities for update
  using (auth.uid() = user_id);

create policy "Farmers can delete own activities"
  on public.crop_activities for delete
  using (auth.uid() = user_id);

-- Trigger for auto-profile creation on auth.users sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, state, district, village, preferred_language, farming_type)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Farmer'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'state',
    new.raw_user_meta_data->>'district',
    new.raw_user_meta_data->>'village',
    coalesce(new.raw_user_meta_data->>'preferred_language', 'en'),
    coalesce(new.raw_user_meta_data->>'farming_type', 'mixed')
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    phone = coalesce(excluded.phone, public.profiles.phone),
    updated_at = now();
  return new;
exception
  when others then
    return new;
end;
$$ language plpgsql security definer set search_path = '';

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger for updated_at timestamps
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = '';

create trigger tr_profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger tr_farms_updated_at before update on public.farms
  for each row execute procedure public.set_updated_at();

create trigger tr_farm_crops_updated_at before update on public.farm_crops
  for each row execute procedure public.set_updated_at();

create trigger tr_crop_activities_updated_at before update on public.crop_activities
  for each row execute procedure public.set_updated_at();
