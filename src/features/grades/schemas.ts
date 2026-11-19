import { z } from "zod";

/**
 * Validation rules for the Add Grade form.
 *
 * The field values stay strings until this schema accepts them: that is the
 * shape a number input produces, and it lets us reject "1e3", "-2" and "1.234"
 * with a localised message instead of relying on the browser or on numeric
 * guessing. The rules mirror the check constraints in
 * `supabase/migrations/20261119000300_create_grades.sql`.
 */
export type GradeFieldErrorKey =
  | "gradebook.add.errors.titleRequired"
  | "gradebook.add.errors.titleTooShort"
  | "gradebook.add.errors.titleTooLong"
  | "gradebook.add.errors.scoreRequired"
  | "gradebook.add.errors.scoreInvalid"
  | "gradebook.add.errors.maxScoreRequired"
  | "gradebook.add.errors.maxScoreInvalid"
  | "gradebook.add.errors.maxScoreTooSmall"
  | "gradebook.add.errors.scoreExceedsMax";

/** Satisfied by `useTranslations("Dashboard")`. */
export type GradeTranslate = (key: GradeFieldErrorKey) => string;

/** Failures that are not field rules: no session, wrong role, vanished row. */
export type GradeFormErrorKey =
  | "gradebook.errors.notSignedIn"
  | "gradebook.errors.notTeacher"
  | "gradebook.errors.notFound"
  | "gradebook.errors.createFailed";

/** Whole, positive-with-zero-allowed, at most two decimal places. */
const TWO_DECIMALS = /^\d+(?:\.\d{1,2})?$/;

function isTwoDecimal(value: string) {
  return TWO_DECIMALS.test(value) && Number.isFinite(Number(value));
}

export function createGradeSchema(t: GradeTranslate) {
  return z
    .object({
      title: z
        .string()
        .trim()
        .min(1, { error: t("gradebook.add.errors.titleRequired") })
        .min(2, { error: t("gradebook.add.errors.titleTooShort") })
        .max(120, { error: t("gradebook.add.errors.titleTooLong") }),
      score: z
        .string()
        .trim()
        .min(1, { error: t("gradebook.add.errors.scoreRequired") })
        .refine(isTwoDecimal, { error: t("gradebook.add.errors.scoreInvalid") }),
      maxScore: z
        .string()
        .trim()
        .min(1, { error: t("gradebook.add.errors.maxScoreRequired") })
        .refine(isTwoDecimal, {
          error: t("gradebook.add.errors.maxScoreInvalid"),
        })
        .refine((value) => Number(value) > 0, {
          error: t("gradebook.add.errors.maxScoreTooSmall"),
        }),
    })
    .refine((values) => Number(values.score) <= Number(values.maxScore), {
      path: ["score"],
      error: t("gradebook.add.errors.scoreExceedsMax"),
    });
}
