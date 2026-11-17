import { setRequestLocale } from "next-intl/server";
import { ComingSoon } from "@/components/shared/coming-soon";

/** Account and notification settings land here. */
export default async function ParentSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ComingSoon locale={locale} sectionKey="nav.settings" />;
}
