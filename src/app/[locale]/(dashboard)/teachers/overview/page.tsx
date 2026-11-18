import { getTranslations, setRequestLocale } from "next-intl/server";
import { StatCard } from "@/components/shared/stat-card";
import { getTeacherOverview } from "@/features/teachers";

/**
 * Teacher dashboard.
 *
 * The three figures are the shell of TCH-02 (class management) and TCH-03
 * (student records): they answer "how much is on my plate?" before the teacher
 * opens a class. The query returns the placeholder contract, so this page does
 * not change when the tables land.
 *
 * The role boundary is `teachers/layout.tsx`; the page only composes data and
 * rendering, like the parent overview.
 */
export default async function TeacherOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const overview = await getTeacherOverview();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-balance text-foreground">
          {t("teacherOverview.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("teacherOverview.subtitle")}
        </p>
      </header>

      <section
        aria-label={t("teacherOverview.title")}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {overview.cards.map((card) => (
          <StatCard
            key={card.id}
            label={t(card.labelKey)}
            value={String(card.value)}
            caption={t(card.captionKey)}
            tone={card.tone}
          />
        ))}
      </section>
    </div>
  );
}
