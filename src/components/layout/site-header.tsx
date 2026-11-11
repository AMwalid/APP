import { getTranslations } from "next-intl/server";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavActions } from "@/components/layout/nav-actions";
import { Link } from "@/lib/i18n/navigation";

/**
 * Sticky site header: brand, desktop navigation, locale switcher, account
 * actions, and the mobile sheet trigger. Rendered once in the locale layout.
 */
export async function SiteHeader() {
  const t = await getTranslations("Navigation");

  return (
    <header className="sticky top-0 z-header border-b border-border bg-background/95 shadow-header backdrop-blur-sm">
      <div className="container-page flex h-[var(--header-height)] items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={t("a11y.home")}
          className="text-2xl font-bold text-primary-hover transition-colors duration-150 ease-standard hover:text-primary-deep"
        >
          IBNI
        </Link>

        <DesktopNav />

        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher />
          <NavActions />
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
