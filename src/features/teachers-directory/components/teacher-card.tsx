import { Briefcase, GraduationCap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import type { PublicTeacher } from "../types";

type TeacherCardProps = {
  teacher: PublicTeacher;
  labels: {
    viewProfile: string;
    experience: (years: number) => string;
  };
};

/**
 * One teacher in the public directory.
 *
 * The prototype's card had a cover photo, star rating, location, favourite and
 * compare controls. None of that data exists in `profiles`, so the geometry is
 * kept — cover band, overlapping avatar, name, meta row, subject chips, footer
 * action — while the fabricated parts are left out. The avatar is initials only.
 */
export function TeacherCard({ teacher, labels }: TeacherCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-background shadow-header transition-shadow duration-150 ease-standard hover:shadow-lg">
      <div
        aria-hidden="true"
        className="h-28 bg-gradient-to-r from-primary-soft to-surface"
      />

      <div className="px-5 pb-5">
        <div className="-mt-10 mb-3 flex items-end justify-between gap-3">
          <span
            aria-hidden="true"
            className="grid size-20 shrink-0 place-items-center rounded-xl border-4 border-background bg-primary-soft text-xl font-bold text-primary-deep shadow-header"
          >
            {teacher.initials}
          </span>

          {teacher.experienceYears !== null ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 text-xs font-medium text-primary-deep">
              <Briefcase className="size-3.5 shrink-0" aria-hidden="true" />
              {labels.experience(teacher.experienceYears)}
            </span>
          ) : null}
        </div>

        <h3 className="text-xl font-bold text-foreground">{teacher.fullName}</h3>

        {teacher.specialization ? (
          <p className="mt-1 flex items-start gap-1.5 text-sm leading-relaxed text-muted-foreground">
            <GraduationCap className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{teacher.specialization}</span>
          </p>
        ) : null}

        {teacher.subjects.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label={teacher.specialization}>
            {teacher.subjects.map((subject) => (
              <li
                key={subject}
                className="rounded-full border border-border bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-deep"
              >
                {subject}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5 border-t border-border pt-4">
          <Link
            href={`/teachers/${teacher.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
          >
            {labels.viewProfile}
          </Link>
        </div>
      </div>
    </article>
  );
}
