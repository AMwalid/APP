import { z } from "zod";

/**
 * Validation rules for the create/edit class form.
 *
 * A factory rather than a constant, like the other features: every message has
 * to be localised, and the translator is only available at call time.
 *
 * One schema serves both modes: editing validates exactly what creating does,
 * so the browser and the server can never disagree about what a valid class is.
 *
 * The length bounds match the check constraints in
 * `supabase/migrations/20261119000000_create_classes_tables.sql`.
 */
export type ClassFieldErrorKey =
  | "classes.form.errors.nameRequired"
  | "classes.form.errors.nameTooShort"
  | "classes.form.errors.nameTooLong"
  | "classes.form.errors.subjectRequired"
  | "classes.form.errors.subjectTooShort"
  | "classes.form.errors.subjectTooLong"
  | "classes.form.errors.gradeLevelRequired"
  | "classes.form.errors.gradeLevelTooLong";

/** Satisfied by `useTranslations("Dashboard")`. */
export type Translate = (key: ClassFieldErrorKey) => string;

/**
 * Messages for a failed action, as opposed to a failed field.
 *
 * Kept apart from `ClassFieldErrorKey` because they are not schema rules: an
 * expired session, a row that vanished, a non-teacher account, or Postgres
 * refusing the write. None of those belongs in a zod message.
 */
export type ClassFormErrorKey =
  | "classes.errors.notSignedIn"
  | "classes.errors.notTeacher"
  | "classes.errors.notFound"
  | "classes.errors.createFailed"
  | "classes.errors.updateFailed"
  | "classes.errors.deleteFailed";

export function createClassSchema(t: Translate) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, { error: t("classes.form.errors.nameRequired") })
      .min(2, { error: t("classes.form.errors.nameTooShort") })
      .max(80, { error: t("classes.form.errors.nameTooLong") }),
    subject: z
      .string()
      .trim()
      .min(1, { error: t("classes.form.errors.subjectRequired") })
      .min(2, { error: t("classes.form.errors.subjectTooShort") })
      .max(60, { error: t("classes.form.errors.subjectTooLong") }),
    gradeLevel: z
      .string()
      .trim()
      .min(1, { error: t("classes.form.errors.gradeLevelRequired") })
      .max(40, { error: t("classes.form.errors.gradeLevelTooLong") }),
  });
}
