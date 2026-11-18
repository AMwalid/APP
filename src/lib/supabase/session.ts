import "server-only";

import { cache } from "react";
import { createClient } from "./server";

/**
 * The signed-in user, or null.
 *
 * Lives in `lib/supabase` rather than in the auth feature because it is session
 * plumbing, not auth UI, and three features need it: the dashboard layout, the
 * parents queries/actions and the profile queries/actions.
 *
 * The placement is also a bundling fix. Importing it from `@/features/auth` pulls
 * that feature's `index.ts`, which re-exports the login and signup forms — and
 * any client module that reaches a Server Action importing the barrel drags zod
 * and those forms into the page's first load. A `lib/` module has no such tail.
 *
 * `getUser()` verifies the token with Supabase instead of trusting the cookie,
 * so this doubles as the server-side permission check for protected pages.
 *
 * Wrapped in `cache()` because a single request now asks more than once: the
 * dashboard layout needs the user for its redirect, `getProfile()` needs it to
 * pick a row, and a page may need it too. Without this, each call is another
 * round-trip to the auth server. The cache is per request, so a session that
 * ends mid-request still ends.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
});
