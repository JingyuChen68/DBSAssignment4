create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.favorite_cities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  city_name text not null,
  latitude numeric not null,
  longitude numeric not null,
  created_at timestamptz not null default now(),
  unique(user_id, city_name)
);

create table if not exists public.weather_updates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  city_name text not null,
  temperature numeric,
  windspeed numeric,
  weather_code integer,
  updated_at timestamptz not null default now(),
  unique(user_id, city_name)
);

alter table public.profiles enable row level security;
alter table public.favorite_cities enable row level security;
alter table public.weather_updates enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id);

create policy "favorite_cities_select_own"
on public.favorite_cities
for select
using (auth.uid() = user_id);

create policy "favorite_cities_insert_own"
on public.favorite_cities
for insert
with check (auth.uid() = user_id);

create policy "favorite_cities_delete_own"
on public.favorite_cities
for delete
using (auth.uid() = user_id);

create policy "weather_updates_select_own"
on public.weather_updates
for select
using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
