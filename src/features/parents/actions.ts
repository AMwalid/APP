"use server";

import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { createAddChildSchema } from "./schemas";
import type { AddChildFormErrorKey } from "./schemas";
import type { AddChildField, AddChildResult, AddChildValues } from "./types";

/**
 * Parents Server Actions.
 *
 * `createChild` validates with the same schema the form used: the browser copy
 * is a convenience, not a guarantee (ARCHITECTURE §7). Failures come back as
 * data instead of exceptions so the dialog can keep its locale and show a
 * translated message, exactly like the auth actions.
 *
 * `parent_id` is taken from the verified session, never from the payload. RLS
 * would reject a forged one anyway, but the value the client sent is not even
 * read — that is the point of doing the check in two places.
 */
async function translator() {
  const locale = await getLocale();
  return getTranslations({ locale, namespace: "Dashboard" });
}

/**
 * Typed so a renamed key fails the build instead of surfacing as a missing
 * message at runtime — `t()` itself is untyped until the messages are augmented.
 */
const SESSION_EXPIRED: AddChildFormErrorKey =
  "children.addChildDialog.errors.notSignedIn";
const SAVE_FAILED: AddChildFormErrorKey =
  "children.addChildDialog.errors.saveFailed";

function toFieldErrors(
  error: z.ZodError<AddChildValues>,
): Partial<Record<AddChildField, string>> {
  const { fieldErrors } = z.flattenError(error);
  const result: Partial<Record<AddChildField, string>> = {};

  for (const field of ["name", "age", "school"] as const) {
    const first = fieldErrors[field]?.[0];
    if (first) {
      result[field] = first;
    }
  }

  return result;
}

export async function createChild(
  input: AddChildValues,
): Promise<AddChildResult> {
  const t = await translator();
  const parsed = createAddChildSchema(t).safeParse(input);

  if (!parsed.success) {
    return { status: "error", fieldErrors: toFieldErrors(parsed.error) };
  }

  const user = await getCurrentUser();

  if (!user) {
    // The page is behind the middleware, so this is a session that expired
    // while the dialog was open. Not an error worth throwing over.
    return {
      status: "error",
      formError: t(SESSION_EXPIRED),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("children").insert({
    parent_id: user.id,
    name: parsed.data.name,
    // The form keeps the age as the raw input string; this is the one place it
    // becomes a number, and only after the schema has proved it is one.
    age: Number(parsed.data.age),
    school: parsed.data.school,
  });

  if (error) {
    console.error("[parents] createChild failed", error.code ?? error.message);
    return {
      status: "error",
      formError: t(SAVE_FAILED),
    };
  }

  // The route is dynamic, so this is not about a cached page: it tells the
  // client router to drop what it has and re-render the list with the new row.
  const locale = await getLocale();
  revalidatePath(`/${locale}/parents/children`);

  return { status: "success" };
}
