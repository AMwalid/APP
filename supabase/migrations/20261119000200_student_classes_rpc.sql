-- STU-01: the classes a student is enrolled in.
--
-- A student may read their own rows in `class_enrollments`, but `classes` and
-- `profiles` are deliberately closed to them: a teacher owns the class row, and
-- a profile is private to its own account. PostgREST embeds obey those RLS
-- policies, so a direct select cannot reach the class name or the teacher's
-- name. Widening either policy would expose unrelated rows just to render one
-- card, so the read goes through this narrow definer function instead.
--
-- The function returns exactly the five fields the card renders. It is gated on
-- the caller being a student, and every row is filtered by `auth.uid()`, so a
-- student can only ever see their own enrollments. `left join` on the teacher's
-- profile keeps a class visible even if that row is missing; the UI falls back
-- to a translated "teacher not named" label rather than dropping the class.
--
-- `security definer` reads past the classes/profiles RLS, but `search_path = ''`
-- forces every name to be schema-qualified. `stable` suits a read-only lookup.
-- The limit bounds the payload; pagination can be added if this ever needs it.
--
-- Revoke from BOTH `public` and `anon`: Supabase's default privileges grant
-- EXECUTE on new functions in `public` to `anon` explicitly, and revoking from
-- `public` alone leaves anon able to call it (as TCH-03 found in QA).

create function public.get_student_classes()
returns table (
  id uuid,
  name text,
  subject text,
  grade_level text,
  teacher_name text
)
language sql
stable
security definer
set search_path = ''
as $$
  select c.id, c.name, c.subject, c.grade_level, t.full_name
  from public.class_enrollments ce
  join public.classes c on c.id = ce.class_id
  left join public.profiles t on t.id = c.teacher_id
  where ce.student_id = auth.uid()
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'student'
    )
  order by c.created_at asc
  limit 200;
$$;

revoke all on function public.get_student_classes() from public, anon;
grant execute on function public.get_student_classes() to authenticated;
