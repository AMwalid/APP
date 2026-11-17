"use server";

import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { env } from "@/config/env";
import { createClient } from "@/lib/supabase/server";
import { createLoginSchema, createSignupSchema, type AuthErrorKey } from "./schemas";
import type { AuthField, AuthResult, LoginValues, SignupValues } from "./types";

/**
 * Auth Server Actions.
 *
 * Every action validates again with the same schema the form used: the browser
 * copy is a convenience, not a guarantee. Failures come back as data instead of
 * exceptions so the form can keep its locale and show a translated message.
 *
 * `getLocale()` reads the `x-next-intl-locale` header forwarded by the
 * middleware, which is why `updateSession` must never replace the response
 * next-intl produced.
 */
async function translator() {
  const locale = await getLocale();
  return getTranslations({ locale, namespace: "Auth" });
}

/**
 * Supabase speaks English and returns machine codes. Only the codes we can say
 * something useful about are translated; everything else collapses to a generic
 * message and the raw error is logged instead of shown.
 */
const ERROR_KEYS: Record<string, AuthErrorKey> = {
  invalid_credentials: "errors.invalidCredentials",
  email_not_confirmed: "errors.emailNotConfirmed",
  user_already_exists: "errors.emailInUse",
  email_exists: "errors.emailInUse",
  weak_password: "errors.weakPassword",
  over_request_rate_limit: "errors.rateLimited",
  over_email_send_rate_limit: "errors.rateLimited",
};

function messageKey(code: string | undefined): AuthErrorKey {
  return (code && ERROR_KEYS[code]) || "errors.unknown";
}

function toFieldErrors(
  error: z.ZodError<Record<AuthField, string>>,
): Partial<Record<AuthField, string>> {
  const { fieldErrors } = z.flattenError(error);
  const result: Partial<Record<AuthField, string>> = {};

  for (const field of ["email", "password"] as const) {
    const first = fieldErrors[field]?.[0];
    if (first) {
      result[field] = first;
    }
  }

  return result;
}

export async function login(input: LoginValues): Promise<AuthResult> {
  const t = await translator();
  const parsed = createLoginSchema(t).safeParse(input);

  if (!parsed.success) {
    return { status: "error", fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    console.error("[auth] login failed", error.code ?? error.status);
    return { status: "error", formError: t(messageKey(error.code)) };
  }

  return { status: "success" };
}

export async function signup(input: SignupValues): Promise<AuthResult> {
  const t = await translator();
  const parsed = createSignupSchema(t).safeParse(input);

  if (!parsed.success) {
    return { status: "error", fieldErrors: toFieldErrors(parsed.error) };
  }

  const locale = await getLocale();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      // Where the confirmation link lands. Must be allowlisted in the Supabase
      // project's Redirect URLs, otherwise Supabase silently falls back to the
      // Site URL and the code is never exchanged.
      emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/${locale}/auth/callback`,
    },
  });

  if (error) {
    console.error("[auth] signup failed", error.code ?? error.status);
    return { status: "error", formError: t(messageKey(error.code)) };
  }

  // With email confirmation enabled Supabase returns a user but no session;
  // there is nothing to redirect with until the link is clicked.
  return data.session ? { status: "success" } : { status: "confirmEmail" };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const locale = await getLocale();
  redirect(`/${locale}/login`);
}

/**
 * Exchanges the `code` from an email-confirmation link for a real session.
 *
 * The PKCE flow hands the code back in the URL, and only a server-side exchange
 * can turn it into the cookies that keep the user signed in. It lives here
 * rather than in the callback route because only `actions.ts` may touch the
 * Supabase client; the route stays a thin redirect decision.
 *
 * Returns false instead of throwing: an expired or already-used link is a
 * normal outcome, and the caller sends the user to the login page either way.
 */
export async function exchangeCodeForSession(code: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth] code exchange failed", error.code ?? error.status);
    return false;
  }

  return true;
}
