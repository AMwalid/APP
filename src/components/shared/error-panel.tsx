"use client";

import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Localized fallback used by every route-level error boundary.
 *
 * The boundary owns `reset`; this panel owns the copy and the navigation. It is
 * deliberately small: a crash should have one obvious retry and one safe way
 * out, not a miniature version of the page that just failed.
 */
export function ErrorPanel({ reset }: { reset: () => void }) {
  const t = useTranslations("Errors");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-8 text-center shadow-sm">
        <p className="text-xs font-semibold tracking-widest text-destructive-deep">
          IBNI
        </p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("description")}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className={cn(buttonVariants(), "w-full sm:w-auto")}
          >
            {t("retry")}
          </button>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full sm:w-auto",
            )}
          >
            {t("home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
