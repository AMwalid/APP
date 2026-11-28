import "server-only";

import { getViewer } from "@/features/profile";
import { getCurrentUser } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import type {
  Class,
  ClassRow,
  EnrollmentRow,
  RosterStudent,
  StudentClass,
  StudentClassRow,
  StudentGradeRow,
  StudentOption,
  StudentOverview,
  StudentProfileRow,
  StudentStat,
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
 * A failed query throws: an empty list would hide an outage behind the page's
 * empty state.
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
    throw new Error(
      "[classes] getClasses failed: " + (error.code ?? error.message),
    );
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
    throw new Error(
      "[classes] getClassById failed: " + (error.code ?? error.message),
    );
  }

  if (!data) {
    return null;
  }

  const row = data as ClassRow;
  const counts = await getStudentCounts([row.id]);

  return toClass(row, counts.get(row.id) ?? 0);
}

/**
 * The student's enrolled classes (STU-01), oldest class first.
 *
 * A student can read their own enrollments but not `classes` or another
 * account's `profiles`, so the joined read goes through the narrow definer
 * function in `20261119000200_student_classes_rpc.sql`. That function checks the
 * caller's role and filters by `auth.uid()`; repeating the role check here keeps
 * a non-student from even calling it, the same defence in depth as the teacher
 * queries.
 *
 * A failed lookup throws, matching `getClasses()`: an empty list would make a
 * broken lookup look like a student with no classes.
 */
export async function getStudentClasses(): Promise<StudentClass[]> {
  const viewer = await getViewer();

  if (!viewer || viewer.role !== "student") {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_student_classes");

  if (error) {
    throw new Error(
      "[classes] getStudentClasses failed: " + (error.code ?? error.message),
    );
  }

  return ((data ?? []) as StudentClassRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    subject: row.subject,
    gradeLevel: row.grade_level,
    teacherName: row.teacher_name?.trim() || null,
  }));
}

/**
 * The student overview (STU-01).
 *
 * `get_student_classes` provides the class names through the narrow definer RPC;
 * this function adds the student's own enrollment and grade rows, both already
 * limited by RLS to rows belonging to the signed-in student. Averaging happens
 * here with the active locale so components stay presentational.
 */
export async function getStudentOverview(
  locale: string,
): Promise<StudentOverview> {
  const classes = await getStudentClasses();

  if (classes.length === 0) {
    return {
      cards: studentStats(locale, classes, []),
      classes: [],
    };
  }

  const supabase = await createClient();
  const { data: enrollmentRows, error: enrollmentError } = await supabase
    .from("class_enrollments")
    .select("id, class_id")
    .order("created_at", { ascending: true });

  if (enrollmentError) {
    throw new Error(
      "[classes] getStudentOverview enrollments failed: " +
        (enrollmentError.code ?? enrollmentError.message),
    );
  }

  const enrollments = (enrollmentRows ?? []) as {
    id: string;
    class_id: string;
  }[];
  const enrollmentIds = enrollments.map((row) => row.id);

  let grades: StudentGradeRow[] = [];

  if (enrollmentIds.length > 0) {
    const { data: gradeRows, error: gradeError } = await supabase
      .from("grades")
      .select("id, enrollment_id, score, max_score, created_at")
      .in("enrollment_id", enrollmentIds);

    if (gradeError) {
      throw new Error(
        "[classes] getStudentOverview grades failed: " +
          (gradeError.code ?? gradeError.message),
      );
    }

    grades = (gradeRows ?? []) as StudentGradeRow[];
  }

  const classIdByEnrollment = new Map(
    enrollments.map((row) => [row.id, row.class_id]),
  );
  const summaryByClass = new Map<string, { count: number; total: number }>();

  for (const grade of grades) {
    const classId = classIdByEnrollment.get(grade.enrollment_id);

    if (!classId) {
      continue;
    }

    const summary = summaryByClass.get(classId) ?? { count: 0, total: 0 };
    summary.count += 1;
    summary.total += gradeRatio(grade);
    summaryByClass.set(classId, summary);
  }

  const percentFormat = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  });
  const classesWithGrades = classes.map((classItem) => {
    const summary = summaryByClass.get(classItem.id);

    return {
      ...classItem,
      gradeCount: summary?.count ?? 0,
      averageScore:
        summary && summary.count > 0
          ? percentFormat.format(summary.total / summary.count)
          : null,
    };
  });

  return {
    cards: studentStats(locale, classes, grades),
    classes: classesWithGrades,
  };
}

/** Each grade contributes its own percentage, equally weighted. */
function gradeRatio(grade: StudentGradeRow): number {
  const maxScore = Number(grade.max_score);
  return maxScore > 0 ? Number(grade.score) / maxScore : 0;
}

function studentStats(
  locale: string,
  classes: StudentClass[],
  grades: StudentGradeRow[],
): StudentStat[] {
  const numberFormat = new Intl.NumberFormat(locale);
  const percentFormat = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  });
  const total = grades.reduce((sum, grade) => sum + gradeRatio(grade), 0);
  const average = grades.length === 0 ? null : total / grades.length;

  return [
    {
      id: "classes",
      labelKey: "studentOverview.cards.classes.label",
      value: numberFormat.format(classes.length),
      captionKey: "studentOverview.cards.classes.caption",
      tone: "neutral",
    },
    {
      id: "grades",
      labelKey: "studentOverview.cards.grades.label",
      value: numberFormat.format(grades.length),
      captionKey: "studentOverview.cards.grades.caption",
      tone: "neutral",
    },
    {
      id: "average",
      labelKey: "studentOverview.cards.average.label",
      value: average === null ? "" : percentFormat.format(average),
      captionKey: "studentOverview.cards.average.caption",
      emptyKey: "studentOverview.cards.average.empty",
      tone: "positive",
    },
  ];
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
 * the student exists, so an empty name/email here falls back to a translated
 * label in the UI rather than hiding the enrollment.
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
    throw new Error(
      "[classes] getRoster failed: " + (error.code ?? error.message),
    );
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
 * id or a made-up uuid before the insert. Returns null when there is no profile
 * row; a failed lookup throws.
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
    throw new Error(
      "[classes] getStudentProfiles failed: " + (error.code ?? error.message),
    );
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
    throw new Error(
      "[classes] getStudentCounts failed: " + (error.code ?? error.message),
    );
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
