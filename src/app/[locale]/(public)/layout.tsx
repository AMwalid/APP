import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getCurrentUser } from "@/features/auth";

/**
 * The header is session-aware, so these routes must render per request rather
 * than ship a build-time snapshot of the signed-out navbar.
 */
export const dynamic = "force-dynamic";

/**
 * Marketing and public pages: the full site chrome.
 *
 * The chrome lives here rather than in the locale layout so the auth and
 * dashboard route groups can ship their own shells. Layouts compose without a
 * wrapper element, so the homepage DOM stays `header` → `div.flex-1` → `footer`
 * as direct children of the body flex column.
 *
 * The session is resolved here, at the app boundary, because components may
 * not import features. Public pages therefore render per request so the header
 * can show one Dashboard link to signed-in visitors; the dashboard group keeps
 * its own shell and guards.
 */
export default async function PublicLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <>
      <SiteHeader isAuthenticated={Boolean(user)} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  );
}
