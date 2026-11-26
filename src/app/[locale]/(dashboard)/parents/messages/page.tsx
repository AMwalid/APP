import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

/** PAR-06 now lives at the shared `/dashboard/messages` inbox. */
export default async function ParentMessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  redirect(`/${locale}/dashboard/messages`);
}
