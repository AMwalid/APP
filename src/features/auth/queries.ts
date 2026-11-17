import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * The signed-in user, or null.
 *
 * Pages read the session through this query rather than importing the Supabase
 * client directly: only `queries.ts` / `actions.ts` may touch the data layer
 * (ARCHITECTURE §5.5).
 *
 * `getUser()` verifies the token with Supabase instead of trusting the cookie,
 * so this doubles as the server-side permission check for protected pages.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}
