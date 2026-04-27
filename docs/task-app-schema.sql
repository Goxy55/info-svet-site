-- TaskFlow MVP schema (Supabase/PostgreSQL)

create table if not exists public.users_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'on_hold', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  notes text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  priority smallint not null default 2 check (priority between 1 and 3),
  due_date date,
  is_today boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  converted_to text check (converted_to in ('task', 'project')),
  created_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_type text not null check (plan_type in ('daily', 'weekly', 'monthly')),
  period_start date not null,
  period_end date,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_tasks_user_id on public.tasks(user_id);
create index if not exists idx_tasks_project_id on public.tasks(project_id);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_ideas_user_id on public.ideas(user_id);
create index if not exists idx_plans_user_id on public.plans(user_id);

-- Enable Row Level Security
alter table public.users_profile enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.ideas enable row level security;
alter table public.plans enable row level security;

-- Basic RLS policies (owner only)
create policy "Users can read own profile" on public.users_profile
for select using (auth.uid() = id);

create policy "Users can upsert own profile" on public.users_profile
for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users manage own projects" on public.projects
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own tasks" on public.tasks
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own ideas" on public.ideas
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own plans" on public.plans
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
