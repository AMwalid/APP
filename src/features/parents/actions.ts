"use server";

import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";
import { z } from "zod";
import { getViewer } from "@/features/profile";
import { getCurrentUser } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { createChildSchema } from "./schemas";
import type { ChildFormErrorKey, LinkErrorKey } from "./schemas";
import type {
  ChildFormField,
  ChildFormValues,
  ChildResult,
  LinkResult,
  StudentOption,
  StudentSearchResult,
} from "./types";

/**
 * Parents Server Actions.
 *
 * Every action validates with the same schema the form used: the browser copy
 * is a convenience, not a guarantee (ARCHITECTURE §7). Failures come back as
 * data instead of exceptions so the dialog keeps its locale and shows a
 * translated message, exactly like the auth actions.
 *
 * `parent_id` is taken from the verified session, never from the payload. RLS
 * would reject a forged one anyway, but the value the client sent is not even
 * read — that is the point of doing the check in two places.
 *
 * Update and delete filter on `id` *and* `parent_id`, and ask for the affected
 * rows back with `.select("id")`. A zero-row result means "not yours or not
 * there", which RLS makes indistinguishable on purpose: a stranger's row and a
 * missing row both answer `notFound`, so the response leaks nothing.
 */
async function translator() {
  const locale = await getLocale();
  return getTranslations({ locale, namespace: "Dashboard" });
}

/**
 * Typed so a renamed key fails the build instead of surfacing as a missing
 * message at runtime — `t()` itself is untyped until the messages are augmented.
 */
const SESSION_EXPIRED: ChildFormErrorKey = "children.errors.notSignedIn";
const NOT_FOUND: ChildFormErrorKey = "children.errors.notFound";
const CREATE_FAILED: ChildFormErrorKey = "children.errors.createFailed";
const UPDATE_FAILED: ChildFormErrorKey = "children.errors.updateFailed";
const DELETE_FAILED: ChildFormErrorKey = "children.errors.deleteFailed";

const NOT_PARENT: LinkErrorKey = "children.errors.notParent";
const SEARCH_INVALID: LinkErrorKey = "children.errors.searchInvalid";
const SEARCH_FAILED: LinkErrorKey = "children.errors.searchFailed";
const LINK_FAILED: LinkErrorKey = "children.errors.linkFailed";

function toFieldErrors(
  error: z.ZodError<ChildFormValues>,
): Partial<Record<ChildFormField, string>> {
  const { fieldErrors } = z.flattenError(error);
  const result: Partial<Record<ChildFormField, string>> = {};

  for (const field of ["name", "age", "school"] as const) {
    const first = fieldErrors[field]?.[0];
    if (first) {
      result[field] = first;
    }
  }

  return result;
}

/** The column values a create and an update share, after validation. */
function toChildColumns(data: ChildFormValues) {
  return {
    name: data.name,
    // The form keeps the age as the raw input string; this is the one place it
    // becomes a number, and only after the schema has proved it is one.
    age: Number(data.age),
    school: data.school,
  };
}

/**
 * The children page is dynamic, so this is not about a cached page: it tells
 * the client router to drop what it has and re-render the list from the server.
 */
async function revalidateChildren() {
  const locale = await getLocale();
  revalidatePath(`/${locale}/parents/children`);
}

async function revalidateChildGrades(childId: string) {
  const locale = await getLocale();
  revalidatePath(`/${locale}/parents/children/${childId}/grades`);
}

