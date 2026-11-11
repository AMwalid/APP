"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { NavActions } from "@/components/layout/nav-actions";
import {
  getMenuEntries,
  isActiveItem,
  isActiveMenuEntry,
  NAV_ITEMS,
} from "@/lib/constants/navigation";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Mobile navigation.
 *
 * A Radix Dialog slides a full-width sheet from under the header, so focus is
 * trapped while it is open and Escape closes it. Sections with children are
 * disclosures (`aria-expanded`), and the first row of every disclosure is the
 * section landing link.
 */
export function MobileNav() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    setOpen(next);

    if (!next) {
      setExpanded(null);
    }
  }

  function close() {
    handleOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={t(open ? "a11y.closeMenu" : "a11y.openMenu")}
          className="rounded-control p-2 text-primary-hover transition-colors duration-150 ease-standard hover:bg-surface-muted md:hidden"
        >
          {open ? (
            <X aria-hidden className="size-6" />
          ) : (
            <Menu aria-hidden className="size-6" />
          )}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-overlay animate-overlay-in bg-foreground/30 backdrop-blur-[2px] md:hidden" />

        <Dialog.Content className="fixed inset-x-0 top-0 z-modal flex max-h-dvh animate-sheet-in flex-col overflow-y-auto bg-surface shadow-panel md:hidden">
          <Dialog.Title className="sr-only">{t("a11y.menu")}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {t("a11y.mainNav")}
          </Dialog.Description>

          <div className="container-page sticky top-0 flex h-[var(--header-height)] items-center justify-between gap-4 border-b border-border bg-surface">
            <Link
              href="/"
              aria-label={t("a11y.home")}
              onClick={close}
              className="text-2xl font-bold text-primary-hover transition-colors duration-150 ease-standard hover:text-primary-deep"
            >
              IBNI
            </Link>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t("a11y.closeMenu")}
                className="rounded-control p-2 text-primary-hover transition-colors duration-150 ease-standard hover:bg-surface-muted"
              >
                <X aria-hidden className="size-6" />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label={t("a11y.mainNav")} className="container-page">
            <ul className="flex flex-col divide-y divide-border border-b border-border">
              {NAV_ITEMS.map((item) => {
                const active = isActiveItem(pathname, item);
                const isExpanded = expanded === item.id;
                const submenuId = `mobile-submenu-${item.id}`;

                if (!item.children?.length) {
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onClick={close}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "block p-4 text-base font-medium transition-colors duration-150 ease-standard",
                          active
                            ? "text-primary"
                            : "text-foreground-secondary hover:bg-surface-muted",
                        )}
                      >
                        {t(item.labelKey)}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={submenuId}
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                      className={cn(
                        "flex w-full items-center justify-between p-4 text-start text-base font-medium transition-colors duration-150 ease-standard hover:bg-surface-muted",
                        active ? "text-primary" : "text-foreground-secondary",
                      )}
                    >
                      {t(item.labelKey)}
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "size-4 transition-transform duration-200",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>

                    {isExpanded && (
                      <ul
                        id={submenuId}
                        className="flex flex-col gap-1 bg-surface-muted px-4 pb-3"
                      >
                        {getMenuEntries(item).map((entry) => {
                          const entryActive = isActiveMenuEntry(
                            pathname,
                            entry.href,
                          );

                          return (
                            <li key={entry.id}>
                              <Link
                                href={entry.href}
                                onClick={close}
                                aria-current={
                                  entryActive ? "page" : undefined
                                }
                                className={cn(
                                  "block rounded-nav px-3 py-2 text-sm transition-colors duration-150 ease-standard",
                                  entryActive
                                    ? "bg-primary-soft font-medium text-primary-hover"
                                    : "text-muted-foreground hover:bg-primary-soft hover:text-primary-hover",
                                )}
                              >
                                {t(entry.labelKey)}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="container-page flex flex-col gap-4 py-6">
            <LocaleSwitcher className="self-start" onNavigate={close} />
            <NavActions fullWidth onNavigate={close} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
