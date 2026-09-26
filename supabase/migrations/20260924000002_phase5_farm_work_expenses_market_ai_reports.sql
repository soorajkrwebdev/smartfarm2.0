-- Phase 5: Farm Work, Expenses, Harvests, Market, Knowledge, Notifications, AI & Reports
-- Digital Farm Management & Sustainable Agriculture Intelligence Platform

-- 1. FARM JOBS (Public listings created by farmers, NO worker accounts)
create table if not exists public.farm_jobs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  title text not null,
  location text not null,
  work_type text not null check (work_type in ('Harvesting', 'Pruning', 'Weeding', 'Planting', 'Irrigation', 'Processing', 'Transport', 'Labour', 'Other')),
  start_date date not null,
  end_date date,
  workers_needed integer not null check (workers_needed > 0),
  wage_rate numeric check (wage_rate >= 0),
  wage_unit text not null default 'day' check (wage_unit in ('day', 'hour', 'piece', 'acre', 'contract')),
  description text not null,
  contact_preference text default 'phone' check (contact_preference in ('phone', 'inquiry', 'both')),
  contact_phone text,
  status text not null default 'open' check (status in ('open', 'filled', 'completed', 'cancelled')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. JOB INQUIRIES (Submissions from public visitors/workers, no worker login required)
create table if not exists public.job_inquiries (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references public.farm_jobs(id) on delete cascade,
  applicant_name text not null,
  applicant_phone text not null,
  applicant_email text,
  available_date date default current_date,
  workers_count integer not null default 1 check (workers_count > 0),
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'accepted', 'declined')),
  created_at timestamptz default now() not null
);

-- 3. FARM EXPENSES (Connected to farm financial analytics)
create table if not exists public.farm_expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  crop_id uuid references public.farm_crops(id) on delete set null,
  category text not null check (category in ('seeds', 'manure', 'fertilizer', 'pesticide', 'labour', 'irrigation', 'machinery', 'transport', 'other')),
  amount numeric not null check (amount >= 0),
  expense_date date not null default current_date,
  description text not null,
  vendor_or_source text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 4. CROP HARVESTS (Yield & harvest analytics)
create table if not exists public.crop_harvests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  crop_id uuid not null references public.farm_crops(id) on delete cascade,
  harvest_date date not null default current_date,
  quantity numeric not null check (quantity > 0),
  unit text not null default 'kg',
  quality text default 'grade_a' check (quality in ('grade_a', 'grade_b', 'grade_c', 'premium', 'standard')),
  sale_price numeric check (sale_price >= 0),
  revenue numeric check (revenue >= 0),
  market_name text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 5. MARKET PRICES (Government agricultural market data / AGMARKNET ecosystem)
create table if not exists public.market_prices (
  id uuid primary key default uuid_generate_v4(),
  crop text not null,
  state text not null,
  district text not null,
  market text not null,
  price_date date not null default current_date,
  min_price numeric check (min_price >= 0),
  max_price numeric check (max_price >= 0),
  modal_price numeric not null check (modal_price >= 0),
  unit text not null default 'INR/quintal',
  source_name text not null default 'AGMARKNET / Directorate of Marketing & Inspection',
  created_at timestamptz default now() not null
);

-- 6. WEATHER CACHE
create table if not exists public.weather_cache (
  id uuid primary key default uuid_generate_v4(),
  latitude numeric(10, 4) not null,
  longitude numeric(10, 4) not null,
  cached_data jsonb not null,
  fetched_at timestamptz default now() not null,
  expires_at timestamptz not null
);

-- 7. KNOWLEDGE SOURCES
create table if not exists public.knowledge_sources (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  organization text not null,
  website_url text,
  authority_type text not null default 'Government / Research Institute',
  description text,
  created_at timestamptz default now() not null
);

