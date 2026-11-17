/**
 * The signed-in navigation, shown in the dashboard sidebar.
 *
 * Same shape as `NAV_ITEMS`: hrefs are locale-less (the locale-aware `Link`
 * adds the prefix) and labels are keys resolved against the `Dashboard`
 * namespace.
 *
 * These are the parent-space routes for now. When students and teachers get
 * their own dashboards, this becomes a per-role list rather than a constant.
 */
export type DashboardNavItem = {
  id: string;
  labelKey: string;
  href: string;
};

export const DASHBOARD_NAV: readonly DashboardNavItem[] = [
  { id: "overview", labelKey: "nav.overview", href: "/parents/overview" },
  { id: "children", labelKey: "nav.children", href: "/parents/children" },
  { id: "messages", labelKey: "nav.messages", href: "/parents/messages" },
  { id: "settings", labelKey: "nav.settings", href: "/parents/settings" },
];
