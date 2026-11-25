/**
 * Routes that require a signed-in user.
 *
 * These are the dashboard entry points, not the public landing pages. The bare
 * `/parents`, `/students`, `/teachers` and `/institutions` paths are marketing
 * routes reachable from the navigation (ARCHITECTURE §3) and must stay public;
 * the signed-in areas live one segment deeper. `/parents/my-courses` is also
 * public because it is currently only a coming-soon stub linked from the
 * landing page; add it back here when the real parent-only page ships.
 *
 * Paths are locale-less. The middleware strips the `/[locale]` prefix before
 * matching, so this list never has to know about `ar` / `fr` / `en`.
 */
export const PROTECTED_PREFIXES = [
  "/dashboard",
  "/parents/overview",
  "/parents/children",
  "/parents/messages",
  "/parents/settings",
  "/parents/track-kid",
  "/students/overview",
  "/students/settings",
  "/students/track-progress",
  "/students/my-courses",
  "/institutions/dashboard",
  "/teachers/overview",
  "/teachers/classes",
  "/teachers/profile",
  "/teachers/settings",
  "/institutions/profile",
  "/institutions/dashboard",
] as const;

/**
 * True for a prefix and anything beneath it, so `/dashboard` matches
 * `/dashboard` and `/dashboard/settings` but never `/dashboard-ish`.
 */
export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
