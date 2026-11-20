import { getTranslations } from "next-intl/server";
import { MarketingPage } from "@/components/shared/marketing-page";

/**
 * Minimal placeholder page for destinations that are promised by the site
 * navigation but not built yet. It reuses the marketing shell so every stub
 * inherits the same hero, spacing and CTA treatment; only the page copy differs.
 *
 * Server component: `setRequestLocale` is called by the route page before this
 * renders, so the shared CTA strings resolve in the active locale.
 */
export async function MarketingComingSoon({ namespace }: { namespace: string }) {
  const t = await getTranslations(namespace);
  const common = await getTranslations("Marketing.comingSoon.common");

  return (
    <MarketingPage
      title={t("title")}
      subtitle={t("subtitle")}
      cta={{
        title: common("ctaTitle"),
        subtitle: common("ctaSubtitle"),
        actions: [
          { label: common("home"), href: "/" },
          { label: common("signup"), href: "/signup", variant: "outline" },
        ],
      }}
    />
  );
}
