import type { UserRole } from "@/types/roles";

/**
 * Types for the signed-in user's profile.
 *
 * The role vocabulary lives in `@/types/roles`: the dashboard navigation needs
 * it too, and `lib/` and `components/` may not import a feature. It is
 * re-exported here so the rest of the profile feature has one import path.
 */
export { USER_ROLES, isUserRole } from "@/types/roles";
export type { UserRole } from "@/types/roles";

/**
 * A profile as the UI sees it.
 *
 * `fullName` is `null` rather than `""` when the user has not set one: the
 * difference between "no name" and "a name that happens to be empty" matters,
 * because the top bar falls back to the email only for the former.
 */
export type Profile = {
  id: string;
  fullName: string | null;
  role: UserRole;
};

/**
 * Everything the dashboard shell needs about the signed-in person.
 *
 * The email lives on the auth user, the name and role on the profile, and the
 * shell needs all three. Joining them here means the layout asks one question
 * instead of two, and neither the layout nor a page has to import the Supabase
 * session module directly — only `queries.ts` may (ARCHITECTURE §9).
 */
export type Viewer = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: UserRole;
};

/**
 * A row of `public.profiles`, as returned by the query.
 *
 * Hand-written from
 * `supabase/migrations/20261118000100_create_profiles_table.sql` because
 * `src/types/database.ts` has not been generated yet (the Supabase CLI is not
 * installed). Replace this with `Tables<"profiles">` the moment it is: the
 * column list here has to stay identical to the migration until then.
 */
export type ProfileRow = {
  id: string;
  full_name: string | null;
  role: string;
};

/** The settings form state. Plain strings: that is what the inputs produce. */
export type ProfileFormValues = {
  fullName: string;
  role: UserRole;
};

export type ProfileField = keyof ProfileFormValues;

/**
 * What `updateProfile` hands back.
 *
 * Failures are data, not exceptions, so the form keeps its locale and can show
 * a translated message — the same contract as `AuthResult` and `ChildResult`.
 */
export type ProfileResult =
  | { status: "success" }
  | {
      status: "error";
      fieldErrors?: Partial<Record<ProfileField, string>>;
      formError?: string;
    };
