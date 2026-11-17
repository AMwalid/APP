import { getTranslations, setRequestLocale } from "next-intl/server";

/**
 * Landing page after login.
 *
 * Deliberately thin: the shell owns identity and sign-out, so this is just a
 * welcome. It becomes the role-based router once accounts carry a role — the
 * parent dashboard lives at `/parents/overview`.
 *
 * No session check here: the dashboard layout already redirects signed-out
 * visitors, and repeating the Supabase round trip would only add latency.
 */
export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Dashboard" });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-balance text-foreground">
        {t("welcome.title")}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {t("welcome.subtitle")}
      </p>
    </div>
  );
}
