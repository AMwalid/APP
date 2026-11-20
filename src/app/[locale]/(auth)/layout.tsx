import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Link } from "@/lib/i18n/navigation";

/**
 * Two-pane auth shell.
 *
 * DOM order is the layout: the form pane is first, the decorative pane second.
 * The document direction (set on <html> from the locale) then puts the form on
 * the right in Arabic and on the left in French/English — without order-*
 * utilities or a direction check here.
 *
 * No marketing nav or footer: the form is the only thing on screen. The
 * decorative pane is hidden below `lg`, so mobile gets a single centred pane.
 */
export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getTranslations("Auth");

  return (
    <main className="flex min-h-screen flex-1">
      {/* Start side — right in AR, left in FR/EN. */}
      <section className="flex flex-1 items-center justify-center bg-surface-muted px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link
              href="/"
              className="text-2xl font-bold text-primary-deep"
            >
              IBNI
            </Link>
            <LocaleSwitcher />
          </div>
          {children}
        </div>
      </section>

      {/* End side — left in AR, right in FR/EN. */}
      <aside className="relative hidden w-1/2 shrink-0 flex-col justify-between overflow-hidden bg-primary-deep p-12 text-primary-foreground lg:flex">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute -start-24 -top-24 size-80 rounded-full border border-primary-foreground/10" />
          <span className="absolute -start-16 -top-16 size-64 rounded-full border border-primary-foreground/10" />
          <span className="absolute -end-20 bottom-8 size-72 rotate-45 rounded-3xl border border-primary-foreground/10" />
          <span className="absolute end-16 top-1/3 size-40 rounded-full bg-primary-foreground/5" />
          <span className="absolute start-1/4 bottom-1/4 size-24 rotate-45 rounded-lg border border-primary-foreground/10" />
        </div>

        <span className="relative text-sm font-semibold tracking-[0.2em] uppercase">
          IBNI
        </span>

        <blockquote className="relative max-w-md text-3xl font-semibold leading-snug text-balance">
          {t("panel.quote")}
        </blockquote>

        <span aria-hidden="true" className="relative h-px w-16 bg-primary-foreground/30" />
      </aside>
    </main>
  );
}
