import { useTranslations } from "next-intl";
import type { Child } from "../types";
import { ChildCardMenu } from "./child-card-menu";

/**
 * One child: name, age, school and their latest grade.
 *
 * The card is a definition list rather than a stack of paragraphs: "School" and
 * "Latest grade" are labels for values, so `dt`/`dd` gives assistive tech the
 * pairing for free. Each row is `justify-between`, which puts the label on the
 * start edge and the value on the end edge in both directions — no `text-left`.
 *
 * The age comes from `child.age` and is pluralised by the message, not here.
 *
 * Grades live in a table that does not exist yet, so the row states that rather
 * than showing a placeholder mark. Once grading lands, this becomes
 * `child.latestGrade` and the "no grades" branch goes away.
 *
 * The edit/delete menu is a client island; this component itself stays on the
 * server.
 */
export function ChildCard({ child }: { child: Child }) {
  const t = useTranslations("Dashboard");

  return (
    <article className="h-full rounded-lg border border-border bg-background p-5 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">
            {child.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("children.card.age", { years: child.age })}
          </p>
        </div>
        <ChildCardMenu child={child} />
      </header>

      <dl className="mt-4 divide-y divide-border border-t border-border">
        <div className="flex items-baseline justify-between gap-3 py-2.5">
          <dt className="text-sm text-muted-foreground">
            {t("children.card.school")}
          </dt>
          <dd className="text-end text-sm font-medium text-foreground">
            {child.school}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 py-2.5">
          <dt className="text-sm text-muted-foreground">
            {t("children.card.latestGrade")}
          </dt>
          <dd className="text-end text-sm text-muted-foreground">
            {t("children.card.noGrade")}
          </dd>
        </div>
      </dl>
    </article>
  );
}
