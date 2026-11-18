import { z } from "zod";

/**
 * Validation rules for the create/edit child form.
 *
 * A factory rather than a constant, like `features/auth/schemas`: every message
 * has to be localised, and the translator is only available at call time.
 *
 * `age` stays a string here on purpose. With `valueAsNumber` an empty field
 * arrives as `NaN`, and zod then reports "expected number" instead of "enter an
 * age" — a confusing message in any language. Keeping the raw input lets the
 * empty case get its own key, and the action converts once with `Number()`.
 *
 * One schema serves both modes: editing validates exactly what creating does,
 * so the browser and the server can never disagree about what a valid child is.
 */
export type ChildFieldErrorKey =
  | "children.form.errors.nameRequired"
  | "children.form.errors.nameTooShort"
  | "children.form.errors.nameTooLong"
  | "children.form.errors.ageRequired"
  | "children.form.errors.ageInvalid"
  | "children.form.errors.ageRange"
  | "children.form.errors.schoolRequired"
  | "children.form.errors.schoolTooShort"
  | "children.form.errors.schoolTooLong";

/** Satisfied by `useTranslations("Dashboard")`. */
export type Translate = (key: ChildFieldErrorKey) => string;

/**
 * Messages for a failed action, as opposed to a failed field.
 *
 * Kept apart from `ChildFieldErrorKey` because they are not schema rules: a
 * session that expired mid-dialog, a row that vanished, or Postgres refusing the
 * write. None of those belongs in a zod message.
 */
export type ChildFormErrorKey =
  | "children.errors.notSignedIn"
  | "children.errors.notFound"
  | "children.errors.createFailed"
  | "children.errors.updateFailed"
  | "children.errors.deleteFailed";

export function createChildSchema(t: Translate) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, { error: t("children.form.errors.nameRequired") })
      .min(2, { error: t("children.form.errors.nameTooShort") })
      .max(60, { error: t("children.form.errors.nameTooLong") }),
    age: z
      .string()
      .trim()
      .min(1, { error: t("children.form.errors.ageRequired") })
      .regex(/^\d{1,2}$/, {
        error: t("children.form.errors.ageInvalid"),
      })
      .refine((value) => Number(value) >= 3 && Number(value) <= 25, {
        error: t("children.form.errors.ageRange"),
      }),
    school: z
      .string()
      .trim()
      .min(1, { error: t("children.form.errors.schoolRequired") })
      .min(2, { error: t("children.form.errors.schoolTooShort") })
      .max(100, { error: t("children.form.errors.schoolTooLong") }),
  });
}
