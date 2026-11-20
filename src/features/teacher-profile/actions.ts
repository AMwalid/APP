"use server";

import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";
import { getViewer } from "@/features/profile";
import { createClient } from "@/lib/supabase/server";
import { createTeacherProfileSchema } from "./schemas";
import type { TeacherProfileFormErrorKey } from "./schemas";
import type {
  TeacherProfileField,
  TeacherProfileFormValues,
  TeacherProfileResult,
} from "./types";

/**
 * Teacher profile Server Action.
 *
 * Validates with the same schema the form used: the browser copy is a
 * convenience, not a guarantee (ARCHITECTURE §7). Failures come back as data so
 * the form keeps its locale and shows a translated message.
 *
 * The id comes from the verified session, never from the payload, and role is
 * checked again here rather than trusted from the dashboard layout guard.
 * RLS checks ownership a second time.
 */

async function translator() {
  const locale = await getLocale();
  return getTranslations({ locale, namespace: "Dashboard" });
}

const SESSION_EXPIRED: TeacherProfileFormErrorKey =
  "teacherProfile.errors.notSignedIn";
const NOT_TEACHER: TeacherProfileFormErrorKey =
  "teacherProfile.errors.notTeacher";
const NOT_FOUND: TeacherProfileFormErrorKey = "teacherProfile.errors.notFound";
const SAVE_FAILED: TeacherProfileFormErrorKey =
  "teacherProfile.errors.saveFailed";

function toFieldErrors(
  error: z.ZodError<TeacherProfileFormValues>,
): Partial<Record<TeacherProfileField, string>> {
  const { fieldErrors } = z.flattenError(error);
  const result: Partial<Record<TeacherProfileField, string>> = {};

  for (const field of [
    "fullName",
    "specialization",
    "experienceYears",
    "bio",
  ] as const) {
    const first = fieldErrors[field]?.[0];
    if (first) {
      result[field] = first;
    }
  }

  return result;
}

export async function updateTeacherProfile(
  input: TeacherProfileFormValues,
): Promise<TeacherProfileResult> {
  const t = await translator();
  const parsed = createTeacherProfileSchema(t).safeParse(input);

  if (!parsed.success) {
    return { status: "error", fieldErrors: toFieldErrors(parsed.error) };
  }

  const viewer = await getViewer();

  if (!viewer) {
    // The page is behind the middleware; this is a session that expired while
    // the form was open. Not an error worth throwing over.
    return { status: "error", formError: t(SESSION_EXPIRED) };
  }

  if (viewer.role !== "teacher") {
    return { status: "error", formError: t(NOT_TEACHER) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      specialization: parsed.data.specialization,
      experience_years: Number(parsed.data.experienceYears),
      // An empty optional bio is stored as NULL rather than "".
      bio: parsed.data.bio || null,
    })
    .eq("id", viewer.id)
    .select("id");

  if (error) {
    console.error(
      "[teacher-profile] updateTeacherProfile failed",
      error.code ?? error.message,
    );
    return { status: "error", formError: t(SAVE_FAILED) };
  }

  // Zero rows: the profile is missing (the trigger never ran for this account).
  // There is no INSERT policy for the app to fall back on.
  if (!data || data.length === 0) {
    return { status: "error", formError: t(NOT_FOUND) };
  }

  // The name is rendered by the shared dashboard shell, so the whole layout
  // cache goes rather than just this route.
  revalidatePath("/", "layout");

  return { status: "success" };
}
