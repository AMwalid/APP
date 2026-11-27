import { ArrowRight, Building2, MapPin } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";

type InstitutionCardProps = {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string | null;
  viewProfileLabel: string;
};

/**
 * One public directory result.
 *
 * The whole card is a link because it has no other interactive controls. The
 * visible footer makes the detail route discoverable; the accessible name comes
 * from the school name, type and location already inside the card, so the label
 * does not need to be repeated on the link.
 */
export function InstitutionCard({
  id,
  name,
  type,
  location,
  description,
  viewProfileLabel,
}: InstitutionCardProps) {
  return (
    <Link
      href={`/institutions/${id}`}
      className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <article className="flex h-full flex-col rounded-xl border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">{type}</p>
          </div>
        </div>
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          <span>{location}</span>
        </p>
        {description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
        <span className="mt-5 inline-flex items-center gap-1.5 border-t border-border pt-4 text-sm font-semibold text-primary-hover transition-colors duration-150 ease-standard">
          {viewProfileLabel}
          <ArrowRight className="size-4 shrink-0 rtl:rotate-180" aria-hidden="true" />
        </span>
      </article>
    </Link>
  );
}
