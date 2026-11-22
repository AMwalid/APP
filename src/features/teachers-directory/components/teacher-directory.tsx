import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PublicTeacher } from "../types";
import { TeacherCard } from "./teacher-card";

type TeacherDirectoryProps = {
  teachers: readonly PublicTeacher[];
  specialties: readonly string[];
  needle: string;
  specialty: string;
  labels: {
    heading: string;
    searchLabel: string;
    searchPlaceholder: string;
    specialtyLabel: string;
    specialtyAll: string;
    submit: string;
    resultCount: (count: number) => string;
    empty: string;
    viewProfile: string;
    experience: (years: number) => string;
  };
};

/**
 * Search form + results grid for the public teacher directory.
 *
 * A plain GET form: the query is in the URL, results render on the server, and
 * no client JavaScript is needed to filter. The select is native so it keeps
 * the browser's keyboard and screen-reader behaviour; styling uses the same
 * tokens as `Input`.
 */
export function TeacherDirectory({
  teachers,
  specialties,
  needle,
  specialty,
  labels,
}: TeacherDirectoryProps) {
  return (
    <section aria-labelledby="teacher-directory-heading" className="space-y-8">
      <h2 id="teacher-directory-heading" className="sr-only">
        {labels.heading}
      </h2>

      <form
        method="get"
        className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1 space-y-2">
          <label
            htmlFor="teacher-search"
            className="block text-sm font-medium text-foreground"
          >
            {labels.searchLabel}
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="teacher-search"
              name="q"
              type="search"
              defaultValue={needle}
              placeholder={labels.searchPlaceholder}
              className="ps-9"
            />
          </div>
        </div>

        <div className="space-y-2 sm:w-56">
          <label
            htmlFor="teacher-specialty"
            className="block text-sm font-medium text-foreground"
          >
            {labels.specialtyLabel}
          </label>
          <select
            id="teacher-specialty"
            name="specialty"
            defaultValue={specialty}
            className="h-10 w-full rounded-control border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors duration-150 ease-standard"
          >
            <option value="">{labels.specialtyAll}</option>
            {specialties.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" size="md">
          {labels.submit}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground" role="status">
        {labels.resultCount(teachers.length)}
      </p>

      {teachers.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              labels={{
                viewProfile: labels.viewProfile,
                experience: labels.experience,
              }}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-surface-muted p-10 text-center text-muted-foreground">
          {labels.empty}
        </p>
      )}
    </section>
  );
}
