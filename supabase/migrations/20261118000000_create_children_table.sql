-- The parent's children (PAR-03).
--
-- One row per child, owned by the guardian who created it. Ownership is the
-- whole security model here: `parent_id` is the only thing RLS checks, and it
-- is always set by the Server Action from the verified session, never from the
-- request body.
--
-- `timestamptz` rather than `timestamp`: a bare timestamp drops the offset, and
-- "when was this added" must not depend on which timezone wrote the row.
--
-- The check constraints mirror the zod rules in
-- `src/features/parents/schemas.ts`. They are deliberately redundant: the schema
-- protects the form, these protect the table from everything else.

create table public.children (
  id         uuid primary key default gen_random_uuid(),
  parent_id  uuid not null references auth.users (id) on delete cascade,
  name       text not null,
  age        int  not null,
  school     text not null,
  created_at timestamptz not null default now(),

  constraint children_name_length   check (char_length(btrim(name)) between 2 and 60),
  constraint children_school_length check (char_length(btrim(school)) between 2 and 100),
  constraint children_age_range     check (age between 3 and 25)
);

-- The list query is always "this parent's children, oldest first".
create index children_parent_id_created_at_idx
  on public.children (parent_id, created_at);

alter table public.children enable row level security;

-- Every policy is scoped to `authenticated`: an anonymous request has no
-- business reaching this table at all, so it should not even be evaluated.

create policy "children_select_own" on public.children
  for select to authenticated
  using (auth.uid() = parent_id);

create policy "children_insert_own" on public.children
  for insert to authenticated
  with check (auth.uid() = parent_id);

-- `with check` matters as much as `using` here: without it a parent could
-- update a row's parent_id and hand their child to another account.
create policy "children_update_own" on public.children
  for update to authenticated
  using (auth.uid() = parent_id)
  with check (auth.uid() = parent_id);

create policy "children_delete_own" on public.children
  for delete to authenticated
  using (auth.uid() = parent_id);
