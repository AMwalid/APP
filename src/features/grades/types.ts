/**
 * Types for the gradebook (GRD-01).
 *
 * `numeric` columns come back from PostgREST as strings, so `GradeRow` keeps
 * them as strings and `queries.ts` converts them before a component ever sees
 * them. The UI deals in numbers; the database keeps exact decimals.
 *
 * The form fields are strings too: a number input's value is a string, and the
 * zod schema validates that string before the action converts it. That keeps
 * the client and server on exactly the same input shape.
 */

/** The enrollment a grade attaches to, after the ownership check. */
export type EnrollmentRef = {
  id: string;
  studentId: string;
};

/** One grade, as the UI renders it. */
export type Grade = {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  createdAt: string;
  /**
   * Only set for the parent's cross-class view. Teacher and student pages show
   * grades for a single class, so they have no need for a class column.
   */
  className?: string;
  subject?: string;
};

/** A row of `public.grades`, as returned by PostgREST. */
export type GradeRow = {
  id: string;
  title: string;
  score: string;
  max_score: string;
  created_at: string;
};

/** The Add Grade form's raw values. */
export type GradeFormValues = {
  title: string;
  score: string;
  maxScore: string;
};

export type GradeField = keyof GradeFormValues;

/**
 * What the create action hands back. Failures are data, not exceptions, so the
 * dialog keeps its locale and can show a translated message.
 */
export type GradeResult =
  | { status: "success" }
  | {
      status: "error";
      fieldErrors?: Partial<Record<GradeField, string>>;
      formError?: string;
    };
