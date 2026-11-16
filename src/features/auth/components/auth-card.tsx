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
    <section className="rounded-lg border border-border bg-background p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-balance text-foreground">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {subtitle}
      </p>
      <div className="mt-6">{children}</div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {footerText}{" "}
        <Link
          href={footerHref}
          className="font-medium text-primary-hover underline-offset-4 hover:underline"
        >
          {footerLinkLabel}
        </Link>
      </p>
    </section>
  );
}
