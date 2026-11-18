import type { UserRole } from "@/types/roles";

/**
 * The signed-in navigation, shown in the dashboard sidebar.
 *
 * Same shape as `NAV_ITEMS`: hrefs are locale-less (the locale-aware `Link`
 * adds the prefix) and labels are keys resolved against the `Dashboard`
 * namespace.
 *
 * One list per role. The shell asks for `DASHBOARD_NAV[viewer.role]`, so the
 * parent sidebar never offers a teacher route and vice versa. The section
 * guards are what make the role and the URL agree; this map only decides what
 * is visible once they do.
 *
 * The student list is intentionally short: the student dashboard is not built
 * yet, and inventing sections before the product does would be a guess.
 */
export type DashboardNavItem = {
  id: string;
  labelKey: string;
  href: string;
};

export const DASHBOARD_NAV: Record<
  UserRole,
  readonly DashboardNavItem[]
> = {
  parent: [
    { id: "overview", labelKey: "nav.overview", href: "/parents/overview" },
    { id: "children", labelKey: "nav.children", href: "/parents/children" },
    { id: "messages", labelKey: "nav.messages", href: "/parents/messages" },
    { id: "settings", labelKey: "nav.settings", href: "/parents/settings" },
  ],
  teacher: [
    { id: "overview", labelKey: "nav.overview", href: "/teachers/overview" },
    { id: "classes", labelKey: "nav.classes", href: "/teachers/classes" },
    { id: "profile", labelKey: "nav.profile", href: "/teachers/profile" },
    { id: "settings", labelKey: "nav.settings", href: "/teachers/settings" },
  ],
  student: [
    { id: "overview", labelKey: "nav.overview", href: "/students/overview" },
    { id: "settings", labelKey: "nav.settings", href: "/students/settings" },
  ],
};
