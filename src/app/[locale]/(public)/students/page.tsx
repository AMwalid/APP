import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MarketingPage } from "@/components/shared/marketing-page";
import {
  MarketingFeatureGrid,
  MarketingValueCards,
  type MarketingFeature,
  type MarketingValueProp,
} from "@/components/shared/marketing-sections";

const NS = "Marketing.students";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });

  return { title: t("metaTitle"), description: t("subtitle") };
}

export default async function StudentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations(NS);

  return (
    <MarketingPage
      title={t("title")}
      subtitle={t("subtitle")}
      heroActions={[
        { label: t("heroPrimary"), href: "/signup" },
        { label: t("heroSecondary"), href: "/book-demo", variant: "outline" },
      ]}
      cta={{
        title: t("cta.title"),
        subtitle: t("cta.subtitle"),
        actions: [
          { label: t("cta.primary"), href: "/signup" },
          { label: t("cta.secondary"), href: "/book-demo", variant: "outline" },
        ],
      }}
    >
      <MarketingValueCards
        items={t.raw("valueProps") as readonly MarketingValueProp[]}
      />
      <MarketingFeatureGrid
        title={t("featuresTitle")}
        actionLabel={t("featureAction")}
        items={t.raw("features") as readonly MarketingFeature[]}
      />
    </MarketingPage>
  );
}
