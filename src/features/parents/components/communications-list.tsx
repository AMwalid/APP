import { useTranslations } from "next-intl";
import type { Communication } from "../types";

/**
 * Recent school communications.
 *
 * Rows are not links: there is no message detail route yet, and a link that
 * goes nowhere is worse than plain text. The subject leads, the sender supports
 * it, and the time sits on the end edge on wide screens, below on narrow ones.
 */
export function CommunicationsList({ items }: { items: Communication[] }) {
  const t = useTranslations("Dashboard");

  return (
    <section
      aria-labelledby="recent-communications"
      className="rounded-lg border border-border bg-background shadow-sm"
    >
      <h2
        id="recent-communications"
        className="border-b border-border px-5 py-4 text-base font-semibold text-foreground"
      >
        {t("overview.communications.title")}
      </h2>

      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {t(item.subjectKey)}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t(item.fromKey)}
              </p>
            </div>
            <p className="shrink-0 text-xs text-muted-foreground">
              {t(item.whenKey)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
