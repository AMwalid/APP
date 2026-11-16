import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

/**
 * Marketing and public pages: the full site chrome.
 *
 * The chrome lives here rather than in the locale layout so the auth and
 * dashboard route groups can ship their own shells. Layouts compose without a
 * wrapper element, so the homepage DOM stays `header` → `div.flex-1` → `footer`
 * as direct children of the body flex column.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  );
}
