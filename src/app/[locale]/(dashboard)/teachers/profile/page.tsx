import { setRequestLocale } from "next-intl/server";
import { ComingSoon } from "@/components/shared/coming-soon";

/** TCH-01 CV-style teacher profile lands here. */
export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ComingSoon locale={locale} sectionKey="nav.profile" />;
}
