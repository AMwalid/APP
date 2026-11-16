import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { FOOTER_COLUMNS } from "@/lib/constants/footer";
import { Link } from "@/lib/i18n/navigation";

/**
 * Global footer, rendered by the locale layout on every page.
 *
 * The three link groups are separate `<nav>` landmarks, each named by its own
 * heading, so assistive technology can tell "Product navigation" from "Legal
 * navigation". Lists carry `role="list"` because Tailwind's preflight removes
 * the list styling that Safari/VoiceOver relies on to keep list semantics.
 *
 * Muted text uses `primary-foreground/80`, not `/70`: at 70% the blend over
 * `primary-deep` measures 4.34:1, below the 4.5:1 floor for normal text, while
 * 80% measures 5.14:1.
 *
 * The copyright year is evaluated at build time on this static route, so it
 * ships in the HTML with no client JavaScript and no hydration mismatch.
 */
export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-deep text-primary-foreground">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block text-2xl font-bold">
              IBNI
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-foreground/80">
              {t("description")}
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.id} aria-labelledby={`footer-${column.id}`}>
              <h2
                id={`footer-${column.id}`}
                className="text-sm font-semibold tracking-wide"
              >
                {t(column.headingKey)}
              </h2>
              <ul role="list" className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/80 transition-colors duration-150 ease-standard hover:text-primary-foreground"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-primary-foreground/15 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-primary-foreground/80">
            {t("copyright", { year })}
          </p>
          <LocaleSwitcher tone="dark" />
        </div>
      </div>
    </footer>
  );
}
