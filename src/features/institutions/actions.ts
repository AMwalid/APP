"use server";

import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getViewer } from "@/features/profile";
import { createInstitutionSchema } from "./schemas";
import type { InstitutionFormErrorKey, Translate } from "./schemas";
import type { InstitutionField, InstitutionResult } from "./types";

async function translator(): Promise<Translate> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Dashboard" });
  return (key: InstitutionFormErrorKey) => t(key);
}

/** Field path -> translated message, with a safe fallback for unknown keys. */
function fieldErrors(
  issues: readonly { path: readonly PropertyKey[]; message: string }[],
): Partial<Record<InstitutionField, string>> {
  const errors: Partial<Record<InstitutionField, string>> = {};
  for (const issue of issues) {
    const field = issue.path[0];
    if (field === "name" || field === "type" || field === "location" || field === "description") {
      errors[field] ??= issue.message;
    }
  }
  return errors;
}

/**
 * Institution profile Server Action (INS-03).
 *
 * The viewer's role is rechecked here and the id comes from the verified session,
 * not the payload. RLS enforces ownership a second time. The action upserts by
 * `owner_id` so first-time creation and later edits share one form.
 */
export async function saveInstitutionProfile(
  formData: FormData,
): Promise<InstitutionResult> {
  const t = await translator();
  const viewer = await getViewer();

  if (!viewer || viewer.role !== "institution_admin") {
    return { status: "error", formError: t("institutionProfile.form.errors.unknown") };
  }

  const parsed = createInstitutionSchema(t).safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    location: formData.get("location"),
    description: formData.get("description") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: fieldErrors(parsed.error.issues),
    };
  }

  const supabase = await createClient();
  const { data: existing, error: lookupError } = await supabase
    .from("institutions")
    .select("id")
    .eq("owner_id", viewer.id)
    .maybeSingle();

  if (lookupError) {
    console.error("Institution ownership lookup failed", lookupError.message);
    return { status: "error", formError: t("institutionProfile.form.errors.unknown") };
  }

  const description = parsed.data.description.trim();
  const payload = {
    name: parsed.data.name,
    type: parsed.data.type,
    location: parsed.data.location,
    description: description === "" ? null : description,
  };

  const result = existing
    ? await supabase
        .from("institutions")
        .update(payload)
        .eq("id", existing.id)
        .eq("owner_id", viewer.id)
        .select("id")
        .single()
    : await supabase
        .from("institutions")
        .insert({ ...payload, owner_id: viewer.id })
        .select("id")
        .single();

  if (result.error) {
    console.error("Failed to save institution", result.error.message);
    return { status: "error", formError: t("institutionProfile.form.errors.unknown") };
  }

  revalidatePath("/institutions");
  revalidatePath("/institutions/dashboard");

  return {
    status: "success",
    message: t(
      existing
        ? "institutionProfile.form.errors.updateSuccess"
        : "institutionProfile.form.errors.createSuccess",
    ),
  };
}
