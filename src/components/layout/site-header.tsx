import { getTranslations } from "next-intl/server";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavActions } from "@/components/layout/nav-actions";
import { SearchButton } from "@/components/layout/search-button";
import { TopBar } from "@/components/layout/top-bar";
import { buttonVariants } from "@/components/ui/button";
import { NAV_CTAS } from "@/lib/constants/navigation";
import { Link } from "@/lib/i18n/navigation";

/**
 * Sticky site header: a dark utility bar stacked on the white main bar.
 *
 * Both tiers live inside one sticky `<header>`, so the whole block stays on
 * screen. The main bar is a three-track grid with two equal `1fr` side tracks
 * around an `auto` navigation track, so the navigation is centred on the
 * container's axis no matter how wide the brand or the action cluster are.
 * Every edge is expressed with `justify-self`, so the layout mirrors in RTL
 * without a single directional utility.
 *
 * A signed-in visitor gets one Dashboard action instead of the whole
 * login/signup/demo cluster; the session is resolved by the public layout.
 */
export async function SiteHeader({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const t = await getTranslations("Navigation");

  return (
    <header className="sticky top-0 z-header">
      <TopBar isAuthenticated={isAuthenticated} />

      <div className="border-b border-border bg-surface/95 shadow-header backdrop-blur-sm">
        <div className="container-page grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3">
          <Link
            href="/"
            aria-label={t("a11y.home")}
            className="justify-self-start text-2xl font-bold text-primary-hover transition-colors duration-150 ease-standard hover:text-primary-deep"
          >
            IBNI
          </Link>

          <DesktopNav className="justify-self-center" />

          <div className="flex items-center gap-1 justify-self-end sm:gap-2">
            <SearchButton />

            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "primary", size: "md" })}
              >
                {t("actions.dashboard")}
              </Link>
            ) : (
              <div className="hidden xl:block">
                <NavActions actions={NAV_CTAS} />
              </div>
            )}

            <MobileNav isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </header>
  );
}
