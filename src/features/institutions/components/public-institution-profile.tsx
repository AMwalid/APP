import { getTranslations } from "next-intl/server";
import { Building2, MapPin } from "lucide-react";
import { MarketingPage } from "@/components/shared/marketing-page";
import { buttonVariants } from "@/components/ui/button";
import { TeacherCard } from "@/features/teachers-directory";
import type { PublicTeacher } from "@/features/teachers-directory";
import { Link } from "@/lib/i18n/navigation";
import type { PublicInstitution } from "../types";

/**
 * A school's public directory detail (PAR-04 / INS-03).
 *
 * The school fields are the public columns from `institutions`; the teacher
 * cards come from the definer RPC that only returns directory-safe profile
 * columns. No enrollment, rating or announcement data is invented — the link is
 * the teacher's own choice of current institution.
 */
export async function PublicInstitutionProfile({
  institution,
  teachers,
}: {
  institution: PublicInstitution;
  teachers: readonly PublicTeacher[];
}) {
  const t = await getTranslations("Marketing.publicInstitutionProfile");

  return (
    <MarketingPage
      eyebrow={t("eyebrow")}
      title={institution.name}
      subtitle={t("subtitle", {
        type: institution.type,
        location: institution.location,
      })}
      heroContent={
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-sm text-primary-deep">
            <Building2 className="size-4 shrink-0" aria-hidden="true" />
            {institution.type}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            {institution.location}
          </span>
          {institution.description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {institution.description}
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("noDescription")}
            </p>
          )}
        </div>
      }
      cta={{
        title: t("ctaTitle"),
        subtitle: t("ctaSubtitle"),
        actions: [{ label: t("ctaAction"), href: "/signup" }],
      }}
    >
      <section aria-labelledby="institution-teachers" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2
            id="institution-teachers"
            className="text-2xl font-bold text-foreground"
          >
            {t("teachersTitle")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("teacherCount", { count: teachers.length })}
          </p>
        </div>

        {teachers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface-muted p-10 text-center">
            <h3 className="text-base font-semibold text-foreground">
              {t("emptyTitle")}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("emptyBody")}
            </p>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher) => (
              <li key={teacher.id}>
                <TeacherCard
                  teacher={teacher}
                  labels={{
                    viewProfile: t("viewProfile"),
                    experience: (years) =>
                      t("experience", { years }),
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex justify-center pt-2">
        <Link
          href="/institutions"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          {t("back")}
        </Link>
      </div>
    </MarketingPage>
  );
}
