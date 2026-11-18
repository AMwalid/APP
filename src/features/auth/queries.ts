/**
 * Auth queries.
 *
 * `getCurrentUser` is defined in `lib/supabase/session` and re-exported here so
 * `@/features/auth` keeps the public API the layout already uses. The body moved
 * out because a feature barrel is the wrong import target for session plumbing:
 * it also re-exports client components, and server files that reach it through a
 * Server Action pull those into the browser bundle.
 */
export { getCurrentUser } from "@/lib/supabase/session";
