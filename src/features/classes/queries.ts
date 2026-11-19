import "server-only";

import { getViewer } from "@/features/profile";
import { getCurrentUser } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import type {
  Class,
  ClassRow,
  EnrollmentRow,
  RosterStudent,
  StudentOption,
  StudentProfileRow,
} from "./types";

/**
 * The teacher's classes (TCH-02), oldest first, with real roster counts.
 *
 * RLS already limits the table to the signed-in teacher; the explicit
 * `teacher_id` filter is defence in depth and the one the index covers. A signed
 * out visitor gets an empty list rather than an error — the page is behind the
 * middleware and the teacher guard, so this only happens if a session expires
 * mid-navigation.
 *
 * A failed query returns `[]` and logs the code: a broken list is not worth
 * crashing the page over, but it must not be silent either.
 *
 * Counts are fetched with a second query rather than a PostgREST aggregate
 * embed. It is one extra round trip, and it works with any PostgREST version.
 * The `in` filter keeps RLS scoped to exactly the classes already returned.
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

  const rows = data as ClassRow[];
  const counts = await getStudentCounts(rows.map((row) => row.id));

  return rows.map((row) => toClass(row, counts.get(row.id) ?? 0));
}

/**
 * One owned class, or null.
 *
 * The caller turns null into `notFound()`. Filtering by `id` *and* `teacher_id`
 * is what makes a stranger's class and a missing class the same answer — no
 * signal about whether someone else's id exists. RLS is the second lock.
 */
export async function getClassById(id: string): Promise<Class | null> {
  const viewer = await getViewer();

  if (!viewer || viewer.role !== "teacher") {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("id, name, subject, grade_level")
    .eq("id", id)
    .eq("teacher_id", viewer.id)
    .maybeSingle();

  if (error) {
    console.error("[classes] getClassById failed", error.code ?? error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  const row = data as ClassRow;
  const counts = await getStudentCounts([row.id]);

  return toClass(row, counts.get(row.id) ?? 0);
}

/**
 * The class roster (TCH-03), oldest enrollment first.
 *
 * `class_enrollments` is read with the teacher's client, so the existing
 * `class_enrollments_teacher_all` policy limits the rows to classes they own.
 * Names and emails come from the bounded, teacher-gated RPC in the migration:
 * `profiles` RLS forbids reading other people's rows, and that is deliberate.
 *
 * A profile missing from the RPC result still gets a row — the FK guarantees
 * the student exists, so an empty name/email here means the lookup failed and
 * the UI falls back to a translated label rather than hiding the enrollment.
 */
export async function getRoster(classId: string): Promise<RosterStudent[]> {
  const viewer = await getViewer();

  if (!viewer || viewer.role !== "teacher") {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("class_enrollments")
    .select("id, student_id, created_at")
    .eq("class_id", classId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[classes] getRoster failed", error.code ?? error.message);
    return [];
  }

  const rows = data as EnrollmentRow[];
  const profiles = await getStudentProfiles(rows.map((row) => row.student_id));

  return rows.map((row) => {
    const profile = profiles.get(row.student_id);

    return {
      enrollmentId: row.id,
      studentId: row.student_id,
      fullName: profile?.fullName?.trim() || null,
      email: profile?.email ?? "",
      enrolledAt: row.created_at,
    };
  });
}

/**
 * A single registered student, used by the enroll action to reject a teacher
 * id or a made-up uuid before the insert. Returns null on a failed lookup.
 */
export async function getStudentById(id: string): Promise<StudentOption | null> {
  const profiles = await getStudentProfiles([id]);

  return profiles.get(id) ?? null;
}

async function getStudentProfiles(
  ids: string[],
): Promise<Map<string, StudentOption>> {
  const result = new Map<string, StudentOption>();

  if (ids.length === 0) {
    return result;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_students_by_ids", { ids });

  if (error) {
    console.error("[classes] get_students_by_ids failed", error.code ?? error.message);
    return result;
  }

  for (const row of data as StudentProfileRow[]) {
    result.set(row.id, {
      id: row.id,
      fullName: row.full_name?.trim() || null,
      email: row.email,
    });
  }

  return result;
}

async function getStudentCounts(ids: string[]): Promise<Map<string, number>> {
  const counts = new Map<string, number>();

  if (ids.length === 0) {
    return counts;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("class_enrollments")
    .select("class_id")
    .in("class_id", ids);

  if (error) {
    console.error("[classes] getStudentCounts failed", error.code ?? error.message);
    return counts;
  }

  for (const row of data as { class_id: string }[]) {
    counts.set(row.class_id, (counts.get(row.class_id) ?? 0) + 1);
  }

  return counts;
}

function toClass(row: ClassRow, studentCount: number): Class {
  return {
    id: row.id,
    name: row.name,
    subject: row.subject,
    gradeLevel: row.grade_level,
    studentCount,
  };
}
