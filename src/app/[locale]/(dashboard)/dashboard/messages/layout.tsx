import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getProfile } from "@/features/profile";
import { ROLE_HOME } from "@/lib/constants/roles";

const CAN_MESSAGE = new Set(["parent", "teacher", "institution_admin"]);

/**
 * Guard for the shared direct-messaging inbox.
 *
 * Parents, teachers and institution staff all message from one route, so the
 * section lives under `/dashboard` rather than being duplicated per role. The
 * shell already checks the session; this layout checks the real profile role.
 */
export default async function MessagesDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = await getProfile();

  if (!profile) {
    redirect(`/${locale}/login?next=%2Fdashboard%2Fmessages`);
  }

  if (!CAN_MESSAGE.has(profile.role)) {
    redirect(`/${locale}${ROLE_HOME[profile.role]}`);
  }

  return <>{children}</>;
}
