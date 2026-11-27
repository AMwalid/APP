import "server-only";

import { getCurrentUser } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import type { TeacherProfile, TeacherProfileRow } from "./types";

/**
 * The signed-in teacher's profile, or null.
 *
 * Null means there is no session or no profile row; both are rendered as empty
 * form defaults. A failed read throws rather than masquerading as an empty
 * profile, the same way `features/profile` treats a missing row.
 *
 * RLS already limits the table to the caller's own row; the explicit `id` filter
 * is defence in depth and the one the primary key covers.
 */
export async function getTeacherProfile(): Promise<TeacherProfile | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, specialization, experience_years, bio, current_institution_id",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      "[teacher-profile] getTeacherProfile failed: " +
        (error.code ?? error.message),
    );
  }

  if (!data) {
    return null;
  }

  const row = data as TeacherProfileRow;

  return {
    fullName: row.full_name?.trim() || "",
    specialization: row.specialization?.trim() || "",
    experienceYears: row.experience_years === null ? "" : String(row.experience_years),
    // Empty means "not written yet", which is what an empty textarea represents.
    bio: row.bio ?? "",
    currentInstitutionId: row.current_institution_id ?? "",
  };
}
