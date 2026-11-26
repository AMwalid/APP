"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { FormAlert } from "@/components/shared/form-alert";
import { Button } from "@/components/ui/button";
import { sendMessage } from "../actions";
import type { Message } from "../types";

type MessageComposerProps = {
  peerId: string;
  onSent: (message: Message) => void;
};

const textareaClasses =
  "flex w-full resize-y rounded-control border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors duration-150 ease-standard placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive";

/** Sends a message through the Server Action and appends it optimistically. */
export function MessageComposer({ peerId, onSent }: MessageComposerProps) {
  const t = useTranslations("Dashboard");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = content.trim();

    if (!trimmed || isPending) {
      return;
    }

    setError(null);

    const payload = new FormData();
    payload.set("receiverId", peerId);
    payload.set("content", trimmed);

    startTransition(async () => {
      const result = await sendMessage(payload);

      if (result.status === "success") {
        onSent(result.message);
        setContent("");
        return;
      }

      setError(
        result.fieldErrors?.content ??
          result.formError ??
          t("messaging.errors.sendFailed"),
      );
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border-t border-border pt-4">
      <label
        htmlFor="message-composer"
        className="text-sm font-medium text-foreground"
      >
        {t("messaging.composer.label")}
      </label>
      <textarea
        id="message-composer"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={3}
        maxLength={2000}
        placeholder={t("messaging.composer.placeholder")}
        className={textareaClasses}
      />
      {error ? <FormAlert tone="error">{error}</FormAlert> : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {t("messaging.composer.hint")}
        </p>
        <Button type="submit" size="md" disabled={!content.trim() || isPending}>
          {isPending
            ? t("messaging.composer.sending")
            : t("messaging.composer.send")}
        </Button>
      </div>
    </form>
  );
}
