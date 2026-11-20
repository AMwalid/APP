import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";

export type MarketingAction = {
  label: string;
  /** Locale-less; the i18n Link adds the active locale prefix. */
  href: string;
  variant?: "primary" | "outline";
};

type MarketingPageProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  /** Sits inside the hero, after the actions — e.g. the stat band. */
  heroContent?: ReactNode;
  heroActions?: readonly MarketingAction[];
  cta: {
    title: string;
    subtitle: string;
    actions: readonly MarketingAction[];
  };
  /** Omit for placeholder pages that are only a hero and a CTA. */
  children?: ReactNode;
};

function ActionLink({ action }: { action: MarketingAction }) {
  return (
    <Link
      href={action.href}
      className={buttonVariants({ variant: action.variant ?? "primary", size: "md" })}
    >
      {action.label}
    </Link>
  );
}

/**
 * Shell shared by every public marketing page.
 *
 * Recreates the prototype's centred hero (including the two soft blurred
 * orbs), the spaced content column and the tinted closing CTA band. The orbs
 * use logical insets so they swap corners with the document direction, and
 * the hero is the only place that owns a background — individual sections
 * stay neutral and composable.
 *
 * Presentational only: all copy arrives translated from the page.
 */
export function MarketingPage({
  eyebrow,
  title,
  subtitle,
  heroContent,
  heroActions,
  cta,
  children,
}: MarketingPageProps) {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-border bg-surface-muted">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -start-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -end-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
        />
        <div className="container-page relative py-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            {eyebrow ? (
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary-hover">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="text-4xl font-bold text-balance text-primary-deep md:text-5xl">
              {title}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-xl leading-relaxed text-balance text-muted-foreground">
              {subtitle}
            </p>
            {heroActions?.length ? (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {heroActions.map((action) => (
                  <ActionLink key={action.href} action={action} />
                ))}
              </div>
            ) : null}
          </div>
          {heroContent ? <div className="relative mt-10">{heroContent}</div> : null}
        </div>
      </section>

      {children ? (
        <div className="container-page py-12">
          <div className="space-y-16">{children}</div>
        </div>
      ) : null}

      <section className="container-page pb-16">
        <div className="rounded-xl bg-gradient-to-r from-primary-soft to-surface p-8 text-center shadow-header">
          <h2 className="text-3xl font-bold text-balance text-primary-deep">
            {cta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {cta.subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {cta.actions.map((action) => (
              <ActionLink key={action.href} action={action} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
