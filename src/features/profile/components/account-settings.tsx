import { getTranslations } from "next-intl/server";
import { getViewer } from "../queries";
import { ProfileForm } from "./profile-form";

/**
 * Account settings, shared by every role's settings route.
 *
 * The page only composes: the profile comes from the feature's query, the form
 * from the feature's components, and the copy from the messages. The parent,
 * teacher and student settings pages are thin wrappers around this, so there is
 * one form and one set of rules no matter which dashboard you came from.
 *
 * The email is shown but not editable: changing it is an auth concern (confirm
 * the new address before it takes over the account), not a profile column, so
 * the form does not pretend to own it.
 *
 * A missing profile is not an error state here. The form renders with empty
 * defaults and the action reports `notFound` on save, which is the honest
 * outcome: the row is created by the database trigger, and there is no INSERT
 * policy for the app to fall back on.
 */
export async function AccountSettings({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const viewer = await getViewer();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-balance text-foreground">
          {t("settings.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("settings.subtitle")}
        </p>
      </header>

      <section className="rounded-lg border border-border bg-background p-5 sm:p-6">
        {viewer?.email ? (
          <p className="mb-6 flex flex-wrap items-baseline gap-2 border-b border-border pb-4 text-sm text-muted-foreground">
            <span>{t("settings.accountLabel")}</span>
            <span className="font-medium text-foreground" dir="ltr">
              {viewer.email}
            </span>
          </p>
        ) : null}

        <ProfileForm
          defaultValues={{
            fullName: viewer?.fullName ?? "",
            role: viewer?.role ?? "parent",
          }}
        />
      </section>
    </div>
  );
}
