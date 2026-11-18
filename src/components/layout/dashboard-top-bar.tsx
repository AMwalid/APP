import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

type DashboardTopBarProps = {
  locale: string;
  email: string;
  /**
   * The profile's full name, or null when the user has not set one.
   *
   * Passed in rather than read here: `components/` may not import `features/`,
   * and the layout already has the profile for this request.
   */
  name: string | null;
  /**
   * The account controls, passed in rather than imported.
   *
   * `components/` may not import `features/` (the boundary rule), and sign-out
   * is a Server Action owned by the auth feature. The layout, which is allowed
   * to import features, supplies the form.
   */
  actions: ReactNode;
};

/**
 * Top bar of the dashboard shell: identity on the end edge, page content below.
 *
 * The start edge is deliberately empty — pages own their own heading, so there
 * is nothing to duplicate here until breadcrumbs arrive.
 *
 * Two identity states, not one. With a name, the bar greets the person. Without
 * one — a brand-new account, or a profile the trigger has not filled — greeting
 * an email address would read worse than the plain "signed in as" label, so the
 * label stays. The email is the tooltip either way, which is where a long
 * address belongs.
 *
 * The locale is a prop, not ambient: reading it from the request store inside a
 * nested component is the kind of implicit dependency that silently falls back
 * to Arabic when the header is missing.
 */
export async function DashboardTopBar({
  locale,
  email,
  name,
  actions,
}: DashboardTopBarProps) {
  const t = await getTranslations({ locale, namespace: "Dashboard" });

  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-3 border-b border-border bg-background px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        {name ? (
          <span
            className="max-w-[16rem] truncate text-sm font-medium text-foreground"
            title={email}
          >
            {t("shell.greeting", { name })}
          </span>
        ) : (
          <>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {t("shell.signedInAs")}
            </span>
            <span
              className="max-w-[14rem] truncate text-sm font-medium text-foreground"
              title={email}
            >
              {email}
            </span>
          </>
        )}
      </div>
      {actions}
    </header>
  );
}
