import type { UserRole } from "@/types/roles";

/**
 * Where each role lands after signing in.
 *
 * One map, used by the `/dashboard` resolver and by every section guard. A role
 * whose dashboard is not built yet still needs a real destination: a placeholder
 * page is honest, a redirect to a route that does not exist is not.
 */
export const ROLE_HOME: Record<UserRole, string> = {
  parent: "/parents/overview",
  teacher: "/teachers/overview",
  student: "/students/overview",
  institution_admin: "/institutions/dashboard",
};
