/**
 * Types for teacher classes (TCH-02).
 *
 * The UI deals in `gradeLevel`; the column is `grade_level`. Keeping the
 * mapping in one place (`queries.ts` / `actions.ts`) means the components never
 * see a snake_case key.
 */

/** One class, as the teacher's page renders it. */
export type Class = {
  id: string;
  name: string;
  subject: string;
  gradeLevel: string;
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

/**
 * The create/edit class form state.
 *
 * All three fields are strings because that is what an `<input>` produces. The
 * schema trims and validates them, and the action maps them to columns once.
 */
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
