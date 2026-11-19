import { getTranslations, setRequestLocale } from "next-intl/server";
import { getStudentClasses, StudentClassCard } from "@/features/classes";

/**
 * STU-01 — the student's classes.
 *
 * One card per enrolled class: name, subject, grade level and the teacher's
 * name. The list comes from a narrow definer function because RLS deliberately
 * stops a student reading `classes` or another account's `profiles`; the query
 * repeats the role check as defence in depth.
 *
 * Like the teacher and parent lists, the grid is page composition rather than a
 * feature component — the feature owns the card and the query, the page owns
 * the header, empty state and layout.
 */
export default async function StudentOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const classList = await getStudentClasses();

  return (
    <div className="space-y-6">
      <header className="min-w-0">
        <h1 className="text-2xl font-bold text-balance text-foreground">
          {t("studentOverview.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("studentOverview.subtitle")}
        </p>
      </header>

      {classList.length === 0 ? (
        /*
          A student with no enrollments has no action to take on this page —
          the teacher adds them to a class — so the empty state tells them what
          to ask for instead of offering a button that cannot work.
        */
        <div className="rounded-lg border border-dashed border-border bg-surface-muted p-8 text-center">
          <h2 className="text-base font-semibold text-foreground">
            {t("studentOverview.empty.title")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("studentOverview.empty.body")}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classList.map((classItem) => (
            <li key={classItem.id}>
              <StudentClassCard classItem={classItem} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
