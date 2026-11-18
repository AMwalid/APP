import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  DashboardMobileNav,
  DashboardSidebarNav,
} from "@/components/layout/dashboard-nav";
import { DashboardTopBar } from "@/components/layout/dashboard-top-bar";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth";
import { getViewer } from "@/features/profile";
import { Link } from "@/lib/i18n/navigation";

/**
 * Shell for every signed-in route.
 *
 * The layout checks the session again rather than trusting the middleware: the
 * middleware protects by URL prefix, and a page added under `(dashboard)` but
 * missing from `PROTECTED_PREFIXES` would otherwise render for anyone. One
 * `getViewer()` here covers the whole subtree, so pages can assume a user.
 *
 * The nav is chosen from the viewer's role, and the section layouts
 * (`parents/`, `teachers/`, `students/`) are the guards that keep the role and
 * the URL in agreement. The shell itself stays role-agnostic.
 *
 * Sidebar on the start edge, content on the end edge. `border-e` is the only
 * directional border in the shell, so it mirrors in Arabic without a single
 * `left`/`right`.
 */
export default async function DashboardLayout({
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

  // The profile read is part of `getViewer`, so the name in the top bar costs
  // no extra token verification.
  const t = await getTranslations({ locale, namespace: "Dashboard" });

  return (
    <div className="flex flex-1">
      <aside className="hidden w-64 shrink-0 flex-col border-e border-border bg-surface lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Link href="/" className="text-xl font-bold text-primary-deep">
            IBNI
          </Link>
        </div>
        <DashboardSidebarNav role={viewer.role} />
        <div className="border-t border-border p-3">
          <LocaleSwitcher />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopBar
          locale={locale}
          email={viewer.email ?? ""}
          name={viewer.fullName}
          actions={
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                {t("shell.signOut")}
              </Button>
            </form>
          }
        />
        <DashboardMobileNav role={viewer.role} />
        <main className="flex-1 bg-surface-muted px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
