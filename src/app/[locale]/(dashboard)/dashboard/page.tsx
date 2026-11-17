import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { getCurrentUser, signOut } from "@/features/auth";

/**
 * Placeholder dashboard.
 *
 * It exists to prove the protected route works end to end: the middleware
 * redirects here, the session cookie survives the round trip, and the page
 * re-checks the user on the server before rendering anything (defence in depth,
 * ARCHITECTURE §7). Real dashboards replace it.
 */
export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations({ locale, namespace: "Auth" });

  return (
    <main className="flex flex-1 flex-col bg-surface-muted">
      <div className="container-page flex flex-1 items-center justify-center py-12">
        <section className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-balance text-foreground">
            {t("Dashboard.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("Dashboard.signedInAs")}
          </p>
          <p className="mt-1 text-sm font-medium break-all text-foreground">
            {user.email}
          </p>
          <form action={signOut} className="mt-6">
            <Button type="submit" variant="outline" size="md" className="w-full">
              {t("Dashboard.signOut")}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
