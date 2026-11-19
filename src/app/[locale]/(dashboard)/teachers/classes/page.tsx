import { getTranslations, setRequestLocale } from "next-intl/server";
import { AddClassDialog, ClassCard, getClasses } from "@/features/classes";

/**
 * TCH-02 — the teacher's classes.
 *
 * One card per class: name, subject, grade level and roster. The list comes
 * from `classes`, filtered by RLS and by `teacher_id`, so a teacher only ever
 * sees their own.
 *
 * The grid lives here rather than in the feature because it is page composition,
 * the same way the parent children page maps its own cards.
 */
export default async function TeacherClassesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const classList = await getClasses();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-balance text-foreground">
            {t("classes.title")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t("classes.subtitle")}
          </p>
        </div>

        <AddClassDialog />
      </header>

      {classList.length === 0 ? (
        /*
          A new teacher has no classes yet, and an empty grid under a "Create
          class" button reads as a page that failed to load. This is the one
          state where the dialog is the answer, so it says so.
        */
        <div className="rounded-lg border border-dashed border-border bg-surface-muted p-8 text-center">
          <h2 className="text-base font-semibold text-foreground">
            {t("classes.empty.title")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("classes.empty.body")}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classList.map((classItem) => (
            <li key={classItem.id}>
              <ClassCard classItem={classItem} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
