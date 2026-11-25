import { getTranslations } from "next-intl/server";
import { getOwnInstitution } from "../queries";
import { InstitutionProfileForm } from "./institution-profile-form";

/** Composition for `/institutions/dashboard`. */
export async function InstitutionProfileView() {
  const t = await getTranslations("Dashboard");
  const institution = await getOwnInstitution();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-balance text-foreground">
          {t("institutionProfile.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("institutionProfile.subtitle")}
        </p>
      </header>

      <section className="rounded-xl border border-border bg-background p-6 shadow-sm">
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
      </section>
    </div>
  );
}
