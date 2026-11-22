import { getTranslations } from "next-intl/server";
import { HeroSearchForm } from "@/components/shared/hero-search-form";

/**
 * Homepage hero search.
 *
 * Submits to the public teacher directory in the active locale. The locale is
 * passed in from `HeroContent` (which already resolves it for the headline) so
 * the form never falls back to the default locale the way a bare `/teachers`
 * action would under `localePrefix: "always"`.
 */
export async function HeroSearch({ locale }: { locale: string }) {
  const t = await getTranslations("Home.Hero");

  return (
    <HeroSearchForm
      id="hero-search"
      action={`/${locale}/teachers`}
      label={t("searchLabel")}
      placeholder={t("searchPlaceholder")}
      buttonLabel={t("searchButton")}
    />
  );
}
