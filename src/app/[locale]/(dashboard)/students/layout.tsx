import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getViewer } from "@/features/profile";
import { ROLE_HOME } from "@/lib/constants/roles";

/**
 * Student-area guard.
 *
 * The student dashboard is still a placeholder, but the route is real and the
 * role is selectable, so it gets the same boundary as the other two areas: a
 * parent or teacher who lands here is sent to their own dashboard, not left on
 * a page that will never belong to them.
 */
export default async function StudentsLayout({
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

  if (viewer.role !== "student") {
    redirect(`/${locale}${ROLE_HOME[viewer.role]}`);
  }

  return <>{children}</>;
}
