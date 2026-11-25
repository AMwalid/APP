import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getViewer } from "@/features/profile";
import { ROLE_HOME } from "@/lib/constants/roles";

/**
 * Seller-area guard for the shared store dashboard.
 *
 * Teachers and verified institution admins both sell on IBNI, so this page lives
 * at `/dashboard/store` instead of duplicating a section under each role. The
 * shell already checks the session; this layout checks which kind of account
 * may manage listings.
 */
export default async function StoreDashboardLayout({
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

  if (viewer.role !== "teacher" && viewer.role !== "institution_admin") {
    redirect(`/${locale}${ROLE_HOME[viewer.role]}`);
  }

  return <>{children}</>;
}
