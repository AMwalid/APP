import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { Communication } from "../types";

/**
 * Recent direct messages from the parent's real inbox.
 *
 * Each row opens the existing conversation route, so a communication is an
 * action rather than a dead line of text. The message leads, the sender supports
 * it, and the localized timestamp sits on the end edge on wide screens. An
 * empty list gets its own translated panel instead of a heading-only box.
 */
export function CommunicationsList({ items }: { items: Communication[] }) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const dateFormat = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

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

      {items.length === 0 ? (
        <div className="p-5 text-center">
          <h3 className="text-sm font-medium text-foreground">
            {t("overview.communications.empty.title")}
          </h3>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("overview.communications.empty.body")}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-1 px-5 py-4 transition-colors duration-150 ease-standard hover:bg-surface-muted sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="rounded-sm transition-colors duration-150 ease-standard hover:text-primary-hover"
                    >
                      {item.subject}
                    </Link>
                  ) : (
                    item.subject
                  )}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {item.from || t("overview.communications.unknownSender")}
                </p>
              </div>
              <p className="shrink-0 text-xs text-muted-foreground">
                {dateFormat.format(new Date(item.when))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
