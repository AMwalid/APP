"use client";

import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import {
  NAV_ACTIONS,
  type NavAction,
} from "@/lib/constants/navigation";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

type NavActionsProps = {
  /** Which actions to render. Defaults to every account action. */
  actions?: readonly NavAction[];
  /** Stack the actions vertically at full width (mobile sheet). */
  fullWidth?: boolean;
  /** Called before the browser navigates (the mobile sheet closes itself). */
  onNavigate?: () => void;
  className?: string;
};

/** Account actions — shared by the desktop bar and the mobile sheet. */
export function NavActions({
  actions = NAV_ACTIONS,
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
      {actions.map((action) => (
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
