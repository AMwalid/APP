"use server";

import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";
import { getViewer } from "@/features/profile";
import { createClient } from "@/lib/supabase/server";
import { getClassById, getStudentById } from "./queries";
import {
  createClassSchema,
  createEnrollmentSchema,
  createSearchQuerySchema,
} from "./schemas";
import type { ClassFormErrorKey, EnrollmentErrorKey } from "./schemas";
import type {
  ClassFormField,
  ClassFormValues,
  ClassResult,
  EnrollResult,
  StudentOption,
  StudentProfileRow,
} from "./types";

/**
 * Teacher class Server Actions (TCH-02).
 *
 * Every action validates with the same schema the form used: the browser copy
 * is a convenience, not a guarantee (ARCHITECTURE §7). Failures come back as
 * data instead of exceptions so the dialog keeps its locale and shows a
 * translated message, exactly like the parent child actions.
 *
 * `teacher_id` is taken from the verified session, never from the payload. RLS
 * would reject a forged one anyway, but the value the client sent is not even
 * read — that is the point of doing the check in two places.
 *
 * The role check is the third lock: the teacher layout already keeps a parent
 * out of the page, but a Server Action is a POST endpoint and can be called
 * directly. `classes.errors.notTeacher` is the honest answer there.
 *
 * Update and delete filter on `id` *and* `teacher_id`, and ask for the affected
 * rows back with `.select("id")`. A zero-row result means "not yours or not
 * there", which RLS makes indistinguishable on purpose: a stranger's class and
 * a missing class both answer `notFound`, so the response leaks nothing.
 */
async function translator() {
  const locale = await getLocale();
  return getTranslations({ locale, namespace: "Dashboard" });
}

/**
 * Typed so a renamed key fails the build instead of surfacing as a missing
 * message at runtime — `t()` itself is untyped until the messages are augmented.
 */
const SESSION_EXPIRED: ClassFormErrorKey = "classes.errors.notSignedIn";
const NOT_TEACHER: ClassFormErrorKey = "classes.errors.notTeacher";
const NOT_FOUND: ClassFormErrorKey = "classes.errors.notFound";
const CREATE_FAILED: ClassFormErrorKey = "classes.errors.createFailed";
const UPDATE_FAILED: ClassFormErrorKey = "classes.errors.updateFailed";
const DELETE_FAILED: ClassFormErrorKey = "classes.errors.deleteFailed";

const ENROLL_SESSION_EXPIRED: EnrollmentErrorKey =
  "classDetails.errors.notSignedIn";
const ENROLL_NOT_TEACHER: EnrollmentErrorKey =
  "classDetails.errors.notTeacher";
const ENROLL_NOT_FOUND: EnrollmentErrorKey = "classDetails.errors.notFound";
const STUDENT_NOT_FOUND: EnrollmentErrorKey =
  "classDetails.errors.studentNotFound";
const ALREADY_ENROLLED: EnrollmentErrorKey =
  "classDetails.errors.alreadyEnrolled";
const ENROLL_FAILED: EnrollmentErrorKey = "classDetails.errors.enrollFailed";
const REMOVE_FAILED: EnrollmentErrorKey = "classDetails.errors.removeFailed";

function toFieldErrors(
  error: z.ZodError<ClassFormValues>,
): Partial<Record<ClassFormField, string>> {
  const { fieldErrors } = z.flattenError(error);
  const result: Partial<Record<ClassFormField, string>> = {};

  for (const field of ["name", "subject", "gradeLevel"] as const) {
    const first = fieldErrors[field]?.[0];
    if (first) {
      result[field] = first;
    }
  }

  return result;
}

/** The column values a create and an update share, after validation. */
function toClassColumns(data: ClassFormValues) {
  return {
    name: data.name,
    subject: data.subject,
    grade_level: data.gradeLevel,
  };
}

/**
 * The classes page is dynamic, so this is not about a cached page: it tells the
 * client router to drop what it has and re-render the list from the server.
 */
async function revalidateClasses() {
  const locale = await getLocale();
  revalidatePath(`/${locale}/teachers/classes`);
}

