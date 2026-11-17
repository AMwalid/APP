import type { z } from "zod";
import type { createLoginSchema, createSignupSchema } from "./schemas";

/**
 * Form value types, inferred from the schemas so the rules and the fields can
 * never drift apart.
 */
export type LoginValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type SignupValues = z.infer<ReturnType<typeof createSignupSchema>>;

/** The fields the auth forms expose; server field errors are keyed by these. */
export type AuthField = "email" | "password";

/**
 * What a Server Action hands back to the form.
 *
 * Actions never throw for an expected failure. A wrong password or a rate limit
 * is a normal outcome, and a thrown error reaches the browser as an opaque 500
 * in production, losing both the message and the locale.
 */
export type AuthResult =
  | { status: "success" }
  /** Signup succeeded but the account needs email confirmation first. */
  | { status: "confirmEmail" }
  | {
      status: "error";
      formError?: string;
      fieldErrors?: Partial<Record<AuthField, string>>;
    };
