import { setRequestLocale } from "next-intl/server";
import { AccountSettings } from "@/features/profile";

/** Account settings for a parent. The view is shared by every role. */
export default async function ParentSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AccountSettings locale={locale} />;
}
