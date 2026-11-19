-- PAR-04: link a child profile to a student account, and let the parent read
-- that student's grades.
--
-- The parent's assertion is the trust model: updating `children.student_id` is
-- how a parent says "this profile belongs to that account". Nothing here widens
-- RLS on children, profiles, enrollments or grades. The two definer functions
-- are narrow readers/writers with an explicit parent-ownership predicate, and
-- EXECUTE is granted only to `authenticated` (revoked from public AND anon —
-- Supabase grants new functions to anon by default).

-- SET NULL, not CASCADE: deleting a student profile clears the link but keeps
-- the parent's child record.
alter table public.children
  add column student_id uuid null references public.profiles (id) on delete set null;

create index children_student_id_idx
  on public.children (student_id)
  where student_id is not null;

-- A foreign key cannot say "must be a student", so a trigger enforces it at the
-- database boundary. RLS only lets a user read their own profile, so this must
-- be a definer function to see the target row. This closes the gap between the
-- RPC (which only ever returns students) and a direct client update.
create function public.children_validate_student_link()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.student_id is not null and not exists (
    select 1 from public.profiles p
    where p.id = new.student_id and p.role = 'student'
  ) then
    raise exception 'student_id must reference a student profile';
  end if;
  return new;
end;
$$;

create trigger children_validate_student_link_trg
  before insert or update of student_id on public.children
  for each row execute function public.children_validate_student_link();

-- Parent finds a student by email. Returns ONLY id and email: no name, no role,
-- no profile fields. The parent-role gate and the student filter are fixed in
-- the function, the needle is bounded, and the result set is capped at 8.
create function public.search_student_by_email(needle text)
returns table (id uuid, email text)
language sql
stable
security definer
set search_path = ''
as $$
  select p.id, u.email
  from public.profiles p
  join auth.users u on u.id = p.id
  where p.role = 'student'
    and exists (
      select 1 from public.profiles parent
      where parent.id = auth.uid() and parent.role = 'parent'
    )
    and char_length(btrim(coalesce(needle, ''))) between 2 and 200
    and u.email ilike '%' || btrim(needle) || '%'
  order by u.email asc
  limit 8;
$$;

revoke all on function public.search_student_by_email(text) from public, anon;
grant execute on function public.search_student_by_email(text) to authenticated;

-- Parent reads grades for their own linked child. Definer is required because
-- grades RLS only permits the student and the teacher; `ch.parent_id =
-- auth.uid()` inside the function is the replacement ownership boundary, and
-- the role check stops a student calling it with a child id they guessed.
-- Everything outside that predicate — classes, enrollments, other parents'
-- children — is unreachable through this function.
create function public.get_child_grades(child_id uuid)
returns table (
  id uuid,
  title text,
  score numeric,
  max_score numeric,
  created_at timestamptz,
  class_id uuid,
  class_name text,
  subject text
)
language sql
stable
security definer
set search_path = ''
as $$
  select g.id, g.title, g.score, g.max_score, g.created_at,
         c.id, c.name, c.subject
  from public.children ch
  join public.class_enrollments ce on ce.student_id = ch.student_id
  join public.classes c on c.id = ce.class_id
  join public.grades g on g.enrollment_id = ce.id
  where ch.id = child_id
    and ch.parent_id = auth.uid()
    and ch.student_id is not null
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'parent'
    )
  order by g.created_at desc, c.name asc
  limit 500;
$$;

revoke all on function public.get_child_grades(uuid) from public, anon;
grant execute on function public.get_child_grades(uuid) to authenticated;
