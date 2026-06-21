create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  major text,
  semester integer check (semester is null or semester between 1 and 14),
  created_at timestamptz not null default now()
);

create table if not exists public.spots (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null,
  location text not null,
  facilities text[] not null default '{}',
  suitable_for text[] not null default '{}',
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null check (
    category in (
      'Belajar',
      'Nugas',
      'Diskusi',
      'Main',
      'Olahraga',
      'Hangout',
      'Kreatif',
      'Event kecil'
    )
  ),
  spot_id uuid not null references public.spots(id) on delete restrict,
  creator_id uuid not null references public.profiles(user_id) on delete cascade,
  activity_time timestamptz not null,
  max_participants integer not null check (max_participants between 1 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.activity_participants (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (activity_id, user_id)
);

create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists spots_facilities_idx on public.spots using gin(facilities);
create index if not exists spots_suitable_for_idx on public.spots using gin(suitable_for);
create index if not exists activities_spot_id_idx on public.activities(spot_id);
create index if not exists activities_creator_id_idx on public.activities(creator_id);
create index if not exists activities_activity_time_idx on public.activities(activity_time);
create index if not exists activity_participants_activity_id_idx on public.activity_participants(activity_id);
create index if not exists activity_participants_user_id_idx on public.activity_participants(user_id);

alter table public.profiles enable row level security;
alter table public.spots enable row level security;
alter table public.activities enable row level security;
alter table public.activity_participants enable row level security;

drop policy if exists "Profiles are readable by authenticated users" on public.profiles;
create policy "Profiles are readable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Spots are publicly readable" on public.spots;
create policy "Spots are publicly readable"
  on public.spots for select
  to anon, authenticated
  using (true);

drop policy if exists "Activities are publicly readable" on public.activities;
create policy "Activities are publicly readable"
  on public.activities for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users can create activities" on public.activities;
create policy "Authenticated users can create activities"
  on public.activities for insert
  to authenticated
  with check (auth.uid() = creator_id);

drop policy if exists "Creators can update their activities" on public.activities;
create policy "Creators can update their activities"
  on public.activities for update
  to authenticated
  using (auth.uid() = creator_id)
  with check (auth.uid() = creator_id);

drop policy if exists "Creators can delete their activities" on public.activities;
create policy "Creators can delete their activities"
  on public.activities for delete
  to authenticated
  using (auth.uid() = creator_id);

drop policy if exists "Participants are publicly readable" on public.activity_participants;
create policy "Participants are publicly readable"
  on public.activity_participants for select
  to anon, authenticated
  using (true);

drop policy if exists "Users can join as themselves" on public.activity_participants;
create policy "Users can join as themselves"
  on public.activity_participants for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can leave their own joined activities" on public.activity_participants;
create policy "Users can leave their own joined activities"
  on public.activity_participants for delete
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_semester text;
  parsed_semester integer;
begin
  raw_semester := new.raw_user_meta_data ->> 'semester';
  parsed_semester := case
    when raw_semester ~ '^[0-9]+$' then raw_semester::integer
    else null
  end;

  insert into public.profiles (user_id, name, major, semester)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1), 'Mahasiswa'),
    nullif(new.raw_user_meta_data ->> 'major', ''),
    parsed_semester
  )
  on conflict (user_id) do update
    set name = excluded.name,
        major = excluded.major,
        semester = excluded.semester;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.prevent_activity_overflow()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  capacity integer;
  current_total integer;
begin
  select max_participants
  into capacity
  from public.activities
  where id = new.activity_id;

  if capacity is null then
    raise exception 'Activity does not exist';
  end if;

  select count(*)
  into current_total
  from public.activity_participants
  where activity_id = new.activity_id;

  if current_total >= capacity then
    raise exception 'Activity quota is full';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_activity_overflow_before_insert on public.activity_participants;
create trigger prevent_activity_overflow_before_insert
  before insert on public.activity_participants
  for each row execute function public.prevent_activity_overflow();
