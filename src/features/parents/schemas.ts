import { z } from "zod";

/**
 * Validation rules for the "add child" form.
 *
 * A factory rather than a constant, like `features/auth/schemas`: every message
 * has to be localised, and the translator is only available at call time.
 *
 * `age` stays a string here on purpose. With `valueAsNumber` an empty field
 * arrives as `NaN`, and zod then reports "expected number" instead of "enter an
 * age" — a confusing message in any language. Keeping the raw input lets the
 * empty case get its own key, and the caller converts once with `Number()`.
 */
export type AddChildErrorKey =
  | "children.addChildDialog.errors.nameRequired"
  | "children.addChildDialog.errors.nameTooShort"
  | "children.addChildDialog.errors.nameTooLong"
  | "children.addChildDialog.errors.ageRequired"
  | "children.addChildDialog.errors.ageInvalid"
  | "children.addChildDialog.errors.ageRange"
  | "children.addChildDialog.errors.schoolRequired"
  | "children.addChildDialog.errors.schoolTooShort"
  | "children.addChildDialog.errors.schoolTooLong";

/** Satisfied by `useTranslations("Dashboard")`. */
export type Translate = (key: AddChildErrorKey) => string;

/**
 * Messages for a failed action, as opposed to a failed field.
 *
 * Kept apart from `AddChildErrorKey` because they are not schema rules: one is
 * "the session went away between opening the dialog and pressing save", the
 * other is "Postgres refused the insert". Neither belongs in a zod message.
 */
export type AddChildFormErrorKey =
  | "children.addChildDialog.errors.notSignedIn"
  | "children.addChildDialog.errors.saveFailed";

export function createAddChildSchema(t: Translate) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, { error: t("children.addChildDialog.errors.nameRequired") })
      .min(2, { error: t("children.addChildDialog.errors.nameTooShort") })
      .max(60, { error: t("children.addChildDialog.errors.nameTooLong") }),
    age: z
      .string()
      .trim()
      .min(1, { error: t("children.addChildDialog.errors.ageRequired") })
      .regex(/^\d{1,2}$/, {
        error: t("children.addChildDialog.errors.ageInvalid"),
      })
      .refine((value) => Number(value) >= 3 && Number(value) <= 25, {
        error: t("children.addChildDialog.errors.ageRange"),
      }),
    school: z
      .string()
      .trim()
      .min(1, { error: t("children.addChildDialog.errors.schoolRequired") })
      .min(2, { error: t("children.addChildDialog.errors.schoolTooShort") })
      .max(100, { error: t("children.addChildDialog.errors.schoolTooLong") }),
  });
}
