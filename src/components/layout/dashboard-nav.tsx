"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
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
 * and passing one string is clearer than a provider for four roles. The vertical
 * list lives in the desktop sidebar. On narrow screens the same links render in
 * a Radix Dialog sheet: focus is trapped, Escape and the overlay close it, and
 * every link closes it before navigating. Nothing is `order-*` or `left/right`,
 * so the sheet mirrors in Arabic by construction.
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
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <Link href="/dashboard" className="text-xl font-bold text-primary-deep">
          IBNI
        </Link>

        <Dialog.Trigger asChild>
          <button
            type="button"
            aria-label={t("nav.openMenu")}
            className="rounded-nav p-2 text-primary-hover transition-colors duration-150 ease-standard hover:bg-surface-subtle"
          >
            <Menu aria-hidden className="size-6 text-primary-hover" />
          </button>
        </Dialog.Trigger>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-overlay animate-overlay-in bg-foreground/30 backdrop-blur-[2px] lg:hidden" />

        <Dialog.Content className="fixed inset-x-0 top-0 z-modal flex max-h-dvh animate-sheet-in flex-col overflow-y-auto bg-surface shadow-panel lg:hidden">
          <Dialog.Title className="sr-only">{t("nav.menu")}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {t("nav.mainNav")}
          </Dialog.Description>

          <div className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border px-5">
            <Link
              href="/dashboard"
              onClick={close}
              className="text-xl font-bold text-primary-deep"
            >
              IBNI
            </Link>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t("nav.closeMenu")}
                className="rounded-nav p-2 text-primary-hover transition-colors duration-150 ease-standard hover:bg-surface-subtle"
              >
                <X aria-hidden className="size-6 text-primary-hover" />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label={t("nav.mainNav")} className="px-3 py-2">
            <ul className="flex flex-col gap-1">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={item.active ? "page" : undefined}
                    className={cn(
                      "block rounded-control px-3 py-3 text-base font-medium transition-colors duration-150 ease-standard",
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

          <div className="mt-auto border-t border-border p-4">
            <LocaleSwitcher className="self-start" onNavigate={close} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
