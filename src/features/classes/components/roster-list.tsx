import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { RosterStudent } from "../types";
import { RosterRowMenu } from "./roster-row-menu";

/**
 * The enrolled students of one class (TCH-03).
 *
 * A table rather than cards: the roster is tabular data with three columns and
 * a per-row action, so `table` gives assistive tech the header-to-cell mapping
 * for free. No `text-left`/`text-right`: alignment follows the document's
 * direction, and the email cell sets `dir="ltr"` because an address is always
 * left-to-right even inside an RTL page.
 *
 * This is a server component; only the row menu is a client island.
 */
export function RosterList({
  classId,
  students,
  locale,
}: {
  classId: string;
  students: readonly RosterStudent[];
  locale: string;
}) {
  const t = useTranslations("Dashboard");

  if (students.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-surface-muted p-8 text-center">
        <h2 className="text-base font-semibold text-foreground">
          {t("classDetails.roster.empty.title")}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {t("classDetails.roster.empty.body")}
        </p>
      </div>
    );
  }

  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-surface-muted">
          <tr>
            <th scope="col" className="px-4 py-3 text-start font-medium text-muted-foreground">
              {t("classDetails.roster.columns.name")}
            </th>
            <th scope="col" className="px-4 py-3 text-start font-medium text-muted-foreground">
              {t("classDetails.roster.columns.email")}
            </th>
            <th scope="col" className="px-4 py-3 text-start font-medium text-muted-foreground">
              {t("classDetails.roster.columns.enrolled")}
            </th>
            <th scope="col">
              <span className="sr-only">{t("classDetails.roster.columns.actions")}</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {students.map((student) => (
            <tr key={student.enrollmentId}>
              <td className="px-4 py-3 font-medium text-foreground">
                {student.fullName ?? t("classDetails.roster.unnamed")}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {student.email ? (
                  <span dir="ltr" className="block w-fit">
                    {student.email}
                  </span>
                ) : (
                  t("classDetails.roster.noEmail")
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {dateFormat.format(new Date(student.enrolledAt))}
              </td>
              <td className="px-2 py-2 text-end">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/teachers/classes/${classId}/students/${student.enrollmentId}`}
                    aria-label={t("gradebook.viewGradesFor", {
                      name: student.fullName ?? student.email,
                    })}
                    className="inline-flex items-center rounded-control px-2 py-1.5 text-sm font-medium text-primary-hover transition-colors duration-150 ease-standard hover:bg-surface-subtle hover:text-primary-deep"
                  >
                    {t("gradebook.viewGrades")}
                  </Link>
                  <RosterRowMenu classId={classId} student={student} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
