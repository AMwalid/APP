/**
 * Types for the institution directory and the owner-editable profile (INS-01/03).
 *
 * `src/types/database.ts` has not been generated yet, so row shapes are written
 * from `20261122000000_create_institutions_directory.sql` and must stay in sync
 * with it until the Supabase CLI is available.
 */

export const INSTITUTION_TYPES = ["School", "Tutoring Center"] as const;

export type InstitutionStat = {
  id: string;
  labelKey: string;
  value: number;
  captionKey: string;
  tone?: "neutral" | "positive";
};

export type InstitutionOverview = {
  cards: InstitutionStat[];
};

export type PublicInstitution = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  location: string;
  createdAt: string;
};

export type InstitutionRow = {
  id: string;
  owner_id: string;
  name: string;
  type: string;
  description: string | null;
  location: string;
  created_at: string;
};

/** The values the form edits, as plain strings from the inputs. */
export type InstitutionProfile = {
  name: string;
  type: string;
  location: string;
  description: string;
};

export type InstitutionFormValues = InstitutionProfile;

export type InstitutionField = keyof InstitutionFormValues;

export type InstitutionResult =
  | { status: "success"; message?: string }
  | {
      status: "error";
      fieldErrors?: Partial<Record<InstitutionField, string>>;
      formError?: string;
    };
