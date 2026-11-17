import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  CommunicationsList,
  SummaryCard,
  getParentOverview,
} from "@/features/parents";

/**
 * PAR-01 — Parent dashboard.
 *
 * "Present each child's attendance, behavior, academic performance, and school
 * communications in one view." The child selector is deferred until profiles
 * exist, so this shows a single child's snapshot.
 *
 * The page only composes: data comes from the feature's query, rendering from
 * the feature's components.
 */
export default async function ParentOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const overview = await getParentOverview();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-balance text-foreground">
          {t("overview.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("overview.subtitle")}
        </p>
      </header>

      <section
        aria-label={t("overview.title")}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {overview.cards.map((card) => (
          <SummaryCard key={card.id} card={card} />
        ))}
      </section>

      <CommunicationsList items={overview.communications} />
    </div>
  );
}
