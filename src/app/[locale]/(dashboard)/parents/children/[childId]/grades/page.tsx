import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { z } from "zod";
import { GradeList } from "@/features/grades";
import { getChildById, getChildGrades } from "@/features/parents";
import { Link } from "@/lib/i18n/navigation";

/**
 * PAR-04 — a parent's read-only view of their linked child's grades.
 *
 * Two locks before anything renders: the id must be a uuid, and `getChildById`
 * must return a child owned by the signed-in parent. A foreign child id and a
 * made-up one both become the same `notFound()`. An unlinked child has no grades
 * page to show, so it takes the same path.
 *
 * The grades themselves come from `get_child_grades`, a definer RPC whose own
 * ownership predicate is the only way past grades RLS for a parent. No add,
 * edit or delete control is rendered here — this side of the feature is read
 * only by construction, not by hiding buttons.
 */
export default async function ParentChildGradesPage({
  params,
}: {
  params: Promise<{ locale: string; childId: string }>;
}) {
  const { locale, childId } = await params;
  setRequestLocale(locale);

  const parsed = z.uuid().safeParse(childId);

  if (!parsed.success) {
    notFound();
  }

  const child = await getChildById(parsed.data);

  if (!child || !child.studentId) {
    notFound();
  }

  const grades = await getChildGrades(child.id);
  const t = await getTranslations({ locale, namespace: "Dashboard" });

  return (
    <div className="space-y-6">
      <Link
        href="/parents/children"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary-hover transition-colors duration-150 ease-standard hover:text-primary-deep"
      >
        <ArrowLeft aria-hidden className="size-4 rtl:rotate-180" />
        {t("parentGrades.back")}
      </Link>

      <header className="min-w-0">
        <h1 className="text-2xl font-bold text-balance text-foreground">
          {t("parentGrades.title", { name: child.name })}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("parentGrades.subtitle")}
        </p>
      </header>

      <section aria-labelledby="parent-grades-heading" className="space-y-3">
        <h2 id="parent-grades-heading" className="text-lg font-semibold text-foreground">
          {t("parentGrades.listTitle")}
        </h2>
        <GradeList
          grades={grades}
          locale={locale}
          showClass
          emptyTitle={t("parentGrades.empty.title")}
          emptyBody={t("parentGrades.empty.body")}
        />
      </section>
    </div>
  );
}
