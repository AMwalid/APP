import { setRequestLocale } from "next-intl/server";
import { ComingSoon } from "@/components/shared/coming-soon";

/** PAR-03 child profiles land here once the schema exists. */
export default async function ParentChildrenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ComingSoon locale={locale} sectionKey="nav.children" />;
}
