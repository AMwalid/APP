import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type EntityCardRow = {
  id: string;
  label: string;
  value: string;
  /** A value that is a status rather than a fact ("No grades yet"). */
  muted?: boolean;
};

type EntityCardProps = {
  /** Usually a string; a card whose title links to a detail page passes a Link. */
  title: ReactNode;
  subtitle: string;
  /** The edit/delete menu, when the entity has one. */
  menu?: ReactNode;
  rows: readonly EntityCardRow[];
  /** An optional trailing action, e.g. "Manage roster" on a class card. */
  footer?: ReactNode;
};

/**
 * The shell for an entity card (a child, a class).
 *
 * Presentational on purpose: it takes translated strings and a menu node, so it
 * can live in `components/shared` and be used by two features without either
 * importing the other. The definition list is the point: "School" and "Latest
 * grade" are labels for values, so `dt`/`dd` gives assistive tech the pairing
 * for free. Each row is `justify-between`, which puts the label on the start
 * edge and the value on the end edge in both directions — no `text-left`.
 */
export function EntityCard({
  title,
  subtitle,
  menu,
  rows,
  footer,
}: EntityCardProps) {
  return (
    <article className="h-full rounded-lg border border-border bg-background p-5 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {menu}
      </header>

      <dl className="mt-4 divide-y divide-border border-t border-border">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-baseline justify-between gap-3 py-2.5"
          >
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd
              className={cn(
                "text-end text-sm",
                row.muted
                  ? "text-muted-foreground"
                  : "font-medium text-foreground",
              )}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {footer ? <div className="mt-3 border-t border-border pt-3">{footer}</div> : null}
    </article>
  );
}
