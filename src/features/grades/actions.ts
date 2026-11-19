"use server";

import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";
import { getViewer } from "@/features/profile";
import { createClient } from "@/lib/supabase/server";
import { getTeacherEnrollment } from "./queries";
import { createGradeSchema } from "./schemas";
import type { GradeFormErrorKey } from "./schemas";
import type { GradeField, GradeFormValues, GradeResult } from "./types";

/**
 * Teacher gradebook action (GRD-01).
 *
 * Three locks, same shape as the classes actions: the form schema validates the
 * values, the viewer check rejects a non-teacher calling the server action
 * directly, and `getTeacherEnrollment` proves the enrollment is in one of their
 * classes before the insert. RLS on `grades` is the final boundary — a forged
 * `enrollment_id` cannot pass its WITH CHECK policy.
 *
 * Failures are returned as data so the dialog can keep its locale and show a
 * translated message instead of throwing through the Next.js error boundary.
 */
async function translator() {
  const locale = await getLocale();
  return getTranslations({ locale, namespace: "Dashboard" });
}

const SESSION_EXPIRED: GradeFormErrorKey = "gradebook.errors.notSignedIn";
const NOT_TEACHER: GradeFormErrorKey = "gradebook.errors.notTeacher";
const NOT_FOUND: GradeFormErrorKey = "gradebook.errors.notFound";
const CREATE_FAILED: GradeFormErrorKey = "gradebook.errors.createFailed";

function toFieldErrors(
  error: z.ZodError<GradeFormValues>,
): Partial<Record<GradeField, string>> {
  const { fieldErrors } = z.flattenError(error);
  const result: Partial<Record<GradeField, string>> = {};

  for (const field of ["title", "score", "maxScore"] as const) {
    const first = fieldErrors[field]?.[0];
    if (first) {
      result[field] = first;
    }
  }

  return result;
}

async function revalidateGradebook(classId: string, enrollmentId: string) {
  const locale = await getLocale();
  revalidatePath(`/${locale}/teachers/classes/${classId}/students/${enrollmentId}`);
  revalidatePath(`/${locale}/students/classes/${classId}`);
}

export async function createGrade(
  classId: string,
  enrollmentId: string,
  input: GradeFormValues,
): Promise<GradeResult> {
  const t = await translator();
  const parsed = createGradeSchema(t).safeParse(input);

  if (!parsed.success) {
    return { status: "error", fieldErrors: toFieldErrors(parsed.error) };
  }

  // A Server Action is a POST endpoint: validate the path ids too, even though
  // the page that called it already did.
  const classIsUuid = z.uuid().safeParse(classId);
  const enrollmentIsUuid = z.uuid().safeParse(enrollmentId);

  if (!classIsUuid.success || !enrollmentIsUuid.success) {
    return { status: "error", formError: t(NOT_FOUND) };
  }

  const viewer = await getViewer();

  if (!viewer) {
    return { status: "error", formError: t(SESSION_EXPIRED) };
  }

  if (viewer.role !== "teacher") {
    return { status: "error", formError: t(NOT_TEACHER) };
  }

  const enrollment = await getTeacherEnrollment(
    classIsUuid.data,
    enrollmentIsUuid.data,
  );

  if (!enrollment) {
    return { status: "error", formError: t(NOT_FOUND) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("grades").insert({
    enrollment_id: enrollment.id,
    title: parsed.data.title,
    score: Number(parsed.data.score),
    max_score: Number(parsed.data.maxScore),
  });

  if (error) {
    console.error("[grades] createGrade failed", error.code ?? error.message);
    return { status: "error", formError: t(CREATE_FAILED) };
  }

  await revalidateGradebook(classIsUuid.data, enrollmentIsUuid.data);

  return { status: "success" };
}
