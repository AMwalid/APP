"use client";

import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { NAV_ACTIONS } from "@/lib/constants/navigation";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

type NavActionsProps = {
  /** Stack the actions vertically at full width (mobile sheet). */
  fullWidth?: boolean;
  /** Called before the browser navigates (the mobile sheet closes itself). */
  onNavigate?: () => void;
  className?: string;
};

/** Login / Sign Up / Book a Demo — shared by the desktop bar and mobile sheet. */
export function NavActions({
  fullWidth = false,
  onNavigate,
  className,
}: NavActionsProps) {
  const t = useTranslations("Navigation");

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        fullWidth && "flex-col items-stretch",
        className,
      )}
    >
      {NAV_ACTIONS.map((action) => (
        <Link
          key={action.id}
          href={action.href}
          onClick={onNavigate}
          className={cn(
            buttonVariants({ variant: action.variant }),
            fullWidth && "w-full justify-start",
          )}
        >
          {t(action.labelKey)}
        </Link>
      ))}
    </div>
  );
}
