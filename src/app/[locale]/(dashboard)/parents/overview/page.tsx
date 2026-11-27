import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  CommunicationsList,
  SummaryCard,
  getParentOverview,
} from "@/features/parents";

/**
 * PAR-01 — Parent dashboard.
 *
 * Aggregates the parent's real children, their grades and their direct messages.
 * Attendance and behavior are not in the schema yet, so this page does not
 * pretend to report them. The page only composes the feature's query and cards.
 */
export default async function ParentOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const overview = await getParentOverview(locale);

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
