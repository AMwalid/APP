import { z } from "zod";
import { PRODUCT_TYPES } from "./types";

export type StoreFieldErrorKey =
  | "store.form.errors.titleRequired"
  | "store.form.errors.titleTooShort"
  | "store.form.errors.titleTooLong"
  | "store.form.errors.typeRequired"
  | "store.form.errors.typeInvalid"
  | "store.form.errors.priceRequired"
  | "store.form.errors.priceInvalid"
  | "store.form.errors.priceTooHigh"
  | "store.form.errors.descriptionRequired"
  | "store.form.errors.descriptionTooShort"
  | "store.form.errors.descriptionTooLong";

export type StoreFormErrorKey =
  | StoreFieldErrorKey
  | "store.form.errors.unknown"
  | "store.form.errors.notFound"
  | "store.form.errors.createSuccess"
  | "store.form.errors.updateSuccess"
  | "store.form.errors.deleteSuccess";

export type Translate = (key: StoreFormErrorKey) => string;

/** Bounds mirror `20261125000000_create_store_products.sql`. */
export function createProductSchema(t: Translate) {
  return z.object({
    title: z
      .string()
      .trim()
      .min(1, t("store.form.errors.titleRequired"))
      .min(2, t("store.form.errors.titleTooShort"))
      .max(140, t("store.form.errors.titleTooLong")),
    type: z
      .string()
      .min(1, t("store.form.errors.typeRequired"))
      .refine((value) => PRODUCT_TYPES.some((allowed) => allowed === value), {
        message: t("store.form.errors.typeInvalid"),
      }),
    price: z
      .string()
      .trim()
      .min(1, t("store.form.errors.priceRequired"))
      .regex(/^\d+(?:\.\d{1,2})?$/, t("store.form.errors.priceInvalid"))
      .refine((value) => Number(value) <= 99_999_999.99, {
        message: t("store.form.errors.priceTooHigh"),
      }),
    description: z
      .string()
      .trim()
      .min(1, t("store.form.errors.descriptionRequired"))
      .min(2, t("store.form.errors.descriptionTooShort"))
      .max(2000, t("store.form.errors.descriptionTooLong")),
  });
}
