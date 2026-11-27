import "server-only";

import { createClient } from "@/lib/supabase/server";
import { toPublicTeacher, type PublicTeacher, type PublicTeacherRow } from "./types";

/**
 * Public directory reads. Both call `security definer` RPCs that hard-code
 * `role = 'teacher'`; anon clients still cannot SELECT profiles directly
 * because the table's RLS only allows reading one's own row.
 *
 * A failed read throws rather than rendering an empty directory, which would
 * make an outage look like a search with no matches.
 */

export type TeacherSearch = {
  needle?: string;
  specialty?: string;
};

export async function getPublicTeachers({
  needle = "",
  specialty = "",
}: TeacherSearch = {}): Promise<PublicTeacher[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_public_teachers", {
    needle: needle.trim(),
    specialty: specialty.trim(),
  });

  if (error) {
    throw new Error(
      "[teachers-directory] getPublicTeachers failed: " +
        (error.code ?? error.message),
    );
  }

  return ((data ?? []) as PublicTeacherRow[]).map(toPublicTeacher);
}

/** A UUID-typed column cannot receive arbitrary path segments. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function getPublicTeacher(id: string): Promise<PublicTeacher | null> {
  if (!UUID.test(id)) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_public_teacher", { p_id: id });

  if (error) {
    throw new Error(
      "[teachers-directory] getPublicTeacher failed: " +
        (error.code ?? error.message),
    );
  }

  const row = (data ?? [])[0] as PublicTeacherRow | undefined;
  return row ? toPublicTeacher(row) : null;
}
