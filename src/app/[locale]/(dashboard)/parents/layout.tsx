import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getViewer } from "@/features/profile";
import { ROLE_HOME } from "@/lib/constants/roles";

/**
 * Parent-area guard.
 *
 * The shell already renders the sidebar and top bar; this layout only enforces
 * the boundary. A teacher or student who follows a parent link is sent to their
 * own dashboard instead of seeing a page that was not built for them.
 *
 * The session check repeats the root layout's on purpose: `getViewer` is cached
 * per request, so it costs nothing, and the guard stays correct if the parent
 * subtree is ever rendered without the root layout.
 */
export default async function ParentsLayout({
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

  if (viewer.role !== "parent") {
    redirect(`/${locale}${ROLE_HOME[viewer.role]}`);
  }

  return <>{children}</>;
}
