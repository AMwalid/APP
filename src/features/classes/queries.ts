import "server-only";

import { getCurrentUser } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import type { Class, ClassRow } from "./types";

/**
 * The teacher's classes (TCH-02), oldest first.
 *
 * RLS already limits the table to the signed-in teacher; the explicit
 * `teacher_id` filter is defence in depth and the one the index covers. A signed
 * out visitor gets an empty list rather than an error — the page is behind the
 * middleware and the teacher guard, so this only happens if a session expires
 * mid-navigation.
 *
 * A failed query returns `[]` and logs the code: a broken list is not worth
 * crashing the page over, but it must not be silent either. That includes the
 * table not existing yet, which is how the page behaves before the migration is
 * applied.
 *
 * `toClass` exists because the Supabase client is untyped until
 * `src/types/database.ts` is generated; it keeps the cast in one place.
 */
export async function getClasses(): Promise<Class[]> {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("id, name, subject, grade_level")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[classes] getClasses failed", error.code ?? error.message);
    return [];
  }

  return (data as ClassRow[]).map(toClass);
}

function toClass(row: ClassRow): Class {
  return {
    id: row.id,
    name: row.name,
    subject: row.subject,
    gradeLevel: row.grade_level,
  };
}
