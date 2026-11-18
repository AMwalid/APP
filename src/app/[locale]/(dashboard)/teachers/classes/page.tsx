import { setRequestLocale } from "next-intl/server";
import { ComingSoon } from "@/components/shared/coming-soon";

/** TCH-02 class management lands here. */
export default async function TeacherClassesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ComingSoon locale={locale} sectionKey="nav.classes" />;
}
