import { useTranslations } from "next-intl";
import type { Grade } from "../types";

/**
 * Grades for one enrollment, shared by the teacher, student and parent views.
 *
 * A table because it is tabular data with labelled columns. There are no
 * per-row controls here: the student and parent must not see the teacher's
 * actions, and the teacher's only write is the Add Grade dialog in the page
 * header. Numbers get `dir="ltr"` and tabular figures so they stay readable
 * inside an RTL page.
 *
 * `showClass` is on for the two cross-class views. `classLabel` lets the student
 * page name that column locally instead of reusing the parent wording.
 * `scoreDisplay` defaults to the split Score/Max score columns used by the
 * teacher and per-class views; the all-classes student page uses "combined" to
 * show `18 / 20` in one cell. Empty copy can be overridden per page.
 */
export function GradeList({
  grades,
  locale,
  showClass = false,
  classLabel,
  scoreDisplay = "split",
  emptyTitle,
  emptyBody,
}: {
  grades: readonly Grade[];
  locale: string;
  showClass?: boolean;
  classLabel?: string;
  scoreDisplay?: "split" | "combined";
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
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-surface-muted">
            <tr>
              {showClass ? (
                <th scope="col" className="px-4 py-3 text-start font-medium text-muted-foreground">
                  {classLabel ?? t("parentGrades.columns.class")}
                </th>
              ) : null}
              <th scope="col" className="px-4 py-3 text-start font-medium text-muted-foreground">
                {t("gradebook.columns.title")}
              </th>
              <th scope="col" className="px-4 py-3 text-start font-medium text-muted-foreground">
                {t("gradebook.columns.score")}
              </th>
              {scoreDisplay === "split" ? (
                <th scope="col" className="px-4 py-3 text-start font-medium text-muted-foreground">
                  {t("gradebook.columns.maxScore")}
                </th>
              ) : null}
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
                    {scoreDisplay === "combined" ? (
                      <>
                        <span className="mx-1 text-muted-foreground">/</span>
                        {numberFormat.format(grade.maxScore)}
                      </>
                    ) : null}
                  </span>
                </td>
                {scoreDisplay === "split" ? (
                  <td className="px-4 py-3 text-muted-foreground">
                    <span dir="ltr" className="block w-fit tabular-nums">
                      {numberFormat.format(grade.maxScore)}
                    </span>
                  </td>
                ) : null}
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
    </div>
  );
}
