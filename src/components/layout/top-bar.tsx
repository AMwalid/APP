import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { NAV_LOGIN, NAV_TOP_LINKS } from "@/lib/constants/navigation";
import { Link } from "@/lib/i18n/navigation";

/**
 * Dark utility bar above the main navigation.
 *
 * Quick links sit on the start edge and the account utilities on the end edge,
 * so the whole strip mirrors with the document direction. It is hidden below
 * `md`; the mobile sheet carries the same links.
 */
export async function TopBar({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const t = await getTranslations("Navigation");

  return (
    <div className="hidden bg-primary-deep text-primary-foreground md:block">
      <div className="container-page flex h-9 items-center justify-between gap-4">
        <nav aria-label={t("a11y.utilityNav")}>
          <ul className="flex items-center gap-5">
            {NAV_TOP_LINKS.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className="text-xs text-primary-foreground/80 transition-colors duration-150 ease-standard hover:text-primary-foreground"
                >
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher tone="dark" />

          {isAuthenticated ? null : (
            <>
              <span
                aria-hidden
                className="h-3 w-px bg-primary-foreground/25"
              />

              <Link
                href={NAV_LOGIN.href}
                className="text-xs font-medium text-primary-foreground/80 transition-colors duration-150 ease-standard hover:text-primary-foreground"
              >
                {t(NAV_LOGIN.labelKey)}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
