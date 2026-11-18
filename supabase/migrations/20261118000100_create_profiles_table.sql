-- The signed-in user's profile.
--
-- ARCHITECTURE §7: "Roles live in the `profiles` table and are checked on the
-- server." This is that table. One row per auth user, created by the trigger at
-- the bottom of this file, never by the client.
--
-- `full_name` is nullable on purpose. The signup form collects only email and
-- password today, so a brand-new account genuinely has no name yet; the shell
-- falls back to the email until the user sets one. Inventing a placeholder
-- ("New user") would be worse than the truth.
--
-- `role` is constrained to the three self-service roles. `institution_admin`
-- and `admin` are deliberately absent: they require the verification flow
-- (INS-02), and a user who can grant themselves `admin` is not a security model.
--
-- `timestamptz` for the same reason as `children.created_at`: "when was this
-- created" must not depend on which timezone wrote the row.

create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  role       text not null default 'parent',
  created_at timestamptz not null default now(),

  constraint profiles_full_name_length
    check (full_name is null or char_length(btrim(full_name)) between 2 and 80),
  constraint profiles_role_valid
    check (role in ('parent', 'teacher', 'student'))
);

alter table public.profiles enable row level security;

-- Read and update your own row. There is deliberately no INSERT policy and no
-- DELETE policy: rows are created by the trigger below (a definer function,
-- which bypasses RLS) and removed by the auth.users cascade. A client cannot
-- conjure a profile, for itself or for anyone else.
--
-- `with check` mirrors `using` so an update cannot move a row to another id.

create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- One profile per new user, automatically.
--
-- `security definer` because the insert runs in the auth schema's context and
-- must write to public; the empty search_path forces every name below to be
-- schema-qualified, so a hostile search_path cannot redirect the insert.
--
-- The name is normalised *here* rather than trusted: metadata is user-supplied,
-- and a 1-character name would violate profiles_full_name_length and make the
-- trigger raise — which fails the signup itself. A bad name degrades to NULL
-- instead. Everything else is allowed to fail loudly: a genuinely broken
-- trigger should not silently stop creating profiles.

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_name text := nullif(btrim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '');
begin
  if new_name is not null and char_length(new_name) not between 2 and 80 then
    new_name := null;
  end if;

  insert into public.profiles (id, full_name)
  values (new.id, new_name)
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: users created before the trigger (the QA account, anything from the
-- auth dashboard) get a row too. `on conflict do nothing` keeps it idempotent,
-- so running this migration against a project that already has profiles is
-- safe. The same name guard as the trigger keeps the backfill from failing on
-- metadata that predates the length rule.

insert into public.profiles (id, full_name)
select
  u.id,
  case
    when char_length(btrim(coalesce(u.raw_user_meta_data ->> 'full_name', ''))) between 2 and 80
      then btrim(u.raw_user_meta_data ->> 'full_name')
  end
from auth.users u
on conflict (id) do nothing;
