import { useTranslations } from "next-intl";
import type { Child } from "../types";

/**
 * One child: name, age, school and their latest grade.
 *
 * The card is a definition list rather than a stack of paragraphs: "School" and
 * "Latest grade" are labels for values, so `dt`/`dd` gives assistive tech the
 * pairing for free. Each row is `justify-between`, which puts the label on the
 * start edge and the value on the end edge in both directions — no `text-left`.
 *
 * The age comes from `child.age` and is pluralised by the message, not here.
 */
export function ChildCard({ child }: { child: Child }) {
  const t = useTranslations("Dashboard");

  return (
    <article className="h-full rounded-lg border border-border bg-background p-5 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">
          {t(child.nameKey)}
        </h2>
        <p className="shrink-0 text-sm text-muted-foreground">
          {t("children.card.age", { years: child.age })}
        </p>
      </header>

      <dl className="mt-4 divide-y divide-border border-t border-border">
        <div className="flex items-baseline justify-between gap-3 py-2.5">
          <dt className="text-sm text-muted-foreground">
            {t("children.card.school")}
          </dt>
          <dd className="text-end text-sm font-medium text-foreground">
            {t(child.schoolKey)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 py-2.5">
          <dt className="text-sm text-muted-foreground">
            {t("children.card.latestGrade")}
          </dt>
          <dd className="text-end">
            <span className="block text-sm font-semibold text-foreground">
              {t(child.gradeValueKey)}
            </span>
            <span className="block text-xs text-muted-foreground">
              {t(child.gradeCaptionKey)}
            </span>
          </dd>
        </div>
      </dl>
    </article>
  );
}
