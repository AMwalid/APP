"use client";

import { useTranslations } from "next-intl";
import { DASHBOARD_NAV } from "@/lib/constants/dashboard-nav";
import { isActiveHref } from "@/lib/constants/navigation";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/roles";

/**
 * The dashboard navigation, in two shapes.
 *
 * Both are client components because the active item depends on the current
 * pathname. `usePathname` from `@/lib/i18n/navigation` returns the path without
 * the locale prefix, which is exactly the form `DASHBOARD_NAV` stores — no
 * prefix stripping here.
 *
 * The role is a prop, not a context: the server layout already has the viewer,
 * and passing one string is clearer than a provider for four links.
 *
 * The vertical list lives in the sidebar; the horizontal one is the same links
 * for narrow screens, where the sidebar is hidden. Nothing is `order-*` or
 * `left/right`: the row direction follows the document, so it mirrors in
 * Arabic by construction.
 */
function useNavItems(role: UserRole) {
  const t = useTranslations("Dashboard");
  const pathname = usePathname();

  return DASHBOARD_NAV[role].map((item) => ({
    ...item,
    label: t(item.labelKey),
    active: isActiveHref(pathname, item.href),
  }));
}

export function DashboardSidebarNav({ role }: { role: UserRole }) {
  const t = useTranslations("Dashboard");
  const items = useNavItems(role);

  return (
    <nav aria-label={t("nav.label")} className="flex-1 overflow-y-auto p-3">
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "block rounded-control px-3 py-2 text-sm font-medium transition-colors duration-150 ease-standard",
                item.active
                  ? "bg-primary-soft text-primary-deep"
                  : "text-foreground-secondary hover:bg-surface-subtle hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function DashboardMobileNav({ role }: { role: UserRole }) {
  const t = useTranslations("Dashboard");
  const items = useNavItems(role);

  return (
    <nav
      aria-label={t("nav.label")}
      className="border-b border-border bg-background px-3 py-2 lg:hidden"
    >
      <ul className="flex gap-1 overflow-x-auto">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "block whitespace-nowrap rounded-control px-3 py-2 text-sm font-medium transition-colors duration-150 ease-standard",
                item.active
                  ? "bg-primary-soft text-primary-deep"
                  : "text-foreground-secondary hover:bg-surface-subtle hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
