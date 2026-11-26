import { z } from "zod";

export type MessagingFieldErrorKey =
  | "messaging.errors.receiverRequired"
  | "messaging.errors.receiverInvalid"
  | "messaging.errors.empty"
  | "messaging.errors.tooLong";

export type MessagingFormErrorKey =
  | MessagingFieldErrorKey
  | "messaging.errors.notAllowed"
  | "messaging.errors.invalidRecipient"
  | "messaging.errors.unknown"
  | "messaging.errors.sendFailed";

export type Translate = (key: MessagingFormErrorKey) => string;

/** Bounds mirror `20261126000000_create_direct_messages.sql`. */
export function createMessageSchema(t: Translate) {
  return z.object({
    receiverId: z
      .string()
      .min(1, t("messaging.errors.receiverRequired"))
      .uuid(t("messaging.errors.receiverInvalid")),
    content: z
      .string()
      .trim()
      .min(1, t("messaging.errors.empty"))
      .max(2000, t("messaging.errors.tooLong")),
  });
}
