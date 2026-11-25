"use server";

import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";
import { getViewer } from "@/features/profile";
import { createClient } from "@/lib/supabase/server";
import { createProductSchema } from "./schemas";
import type { StoreFormErrorKey, Translate } from "./schemas";
import type { ProductField, ProductResult } from "./types";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function sellerContext(): Promise<
  { viewerId: string; t: Translate } | null
> {
  const locale = await getLocale();
  const translate = await getTranslations({ locale, namespace: "Dashboard" });
  const t: Translate = (key: StoreFormErrorKey) => translate(key);

  const viewer = await getViewer();
  const isSeller =
    viewer?.role === "teacher" || viewer?.role === "institution_admin";

  if (!viewer || !isSeller) {
    return null;
  }

  return { viewerId: viewer.id, t };
}

function fieldErrors(
  issues: readonly { path: readonly PropertyKey[]; message: string }[],
): Partial<Record<ProductField, string>> {
  const errors: Partial<Record<ProductField, string>> = {};

  for (const issue of issues) {
    const field = issue.path[0];
    if (
      field === "title" ||
      field === "type" ||
      field === "price" ||
      field === "description"
    ) {
      errors[field] ??= issue.message;
    }
  }

  return errors;
}

function formDataValues(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    type: String(formData.get("type") ?? ""),
    price: String(formData.get("price") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
}

function revalidateStore() {
  revalidatePath("/store");
  revalidatePath("/dashboard/store");
}

/**
 * Create a listing. The seller id comes from the verified session, and RLS
 * repeats the ownership and role checks.
 */
export async function createProduct(formData: FormData): Promise<ProductResult> {
  const context = await sellerContext();
  if (!context) {
    const locale = await getLocale();
    const translate = await getTranslations({ locale, namespace: "Dashboard" });
    return {
      status: "error",
      formError: translate("store.form.errors.unknown"),
    };
  }

  const parsed = createProductSchema(context.t).safeParse(formDataValues(formData));
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrors(parsed.error.issues) };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .insert({
      seller_id: context.viewerId,
      title: parsed.data.title,
      type: parsed.data.type,
      price: Number(parsed.data.price),
      description: parsed.data.description,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create product", error.message);
    return {
      status: "error",
      formError: context.t("store.form.errors.unknown"),
    };
  }

  revalidateStore();
  return {
    status: "success",
    message: context.t("store.form.errors.createSuccess"),
  };
}

/** Edit one of the signed-in seller's own listings. */
export async function updateProduct(
  id: string,
  formData: FormData,
): Promise<ProductResult> {
  const context = await sellerContext();
  if (!context) {
    const locale = await getLocale();
    const translate = await getTranslations({ locale, namespace: "Dashboard" });
    return {
      status: "error",
      formError: translate("store.form.errors.unknown"),
    };
  }

  if (!UUID_PATTERN.test(id)) {
    return { status: "error", formError: context.t("store.form.errors.notFound") };
  }

  const parsed = createProductSchema(context.t).safeParse(formDataValues(formData));
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrors(parsed.error.issues) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .update({
      title: parsed.data.title,
      type: parsed.data.type,
      price: Number(parsed.data.price),
      description: parsed.data.description,
    })
    .eq("id", id)
    .eq("seller_id", context.viewerId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to update product", error.message);
    return {
      status: "error",
      formError: context.t("store.form.errors.unknown"),
    };
  }

  if (!data) {
    return { status: "error", formError: context.t("store.form.errors.notFound") };
  }

  revalidateStore();
  return {
    status: "success",
    message: context.t("store.form.errors.updateSuccess"),
  };
}

/** Delete one of the signed-in seller's own listings. */
export async function deleteProduct(id: string): Promise<ProductResult> {
  const context = await sellerContext();
  if (!context) {
    const locale = await getLocale();
    const translate = await getTranslations({ locale, namespace: "Dashboard" });
    return {
      status: "error",
      formError: translate("store.form.errors.unknown"),
    };
  }

  if (!UUID_PATTERN.test(id)) {
    return { status: "error", formError: context.t("store.form.errors.notFound") };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("seller_id", context.viewerId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to delete product", error.message);
    return {
      status: "error",
      formError: context.t("store.form.errors.unknown"),
    };
  }

  if (!data) {
    return { status: "error", formError: context.t("store.form.errors.notFound") };
  }

  revalidateStore();
  return {
    status: "success",
    message: context.t("store.form.errors.deleteSuccess"),
  };
}
