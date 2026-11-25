import { setRequestLocale } from "next-intl/server";
import { InstitutionProfileView } from "@/features/institutions";

/** INS-03: the institution admin's editable public profile. */
export default async function InstitutionDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <InstitutionProfileView />;
}