export async function createChild(
  input: ChildFormValues,
): Promise<ChildResult> {
  const t = await translator();
  const parsed = createChildSchema(t).safeParse(input);

  if (!parsed.success) {
    return { status: "error", fieldErrors: toFieldErrors(parsed.error) };
  }

  const user = await getCurrentUser();

  if (!user) {
    // The page is behind the middleware, so this is a session that expired
    // while the dialog was open. Not an error worth throwing over.
    return { status: "error", formError: t(SESSION_EXPIRED) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("children").insert({
    parent_id: user.id,
    ...toChildColumns(parsed.data),
  });

  if (error) {
    console.error("[parents] createChild failed", error.code ?? error.message);
    return { status: "error", formError: t(CREATE_FAILED) };
  }

  await revalidateChildren();

  return { status: "success" };
}

export async function updateChild(
  id: string,
  input: ChildFormValues,
): Promise<ChildResult> {
  const t = await translator();

  // Check the id before it reaches PostgREST: a malformed uuid would otherwise
  // come back as a 400 that reads like a server fault rather than a stale page.
  const childId = z.uuid().safeParse(id);

  if (!childId.success) {
    return { status: "error", formError: t(NOT_FOUND) };
  }

  const parsed = createChildSchema(t).safeParse(input);

  if (!parsed.success) {
    return { status: "error", fieldErrors: toFieldErrors(parsed.error) };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { status: "error", formError: t(SESSION_EXPIRED) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("children")
    // `parent_id` is never in the payload: a child cannot be moved between
    // accounts, only edited by the parent who already owns the row.
    .update(toChildColumns(parsed.data))
    .eq("id", childId.data)
    .eq("parent_id", user.id)
    .select("id");

  if (error) {
    console.error("[parents] updateChild failed", error.code ?? error.message);
    return { status: "error", formError: t(UPDATE_FAILED) };
  }

  if (!data || data.length === 0) {
    return { status: "error", formError: t(NOT_FOUND) };
  }

  await revalidateChildren();

  return { status: "success" };
}

export async function deleteChild(id: string): Promise<ChildResult> {
  const t = await translator();
  const childId = z.uuid().safeParse(id);

  if (!childId.success) {
    return { status: "error", formError: t(NOT_FOUND) };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { status: "error", formError: t(SESSION_EXPIRED) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("children")
    .delete()
    .eq("id", childId.data)
    .eq("parent_id", user.id)
    .select("id");

  if (error) {
    console.error("[parents] deleteChild failed", error.code ?? error.message);
    return { status: "error", formError: t(DELETE_FAILED) };
  }

  if (!data || data.length === 0) {
    return { status: "error", formError: t(NOT_FOUND) };
  }

  await revalidateChildren();

  return { status: "success" };
}

/**
 * Find a registered student by email (PAR-04).
 *
 * The needle is bounded here as well as in the SQL function: a Server Action is
 * a POST endpoint, so the browser's 2-character check is never the boundary.
 * The RPC itself gates on the parent role and returns only id and email.
 */
export async function searchStudentsByEmail(
  needle: string,
): Promise<StudentSearchResult> {
  const t = await translator();
  const parsed = z.string().trim().min(2).max(200).safeParse(needle);

  if (!parsed.success) {
    return { status: "error", formError: t(SEARCH_INVALID) };
  }

  const viewer = await getViewer();

  if (!viewer) {
    return { status: "error", formError: t(SESSION_EXPIRED) };
  }

  if (viewer.role !== "parent") {
    return { status: "error", formError: t(NOT_PARENT) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_student_by_email", {
    needle: parsed.data,
  });

  if (error) {
    console.error("[parents] searchStudentsByEmail failed", error.code ?? error.message);
    return { status: "error", formError: t(SEARCH_FAILED) };
  }

  const students: StudentOption[] = (data ?? []).map(
    (row: { id: string; email: string }) => ({ id: row.id, email: row.email }),
  );

  return { status: "success", students };
}

/**
 * Assert that a child profile belongs to a student account (PAR-04).
 *
 * Three locks: uuid validation, the verified parent's role, and a filtered
 * update on `id` AND `parent_id` that asks for affected rows back. RLS is the
 * final boundary; the database trigger additionally guarantees the target is a
 * student profile, even if a client writes to the table directly.
 */
export async function linkStudentToChild(
  childId: string,
  studentId: string,
): Promise<LinkResult> {
  const t = await translator();
  const child = z.uuid().safeParse(childId);
  const student = z.uuid().safeParse(studentId);

  if (!child.success || !student.success) {
    return { status: "error", formError: t(NOT_FOUND) };
  }

  const viewer = await getViewer();

  if (!viewer) {
    return { status: "error", formError: t(SESSION_EXPIRED) };
  }

  if (viewer.role !== "parent") {
    return { status: "error", formError: t(NOT_PARENT) };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { status: "error", formError: t(SESSION_EXPIRED) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("children")
    .update({ student_id: student.data })
    .eq("id", child.data)
    .eq("parent_id", user.id)
    .select("id");

  if (error) {
    console.error("[parents] linkStudentToChild failed", error.code ?? error.message);
    return { status: "error", formError: t(LINK_FAILED) };
  }

  if (!data || data.length === 0) {
    return { status: "error", formError: t(NOT_FOUND) };
  }

  await revalidateChildren();
  await revalidateChildGrades(child.data);

  return { status: "success" };
}
