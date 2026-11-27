import { getTranslations } from "next-intl/server";
import { getSelectableInstitutions } from "@/features/institutions";
import { getTeacherProfile } from "../queries";
import { TeacherProfileForm } from "./teacher-profile-form";

/**
 * Teacher profile route composition.
 *
 * The page only composes: the values come from the feature's query, the school
 * list from the institutions feature, the form from this feature's components,
 * and the copy from the messages. A missing profile is not an error state — the
 * form renders with empty defaults and the action reports `notFound` on save,
 * which is the honest outcome.
 */
export async function TeacherProfileView() {
  const t = await getTranslations("Dashboard");
  const [profile, institutions] = await Promise.all([
    getTeacherProfile(),
    getSelectableInstitutions(),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-balance text-foreground">
          {t("teacherProfile.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("teacherProfile.subtitle")}
        </p>
      </header>

      <section className="rounded-lg border border-border bg-background p-5 sm:p-6">
        <TeacherProfileForm
          institutions={institutions}
          defaultValues={{
            fullName: profile?.fullName ?? "",
            specialization: profile?.specialization ?? "",
            experienceYears: profile?.experienceYears ?? "",
            bio: profile?.bio ?? "",
            currentInstitutionId: profile?.currentInstitutionId ?? "",
          }}
        />
      </section>
    </div>
  );
}
