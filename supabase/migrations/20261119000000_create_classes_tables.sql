-- TCH-02: classes and their rosters.
--
-- One row per class, owned by the teacher who created it. `teacher_id` is set
-- by the Server Action from the verified session, never from the request body.
--
-- `class_enrollments` is the roster join table. It has no UI yet; the table and
-- its policies land now so TCH-03 can add students without a second migration.
--
-- `timestamptz` for the same reason as `children.created_at`: "when was this
-- created" must not depend on which timezone wrote the row.
--
-- The check constraints mirror the zod rules in
-- `src/features/classes/schemas.ts`. They are deliberately redundant: the schema
-- protects the form, these protect the table from everything else.

create table public.classes (
  id          uuid primary key default gen_random_uuid(),
  teacher_id  uuid not null references auth.users (id) on delete cascade,
  name        text not null,
  subject     text not null,
  grade_level text not null,
  created_at  timestamptz not null default now(),

  constraint classes_name_length
    check (char_length(btrim(name)) between 2 and 80),
  constraint classes_subject_length
    check (char_length(btrim(subject)) between 2 and 60),
  constraint classes_grade_level_length
    check (char_length(btrim(grade_level)) between 1 and 40)
);

-- The list query is always "this teacher's classes, oldest first".
create index classes_teacher_id_created_at_idx
  on public.classes (teacher_id, created_at);

alter table public.classes enable row level security;

-- Ownership is the real boundary. The role check is the second lock: a parent
-- who calls the Server Action directly should not be able to create a class for
-- themselves. `is_teacher()` reads the caller's own profile, which the existing
-- profiles policy already allows.
--
-- `security invoker` keeps the profiles RLS in force; `search_path = ''` forces
-- every name in the body to be schema-qualified.
create function public.is_teacher()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'teacher'
  );
$$;

create policy "classes_select_own" on public.classes
  for select to authenticated
  using (auth.uid() = teacher_id and public.is_teacher());

create policy "classes_insert_own" on public.classes
  for insert to authenticated
  with check (auth.uid() = teacher_id and public.is_teacher());

-- `with check` mirrors `using`: an update cannot hand a class to another account.
create policy "classes_update_own" on public.classes
  for update to authenticated
  using (auth.uid() = teacher_id and public.is_teacher())
  with check (auth.uid() = teacher_id and public.is_teacher());

create policy "classes_delete_own" on public.classes
  for delete to authenticated
  using (auth.uid() = teacher_id and public.is_teacher());

create table public.class_enrollments (
  id         uuid primary key default gen_random_uuid(),
  class_id   uuid not null references public.classes (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),

  constraint class_enrollments_unique unique (class_id, student_id)
);

-- The unique constraint already indexes (class_id, student_id); this one serves
-- the student's future "my classes" query and the select policy below.
create index class_enrollments_student_id_idx
  on public.class_enrollments (student_id);

alter table public.class_enrollments enable row level security;

-- Teachers manage the roster of their own classes. `for all` covers select,
-- insert, update and delete; `using` checks the existing row and `with check`
-- the new one, so an enrollment cannot be moved to another teacher's class.
create policy "class_enrollments_teacher_all" on public.class_enrollments
  for all to authenticated
  using (
    exists (
      select 1
      from public.classes c
      where c.id = class_id
        and c.teacher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.classes c
      where c.id = class_id
        and c.teacher_id = auth.uid()
    )
  );

-- A student sees their own enrollments only. No insert/update/delete: a student
-- joins through the teacher (or an invite flow later), not by writing the row.
create policy "class_enrollments_student_select_own"
  on public.class_enrollments
  for select to authenticated
  using (student_id = auth.uid());
