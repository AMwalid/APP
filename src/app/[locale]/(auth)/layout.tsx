import type { ReactNode } from "react";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Link } from "@/lib/i18n/navigation";

/**
 * Auth shell: brand, locale switcher, one centred card. No marketing nav and
 * no footer, so the form is the only thing on screen and the mobile page does
 * not end in a screenful of links.
 *
 * The card is centred in whatever height the body has left; because the body
 * is a flex column, a short form still sits in the middle of the viewport
 * instead of clinging to the top.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 flex-col bg-surface-muted">
      <div className="container-page flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between gap-4">
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
      </div>
    </main>
  );
}
