"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALE_LABELS: Record<string, string> = {
  ar: "AR",
  fr: "FR",
};

type LocaleSwitcherProps = {
  /** Called before the browser navigates (the mobile sheet closes itself). */
  onNavigate?: () => void;
  className?: string;
};

/**
 * AR / FR toggle. It links to the current pathname in the other locale, so the
 * switch is a real navigation (shareable, works without JS). Query strings are
 * intentionally dropped until `/find-resources` exists.
 */
export function LocaleSwitcher({
  onNavigate,
  className,
}: LocaleSwitcherProps) {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label={t("a11y.language")}
      className={cn(
        "flex items-center gap-0.5 rounded-control border border-border p-0.5",
        className,
      )}
    >
      {routing.locales.map((item) => {
        const isActive = item === locale;

        return (
          <Link
            key={item}
            href={pathname}
            locale={item}
            onClick={onNavigate}
            aria-current={isActive ? "true" : undefined}
            aria-label={t(`a11y.languages.${item}`)}
            className={cn(
              "rounded-[calc(var(--radius-control)-2px)] px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors duration-150 ease-standard",
              isActive
                ? "bg-primary-soft text-primary-hover"
                : "text-muted-foreground hover:text-primary-hover",
            )}
          >
            {LOCALE_LABELS[item]}
          </Link>
        );
      })}
    </div>
  );
}
