import { z } from "zod";
import type { TeacherProfileFormValues } from "./types";

/**
 * Validation rules for the teacher profile form.
 *
 * A factory rather than a constant, like `features/profile` and `features/auth`:
 * every message has to be localised, and the translator is only available at
 * call time. The same schema runs in the form and again in the Server Action.
 *
 * The bounds mirror the check constraints in
 * `20261120000100_add_teacher_profile_fields.sql`; the school id is checked
 * again against the selectable list in the action, because the browser is not
 * a trust boundary.
 */

export type TeacherProfileFieldErrorKey =
  | "teacherProfile.form.errors.fullNameRequired"
  | "teacherProfile.form.errors.fullNameTooShort"
  | "teacherProfile.form.errors.fullNameTooLong"
  | "teacherProfile.form.errors.specializationRequired"
  | "teacherProfile.form.errors.specializationTooShort"
  | "teacherProfile.form.errors.specializationTooLong"
  | "teacherProfile.form.errors.experienceYearsRequired"
  | "teacherProfile.form.errors.experienceYearsInvalid"
  | "teacherProfile.form.errors.experienceYearsRange"
  | "teacherProfile.form.errors.bioTooShort"
  | "teacherProfile.form.errors.bioTooLong"
  | "teacherProfile.form.errors.currentInstitutionInvalid";

/** Satisfied by `useTranslations("Dashboard")`. */
export type Translate = (key: TeacherProfileFieldErrorKey) => string;

/** Messages for a failed action, as opposed to a failed field. */
export type TeacherProfileFormErrorKey =
  | "teacherProfile.errors.notSignedIn"
  | "teacherProfile.errors.notTeacher"
  | "teacherProfile.errors.notFound"
  | "teacherProfile.errors.saveFailed";

/** A UUID-typed column cannot receive arbitrary form values. */
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createTeacherProfileSchema(t: Translate) {
  return z.object({
    fullName: z
      .string()
      .trim()
      .min(1, { error: t("teacherProfile.form.errors.fullNameRequired") })
      .min(2, { error: t("teacherProfile.form.errors.fullNameTooShort") })
      .max(80, { error: t("teacherProfile.form.errors.fullNameTooLong") }),
    specialization: z
      .string()
      .trim()
      .min(1, {
        error: t("teacherProfile.form.errors.specializationRequired"),
      })
      .min(2, {
        error: t("teacherProfile.form.errors.specializationTooShort"),
      })
      .max(80, {
        error: t("teacherProfile.form.errors.specializationTooLong"),
      }),
    // Kept as a string so the form type and the schema input type stay the same.
    // Digits only, then the 0–60 range; the action does the final Number().
    experienceYears: z
      .string()
      .trim()
      .min(1, {
        error: t("teacherProfile.form.errors.experienceYearsRequired"),
      })
      .refine((value) => /^\d+$/.test(value), {
        error: t("teacherProfile.form.errors.experienceYearsInvalid"),
      })
      .refine((value) => Number(value) <= 60, {
        error: t("teacherProfile.form.errors.experienceYearsRange"),
      }),
    // Optional: an empty string is a valid "no bio yet". Once something is
    // entered it has to be a real bio, matching the database constraint.
    bio: z
      .string()
      .trim()
      .refine((value) => value.length === 0 || value.length >= 20, {
        error: t("teacherProfile.form.errors.bioTooShort"),
      })
      .refine((value) => value.length <= 1000, {
        error: t("teacherProfile.form.errors.bioTooLong"),
      }),
    // Empty means "not linked yet"; a non-empty value must at least be a UUID.
    // The action also checks that it is one of the institutions offered.
    currentInstitutionId: z.string().refine((value) => value === "" || UUID.test(value), {
      error: t("teacherProfile.form.errors.currentInstitutionInvalid"),
    }),
  }) satisfies z.ZodType<TeacherProfileFormValues>;
}
