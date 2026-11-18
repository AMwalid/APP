import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getViewer } from "@/features/profile";
import { ROLE_HOME } from "@/lib/constants/roles";

/**
 * Teacher-area guard.
 *
 * This is not a second shell: the shared `(dashboard)` layout owns the sidebar,
 * top bar and mobile nav, and its nav reads `viewer.role`. Duplicating the shell
 * here would put two sidebars on every teacher page.
 *
 * A parent or student who follows a teacher link is sent to their own
 * dashboard. The session check is cached by `getViewer`, so the guard and the
 * shell share one profile read.
 */
export default async function TeachersLayout({
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

  if (viewer.role !== "teacher") {
    redirect(`/${locale}${ROLE_HOME[viewer.role]}`);
  }

  return <>{children}</>;
}
