"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { Message } from "../types";

type MessageThreadProps = {
  messages: readonly Message[];
  currentUserId: string;
  peerName: string;
  locale: string;
};

function formatTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

/** Chronological chat history with logical start/end bubble alignment. */
export function MessageThread({
  messages,
  currentUserId,
  peerName,
  locale,
}: MessageThreadProps) {
  const t = useTranslations("Dashboard");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="grid min-h-64 place-items-center rounded-lg border border-dashed border-border bg-surface-muted p-8 text-center text-sm text-muted-foreground">
        {t("messaging.thread.empty")}
      </div>
    );
  }

  return (
    <div
      aria-label={peerName}
      className="min-h-64 space-y-4 overflow-y-auto rounded-lg border border-border bg-surface-muted p-4 sm:p-5"
      role="log"
    >
      {messages.map((message) => {
        const isMine = message.senderId === currentUserId;

        return (
          <div key={message.id} className="flex w-full flex-col">
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                isMine ? "ms-auto" : "me-auto",
                isMine
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground",
              )}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            </div>
            <time
              dateTime={message.createdAt}
              className={cn(
                "mt-1 block w-fit px-1 text-[11px] text-muted-foreground",
                isMine ? "ms-auto" : "me-auto",
              )}
            >
              {isMine ? `${t("messaging.thread.you")} · ` : ""}
              {formatTime(message.createdAt, locale)}
            </time>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
