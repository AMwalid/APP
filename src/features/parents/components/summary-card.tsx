import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { SummaryCardData } from "../types";

/**
 * One summary figure (attendance, behaviour, next exam).
 *
 * `tone="positive"` is the only emphasis: it marks a value that reads as good
 * news, using the same `primary-soft` / `primary-deep` pair as the rest of the
 * app (6.81:1, so it clears AA at this size). Everything else stays neutral so
 * the green actually means something.
 */
export function SummaryCard({ card }: { card: SummaryCardData }) {
  const t = useTranslations("Dashboard");
  const positive = card.tone === "positive";

  return (
    <article className="rounded-lg border border-border bg-background p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">
        {t(card.labelKey)}
      </p>
      <p
        className={cn(
          "mt-2 text-3xl font-bold",
          positive ? "text-primary-deep" : "text-foreground",
        )}
      >
        {t(card.valueKey)}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{t(card.captionKey)}</p>
    </article>
  );
}
