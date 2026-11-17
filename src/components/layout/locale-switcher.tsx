"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALE_LABELS: Record<string, string> = {
  ar: "AR",
  fr: "FR",
  en: "EN",
};

type LocaleSwitcherProps = {
  /** Called before the browser navigates (the mobile sheet closes itself). */
  onNavigate?: () => void;
  /** `dark` is for the dark utility bar; `light` for the white sheet. */
  tone?: "light" | "dark";
  className?: string;
};

const TONES = {
  light: {
    group: "border-border",
    active: "bg-primary-soft text-primary-hover",
    idle: "text-muted-foreground hover:text-primary-hover",
  },
  dark: {
    group: "border-primary-foreground/25",
    active: "bg-primary-foreground/15 text-primary-foreground",
    idle: "text-primary-foreground/80 hover:text-primary-foreground",
  },
} as const;

/**
 * AR / FR toggle. It links to the current pathname in the other locale, so the
 * switch is a real navigation (shareable, works without JS). Query strings are
 * intentionally dropped until `/find-resources` exists.
 */
export function LocaleSwitcher({
  onNavigate,
  tone = "light",
  className,
}: LocaleSwitcherProps) {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const palette = TONES[tone];

  return (
    <div
      role="group"
      aria-label={t("a11y.language")}
      className={cn(
        "flex items-center gap-0.5 rounded-control border p-0.5",
        palette.group,
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
              "rounded-[calc(var(--radius-control)-2px)] px-2 py-1 text-xs font-semibold tracking-wide transition-colors duration-150 ease-standard",
              isActive ? palette.active : palette.idle,
            )}
          >
            {LOCALE_LABELS[item]}
          </Link>
        );
      })}
    </div>
  );
}
