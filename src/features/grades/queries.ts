import "server-only";

import { getViewer } from "@/features/profile";
import { getCurrentUser } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import type { EnrollmentRef, Grade, GradeRow } from "./types";

/**
 * Grades for one enrollment, newest first (GRD-01).
 *
 * No role check here on purpose: the `grades` RLS policies are the boundary and
 * already separate a teacher's view from a student's. Both callers validate the
 * enrollment belongs to them before calling this, so a forged id cannot reach
 * PostgREST without an ownership check in the page or action.
 *
 * `numeric` columns arrive as strings; converting here keeps components free of
 * database shapes. A failed read throws rather than returning `[]`, which would
 * hide an outage behind the page's empty state.
 */
export async function getGrades(enrollmentId: string): Promise<Grade[]> {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("grades")
    .select("id, title, score, max_score, created_at")
    .eq("enrollment_id", enrollmentId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      "[grades] getGrades failed: " + (error.code ?? error.message),
    );
  }

  return (data as GradeRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    score: Number(row.score),
    maxScore: Number(row.max_score),
    createdAt: row.created_at,
  }));
}

/**
 * One enrollment in one of the teacher's classes, or null.
 *
 * Filtering on both ids is what makes a stale enrollment from another class
 * impossible to use. The teacher RLS on `class_enrollments` is the second lock,
 * and the role check stops a parent from calling this query directly.
 */
export async function getTeacherEnrollment(
  classId: string,
  enrollmentId: string,
): Promise<EnrollmentRef | null> {
  const viewer = await getViewer();

  if (!viewer || viewer.role !== "teacher") {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("class_enrollments")
    .select("id, student_id")
    .eq("id", enrollmentId)
    .eq("class_id", classId)
    .maybeSingle();

  if (error) {
    throw new Error(
      "[grades] getTeacherEnrollment failed: " + (error.code ?? error.message),
    );
  }

  if (!data) {
    return null;
  }

  return { id: data.id, studentId: data.student_id };
}

/**
 * The signed-in student's enrollment in one class, or null.
 *
 * The student RLS already limits the table to their own rows; filtering by
 * `student_id` as well is defence in depth and uses the existing index.
 */
export async function getStudentEnrollmentForClass(
  classId: string,
): Promise<EnrollmentRef | null> {
  const viewer = await getViewer();

  if (!viewer || viewer.role !== "student") {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("class_enrollments")
    .select("id, student_id")
    .eq("class_id", classId)
    .eq("student_id", viewer.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      "[grades] getStudentEnrollmentForClass failed: " +
        (error.code ?? error.message),
    );
  }

  if (!data) {
    return null;
  }

  return { id: data.id, studentId: data.student_id };
}
