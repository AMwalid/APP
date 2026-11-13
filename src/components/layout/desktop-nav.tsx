"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  getMenuEntries,
  isActiveItem,
  isActiveMenuEntry,
  NAV_ITEMS,
} from "@/lib/constants/navigation";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

const TOP_LEVEL_BASE =
  "inline-flex items-center gap-1 rounded-nav px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150 ease-standard";

function topLevelTone(active: boolean) {
  return active
    ? "text-primary font-semibold"
    : "text-foreground-secondary hover:text-primary data-[state=open]:text-primary";
}

const ROW_BASE =
  "block rounded-nav px-3 py-2 text-sm transition-colors duration-150 ease-standard";

/**
 * Desktop navigation.
 *
 * The whole top-level item is the Radix trigger; the first row of every panel
 * is the section landing link. There is no `Viewport`: each panel is absolutely
 * positioned against its own item so it lines up with the trigger.
 */
export function DesktopNav({ className }: { className?: string }) {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <NavigationMenu.Root
      aria-label={t("a11y.mainNav")}
      dir={locale === "ar" ? "rtl" : "ltr"}
      delayDuration={120}
      skipDelayDuration={300}
      className={cn("hidden xl:block", className)}
    >
      <NavigationMenu.List className="flex items-center gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActiveItem(pathname, item);

          if (!item.children?.length) {
            return (
              <NavigationMenu.Item key={item.id}>
                <NavigationMenu.Link asChild active={active}>
                  <Link
                    href={item.href}
                    className={cn(TOP_LEVEL_BASE, topLevelTone(active))}
                  >
                    {t(item.labelKey)}
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            );
          }

          return (
            <NavigationMenu.Item key={item.id} className="relative">
              <NavigationMenu.Trigger
                className={cn(TOP_LEVEL_BASE, "group", topLevelTone(active))}
              >
                {t(item.labelKey)}
                <ChevronDown
                  aria-hidden
                  className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </NavigationMenu.Trigger>

              <NavigationMenu.Content className="absolute top-full start-0 z-dropdown pt-1 animate-dropdown-in">
                <ul className="w-64 rounded-control border border-border bg-surface p-2 shadow-panel">
                  {getMenuEntries(item).map((entry) => {
                    const entryActive = isActiveMenuEntry(pathname, entry.href);

                    return (
                      <li key={entry.id}>
                        <NavigationMenu.Link asChild active={entryActive}>
                          <Link
                            href={entry.href}
                            className={cn(
                              ROW_BASE,
                              entryActive
                                ? "bg-primary-soft font-medium text-primary-hover"
                                : "text-muted-foreground hover:bg-primary-soft hover:text-primary-hover",
                            )}
                          >
                            {t(entry.labelKey)}
                          </Link>
                        </NavigationMenu.Link>
                      </li>
                    );
                  })}
                </ul>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
