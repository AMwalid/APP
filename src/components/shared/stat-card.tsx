import { cn } from "@/lib/utils";

export type StatCardTone = "neutral" | "positive";

type StatCardProps = {
  label: string;
  value: string;
  caption?: string;
  tone?: StatCardTone;
};

/**
 * One summary figure (attendance, class count, marking queue).
 *
 * Presentational on purpose: it takes translated strings, not translation
 * keys, because `components/` may not import `features/` and both the parent
 * and teacher overviews render this same card.
 *
 * `tone="positive"` is the only emphasis: it marks a value that reads as good
 * news, using the same `primary-soft` / `primary-deep` pair as the rest of the
 * app (6.81:1, so it clears AA at this size). Everything else stays neutral so
 * the green actually means something.
 */
export function StatCard({
  label,
  value,
  caption,
  tone = "neutral",
}: StatCardProps) {
  const positive = tone === "positive";

  return (
    <article className="rounded-lg border border-border bg-background p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-2 text-3xl font-bold",
          positive ? "text-primary-deep" : "text-foreground",
        )}
      >
        {value}
      </p>
      {caption ? (
        <p className="mt-1 text-sm text-muted-foreground">{caption}</p>
      ) : null}
    </article>
  );
}
