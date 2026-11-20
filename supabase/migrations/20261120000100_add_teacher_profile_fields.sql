-- Teacher profile fields (TCH-01).
--
-- All three columns are nullable: a teacher can sign up and complete the profile
-- later, so existing rows need no backfill and no NOT NULL to satisfy.
--
-- RLS: the existing "profiles_update_own" policy is table-level:
--   for update to authenticated
--   using (auth.uid() = id) with check (auth.uid() = id)
-- It already covers every column below, new or old. Adding a second UPDATE
-- policy is unnecessary — policies are OR'd, not replaced. The SELECT policy
-- likewise covers reading these columns back.

alter table public.profiles
  add column specialization   text,
  add column experience_years integer,
  add column bio              text;

-- The form validates the same bounds; these constraints are the final boundary
-- if a row is ever written outside the app. An empty bio is allowed because it
-- is optional; a non-empty one has to be a real bio.
alter table public.profiles
  add constraint profiles_specialization_length
    check (specialization is null or char_length(btrim(specialization)) between 2 and 80),
  add constraint profiles_experience_years_range
    check (experience_years is null or experience_years between 0 and 60),
  add constraint profiles_bio_length
    check (
      bio is null
      or char_length(btrim(bio)) = 0
      or char_length(btrim(bio)) between 20 and 1000
    );

comment on column public.profiles.specialization is 'Teacher subject specialism, e.g. Math, Physics.';
comment on column public.profiles.experience_years is 'Years of teaching experience.';
comment on column public.profiles.bio is 'Optional short teacher biography shown on the profile.';
