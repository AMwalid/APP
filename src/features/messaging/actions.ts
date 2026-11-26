"use server";

import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";
import { getProfile } from "@/features/profile";
import { createClient } from "@/lib/supabase/server";
import { createMessageSchema } from "./schemas";
import type { MessagingFormErrorKey, Translate } from "./schemas";
import type { MessageField, MessageRow, SendMessageResult } from "./types";
import { toMessage } from "./types";

const SENDER_ROLES = new Set(["parent", "teacher", "institution_admin"]);

function formDataValues(formData: FormData) {
  return {
    receiverId: String(formData.get("receiverId") ?? ""),
    content: String(formData.get("content") ?? ""),
  };
}

function fieldErrors(
  issues: readonly { path: readonly PropertyKey[]; message: string }[],
): Partial<Record<MessageField, string>> {
  const errors: Partial<Record<MessageField, string>> = {};

  for (const issue of issues) {
    const field = issue.path[0];
    if (field === "receiverId" || field === "content") {
      errors[field] ??= issue.message;
    }
  }

  return errors;
}

async function messagingContext(): Promise<{
  senderId: string | null;
  role: string | null;
  t: Translate;
}> {
  const locale = await getLocale();
  const translate = await getTranslations({ locale, namespace: "Dashboard" });
  const t: Translate = (key: MessagingFormErrorKey) => translate(key);

  const profile = await getProfile();
  return {
    senderId: profile?.id ?? null,
    role: profile?.role ?? null,
    t,
  };
}

/** Send one message. The sender and recipient are both checked server-side. */
export async function sendMessage(
  formData: FormData,
): Promise<SendMessageResult> {
  const context = await messagingContext();

  if (!context.senderId || !context.role || !SENDER_ROLES.has(context.role)) {
    return {
      status: "error",
      formError: context.t("messaging.errors.notAllowed"),
    };
  }

  const parsed = createMessageSchema(context.t).safeParse(
    formDataValues(formData),
  );
  if (!parsed.success) {
    return { status: "error", fieldErrors: fieldErrors(parsed.error.issues) };
  }

  const supabase = await createClient();
  const { data: canMessage, error: permissionError } = await supabase.rpc(
    "can_message_user",
    { p_user_id: parsed.data.receiverId },
  );

  if (permissionError || canMessage !== true) {
    console.error(
      "[messaging] recipient check failed",
      permissionError?.code ?? permissionError?.message ?? "not allowed",
    );
    return {
      status: "error",
      formError: context.t("messaging.errors.invalidRecipient"),
    };
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: context.senderId,
      receiver_id: parsed.data.receiverId,
      content: parsed.data.content,
    })
    .select("id, sender_id, receiver_id, content, read_at, created_at")
    .single();

  if (error) {
    console.error("[messaging] insert failed", error.code ?? error.message);
    return { status: "error", formError: context.t("messaging.errors.sendFailed") };
  }

  revalidatePath("/dashboard/messages");

  return { status: "success", message: toMessage(data as MessageRow) };
}
