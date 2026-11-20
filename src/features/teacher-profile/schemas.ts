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
 * `20261120000100_add_teacher_profile_fields.sql`: the schema protects the form,
 * the constraints protect the table.
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
  | "teacherProfile.form.errors.bioTooLong";

/** Satisfied by `useTranslations("Dashboard")`. */
export type Translate = (key: TeacherProfileFieldErrorKey) => string;

/** Messages for a failed action, as opposed to a failed field. */
export type TeacherProfileFormErrorKey =
  | "teacherProfile.errors.notSignedIn"
  | "teacherProfile.errors.notTeacher"
  | "teacherProfile.errors.notFound"
  | "teacherProfile.errors.saveFailed";

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
  }) satisfies z.ZodType<TeacherProfileFormValues>;
}
