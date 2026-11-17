import { getTranslations } from "next-intl/server";

type ComingSoonProps = {
  locale: string;
  /** Translation key for the section name, e.g. `nav.children`. */
  sectionKey: string;
};

/**
 * Placeholder body for dashboard sections that exist in the navigation but have
 * no product behind them yet.
 *
 * Keeping the route real means the sidebar never links to a 404: the shell is
 * fully clickable, and each section gains content by replacing its page body.
 */
export async function ComingSoon({ locale, sectionKey }: ComingSoonProps) {
  const t = await getTranslations({ locale, namespace: "Dashboard" });

  return (
    <div className="mx-auto max-w-xl rounded-lg border border-border bg-background p-8 text-center shadow-sm">
      <h1 className="text-xl font-bold text-foreground">{t(sectionKey)}</h1>
      <p className="mt-2 text-sm font-medium text-primary-deep">
        {t("comingSoon.title")}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {t("comingSoon.body")}
      </p>
    </div>
  );
}
