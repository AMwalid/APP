import "server-only";

import { getStudentClasses } from "@/features/classes";
import { getViewer } from "@/features/profile";
import { getCurrentUser } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import type { EnrollmentRef, Grade, GradeRow, StudentGrade } from "./types";

/** `grades` row plus the enrollment id needed to map it to a class. */
type GradeEnrollmentRow = GradeRow & { enrollment_id: string };

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
 * All of the signed-in student's grades across every class, newest first.
 *
 * The student already has RLS access to their own enrollments and grades, so no
 * new definer RPC is needed. Class names are the exception: `classes` is closed
 * to students, so they come from the existing narrow `get_student_classes`
 * function through the classes feature's public API.
 *
 * The role check stops a non-student from calling this directly, the explicit
 * `student_id` filter is defence in depth, and the id tie-break makes equal
 * timestamps deterministic. The 500-row cap mirrors `get_child_grades`.
 */
export async function getStudentGrades(): Promise<StudentGrade[]> {
  const viewer = await getViewer();

  if (!viewer || viewer.role !== "student") {
    return [];
  }

  const supabase = await createClient();
  const { data: enrollmentRows, error: enrollmentError } = await supabase
    .from("class_enrollments")
    .select("id, class_id")
    .eq("student_id", viewer.id);

  if (enrollmentError) {
    throw new Error(
      "[grades] getStudentGrades enrollments failed: " +
        (enrollmentError.code ?? enrollmentError.message),
    );
  }

  const enrollments = (enrollmentRows ?? []) as {
    id: string;
    class_id: string;
  }[];

  if (enrollments.length === 0) {
    return [];
  }

  const [classes, gradeResult] = await Promise.all([
    getStudentClasses(),
    supabase
      .from("grades")
      .select("id, title, score, max_score, created_at, enrollment_id")
      .in(
        "enrollment_id",
        enrollments.map((row) => row.id),
      )
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(500),
  ]);

  if (gradeResult.error) {
    throw new Error(
      "[grades] getStudentGrades grades failed: " +
        (gradeResult.error.code ?? gradeResult.error.message),
    );
  }

  const classById = new Map(classes.map((classItem) => [classItem.id, classItem]));

  // A grade's enrollment always points at one of the student's classes. If the
  // class RPC ever omits one, throw rather than render a blank class cell.
  const classByEnrollment = new Map(
    enrollments.map((row) => {
      const classItem = classById.get(row.class_id);

      if (!classItem) {
        throw new Error(
          "[grades] getStudentGrades missing class for enrollment " + row.id,
        );
      }

      return [row.id, classItem] as const;
    }),
  );

  return ((gradeResult.data ?? []) as GradeEnrollmentRow[]).map((row) => {
    const classItem = classByEnrollment.get(row.enrollment_id);

    if (!classItem) {
      throw new Error(
        "[grades] getStudentGrades missing enrollment for grade " + row.id,
      );
    }

    return {
      id: row.id,
      title: row.title,
      score: Number(row.score),
      maxScore: Number(row.max_score),
      createdAt: row.created_at,
      classId: classItem.id,
      className: classItem.name,
      subject: classItem.subject,
    };
  });
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
