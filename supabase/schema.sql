-- Enable UUID generation
create extension if not exists "pgcrypto";

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  description text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_on date not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  unique (habit_id, user_id, completed_on)
);

alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

create policy "Users can read own habits"
  on public.habits
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own habits"
  on public.habits
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own habits"
  on public.habits
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own habits"
  on public.habits
  for delete
  using (auth.uid() = user_id);

create policy "Users can read own habit logs"
  on public.habit_logs
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own habit logs"
  on public.habit_logs
  for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own habit logs"
  on public.habit_logs
  for delete
  using (auth.uid() = user_id);

create index if not exists idx_habits_user_id on public.habits(user_id);
create index if not exists idx_habit_logs_habit_id on public.habit_logs(habit_id);
create index if not exists idx_habit_logs_user_id_completed_on on public.habit_logs(user_id, completed_on desc);
