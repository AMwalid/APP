-- Public institution directory (INS-01/INS-03) and the owner-editable profile.

create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_trgm with schema extensions;

-- The profile role vocabulary gains institution_admin. Self-service signup still
-- does not offer this role; it is assigned after verification (INS-02).
alter table public.profiles drop constraint if exists profiles_role_valid;
alter table public.profiles add constraint profiles_role_valid
  check (role in ('parent', 'teacher', 'student', 'institution_admin'));

-- A signed-in user may not promote themselves. SQL editor / service-role calls
-- have no `authenticated` JWT claim, so admin assignment remains possible out of band.
create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and coalesce(current_setting('request.jwt.claim.role', true), '') = 'authenticated'
  then
    raise exception 'role cannot be changed by the client';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_role_guard on public.profiles;
create trigger profiles_role_guard
  before update of role on public.profiles
  for each row execute function public.guard_profile_role();

-- Used by the INSERT policy so only verified admins can create a listing.
create or replace function public.current_user_is_institution_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'institution_admin'
  );
$$;

revoke all on function public.current_user_is_institution_admin() from public, anon, authenticated;
grant execute on function public.current_user_is_institution_admin() to authenticated;

create table public.institutions (
  id          uuid primary key default extensions.gen_random_uuid(),
  owner_id    uuid not null unique references auth.users (id) on delete cascade,
  name        text not null,
  type        text not null,
  description text,
  location    text not null,
  created_at  timestamptz not null default now(),

  constraint institutions_name_length
    check (char_length(btrim(name)) between 2 and 120),
  constraint institutions_type_valid
    check (type in ('School', 'Tutoring Center')),
  constraint institutions_location_length
    check (char_length(btrim(location)) between 2 and 120),
  constraint institutions_description_length
    check (description is null or char_length(btrim(description)) <= 2000)
);

create index institutions_name_trgm_idx
  on public.institutions using gin (name extensions.gin_trgm_ops);

create index institutions_location_trgm_idx
  on public.institutions using gin (location extensions.gin_trgm_ops);

create index institutions_type_idx on public.institutions (type);

alter table public.institutions enable row level security;

-- Public readers can see directory columns only. Owner_id stays private to the
-- owner; the dashboard queries it explicitly as authenticated.
revoke all on public.institutions from public, anon, authenticated;
grant select (id, name, type, description, location, created_at)
  on public.institutions to anon;
grant select, insert, update, delete
  on public.institutions to authenticated;

create policy institutions_public_read
  on public.institutions for select
  to anon, authenticated
  using (true);

create policy institutions_owner_insert
  on public.institutions for insert
  to authenticated
  with check (
    auth.uid() = owner_id
    and public.current_user_is_institution_admin()
  );

create policy institutions_owner_update
  on public.institutions for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy institutions_owner_delete
  on public.institutions for delete
  to authenticated
  using (auth.uid() = owner_id);

-- Bounded, injection-safe search path for the public page. The table-level SELECT
-- policy above still exists; the app uses this RPC so input is trimmed and capped.
create or replace function public.search_public_institutions(needle text)
returns table (
  id          uuid,
  name        text,
  type        text,
  description text,
  location    text,
  created_at  timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select i.id, i.name, i.type, i.description, i.location, i.created_at
  from public.institutions i
  where btrim(coalesce(needle, '')) = ''
     or i.name ilike '%' || btrim(needle) || '%'
     or i.location ilike '%' || btrim(needle) || '%'
  order by i.name asc
  limit 50;
$$;

revoke all on function public.search_public_institutions(text) from public, anon, authenticated;
grant execute on function public.search_public_institutions(text)
  to anon, authenticated;
