import { setRequestLocale } from "next-intl/server";
import { StoreDashboardView } from "@/features/store";

/** MKT-01: the seller's create/edit/delete screen for store listings. */
export default async function StoreDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <StoreDashboardView locale={locale} />;
}
