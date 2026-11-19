/**
 * Types for teacher classes (TCH-02) and their rosters (TCH-03).
 *
 * The UI deals in camelCase (`gradeLevel`, `fullName`); the columns are
 * snake_case. The mapping lives in `queries.ts` / `actions.ts`, so components
 * never see a raw database row.
 */

/** One class, as the teacher's pages render it. */
export type Class = {
  id: string;
  name: string;
  subject: string;
  gradeLevel: string;
  /** Number of enrolled students, shown on the classes grid. */
  studentCount: number;
};

/**
 * One class in the student's dashboard (STU-01).
 *
 * The teacher's name is nullable: a class can outlive a missing profile row,
 * and the card falls back to a translated label instead of hiding the class.
 */
export type StudentClass = {
  id: string;
  name: string;
  subject: string;
  gradeLevel: string;
  teacherName: string | null;
};

/** A row from the `get_student_classes` definer function. */
export type StudentClassRow = {
  id: string;
  name: string;
  subject: string;
  grade_level: string;
  teacher_name: string | null;
};

/**
 * A row of `public.classes`, as returned by the query.
 *
 * Hand-written from `supabase/migrations/20261119000000_create_classes_tables.sql`
 * because `src/types/database.ts` has not been generated yet (the Supabase CLI
 * is not installed). Replace this with `Tables<"classes">` the moment it is:
 * the column list here has to stay identical to the migration until then.
 */
export type ClassRow = {
  id: string;
  name: string;
  subject: string;
  grade_level: string;
};

/** A row of `public.class_enrollments`. */
export type EnrollmentRow = {
  id: string;
  student_id: string;
  created_at: string;
};

/** A row from the `get_students_by_ids` / `search_students` RPCs. */
export type StudentProfileRow = {
  id: string;
  full_name: string | null;
  email: string;
};

/** One result in the Add Student search. */
export type StudentOption = {
  id: string;
  fullName: string | null;
  email: string;
};

/** One row of the class roster. */
export type RosterStudent = {
  enrollmentId: string;
  studentId: string;
  fullName: string | null;
  email: string;
  enrolledAt: string;
};

/** The create/edit class form state. */
export type ClassFormValues = {
  name: string;
  subject: string;
  gradeLevel: string;
};

export type ClassFormField = keyof ClassFormValues;

/**
 * What the class actions hand back: `createClass`, `updateClass`, `deleteClass`.
 *
 * Failures are data, not exceptions, so the dialog keeps its locale and can show
 * a translated message. `fieldErrors` is partial because a single failed submit
 * may only concern one field, and absent for delete, which has no fields.
 */
export type ClassResult =
  | { status: "success" }
  | {
      status: "error";
      fieldErrors?: Partial<Record<ClassFormField, string>>;
      formError?: string;
    };

/** What the enrollment and removal actions hand back. */
export type EnrollResult =
  | { status: "success" }
  | { status: "error"; formError?: string };
