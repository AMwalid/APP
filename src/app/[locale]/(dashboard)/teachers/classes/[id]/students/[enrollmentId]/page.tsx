import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getClassById, getRoster } from "@/features/classes";
import {
  AddGradeDialog,
  getGrades,
  getTeacherEnrollment,
  GradeList,
} from "@/features/grades";
import { Link } from "@/lib/i18n/navigation";

/**
 * GRD-01 — one student's gradebook, as seen by their teacher.
 *
 * Three locks before anything renders:
 *
 * 1. Both path segments must be uuids.
 * 2. `getClassById` proves the class is the teacher's own.
 * 3. `getTeacherEnrollment` proves the enrollment belongs to that class.
 *
 * A missing class, a foreign class, a stale enrollment and a malformed id all
 * become the same `notFound()`, so the page reveals nothing about ids that are
 * not ours. RLS on `grades` is the final boundary.
 */
export default async function TeacherGradebookPage({
  params,
}: {
  params: Promise<{ locale: string; id: string; enrollmentId: string }>;
}) {
  const { locale, id, enrollmentId } = await params;
  setRequestLocale(locale);

  const classId = z.uuid().safeParse(id);
  const enrollment = z.uuid().safeParse(enrollmentId);

  if (!classId.success || !enrollment.success) {
    notFound();
  }

  const [classItem, enrollmentRef, roster, grades] = await Promise.all([
    getClassById(classId.data),
    getTeacherEnrollment(classId.data, enrollment.data),
    getRoster(classId.data),
    getGrades(enrollment.data),
  ]);

  if (!classItem || !enrollmentRef) {
    notFound();
  }

  const student = roster.find((row) => row.enrollmentId === enrollmentRef.id);

  if (!student) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const studentName = student.fullName ?? student.email;

  return (
    <div className="space-y-6">
      <Link
        href={`/teachers/classes/${classItem.id}`}
        className="inline-flex items-center gap-1 text-sm font-medium text-primary-hover transition-colors duration-150 ease-standard hover:text-primary-deep"
      >
        <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
        {t("gradebook.backToClass")}
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-balance text-foreground">
            {t("gradebook.teacherTitle", { name: studentName })}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t("gradebook.subtitle", { name: classItem.name })}
          </p>
        </div>

        <AddGradeDialog
          classId={classItem.id}
          enrollmentId={enrollmentRef.id}
        />
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
