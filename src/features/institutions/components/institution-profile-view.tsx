import { getTranslations } from "next-intl/server";
import { getOwnInstitution } from "../queries";
import { InstitutionProfileForm } from "./institution-profile-form";

/** The editable public-profile section of `/institutions/dashboard`. */
export async function InstitutionProfileView() {
  const t = await getTranslations("Dashboard");
  const institution = await getOwnInstitution();

  return (
    <section
      aria-labelledby="institution-profile-title"
      className="mx-auto max-w-2xl rounded-xl border border-border bg-background p-6 shadow-sm"
    >
      <h2
        id="institution-profile-title"
        className="text-lg font-semibold text-foreground"
      >
        {t("institutionProfile.title")}
      </h2>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {t("institutionProfile.subtitle")}
      </p>

      <div className="mt-5">
        <InstitutionProfileForm
          defaultValues={
            institution ?? {
              name: "",
              type: "School",
              location: "",
              description: "",
            }
          }
        />
      </div>
    </section>
  );
}
