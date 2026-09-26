-- Phase 2: Agricultural Inputs & Organic Farming Knowledge Library
-- Digital Farm Management & Sustainable Agriculture Intelligence Platform

-- 1. FARM INPUTS (Farmer inventory & purchase records)
create table if not exists public.farm_inputs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  crop_id uuid references public.farm_crops(id) on delete set null,
  product_name text not null,
  category text not null check (category in (
    'Seeds',
    'Fertilizers',
    'Organic manure',
    'Biofertilizers',
    'Biological inputs',
    'Botanical inputs',
    'Pesticides',
    'Other'
  )),
  purchase_date date not null default current_date,
  quantity numeric not null check (quantity > 0),
  unit text not null default 'kg',
  cost numeric not null default 0 check (cost >= 0),
  purpose text,
  application_method text,
  batch_or_lot_no text,
  supplier_or_source text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. ORGANIC INPUTS (Curated scientific knowledge library - Non-commercial)
create table if not exists public.organic_inputs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null check (category in (
    'Organic Manures',
    'Biofertilizers',
    'Biological / Biocontrol Inputs',
    'Botanical Inputs',
    'Soil Amendments'
  )),
  description text not null,
  purpose text not null,
  benefits text[] not null default '{}',
  suitable_crops text[] not null default '{}',
  application_information text not null,
  precautions text,
  organic_relevance text,
  source_name text not null,
  source_url text,
  last_verified_date date default current_date,
  verification_status text default 'Unverified / For Review',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. CROP ORGANIC INPUTS (Relational mapping between crops and organic inputs)
create table if not exists public.crop_organic_inputs (
  id uuid primary key default uuid_generate_v4(),
  crop_name text not null,
  organic_input_id uuid not null references public.organic_inputs(id) on delete cascade,
  recommended_stage text not null,
  dosage_guide text not null,
  application_notes text,
  source_reference text,
  created_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_inputs_user on public.farm_inputs(user_id);
create index if not exists idx_inputs_farm on public.farm_inputs(farm_id);
create index if not exists idx_inputs_crop on public.farm_inputs(crop_id);
create index if not exists idx_inputs_category on public.farm_inputs(category);
create index if not exists idx_organic_inputs_category on public.organic_inputs(category);
create index if not exists idx_crop_organic_crop on public.crop_organic_inputs(crop_name);

-- ROW LEVEL SECURITY
alter table public.farm_inputs enable row level security;
alter table public.organic_inputs enable row level security;
alter table public.crop_organic_inputs enable row level security;

-- Policies for Farm Inputs (Private to Farmer)
create policy "Farmers can view own inputs"
  on public.farm_inputs for select
  using (auth.uid() = user_id);

create policy "Farmers can insert own inputs"
  on public.farm_inputs for insert
  with check (auth.uid() = user_id);

create policy "Farmers can update own inputs"
  on public.farm_inputs for update
  using (auth.uid() = user_id);

create policy "Farmers can delete own inputs"
  on public.farm_inputs for delete
  using (auth.uid() = user_id);

-- Policies for Organic Knowledge Library (Public Read Access for All)
create policy "Allow public read access to organic_inputs library"
  on public.organic_inputs for select
  using (true);

create policy "Allow public read access to crop_organic_inputs mapping"
  on public.crop_organic_inputs for select
  using (true);

-- Updated_at Trigger for farm_inputs
create trigger tr_farm_inputs_updated_at before update on public.farm_inputs
  for each row execute procedure public.set_updated_at();

create trigger tr_organic_inputs_updated_at before update on public.organic_inputs
  for each row execute procedure public.set_updated_at();
