import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MarketingPage } from "@/components/shared/marketing-page";
import {
  MarketingIconGrid,
  MarketingPillars,
  MarketingProsePanel,
  MarketingTeamGrid,
  type MarketingPillar,
  type MarketingTeamMember,
} from "@/components/shared/marketing-sections";

const NS = "Marketing.about";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });

  return { title: t("metaTitle"), description: t("subtitle") };
}

export default async function AboutPage({
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
      cta={{
        title: t("cta.title"),
        subtitle: t("cta.subtitle"),
        actions: [
          { label: t("cta.primary"), href: "/signup" },
          { label: t("cta.secondary"), href: "/book-demo", variant: "outline" },
        ],
      }}
    >
      <MarketingProsePanel
        title={t("who.title")}
        paragraphs={t.raw("who.paragraphs") as readonly string[]}
        tone="soft"
      />
      <MarketingPillars
        items={t.raw("pillars") as readonly {
          id: string;
          title: string;
          body: string;
          icon: "target" | "lightbulb";
        }[]}
      />
      <MarketingProsePanel
        title={t("name.title")}
        paragraphs={t.raw("name.paragraphs") as readonly string[]}
      />
      <MarketingProsePanel
        title={t("story.title")}
        paragraphs={t.raw("story.paragraphs") as readonly string[]}
      />
      <MarketingTeamGrid
        title={t("teamTitle")}
        items={t.raw("team") as readonly MarketingTeamMember[]}
      />
      <MarketingIconGrid
        title={t("whyTitle")}
        items={t.raw("why") as readonly MarketingPillar[]}
      />
    </MarketingPage>
  );
}
