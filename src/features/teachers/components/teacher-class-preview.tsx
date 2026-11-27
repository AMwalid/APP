import { useTranslations } from "next-intl";
import { ClassCard, type Class } from "@/features/classes";
import { Link } from "@/lib/i18n/navigation";

/**
 * A short, real class preview beneath the teacher's overview figures.
 *
 * The cards are the same ones used on `/teachers/classes`, so the overview
 * cannot drift into a second visual language. The empty state has no button
 * because creating a class belongs on the classes page, which "View all" opens.
 */
export function TeacherClassPreview({ classes }: { classes: Class[] }) {
  const t = useTranslations("Dashboard");

  return (
    <section aria-labelledby="teacher-class-preview" className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2
          id="teacher-class-preview"
          className="text-lg font-semibold text-foreground"
        >
          {t("teacherOverview.classes.title")}
        </h2>
        <Link
          href="/teachers/classes"
          className="rounded-sm text-sm font-semibold text-primary-hover transition-colors duration-150 ease-standard hover:text-primary-deep"
        >
          {t("teacherOverview.classes.viewAll")}
        </Link>
      </div>

      {classes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-surface-muted p-8 text-center">
          <h3 className="text-sm font-medium text-foreground">
            {t("teacherOverview.classes.empty.title")}
          </h3>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("teacherOverview.classes.empty.body")}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classes.slice(0, 3).map((classItem) => (
            <li key={classItem.id}>
              <ClassCard classItem={classItem} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
