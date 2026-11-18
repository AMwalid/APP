/**
 * The self-service role vocabulary.
 *
 * It lives in `src/types` rather than inside `features/profile` because the
 * dashboard navigation needs it too, and the boundary rules keep `lib/` and
 * `components/` out of `features/`. One list, imported by the profile schema,
 * the settings form, the nav map and the role guards.
 *
 * `institution_admin` and `admin` are deliberately absent: they are not
 * self-service, they arrive with verification, and the database check
 * constraint refuses them until then.
 */
export const USER_ROLES = ["parent", "teacher", "student"] as const;

export type UserRole = (typeof USER_ROLES)[number];

/**
 * Narrowing helper for values that come back from the database.
 *
 * The Supabase client is untyped until `src/types/database.ts` is generated, so
 * `role` arrives as `string`. The check constraint makes anything else
 * impossible, but reading it through a guard means a future migration that
 * widens the column cannot silently put an unknown role into the UI.
 */
export function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value);
}
