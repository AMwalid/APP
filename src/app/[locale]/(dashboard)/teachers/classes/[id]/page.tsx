import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { z } from "zod";
import {
  AddStudentDialog,
  getClassById,
  getRoster,
  RosterList,
} from "@/features/classes";
import { Link } from "@/lib/i18n/navigation";

/**
 * TCH-03 — one class and its roster.
 *
 * Two locks before anything renders:
 *
 * 1. The `id` must be a uuid. A malformed path is a 404, not a 500 from
 *    PostgREST complaining about an invalid uuid filter.
 * 2. `getClassById` filters on `id` **and** `teacher_id` and is wrapped in the
 *    teacher role check. A missing class and somebody else's class both return
 *    null and both become the same `notFound()`, so the page reveals nothing
 *    about whether a stranger's id exists. RLS is the second boundary.
 *
 * The page stays thin: it validates, fetches, and composes the feature's
 * components. All the strings come from `Dashboard.classDetails.*`.
 */
export default async function ClassDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const parsedId = z.uuid().safeParse(id);

  if (!parsedId.success) {
    notFound();
  }

  const [classItem, students] = await Promise.all([
    getClassById(parsedId.data),
    getRoster(parsedId.data),
  ]);

  if (!classItem) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Dashboard" });

  return (
    <div className="space-y-6">
      <Link
        href="/teachers/classes"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary-hover transition-colors duration-150 ease-standard hover:text-primary-deep"
      >
        <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
        {t("classDetails.back")}
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-balance text-foreground">
            {classItem.name}
          </h1>
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <div className="flex gap-2">
              <dt className="text-muted-foreground">
                {t("classDetails.subject")}
              </dt>
              <dd className="font-medium text-foreground">
                {classItem.subject}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground">
                {t("classDetails.gradeLevel")}
              </dt>
              <dd className="font-medium text-foreground">
                {classItem.gradeLevel}
              </dd>
            </div>
          </dl>
        </div>

        <AddStudentDialog classId={classItem.id} />
      </header>

      <section aria-labelledby="roster-heading" className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="roster-heading" className="text-lg font-semibold text-foreground">
            {t("classDetails.roster.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("classDetails.roster.count", { count: students.length })}
          </p>
        </div>

        <RosterList
          classId={classItem.id}
          students={students}
          locale={locale}
        />
      </section>
    </div>
  );
}
