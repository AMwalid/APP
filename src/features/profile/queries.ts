import "server-only";

import { cache } from "react";
import { getCurrentUser } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { isUserRole, type Profile, type ProfileRow, type Viewer } from "./types";

/**
 * The signed-in user's profile, or null.
 *
 * Null covers three cases that the caller treats the same way: nobody is signed
 * in, the row does not exist (a user created before the trigger and missed by
 * the backfill), and the read failed. All three mean "we have no name for this
 * person", and the top bar falls back to the email for exactly that reason.
 *
 * `maybeSingle` rather than `single`: a missing row is an expected state here,
 * not an error, and PostgREST would otherwise answer 406.
 *
 * RLS already limits the table to the caller's own row; the explicit `id` filter
 * is defence in depth and the one the primary key covers.
 */
export async function getProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[profile] getProfile failed", error.code ?? error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  const row = data as ProfileRow;

  return {
    id: row.id,
    // Whitespace-only is no name at all. `null` is what the fallback tests.
    fullName: row.full_name?.trim() || null,
    role: isUserRole(row.role) ? row.role : "parent",
  };
}

/**
 * The signed-in person, as the dashboard shell sees them: auth email plus the
 * profile's name and role.
 *
 * Null when nobody is signed in. A signed-in user with no profile row is not
 * null — they get `fullName: null` and the default role, because the shell can
 * still greet them by email. `getProfile` is where "no row" is visible, for the
 * settings page that has to say so on save.
 *
 * `getCurrentUser` is cached per request, so the call inside `getProfile` is
 * free here rather than a second token check. `getViewer` itself is cached too:
 * the shell and the section guard both ask for it on the same render, and
 * without this the profile row would be read twice.
 */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const profile = await getProfile();

  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile?.fullName ?? null,
    role: profile?.role ?? "parent",
  };
});
