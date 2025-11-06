-- Create profiles table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  created_at timestamp with time zone default now() not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Policy: Users can view their own profile
create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- Trigger to create profile automatically when user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Create diagnostics table
create table public.diagnostics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  sector text not null,
  input_text text not null,
  generated_suggestions jsonb not null default '[]'::jsonb,
  selected_automations text[] default array[]::text[],
  plan_document text,
  pricing_advice text,
  status text not null default 'completed' check (status in ('pending', 'in_progress', 'completed')),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Indexes for performance
create index diagnostics_user_id_idx on public.diagnostics(user_id);
create index diagnostics_created_at_idx on public.diagnostics(created_at desc);

-- Trigger for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_diagnostics_updated_at
before update on public.diagnostics
for each row
execute function update_updated_at_column();

-- Enable RLS on diagnostics
alter table public.diagnostics enable row level security;

-- Policy: Users can view their own diagnostics
create policy "Users can view their own diagnostics"
on public.diagnostics
for select
to authenticated
using (auth.uid() = user_id);

-- Policy: Users can insert their own diagnostics
create policy "Users can insert their own diagnostics"
on public.diagnostics
for insert
to authenticated
with check (auth.uid() = user_id);

-- Policy: Users can update their own diagnostics
create policy "Users can update their own diagnostics"
on public.diagnostics
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Policy: Users can delete their own diagnostics
create policy "Users can delete their own diagnostics"
on public.diagnostics
for delete
to authenticated
using (auth.uid() = user_id);