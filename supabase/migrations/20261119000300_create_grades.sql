-- GRD-01: the gradebook.
--
-- A grade belongs to an enrollment, not directly to a student or a class. That
-- one link gives both halves of the RLS story: the teacher owns the class that
-- owns the enrollment, and the student owns the enrollment itself. No profile
-- or class policy changes are needed, and no definer function is needed to read
-- grades — the existing enrollment policies are the bridge.
--
-- numeric(6,2) rather than float: scores are fixed-decimal, and the check
-- constraints mirror the zod rules so a forged Server Action cannot smuggle in
-- a negative score, a zero maximum, or a score above the maximum.
--
-- Deleting a student from the roster cascades to their grades; deleting a class
-- cascades through enrollments. A grade never outlives the enrollment it needs
-- to be authorised by.

create table public.grades (
  id            uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.class_enrollments (id) on delete cascade,
  title         text not null,
  score         numeric(6,2) not null,
  max_score     numeric(6,2) not null,
  created_at    timestamptz not null default now(),

  constraint grades_title_length check (char_length(btrim(title)) between 2 and 120),
  constraint grades_score_nonnegative check (score >= 0),
  constraint grades_max_score_positive check (max_score > 0),
  constraint grades_score_le_max check (score <= max_score)
);

create index grades_enrollment_id_created_at_idx
  on public.grades (enrollment_id, created_at);

alter table public.grades enable row level security;

-- Teachers may create, read, update and delete grades, but only through an
-- enrollment in a class they own. `is_teacher()` is the second lock; the join
-- is the ownership check. Both USING and WITH CHECK carry it so an update
-- cannot move a grade to somebody else's enrollment either.
create policy "grades_teacher_all" on public.grades
  for all to authenticated
  using (
    public.is_teacher()
    and exists (
      select 1
      from public.class_enrollments ce
      join public.classes c on c.id = ce.class_id
      where ce.id = enrollment_id
        and c.teacher_id = auth.uid()
    )
  )
  with check (
    public.is_teacher()
    and exists (
      select 1
      from public.class_enrollments ce
      join public.classes c on c.id = ce.class_id
      where ce.id = enrollment_id
        and c.teacher_id = auth.uid()
    )
  );

-- Students read only grades attached to their own enrollment. No write policy:
-- a student cannot invent, edit or remove a grade. Parents and anon have no
-- policy at all, so they see nothing and every write is rejected.
create policy "grades_student_select_own" on public.grades
  for select to authenticated
  using (
    exists (
      select 1
      from public.class_enrollments ce
      where ce.id = enrollment_id
        and ce.student_id = auth.uid()
    )
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'student'
    )
  );
