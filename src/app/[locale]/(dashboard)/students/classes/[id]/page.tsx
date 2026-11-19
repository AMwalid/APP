import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getStudentClasses } from "@/features/classes";
import {
  getGrades,
  getStudentEnrollmentForClass,
  GradeList,
} from "@/features/grades";
import { Link } from "@/lib/i18n/navigation";

/**
 * GRD-01 — one student's grades for one enrolled class.
 *
 * The class id is validated as a uuid, then looked up in the student's own
 * class list and paired with their own enrollment. Both queries are limited by
 * RLS and by `auth.uid()`, so a class the student is not enrolled in yields the
 * same `notFound()` as a made-up id. The shared GradeList renders no teacher
 * controls — add/edit/delete never reach this side of the feature.
 */
export default async function StudentGradesPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const classId = z.uuid().safeParse(id);

  if (!classId.success) {
    notFound();
  }

  const [classes, enrollment] = await Promise.all([
    getStudentClasses(),
    getStudentEnrollmentForClass(classId.data),
  ]);

  const classItem = classes.find((item) => item.id === classId.data);

  if (!classItem || !enrollment) {
    notFound();
  }

  const grades = await getGrades(enrollment.id);
  const t = await getTranslations({ locale, namespace: "Dashboard" });

  return (
    <div className="space-y-6">
      <Link
        href="/students/overview"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary-hover transition-colors duration-150 ease-standard hover:text-primary-deep"
      >
        <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
        {t("gradebook.backToOverview")}
      </Link>

      <header className="min-w-0">
        <h1 className="text-2xl font-bold text-balance text-foreground">
          {t("gradebook.studentTitle", { name: classItem.name })}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("gradebook.subtitle", { name: classItem.subject })}
        </p>
      </header>

      <section aria-labelledby="gradebook-heading" className="space-y-3">
        <h2 id="gradebook-heading" className="text-lg font-semibold text-foreground">
          {t("gradebook.listTitle")}
        </h2>
        <GradeList grades={grades} locale={locale} />
      </section>
    </div>
  );
}
