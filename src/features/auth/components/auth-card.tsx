import type { ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  /** Question above the switch link, e.g. "Don't have an account?" */
  footerText: string;
  /** Label of the switch link, e.g. "Sign up". */
  footerLinkLabel: string;
  footerHref: string;
};

/**
 * Frame shared by the login and signup forms.
 *
 * Presentational only: every string arrives already translated, so this stays
 * a plain component and never needs the request locale itself. The footer link
 * is structured rather than a free node so both pages get the same styling and
 * the same locale-aware `Link`.
 */
export function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkLabel,
  footerHref,
}: AuthCardProps) {
  return (
    <section className="rounded-lg bg-background p-8 shadow-panel sm:p-10">
      <h1 className="text-3xl font-bold text-balance text-foreground">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {subtitle}
      </p>
      <div className="mt-8">{children}</div>
      <p className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-border pt-6 text-sm text-muted-foreground">
        {footerText}{" "}
        <Link
          href={footerHref}
          className="font-semibold text-primary-hover underline-offset-4 hover:underline"
        >
          {footerLinkLabel}
        </Link>
      </p>
    </section>
  );
}
