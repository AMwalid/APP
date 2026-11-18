import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getViewer } from "@/features/profile";
import { ROLE_HOME } from "@/lib/constants/roles";

/**
 * The role resolver.
 *
 * Every entry point — password login, signup with an immediate session, the
 * email-confirmation callback, and a direct visit — lands here, so this is the
 * one place that has to know where a role belongs. Doing it in the login action
 * would need a second profile read after the session cookie is written and
 * would leave signup and the callback to duplicate the same mapping.
 *
 * `redirect` throws, so nothing below it renders and there is no flash of a
 * generic page. The section guards catch a deep link that points at another
 * role's area; this page only handles "I just signed in, where do I go?".
 */
export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const viewer = await getViewer();

  if (!viewer) {
    redirect(`/${locale}/login`);
  }

  redirect(`/${locale}${ROLE_HOME[viewer.role]}`);
}
