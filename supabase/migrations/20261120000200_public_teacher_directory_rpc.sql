-- Public teacher directory (TCH-04).
--
-- profiles RLS still permits a user to read only their own row; these functions
-- are security definer but hard-code role = 'teacher', never touch auth.users,
-- bound both inputs, and cap the result at 50 rows. EXECUTE is revoked from
-- public and granted only to anon/authenticated so an unauthenticated visitor
-- can browse the directory without gaining a general profile reader.

create function public.search_public_teachers(needle text, specialty text)
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
    and p.full_name is not null
    and (
      btrim(coalesce(needle, '')) = ''
      or p.full_name ilike '%' || btrim(needle) || '%'
      or coalesce(p.specialization, '') ilike '%' || btrim(needle) || '%'
      or coalesce(p.bio, '') ilike '%' || btrim(needle) || '%'
    )
    and (
      btrim(coalesce(specialty, '')) = ''
      or coalesce(p.specialization, '') ilike '%' || btrim(specialty) || '%'
    )
  order by p.full_name asc
  limit 50;
$$;

revoke all on function public.search_public_teachers(text, text)
  from public, anon, authenticated;
grant execute on function public.search_public_teachers(text, text)
  to anon, authenticated;

-- The detail route needs a single teacher by id. A direct SELECT from anon is
-- blocked by profiles_select_own, so this is the one narrow read path for it.
create function public.get_public_teacher(p_id uuid)
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
  where p.role = 'teacher' and p.id = p_id
  limit 1;
$$;

revoke all on function public.get_public_teacher(uuid)
  from public, anon, authenticated;
grant execute on function public.get_public_teacher(uuid)
  to anon, authenticated;
