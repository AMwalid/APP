import "server-only";

import { getClasses } from "@/features/classes";
import { getViewer } from "@/features/profile";
import { createClient } from "@/lib/supabase/server";
import type { TeacherOverview } from "./types";

/** Only `id` is needed: the grade count is a quantity, not a row list. */
type EnrollmentIdRow = { id: string };

/**
 * The teacher overview (TCH-02 / TCH-03).
 *
 * The class list comes from `getClasses()`, which is already RLS-scoped to the
 * signed-in teacher. Enrollment ids are read with the same teacher client, and
 * the grade count is a head-only query over those ids: RLS on `grades` only
 * allows a teacher to see grades through classes they own.
 *
 * There is no assignment/submission table, so "pending grading" cannot be
 * reported honestly. The third figure is grades actually recorded instead.
 */
export async function getTeacherOverview(): Promise<TeacherOverview> {
  const viewer = await getViewer();

  if (!viewer || viewer.role !== "teacher") {
    return { cards: [], classes: [] };
  }

  const classes = await getClasses();
  const gradeCount = await getGradeCount(classes.map((item) => item.id));
  const studentCount = classes.reduce(
    (sum, item) => sum + item.studentCount,
    0,
  );

  return {
    cards: [
      {
        id: "students",
        labelKey: "teacherOverview.cards.students.label",
        value: studentCount,
        captionKey: "teacherOverview.cards.students.caption",
        tone: "neutral",
      },
      {
        id: "classes",
        labelKey: "teacherOverview.cards.classes.label",
        value: classes.length,
        captionKey: "teacherOverview.cards.classes.caption",
        tone: "neutral",
      },
      {
        id: "grading",
        labelKey: "teacherOverview.cards.grading.label",
        value: gradeCount,
        captionKey: "teacherOverview.cards.grading.caption",
        tone: "neutral",
      },
    ],
    classes,
  };
}

async function getGradeCount(classIds: string[]): Promise<number> {
  if (classIds.length === 0) {
    return 0;
  }

  const supabase = await createClient();
  const { data: enrollments, error: enrollmentError } = await supabase
    .from("class_enrollments")
    .select("id")
    .in("class_id", classIds);

  if (enrollmentError) {
    throw new Error(
      "[teachers] getGradeCount enrollments failed: " +
        (enrollmentError.code ?? enrollmentError.message),
    );
  }

  const enrollmentIds = (enrollments as EnrollmentIdRow[]).map((row) => row.id);

  if (enrollmentIds.length === 0) {
    return 0;
  }

  const { count, error } = await supabase
    .from("grades")
    .select("id", { count: "exact", head: true })
    .in("enrollment_id", enrollmentIds);

  if (error) {
    throw new Error(
      "[teachers] getGradeCount failed: " + (error.code ?? error.message),
    );
  }

  return count ?? 0;
}
