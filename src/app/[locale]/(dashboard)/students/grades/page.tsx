import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getStudentGrades, GradeList } from "@/features/grades";
import { Link } from "@/lib/i18n/navigation";

/**
 * STU-02 — all of the student's grades across every class.
 *
 * RLS on `class_enrollments` and `grades` limits the read to the signed-in
 * student; the class names come from the existing narrow student-classes RPC.
 * The route stays thin and renders the shared read-only GradeList: no teacher
 * controls reach this side of the feature.
 */
export default async function StudentAllGradesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const grades = await getStudentGrades();

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
          {t("studentGrades.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("studentGrades.subtitle")}
        </p>
      </header>

      <section aria-labelledby="student-grades-heading" className="space-y-3">
        <h2
          id="student-grades-heading"
          className="text-lg font-semibold text-foreground"
        >
          {t("studentGrades.listTitle")}
        </h2>
        <GradeList
          grades={grades}
          locale={locale}
          showClass
          classLabel={t("studentGrades.columns.class")}
          scoreDisplay="combined"
          emptyTitle={t("studentGrades.empty.title")}
          emptyBody={t("studentGrades.empty.body")}
        />
      </section>
    </div>
  );
}