-- 8. KNOWLEDGE ARTICLES (Authoritative, source-backed articles)
create table if not exists public.knowledge_articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null check (category in (
    'Organic Farming',
    'Pest & IPM',
    'Soil Health',
    'Waste Management',
    'Crop Management',
    'Climate & Weather',
    'Market Awareness',
    'Sustainable Agriculture'
  )),
  summary text not null,
  content jsonb not null default '[]',
  tags text[] not null default '{}',
  read_minutes integer not null default 5,
  source_name text not null,
  source_url text,
  last_verified date not null default current_date,
  verification_status text not null default 'General Agricultural Information',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 9. NOTIFICATIONS
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('activity_reminder', 'pest_follow_up', 'harvest_reminder', 'scheduled_activity', 'weather_indicator', 'advisory_update', 'job_inquiry')),
  title text not null,
  message text not null,
  related_record_id uuid,
  related_record_type text,
  scheduled_time timestamptz,
  is_read boolean not null default false,
  created_at timestamptz default now() not null
);

-- 10. AI CONVERSATIONS
create table if not exists public.ai_conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Farm Advisory Consultation',
  messages jsonb not null default '[]',
  context_metadata jsonb default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 11. FARM REPORTS
create table if not exists public.farm_reports (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  farm_id uuid not null references public.farms(id) on delete cascade,
  report_title text not null,
  report_period_start date,
  report_period_end date,
  report_data jsonb not null,
  generated_at timestamptz default now() not null
);

-- Performance Indexes
create index if not exists idx_farm_jobs_user on public.farm_jobs(user_id);
create index if not exists idx_farm_jobs_status on public.farm_jobs(status);
create index if not exists idx_job_inquiries_job on public.job_inquiries(job_id);
create index if not exists idx_farm_expenses_user on public.farm_expenses(user_id);
create index if not exists idx_farm_expenses_farm on public.farm_expenses(farm_id);
create index if not exists idx_crop_harvests_user on public.crop_harvests(user_id);
create index if not exists idx_crop_harvests_farm on public.crop_harvests(farm_id);
create index if not exists idx_market_prices_crop on public.market_prices(crop);
create index if not exists idx_market_prices_state on public.market_prices(state);
create index if not exists idx_market_prices_date on public.market_prices(price_date desc);
create index if not exists idx_weather_cache_coords on public.weather_cache(latitude, longitude);
create index if not exists idx_knowledge_articles_category on public.knowledge_articles(category);
create index if not exists idx_notifications_user on public.notifications(user_id, is_read);
create index if not exists idx_ai_conversations_user on public.ai_conversations(user_id);
create index if not exists idx_farm_reports_user on public.farm_reports(user_id);

-- ROW LEVEL SECURITY
alter table public.farm_jobs enable row level security;
alter table public.job_inquiries enable row level security;
alter table public.farm_expenses enable row level security;
alter table public.crop_harvests enable row level security;
alter table public.market_prices enable row level security;
alter table public.weather_cache enable row level security;
alter table public.knowledge_sources enable row level security;
alter table public.knowledge_articles enable row level security;
alter table public.notifications enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.farm_reports enable row level security;

-- 1. Farm Jobs Policies:
-- Public can browse open jobs; Farmers can view all own jobs
create policy "Anyone can view open farm jobs"
  on public.farm_jobs for select
  using (status = 'open' or auth.uid() = user_id);

create policy "Farmers can insert own jobs"
  on public.farm_jobs for insert
  with check (auth.uid() = user_id);

create policy "Farmers can update own jobs"
  on public.farm_jobs for update
  using (auth.uid() = user_id);

create policy "Farmers can delete own jobs"
  on public.farm_jobs for delete
  using (auth.uid() = user_id);

-- 2. Job Inquiries Policies:
-- Public can submit an inquiry to any open job
create policy "Public can insert job inquiry"
  on public.job_inquiries for insert
  with check (true);

-- Only the farmer who owns the farm_job can read/update inquiries
create policy "Farmers can view inquiries for their jobs"
  on public.job_inquiries for select
  using (
    exists (
      select 1 from public.farm_jobs
      where public.farm_jobs.id = job_inquiries.job_id
      and public.farm_jobs.user_id = auth.uid()
    )
  );

