-- ToughTongue AI Integration Schema for Supabase
-- This schema supports user management and session tracking

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  avatar_url text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies for users
alter table public.users enable row level security;

create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- Trigger to create user profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- TT_SESSIONS TABLE (ToughTongue AI Sessions)
-- ============================================================================
create table public.tt_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  
  -- ToughTongue AI data
  tt_session_id text not null unique,
  scenario_id text not null,
  scenario_name text,
  
  -- Session metadata
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  duration_seconds integer,
  status text check (status in ('started', 'completed', 'incomplete', 'analyzing')) default 'started',
  
  -- Analysis data (from ToughTongue AI API)
  analysis_data jsonb,
  score numeric(5,2),
  feedback_summary text,
  strengths text[],
  areas_for_improvement text[],
  
  -- Metadata
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index tt_sessions_user_id_idx on public.tt_sessions(user_id);
create index tt_sessions_scenario_id_idx on public.tt_sessions(scenario_id);
create index tt_sessions_tt_session_id_idx on public.tt_sessions(tt_session_id);
create index tt_sessions_created_at_idx on public.tt_sessions(created_at desc);
create index tt_sessions_status_idx on public.tt_sessions(status);

-- RLS Policies for tt_sessions
alter table public.tt_sessions enable row level security;

create policy "Users can view own sessions"
  on public.tt_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.tt_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on public.tt_sessions for update
  using (auth.uid() = user_id);

-- ============================================================================
-- USER_PROGRESS TABLE
-- ============================================================================
create table public.user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  scenario_id text not null,
  scenario_name text,
  
  -- Progress tracking
  total_attempts integer default 0,
  completed_attempts integer default 0,
  best_score numeric(5,2),
  average_score numeric(5,2),
  latest_score numeric(5,2),
  
  -- Time tracking
  total_time_seconds integer default 0,
  average_time_seconds integer,
  last_practiced_at timestamp with time zone,
  
  -- Streak tracking
  current_streak integer default 0,
  longest_streak integer default 0,
  last_practice_date date,
  
  -- Metadata
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Unique constraint: one progress record per user per scenario
  unique(user_id, scenario_id)
);

-- Indexes
create index user_progress_user_id_idx on public.user_progress(user_id);
create index user_progress_scenario_id_idx on public.user_progress(scenario_id);
create index user_progress_last_practiced_idx on public.user_progress(last_practiced_at desc);

-- RLS Policies for user_progress
alter table public.user_progress enable row level security;

create policy "Users can view own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can manage own progress"
  on public.user_progress for all
  using (auth.uid() = user_id);

-- Function to update progress after session completion
create or replace function public.update_user_progress()
returns trigger
language plpgsql
security definer
as $$
declare
  v_score numeric(5,2);
  v_duration integer;
  v_is_completed boolean;
begin
  -- Only process completed sessions
  if new.status = 'completed' and (old.status is null or old.status != 'completed') then
    v_score := new.score;
    v_duration := new.duration_seconds;
    v_is_completed := true;
    
    -- Upsert progress record
    insert into public.user_progress (
      user_id,
      scenario_id,
      scenario_name,
      total_attempts,
      completed_attempts,
      best_score,
      latest_score,
      total_time_seconds,
      last_practiced_at,
      last_practice_date
    ) values (
      new.user_id,
      new.scenario_id,
      new.scenario_name,
      1,
      case when v_is_completed then 1 else 0 end,
      v_score,
      v_score,
      coalesce(v_duration, 0),
      new.completed_at,
      date(new.completed_at)
    )
    on conflict (user_id, scenario_id) do update set
      total_attempts = user_progress.total_attempts + 1,
      completed_attempts = user_progress.completed_attempts + case when v_is_completed then 1 else 0 end,
      best_score = greatest(user_progress.best_score, v_score),
      latest_score = v_score,
      average_score = (
        (coalesce(user_progress.average_score, 0) * user_progress.completed_attempts + v_score) /
        (user_progress.completed_attempts + 1)
      ),
      total_time_seconds = user_progress.total_time_seconds + coalesce(v_duration, 0),
      average_time_seconds = (
        (user_progress.total_time_seconds + coalesce(v_duration, 0)) /
        (user_progress.completed_attempts + 1)
      ),
      last_practiced_at = new.completed_at,
      last_practice_date = date(new.completed_at),
      -- Update streak
      current_streak = case
        when user_progress.last_practice_date = date(new.completed_at) - interval '1 day' then user_progress.current_streak + 1
        when user_progress.last_practice_date = date(new.completed_at) then user_progress.current_streak
        else 1
      end,
      longest_streak = greatest(
        user_progress.longest_streak,
        case
          when user_progress.last_practice_date = date(new.completed_at) - interval '1 day' then user_progress.current_streak + 1
          when user_progress.last_practice_date = date(new.completed_at) then user_progress.current_streak
          else 1
        end
      ),
      updated_at = timezone('utc'::text, now());
  end if;
  
  return new;
end;
$$;

create trigger on_session_completed
  after insert or update on public.tt_sessions
  for each row
  execute procedure public.update_user_progress();

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger set_updated_at_users
  before update on public.users
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_tt_sessions
  before update on public.tt_sessions
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at_user_progress
  before update on public.user_progress
  for each row execute procedure public.handle_updated_at();

