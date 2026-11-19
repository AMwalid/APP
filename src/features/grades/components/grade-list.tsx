import { useTranslations } from "next-intl";
import type { Grade } from "../types";

/**
 * The grades of one enrollment, shared by the teacher, student and parent views.
 *
 * A table because it is tabular data with labelled columns. There are no
 * per-row controls here: the student and parent must not see the teacher's
 * actions, and the teacher's only write is the Add Grade dialog in the page
 * header. Numbers get `dir="ltr"` and tabular figures so they stay readable
 * inside an RTL page.
 *
 * `showClass` is off everywhere except the parent's cross-class page; the
 * teacher and student tables keep their original five columns. Likewise the
 * empty state can be overridden so the parent page gets its own wording.
 */
export function GradeList({
  grades,
  locale,
  showClass = false,
  emptyTitle,
  emptyBody,
}: {
  grades: readonly Grade[];
  locale: string;
  showClass?: boolean;
  emptyTitle?: string;
  emptyBody?: string;
}) {
  const t = useTranslations("Dashboard");

  if (grades.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-surface-muted p-8 text-center">
        <h2 className="text-base font-semibold text-foreground">
          {emptyTitle ?? t("gradebook.empty.title")}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {emptyBody ?? t("gradebook.empty.body")}
        </p>
      </div>
    );
  }

  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  const numberFormat = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  });
  const percentFormat = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  });

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-surface-muted">
          <tr>
            {showClass ? (
              <th scope="col" className="px-4 py-3 text-start font-medium text-muted-foreground">
                {t("parentGrades.columns.class")}
              </th>
            ) : null}
            <th scope="col" className="px-4 py-3 text-start font-medium text-muted-foreground">
              {t("gradebook.columns.title")}
            </th>
            <th scope="col" className="px-4 py-3 text-start font-medium text-muted-foreground">
              {t("gradebook.columns.score")}
            </th>
            <th scope="col" className="px-4 py-3 text-start font-medium text-muted-foreground">
              {t("gradebook.columns.maxScore")}
            </th>
            <th scope="col" className="px-4 py-3 text-start font-medium text-muted-foreground">
              {t("gradebook.columns.percentage")}
            </th>
            <th scope="col" className="px-4 py-3 text-start font-medium text-muted-foreground">
              {t("gradebook.columns.date")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {grades.map((grade) => (
            <tr key={grade.id}>
              {showClass ? (
                <td className="px-4 py-3 font-medium text-foreground">
                  <span className="block">{grade.className}</span>
                  {grade.subject ? (
                    <span className="block text-xs text-muted-foreground">
                      {grade.subject}
                    </span>
                  ) : null}
                </td>
              ) : null}
              <td className="px-4 py-3 font-medium text-foreground">
                {grade.title}
              </td>
              <td className="px-4 py-3 text-foreground">
                <span dir="ltr" className="block w-fit tabular-nums">
                  {numberFormat.format(grade.score)}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                <span dir="ltr" className="block w-fit tabular-nums">
                  {numberFormat.format(grade.maxScore)}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                <span dir="ltr" className="block w-fit tabular-nums">
                  {percentFormat.format(grade.score / grade.maxScore)}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {dateFormat.format(new Date(grade.createdAt))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
