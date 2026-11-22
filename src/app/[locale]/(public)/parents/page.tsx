import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroSearchForm } from "@/components/shared/hero-search-form";
import { MarketingPage } from "@/components/shared/marketing-page";
import {
  MarketingFeatureGrid,
  MarketingStatBand,
  MarketingTestimonials,
  MarketingValueCards,
  type MarketingFeature,
  type MarketingStat,
  type MarketingTestimonial,
  type MarketingValueProp,
} from "@/components/shared/marketing-sections";

const NS = "Marketing.parents";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });

  return { title: t("metaTitle"), description: t("subtitle") };
}

export default async function ParentsPage({
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
      heroContent={
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8">
          <HeroSearchForm
            id="parents-search"
            action={`/${locale}/institutions`}
            label={t("searchLabel")}
            placeholder={t("searchPlaceholder")}
            buttonLabel={t("searchButton")}
          />
          <MarketingStatBand items={t.raw("stats") as readonly MarketingStat[]} />
        </div>
      }
      heroActions={[
        { label: t("heroPrimary"), href: "/parents/overview" },
        { label: t("heroSecondary"), href: "/parents/my-courses", variant: "outline" },
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
      <MarketingTestimonials
        title={t("testimonialsTitle")}
        items={t.raw("testimonials") as readonly MarketingTestimonial[]}
      />
      <MarketingFeatureGrid
        title={t("featuresTitle")}
        actionLabel={t("featureAction")}
        items={t.raw("features") as readonly MarketingFeature[]}
      />
    </MarketingPage>
  );
}
