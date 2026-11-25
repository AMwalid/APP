import { z } from "zod";
import { INSTITUTION_TYPES } from "./types";

export type InstitutionFieldErrorKey =
  | "institutionProfile.form.errors.nameRequired"
  | "institutionProfile.form.errors.nameTooShort"
  | "institutionProfile.form.errors.nameTooLong"
  | "institutionProfile.form.errors.typeRequired"
  | "institutionProfile.form.errors.typeInvalid"
  | "institutionProfile.form.errors.locationRequired"
  | "institutionProfile.form.errors.locationTooShort"
  | "institutionProfile.form.errors.locationTooLong"
  | "institutionProfile.form.errors.descriptionTooLong";

export type InstitutionFormErrorKey =
  | InstitutionFieldErrorKey
  | "institutionProfile.form.errors.unknown"
  | "institutionProfile.form.errors.notFound"
  | "institutionProfile.form.errors.success"
  | "institutionProfile.form.errors.createSuccess"
  | "institutionProfile.form.errors.updateSuccess";

export type Translate = (key: InstitutionFormErrorKey) => string;

/** Bounds mirror `20261122000000_create_institutions_directory.sql`. */
export function createInstitutionSchema(t: Translate) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, t("institutionProfile.form.errors.nameTooShort"))
      .max(120, t("institutionProfile.form.errors.nameTooLong"))
      .min(1, t("institutionProfile.form.errors.nameRequired")),
    type: z
      .string()
      .min(1, t("institutionProfile.form.errors.typeRequired"))
      .refine((value) => INSTITUTION_TYPES.some((allowed) => allowed === value), {
        message: t("institutionProfile.form.errors.typeInvalid"),
      }),
    location: z
      .string()
      .trim()
      .min(2, t("institutionProfile.form.errors.locationTooShort"))
      .max(120, t("institutionProfile.form.errors.locationTooLong"))
      .min(1, t("institutionProfile.form.errors.locationRequired")),
    description: z
      .string()
      .trim()
      .max(2000, t("institutionProfile.form.errors.descriptionTooLong")),
  });
}
