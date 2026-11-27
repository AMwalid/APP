import { getTranslations, setRequestLocale } from "next-intl/server";
import { StatCard } from "@/components/shared/stat-card";
import {
  getInstitutionOverview,
  InstitutionProfileView,
} from "@/features/institutions";

/** INS-03/04: the institution admin's overview and editable public profile. */
export default async function InstitutionDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const overview = await getInstitutionOverview();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-balance text-foreground">
          {t("institutionOverview.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("institutionOverview.subtitle")}
        </p>
      </header>

      <section
        aria-label={t("institutionOverview.title")}
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

      <InstitutionProfileView />
    </div>
  );
}
