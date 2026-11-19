-- TCH-03: a student directory the teacher's UI can search.
--
-- `profiles` RLS deliberately lets a user read only their own row, and there is
-- no email column there: email lives in `auth.users`, which the client cannot
-- read. A teacher still needs to find a registered student by name or email.
--
-- These two functions are the answer. They are `security definer` so they can
-- join profiles to auth.users, but they are *not* a general profile reader:
-- both hard-code `role = 'student'`, both call `public.is_teacher()`, both bound
-- their input, and EXECUTE is granted only to `authenticated` (never anon).
-- No profile policy changes, so the ownership RLS from the existing migration
-- stays exactly as it was. `is_teacher()` remains `security invoker`: inside a
-- definer function it runs with the definer's rights, sees the caller's profile
-- row, and returns the caller's real role.
--
-- `search_path = ''` forces every name to be schema-qualified, so a hostile
-- search_path cannot redirect the lookups.
--
-- The grants revoke from BOTH `public` and `anon`. Supabase's default
-- privileges grant EXECUTE on new functions in `public` to `anon` explicitly,
-- so `revoke ... from public` alone leaves `anon` able to call the function
-- (it returns zero rows because of the `is_teacher()` gate, but it should not
-- be reachable at all).

create function public.search_students(needle text)
returns table (id uuid, full_name text, email text)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, p.full_name, u.email
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.role = 'student'
    and public.is_teacher()
    and char_length(btrim(coalesce(needle, ''))) >= 2
    and (
      p.full_name ilike '%' || btrim(needle) || '%'
      or u.email ilike '%' || btrim(needle) || '%'
    )
  order by u.email asc
  limit 8;
$$;

revoke all on function public.search_students(text) from public, anon;
grant execute on function public.search_students(text) to authenticated;

-- The roster query needs names and emails for ids it already knows. Bounded at
-- 100 ids: this is a display helper, not a way to dump the directory.
create function public.get_students_by_ids(ids uuid[])
returns table (id uuid, full_name text, email text)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, p.full_name, u.email
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.role = 'student'
    and public.is_teacher()
    and p.id = any (coalesce(ids, '{}'::uuid[]))
  limit 100;
$$;

revoke all on function public.get_students_by_ids(uuid[]) from public, anon;
grant execute on function public.get_students_by_ids(uuid[]) to authenticated;
