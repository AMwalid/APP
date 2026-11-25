import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MarketingPage } from "@/components/shared/marketing-page";
import { ProductDirectory, getPublicProducts } from "@/features/store";

const NS = "Marketing.store";
const DIRECTORY_NS = "Marketing.storeDirectory";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });

  return { title: t("metaTitle"), description: t("subtitle") };
}

/** Search state lives in the URL, like the institution directory. */
type SearchParams = Promise<{ q?: string | string[] }>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export default async function StorePage({
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
  const products = await getPublicProducts(needle);

  return (
    <MarketingPage
      title={t("title")}
      subtitle={t("subtitle")}
      heroActions={[
        { label: t("heroPrimary"), href: "/signup", variant: "outline" },
        { label: t("heroSecondary"), href: "/teachers" },
      ]}
      heroSearch={{
        id: "store-hero-search",
        action: `/${locale}/store`,
        label: directory("searchLabel"),
        placeholder: directory("searchPlaceholder"),
        buttonLabel: directory("submit"),
        defaultValue: needle,
      }}
      cta={{
        title: t("cta.title"),
        subtitle: t("cta.subtitle"),
        actions: [
          { label: t("cta.primary"), href: "/signup" },
          { label: t("cta.secondary"), href: "/book-demo", variant: "outline" },
        ],
      }}
    >
      <ProductDirectory
        products={products}
        needle={needle}
        locale={locale}
        labels={{
          heading: directory("heading"),
          searchLabel: directory("searchLabel"),
          searchPlaceholder: directory("searchPlaceholder"),
          submit: directory("submit"),
          resultCount: (count) => directory("resultCount", { count }),
          empty: directory("empty"),
          type: (type) =>
            type === "Course"
              ? directory("typeCourse")
              : type === "Book"
                ? directory("typeBook")
                : directory("typeSupply"),
          soldBy: directory("soldBy"),
        }}
      />
    </MarketingPage>
  );
}
