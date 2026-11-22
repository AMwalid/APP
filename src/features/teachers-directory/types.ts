/**
 * Types for the public teacher directory.
 *
 * The RPC returns raw `profiles` columns; the UI gets a normalised shape with
 * display strings only. `src/types/database.ts` has not been generated yet, so
 * the row type is hand-written from the migration and must stay in sync with
 * `20261120000200_public_teacher_directory_rpc.sql`.
 */

export type PublicTeacherRow = {
  id: string;
  full_name: string | null;
  specialization: string | null;
  experience_years: number | null;
  bio: string | null;
};

export type PublicTeacher = {
  id: string;
  fullName: string;
  specialization: string;
  experienceYears: number | null;
  bio: string;
  /** initials for the placeholder avatar, e.g. "AM" */
  initials: string;
  /** comma-separated specialisms, trimmed for the chip row */
  subjects: string[];
};

export function toPublicTeacher(row: PublicTeacherRow): PublicTeacher {
  const fullName = row.full_name?.trim() || "";
  const specialization = row.specialization?.trim() || "";

  return {
    id: row.id,
    fullName,
    specialization,
    experienceYears: row.experience_years,
    bio: row.bio?.trim() || "",
    initials: fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join(""),
    subjects: specialization
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean),
  };
}
