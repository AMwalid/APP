import { getTranslations } from "next-intl/server";
import { Briefcase, GraduationCap } from "lucide-react";
import { MarketingPage } from "@/components/shared/marketing-page";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import type { PublicTeacher } from "../types";

/**
 * A teacher's public CV.
 *
 * Reuses the marketing shell so the hero geometry, spacing and closing CTA are
 * shared with the rest of the public site. The prototype's cover photo, stars,
 * courses, reviews and contact details are gone: none of them exist in the
 * database, and contact details should not be public. The overlapping avatar
 * and the about/experience card layout are kept using semantic tokens.
 */
export async function PublicTeacherProfile({
  teacher,
}: {
  teacher: PublicTeacher;
}) {
  const t = await getTranslations("Marketing.publicTeacherProfile");

  return (
    <MarketingPage
      eyebrow={t("eyebrow")}
      title={teacher.fullName}
      subtitle={teacher.specialization || t("noSpecialization")}
      heroContent={
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
          <div
            aria-hidden="true"
            className="grid size-24 place-items-center rounded-2xl border-4 border-background bg-primary-soft text-2xl font-bold text-primary-deep shadow-header"
          >
            {teacher.initials}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-primary-deep">
            {teacher.specialization ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5">
                <GraduationCap className="size-4 shrink-0" aria-hidden="true" />
                {teacher.specialization}
              </span>
            ) : null}
            {teacher.experienceYears !== null ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5">
                <Briefcase className="size-4 shrink-0" aria-hidden="true" />
                {t("experience", { years: teacher.experienceYears })}
              </span>
            ) : null}
          </div>
        </div>
      }
      cta={{
        title: t("ctaTitle"),
        subtitle: t("ctaSubtitle"),
        actions: [{ label: t("ctaAction"), href: "/signup" }],
      }}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-xl font-bold text-foreground">
              {t("aboutTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {teacher.bio || t("noBio")}
            </p>
          </section>

          <section className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-xl font-bold text-foreground">
              {t("specializationTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {teacher.specialization || t("noSpecialization")}
            </p>
          </section>

          <section className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-xl font-bold text-foreground">
              {t("experienceTitle")}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {teacher.experienceYears !== null
                ? t("experience", { years: teacher.experienceYears })
                : t("noExperience")}
            </p>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border border-border bg-background p-6">
            <h2 className="text-lg font-bold text-foreground">
              {t("contactTitle")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("contactBody")}
            </p>
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "md" }), "mt-5 w-full")}
            >
              {t("contactCta")}
            </Link>
          </section>

          <Link
            href="/teachers"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            {t("back")}
          </Link>
        </aside>
      </div>
    </MarketingPage>
  );
}
