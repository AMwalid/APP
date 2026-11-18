"use server";

import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { createProfileSchema } from "./schemas";
import type { ProfileFormErrorKey } from "./schemas";
import type { ProfileField, ProfileFormValues, ProfileResult } from "./types";

/**
 * Profile Server Actions.
 *
 * Validates with the same schema the form used: the browser copy is a
 * convenience, not a guarantee (ARCHITECTURE §7). Failures come back as data
 * instead of exceptions so the form keeps its locale and shows a translated
 * message.
 *
 * `id` is taken from the verified session, never from the payload, and is never
 * part of the update object: a profile cannot be moved to another account. RLS
 * checks the same thing again — two places, one rule.
 *
 * There is no `create` counterpart. Profiles are created by the database
 * trigger, and there is no INSERT policy to allow anything else; a missing row
 * is reported as `notFound` rather than quietly upserted.
 */
async function translator() {
  const locale = await getLocale();
  return getTranslations({ locale, namespace: "Dashboard" });
}

/**
 * Typed so a renamed key fails the build instead of surfacing as a missing
 * message at runtime — `t()` itself is untyped until the messages are augmented.
 */
const SESSION_EXPIRED: ProfileFormErrorKey = "settings.errors.notSignedIn";
const NOT_FOUND: ProfileFormErrorKey = "settings.errors.notFound";
const SAVE_FAILED: ProfileFormErrorKey = "settings.errors.saveFailed";

function toFieldErrors(
  error: z.ZodError<ProfileFormValues>,
): Partial<Record<ProfileField, string>> {
  const { fieldErrors } = z.flattenError(error);
  const result: Partial<Record<ProfileField, string>> = {};

  for (const field of ["fullName", "role"] as const) {
    const first = fieldErrors[field]?.[0];
    if (first) {
      result[field] = first;
    }
  }

  return result;
}

export async function updateProfile(
  input: ProfileFormValues,
): Promise<ProfileResult> {
  const t = await translator();
  const parsed = createProfileSchema(t).safeParse(input);

  if (!parsed.success) {
    return { status: "error", fieldErrors: toFieldErrors(parsed.error) };
  }

  const user = await getCurrentUser();

  if (!user) {
    // The page is behind the middleware, so this is a session that expired
    // while the form was open. Not an error worth throwing over.
    return { status: "error", formError: t(SESSION_EXPIRED) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      role: parsed.data.role,
    })
    .eq("id", user.id)
    .select("id");

  if (error) {
    console.error("[profile] updateProfile failed", error.code ?? error.message);
    return { status: "error", formError: t(SAVE_FAILED) };
  }

  // Zero rows: the profile is missing (the trigger never ran for this account
  // and the backfill missed it). The settings form cannot create one — by
  // design, there is no INSERT policy — so say so instead of pretending.
  if (!data || data.length === 0) {
    return { status: "error", formError: t(NOT_FOUND) };
  }

  // The name is rendered by the dashboard layout, which is shared by every
  // signed-in route. Revalidating one page would leave the top bar stale, so
  // the whole layout cache goes.
  revalidatePath("/", "layout");

  return { status: "success" };
}
