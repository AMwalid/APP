import { Building2, MapPin } from "lucide-react";

type InstitutionCardProps = {
  name: string;
  type: string;
  location: string;
  description: string | null;
};

/** One public directory result. No links yet: detail pages are out of scope. */
export function InstitutionCard({
  name,
  type,
  location,
  description,
}: InstitutionCardProps) {
  return (
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
    </article>
  );
}
