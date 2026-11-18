import { z } from "zod";
import { USER_ROLES } from "./types";

/**
 * Validation rules for the settings form.
 *
 * A factory rather than a constant, like `features/auth` and `features/parents`:
 * every message has to be localised, and the translator is only available at
 * call time. The same schema runs in the form and again in the Server Action.
 *
 * `fullName` is required here even though the column is nullable. The column is
 * nullable because a brand-new account has no name yet; the form is where the
 * user fixes that, so saving an empty name would only recreate the state they
 * came here to leave.
 *
 * The length bounds match `profiles_full_name_length` in the migration. The
 * schema protects the form, the constraint protects the table.
 */
export type ProfileFieldErrorKey =
  | "settings.form.errors.fullNameRequired"
  | "settings.form.errors.fullNameTooShort"
  | "settings.form.errors.fullNameTooLong"
  | "settings.form.errors.roleInvalid";

/** Satisfied by `useTranslations("Dashboard")`. */
export type Translate = (key: ProfileFieldErrorKey) => string;

/**
 * Messages for a failed action, as opposed to a failed field.
 *
 * Kept apart from `ProfileFieldErrorKey` because they are not schema rules: an
 * expired session, a missing row, or Postgres refusing the write.
 */
export type ProfileFormErrorKey =
  | "settings.errors.notSignedIn"
  | "settings.errors.notFound"
  | "settings.errors.saveFailed";

export function createProfileSchema(t: Translate) {
  return z.object({
    fullName: z
      .string()
      .trim()
      .min(1, { error: t("settings.form.errors.fullNameRequired") })
      .min(2, { error: t("settings.form.errors.fullNameTooShort") })
      .max(80, { error: t("settings.form.errors.fullNameTooLong") }),
    // `USER_ROLES` is the same list the check constraint uses, so a role that
    // reaches the action is one the table will accept.
    role: z.enum(USER_ROLES, {
      error: t("settings.form.errors.roleInvalid"),
    }),
  });
}
