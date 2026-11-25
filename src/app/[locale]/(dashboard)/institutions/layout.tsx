import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getViewer } from "@/features/profile";
import { ROLE_HOME } from "@/lib/constants/roles";

/**
 * Institution-admin area guard.
 *
 * The shell already checks the session; this layout additionally requires the
 * verified `institution_admin` role. Other roles are sent to their own dashboard.
 */
export default async function InstitutionsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const viewer = await getViewer();

  if (!viewer) {
    redirect(`/${locale}/login`);
  }

  if (viewer.role !== "institution_admin") {
    redirect(`/${locale}${ROLE_HOME[viewer.role]}`);
  }

  return <>{children}</>;
}
