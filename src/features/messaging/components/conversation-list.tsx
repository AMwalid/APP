"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Conversation } from "../types";

type ConversationListProps = {
  conversations: readonly Conversation[];
  activePeerId: string | null;
  locale: string;
};

function formatTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

/** Conversation picker on the start edge of the inbox. */
export function ConversationList({
  conversations,
  activePeerId,
  locale,
}: ConversationListProps) {
  const t = useTranslations("Dashboard");

  if (conversations.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-surface-muted p-6 text-center text-sm leading-relaxed text-muted-foreground">
        {t("messaging.conversations.empty")}
      </p>
    );
  }

  return (
    <ul className="space-y-2" aria-label={t("messaging.conversations.title")}>
      {conversations.map((conversation) => {
        const isActive = conversation.peerId === activePeerId;

        return (
          <li key={conversation.peerId}>
            <Link
              href={`/dashboard/messages?peer=${conversation.peerId}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "block rounded-lg border border-e-4 px-4 py-3 transition-colors duration-150 ease-standard hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isActive
                  ? "border-e-primary bg-primary-soft"
                  : "border-e-transparent bg-background",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm font-semibold text-foreground">
                  {conversation.peerName ??
                    t("messaging.conversations.unknown")}
                </span>
                <time
                  dateTime={conversation.lastMessageAt}
                  className="shrink-0 text-[11px] text-muted-foreground"
                >
                  {formatTime(conversation.lastMessageAt, locale)}
                </time>
              </div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {conversation.lastMessage}
                </span>
                {conversation.unreadCount > 0 ? (
                  <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
                    {t("messaging.conversations.unread", {
                      count: conversation.unreadCount,
                    })}
                  </span>
                ) : null}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
