"use client";

import { useTranslations } from "next-intl";

/** Dashboard-wide skeleton shown while a page's server data is resolving. */
export default function DashboardLoading() {
  const t = useTranslations("Dashboard");

  return (
    <div className="space-y-6" role="status" aria-live="polite">
      <div className="space-y-3">
        <p className="text-sm font-medium text-primary-hover">
          {t("loading.title")}
        </p>
        <div className="h-8 w-56 max-w-full animate-pulse rounded-control bg-surface-subtle" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded-control bg-surface-subtle" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((card) => (
          <div
            key={card}
            className="h-32 animate-pulse rounded-lg border border-border bg-surface"
          />
        ))}
      </div>

      <div className="h-48 animate-pulse rounded-lg border border-border bg-surface" />
      <p className="text-sm text-muted-foreground">{t("loading.description")}</p>
    </div>
  );
}
