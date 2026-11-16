import { ArrowRight, type LucideIcon } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";

type AudienceCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  learnMore: string;
};

/**
 * One audience card: icon, title, description and a "learn more" link.
 *
 * The card is a flex column with `h-full`, and the link uses `mt-auto`, so a
 * row of cards keeps every link on the same baseline no matter how long the
 * descriptions run — which matters most in Arabic and French.
 *
 * The arrow is mirrored with the `rtl:` variant instead of a locale check, so
 * it points along the reading direction without any JavaScript.
 */
export function AudienceCard({
  icon: Icon,
  title,
  description,
  href,
  learnMore,
}: AudienceCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-control border border-border bg-surface p-6 shadow-header transition-shadow duration-150 ease-standard hover:shadow-panel">
      <span className="inline-flex size-11 items-center justify-center rounded-control bg-primary-soft text-primary-hover">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-primary-deep">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <Link
        href={href}
        aria-label={`${learnMore} — ${title}`}
        className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-primary-hover transition-colors duration-150 ease-standard hover:text-primary-deep"
      >
        {learnMore}
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform duration-150 ease-standard group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
        />
      </Link>
    </article>
  );
}
