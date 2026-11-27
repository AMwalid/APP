/**
 * Types for the teacher profile form (TCH-01).
 *
 * The form deals in plain strings because that is what the inputs produce —
 * including `experienceYears`, which the schema checks as digits and the action
 * converts to a number. `currentInstitutionId` is also a string: `""` is the
 * native `<select>` representation of "no school yet", converted to NULL once.
 * Keeping the form type identical to the schema *input* type is what lets
 * `zodResolver` infer correctly.
 *
 * `src/types/database.ts` has not been generated yet (the Supabase CLI is not
 * installed), so the row shape is hand-written from
 * `20261120000100_add_teacher_profile_fields.sql` plus
 * `20261127000000_link_teachers_to_institutions.sql` until then.
 */

export type TeacherProfileRow = {
  id: string;
  full_name: string | null;
  specialization: string | null;
  experience_years: number | null;
  bio: string | null;
  current_institution_id: string | null;
};

/** The values the form edits, as the server read them. */
export type TeacherProfile = {
  fullName: string;
  specialization: string;
  /** Empty when the teacher has not entered a number yet. */
  experienceYears: string;
  bio: string;
  /** Empty when the teacher has not chosen a school yet. */
  currentInstitutionId: string;
};

export type TeacherProfileFormValues = TeacherProfile;

export type TeacherProfileField = keyof TeacherProfileFormValues;

/**
 * What `updateTeacherProfile` hands back. Failures are data, not exceptions, so
 * the form keeps its locale and shows a translated message — the same contract
 * as `AuthResult`, `ChildResult` and `ProfileResult`.
 */
export type TeacherProfileResult =
  | { status: "success" }
  | {
      status: "error";
      fieldErrors?: Partial<Record<TeacherProfileField, string>>;
      formError?: string;
    };
