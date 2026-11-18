import "server-only";

import { createClient } from "./server";

/**
 * The signed-in user, or null.
 *
 * Lives in `lib/supabase` rather than in the auth feature because it is session
 * plumbing, not auth UI, and two features need it: the dashboard layout and the
 * parents queries/actions.
 *
 * The placement is also a bundling fix. Importing it from `@/features/auth` pulls
 * that feature's `index.ts`, which re-exports the login and signup forms — and
 * any client module that reaches a Server Action importing the barrel drags zod
 * and those forms into the page's first load. A `lib/` module has no such tail.
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
