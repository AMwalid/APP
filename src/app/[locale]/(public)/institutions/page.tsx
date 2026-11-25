import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MarketingPage } from "@/components/shared/marketing-page";
import {
  MarketingFeatureGrid,
  MarketingValueCards,
  type MarketingFeature,
  type MarketingValueProp,
} from "@/components/shared/marketing-sections";
import { InstitutionDirectory, getPublicInstitutions } from "@/features/institutions";

const NS = "Marketing.institutions";
const DIRECTORY_NS = "Marketing.institutionDirectory";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });

  return { title: t("metaTitle"), description: t("subtitle") };
}

/** Search state lives in the URL, like the teacher directory. */
type SearchParams = Promise<{ q?: string | string[] }>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export default async function InstitutionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations(NS);
  const directory = await getTranslations(DIRECTORY_NS);
  const { q } = await searchParams;
  const needle = first(q);
  const institutions = await getPublicInstitutions(needle);

  return (
    <MarketingPage
      title={t("title")}
      subtitle={t("subtitle")}
      heroActions={[
        { label: t("heroPrimary"), href: "/book-demo" },
        { label: t("heroSecondary"), href: "/signup", variant: "outline" },
      ]}
      heroSearch={{
        id: "institution-hero-search",
        action: `/${locale}/institutions`,
        label: directory("searchLabel"),
        placeholder: directory("searchPlaceholder"),
        buttonLabel: directory("submit"),
        defaultValue: needle,
      }}
      cta={{
        title: t("cta.title"),
        subtitle: t("cta.subtitle"),
        actions: [
          { label: t("cta.primary"), href: "/book-demo" },
          { label: t("cta.secondary"), href: "/signup", variant: "outline" },
        ],
      }}
    >
      <InstitutionDirectory
        institutions={institutions}
        needle={needle}
        labels={{
          heading: directory("heading"),
          searchLabel: directory("searchLabel"),
          searchPlaceholder: directory("searchPlaceholder"),
          submit: directory("submit"),
          resultCount: (count) => directory("resultCount", { count }),
          empty: directory("empty"),
        }}
      />
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
