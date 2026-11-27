-- School ↔ Teacher link (MVP: one current school per teacher).
--
-- Verification note: institutions can only be inserted by `institution_admin`,
-- a role assigned out of band after INS-02 verification. Every existing row in
-- public.institutions is therefore already a verified directory listing, so no
-- second verification flag is needed for this slice.

alter table public.profiles
  add column current_institution_id uuid null
    references public.institutions (id) on delete set null,
  add constraint profiles_current_institution_requires_teacher
    check (current_institution_id is null or role = 'teacher');

create index profiles_current_institution_id_idx
  on public.profiles (current_institution_id)
  where current_institution_id is not null;

comment on column public.profiles.current_institution_id is
  'The verified institution where this teacher currently works.';

-- Narrow public read for the school detail route. RLS on profiles still only
-- lets a user read their own row; this definer function exposes exactly the
-- same safe columns as the existing public teacher directory.
create function public.get_institution_teachers(p_institution_id uuid)
returns table (
  id uuid,
  full_name text,
  specialization text,
  experience_years integer,
  bio text
)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, p.full_name, p.specialization, p.experience_years, p.bio
  from public.profiles p
  where p.role = 'teacher'
    and p.current_institution_id = p_institution_id
    and p.full_name is not null
  order by p.full_name asc
  limit 50;
$$;

revoke all on function public.get_institution_teachers(uuid)
  from public, anon, authenticated;
grant execute on function public.get_institution_teachers(uuid)
  to anon, authenticated;

-- Single-institution detail read, mirroring get_public_teacher(id).
create function public.get_public_institution(p_id uuid)
returns table (
  id uuid,
  name text,
  type text,
  description text,
  location text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select i.id, i.name, i.type, i.description, i.location, i.created_at
  from public.institutions i
  where i.id = p_id
  limit 1;
$$;

revoke all on function public.get_public_institution(uuid)
  from public, anon, authenticated;
grant execute on function public.get_public_institution(uuid)
  to anon, authenticated;
