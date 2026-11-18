import { setRequestLocale } from "next-intl/server";
import { ComingSoon } from "@/components/shared/coming-soon";

/**
 * The student dashboard is not built yet.
 *
 * The route exists so `ROLE_HOME.student` points at a real page instead of a
 * 404, and so the student sidebar has an active item. It becomes the real
 * overview when the student experience lands.
 */
export default async function StudentOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ComingSoon locale={locale} sectionKey="nav.overview" />;
}
