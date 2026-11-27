import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PublicInstitution } from "../types";
import { InstitutionCard } from "./institution-card";

type InstitutionDirectoryProps = {
  institutions: readonly PublicInstitution[];
  needle: string;
  labels: {
    heading: string;
    searchLabel: string;
    searchPlaceholder: string;
    submit: string;
    resultCount: (count: number) => string;
    empty: string;
    viewProfile: string;
  };
};

/** Search + results for the public institution directory. */
export function InstitutionDirectory({
  institutions,
  needle,
  labels,
}: InstitutionDirectoryProps) {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {labels.heading}
        </h2>
        <p className="text-sm text-muted-foreground">
          {labels.resultCount(institutions.length)}
        </p>
      </div>

      <form role="search" method="get" className="mx-auto flex max-w-2xl flex-col gap-2 sm:flex-row">
        <label htmlFor="institution-directory-search" className="sr-only">
          {labels.searchLabel}
        </label>
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="institution-directory-search"
            name="q"
            type="search"
            defaultValue={needle}
            placeholder={labels.searchPlaceholder}
            className="ps-9"
          />
        </div>
        <Button type="submit">{labels.submit}</Button>
      </form>

      {institutions.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-surface-muted p-10 text-center text-sm text-muted-foreground">
          {labels.empty}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {institutions.map((institution) => (
            <InstitutionCard
              key={institution.id}
              id={institution.id}
              name={institution.name}
              type={institution.type}
              location={institution.location}
              description={institution.description}
              viewProfileLabel={labels.viewProfile}
            />
          ))}
        </div>
      )}
    </section>
  );
}