export async function createClass(
  input: ClassFormValues,
): Promise<ClassResult> {
  const t = await translator();
  const parsed = createClassSchema(t).safeParse(input);

  if (!parsed.success) {
    return { status: "error", fieldErrors: toFieldErrors(parsed.error) };
  }

  const viewer = await getViewer();

  if (!viewer) {
    // The page is behind the middleware and the teacher guard, so this is a
    // session that expired while the dialog was open.
    return { status: "error", formError: t(SESSION_EXPIRED) };
  }

  if (viewer.role !== "teacher") {
    return { status: "error", formError: t(NOT_TEACHER) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("classes").insert({
    teacher_id: viewer.id,
    ...toClassColumns(parsed.data),
  });

  if (error) {
    console.error("[classes] createClass failed", error.code ?? error.message);
    return { status: "error", formError: t(CREATE_FAILED) };
  }

  await revalidateClasses();

  return { status: "success" };
}

export async function updateClass(
  id: string,
  input: ClassFormValues,
): Promise<ClassResult> {
  const t = await translator();

  // Check the id before it reaches PostgREST: a malformed uuid would otherwise
  // come back as a 400 that reads like a server fault rather than a stale page.
  const classId = z.uuid().safeParse(id);

  if (!classId.success) {
    return { status: "error", formError: t(NOT_FOUND) };
  }

  const parsed = createClassSchema(t).safeParse(input);

  if (!parsed.success) {
    return { status: "error", fieldErrors: toFieldErrors(parsed.error) };
  }

  const viewer = await getViewer();

  if (!viewer) {
    return { status: "error", formError: t(SESSION_EXPIRED) };
  }

  if (viewer.role !== "teacher") {
    return { status: "error", formError: t(NOT_TEACHER) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    // `teacher_id` is never in the payload: a class cannot be moved between
    // accounts, only edited by the teacher who already owns the row.
    .update(toClassColumns(parsed.data))
    .eq("id", classId.data)
    .eq("teacher_id", viewer.id)
    .select("id");

  if (error) {
    console.error("[classes] updateClass failed", error.code ?? error.message);
    return { status: "error", formError: t(UPDATE_FAILED) };
  }

  if (!data || data.length === 0) {
    return { status: "error", formError: t(NOT_FOUND) };
  }

  await revalidateClasses();

  return { status: "success" };
}

export async function deleteClass(id: string): Promise<ClassResult> {
  const t = await translator();
  const classId = z.uuid().safeParse(id);

  if (!classId.success) {
    return { status: "error", formError: t(NOT_FOUND) };
  }

  const viewer = await getViewer();

  if (!viewer) {
    return { status: "error", formError: t(SESSION_EXPIRED) };
  }

  if (viewer.role !== "teacher") {
    return { status: "error", formError: t(NOT_TEACHER) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .delete()
    .eq("id", classId.data)
    .eq("teacher_id", viewer.id)
    .select("id");

  if (error) {
    console.error("[classes] deleteClass failed", error.code ?? error.message);
    return { status: "error", formError: t(DELETE_FAILED) };
  }

  if (!data || data.length === 0) {
    return { status: "error", formError: t(NOT_FOUND) };
  }

  await revalidateClasses();

  return { status: "success" };
}

/* -------------------------------------------------------------------------- */
/* Roster (TCH-03)                                                            */
/* -------------------------------------------------------------------------- */

/** The grid card's count and the detail page's roster both have to refresh. */
async function revalidateClass(classId: string) {
  const locale = await getLocale();

  revalidatePath(`/${locale}/teachers/classes`);
  revalidatePath(`/${locale}/teachers/classes/${classId}`);
}

/**
 * Read-only search for the Add Student dialog.
 *
 * An invalid query answers `[]` rather than an error: the button is disabled
 * until the query is long enough, so there is no user-facing message to show.
 * The RPC itself repeats the teacher check and bounds the result set.
 */
export async function searchStudents(query: string): Promise<StudentOption[]> {
  const t = await translator();
  const parsed = createSearchQuerySchema(t).safeParse(query);

  if (!parsed.success) {
    return [];
  }

  const viewer = await getViewer();

  if (!viewer || viewer.role !== "teacher") {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_students", {
    needle: parsed.data,
  });

  if (error) {
    console.error("[classes] searchStudents failed", error.code ?? error.message);
    return [];
  }

  return (data as StudentProfileRow[]).map((row) => ({
    id: row.id,
    fullName: row.full_name?.trim() || null,
    email: row.email,
  }));
}

/**
 * Enroll a registered student in the teacher's class.
 *
 * Four checks before the insert: the class id is a uuid, the caller is a
 * teacher, the class is theirs (`getClassById` filters by teacher_id), and the
 * student id resolves through the teacher-gated RPC — that last one rejects a
 * teacher or parent id even though the FK alone would accept it.
 *
 * The row itself is still written with the teacher's client, so
 * `class_enrollments_teacher_all` is the real boundary. A duplicate is a
 * 23505 on the unique (class_id, student_id) constraint, reported as data so
 * the dialog can show a translated message.
 */
export async function enrollStudent(
  classId: string,
  studentId: string,
): Promise<EnrollResult> {
  const t = await translator();
  const parsedClassId = z.uuid().safeParse(classId);
  const parsedStudentId = createEnrollmentSchema().safeParse({ studentId });

  if (!parsedClassId.success || !parsedStudentId.success) {
    return { status: "error", formError: t(ENROLL_NOT_FOUND) };
  }

  const viewer = await getViewer();

  if (!viewer) {
    return { status: "error", formError: t(ENROLL_SESSION_EXPIRED) };
  }

  if (viewer.role !== "teacher") {
    return { status: "error", formError: t(ENROLL_NOT_TEACHER) };
  }

  const classItem = await getClassById(parsedClassId.data);

  if (!classItem) {
    return { status: "error", formError: t(ENROLL_NOT_FOUND) };
  }

  const student = await getStudentById(parsedStudentId.data.studentId);

  if (!student) {
    return { status: "error", formError: t(STUDENT_NOT_FOUND) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("class_enrollments").insert({
    class_id: classItem.id,
    student_id: student.id,
  });

  if (error) {
    if (error.code === "23505") {
      return { status: "error", formError: t(ALREADY_ENROLLED) };
    }

    console.error("[classes] enrollStudent failed", error.code ?? error.message);
    return { status: "error", formError: t(ENROLL_FAILED) };
  }

  await revalidateClass(classItem.id);

  return { status: "success" };
}

/**
 * Remove one enrollment. The id and the class id are both in the filter: a
 * stale row from another class must never be deleted, and RLS checks ownership
 * of the class through the existing teacher policy.
 */
export async function unenrollStudent(
  classId: string,
  enrollmentId: string,
): Promise<EnrollResult> {
  const t = await translator();
  const parsedClassId = z.uuid().safeParse(classId);
  const parsedEnrollmentId = z.uuid().safeParse(enrollmentId);

  if (!parsedClassId.success || !parsedEnrollmentId.success) {
    return { status: "error", formError: t(ENROLL_NOT_FOUND) };
  }

  const viewer = await getViewer();

  if (!viewer) {
    return { status: "error", formError: t(ENROLL_SESSION_EXPIRED) };
  }

  if (viewer.role !== "teacher") {
    return { status: "error", formError: t(ENROLL_NOT_TEACHER) };
  }

  const classItem = await getClassById(parsedClassId.data);

  if (!classItem) {
    return { status: "error", formError: t(ENROLL_NOT_FOUND) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("class_enrollments")
    .delete()
    .eq("id", parsedEnrollmentId.data)
    .eq("class_id", classItem.id)
    .select("id");

  if (error) {
    console.error("[classes] unenrollStudent failed", error.code ?? error.message);
    return { status: "error", formError: t(REMOVE_FAILED) };
  }

  if (!data || data.length === 0) {
    return { status: "error", formError: t(ENROLL_NOT_FOUND) };
  }

  await revalidateClass(classItem.id);

  return { status: "success" };
}