create policy "Farmers can update inquiries for their jobs"
  on public.job_inquiries for update
  using (
    exists (
      select 1 from public.farm_jobs
      where public.farm_jobs.id = job_inquiries.job_id
      and public.farm_jobs.user_id = auth.uid()
    )
  );

create policy "Farmers can delete inquiries for their jobs"
  on public.job_inquiries for delete
  using (
    exists (
      select 1 from public.farm_jobs
      where public.farm_jobs.id = job_inquiries.job_id
      and public.farm_jobs.user_id = auth.uid()
    )
  );

-- 3. Farm Expenses Policies (Private to Farmer)
create policy "Farmers can view own expenses"
  on public.farm_expenses for select using (auth.uid() = user_id);
create policy "Farmers can insert own expenses"
  on public.farm_expenses for insert with check (auth.uid() = user_id);
create policy "Farmers can update own expenses"
  on public.farm_expenses for update using (auth.uid() = user_id);
create policy "Farmers can delete own expenses"
  on public.farm_expenses for delete using (auth.uid() = user_id);

-- 4. Crop Harvests Policies (Private to Farmer)
create policy "Farmers can view own harvests"
  on public.crop_harvests for select using (auth.uid() = user_id);
create policy "Farmers can insert own harvests"
  on public.crop_harvests for insert with check (auth.uid() = user_id);
create policy "Farmers can update own harvests"
  on public.crop_harvests for update using (auth.uid() = user_id);
create policy "Farmers can delete own harvests"
  on public.crop_harvests for delete using (auth.uid() = user_id);

-- 5. Market Prices & Weather Cache Policies (Public Read)
create policy "Public can view market prices"
  on public.market_prices for select using (true);
create policy "Public can view weather cache"
  on public.weather_cache for select using (true);

-- 6. Knowledge Hub Policies (Public Read)
create policy "Public can view knowledge sources"
  on public.knowledge_sources for select using (true);
create policy "Public can view knowledge articles"
  on public.knowledge_articles for select using (true);

-- 7. Notifications Policies (Private to Farmer)
create policy "Farmers can view own notifications"
  on public.notifications for select using (auth.uid() = user_id);
create policy "Farmers can insert own notifications"
  on public.notifications for insert with check (auth.uid() = user_id);
create policy "Farmers can update own notifications"
  on public.notifications for update using (auth.uid() = user_id);
create policy "Farmers can delete own notifications"
  on public.notifications for delete using (auth.uid() = user_id);

-- 8. AI Conversations Policies (Private to Farmer)
create policy "Farmers can view own ai conversations"
  on public.ai_conversations for select using (auth.uid() = user_id);
create policy "Farmers can insert own ai conversations"
  on public.ai_conversations for insert with check (auth.uid() = user_id);
create policy "Farmers can update own ai conversations"
  on public.ai_conversations for update using (auth.uid() = user_id);
create policy "Farmers can delete own ai conversations"
  on public.ai_conversations for delete using (auth.uid() = user_id);

-- 9. Farm Reports Policies (Private to Farmer)
create policy "Farmers can view own farm reports"
  on public.farm_reports for select using (auth.uid() = user_id);
create policy "Farmers can insert own farm reports"
  on public.farm_reports for insert with check (auth.uid() = user_id);
create policy "Farmers can update own farm reports"
  on public.farm_reports for update using (auth.uid() = user_id);
create policy "Farmers can delete own farm reports"
  on public.farm_reports for delete using (auth.uid() = user_id);

-- Triggers for updated_at
create trigger tr_farm_jobs_updated_at before update on public.farm_jobs
  for each row execute procedure public.set_updated_at();
create trigger tr_farm_expenses_updated_at before update on public.farm_expenses
  for each row execute procedure public.set_updated_at();
create trigger tr_crop_harvests_updated_at before update on public.crop_harvests
  for each row execute procedure public.set_updated_at();
create trigger tr_knowledge_articles_updated_at before update on public.knowledge_articles
  for each row execute procedure public.set_updated_at();
create trigger tr_ai_conversations_updated_at before update on public.ai_conversations
  for each row execute procedure public.set_updated_at();
