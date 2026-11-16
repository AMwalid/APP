import { z } from "zod";

/**
 * Validation rules for the auth forms.
 *
 * The schemas are factories rather than constants because every message has to
 * be localised, and the same rules will later run inside server actions where
 * `t` comes from `getTranslations("Auth")` instead of `useTranslations`.
 *
 * The email is trimmed before the format check (`pipe`), so a pasted
 * `" a@b.co "` validates. `z.email().trim()` would check the untrimmed string
 * first and reject it.
 */
export type AuthErrorKey =
  | "errors.emailRequired"
  | "errors.emailInvalid"
  | "errors.passwordRequired"
  | "errors.passwordTooShort";

/** Satisfied by both `useTranslations("Auth")` and `getTranslations("Auth")`. */
export type Translate = (key: AuthErrorKey) => string;

const emailField = (t: Translate) =>
  z
    .string()
    .trim()
    .min(1, { error: t("errors.emailRequired") })
    .pipe(z.email({ error: t("errors.emailInvalid") }));

export function createLoginSchema(t: Translate) {
  return z.object({
    email: emailField(t),
    // No length rule on login: an existing password may predate the policy,
    // and rejecting it here would lock the account out of its own form.
    password: z.string().min(1, { error: t("errors.passwordRequired") }),
  });
}

export function createSignupSchema(t: Translate) {
  return z.object({
    email: emailField(t),
    password: z
      .string()
      .min(1, { error: t("errors.passwordRequired") })
      .min(8, { error: t("errors.passwordTooShort") }),
  });
}
