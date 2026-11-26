"use client";

import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import type { Conversation, Message } from "../types";
import { useMessageRealtime } from "../realtime";
import { ConversationList } from "./conversation-list";
import { MessageComposer } from "./message-composer";
import { MessageThread } from "./message-thread";

type MessagingViewProps = {
  locale: string;
  currentUserId: string;
  conversations: readonly Conversation[];
  messages: readonly Message[];
  activePeerId: string | null;
  activePeerName?: string | null;
};

function newestFirst(a: Conversation, b: Conversation) {
  return b.lastMessageAt.localeCompare(a.lastMessageAt);
}

function chronological(a: Message, b: Message) {
  return a.createdAt.localeCompare(b.createdAt);
}

/** Two-pane inbox: conversations on the start edge, thread on the end edge. */
export function MessagingView({
  locale,
  currentUserId,
  conversations,
  messages,
  activePeerId,
  activePeerName = null,
}: MessagingViewProps) {
  const t = useTranslations("Dashboard");
  const [threads, setThreads] = useState<readonly Message[]>(messages);
  const [summary, setSummary] = useState<readonly Conversation[]>(() =>
    conversations.map((conversation) =>
      conversation.peerId === activePeerId
        ? { ...conversation, unreadCount: 0 }
        : conversation,
    ),
  );

  const handleMessage = useCallback(
    (message: Message) => {
      const peerId =
        message.senderId === currentUserId
          ? message.receiverId
          : message.senderId;
      const isIncoming = message.receiverId === currentUserId;

      if (peerId === activePeerId) {
        setThreads((current) =>
          current.some((item) => item.id === message.id)
            ? current
            : [...current, message].sort(chronological),
        );
      }

      setSummary((current) => {
        const existing = current.find((item) => item.peerId === peerId);
        const unreadCount =
          peerId === activePeerId
            ? 0
            : (existing?.unreadCount ?? 0) + (isIncoming ? 1 : 0);

        const updated: Conversation = {
          peerId,
          peerName: existing?.peerName ?? activePeerName ?? null,
          lastMessage: message.content,
          lastMessageAt: message.createdAt,
          unreadCount,
        };

        return [updated, ...current.filter((item) => item.peerId !== peerId)]
          .sort(newestFirst);
      });
    },
    [activePeerId, activePeerName, currentUserId],
  );

  useMessageRealtime({ currentUserId, onMessage: handleMessage });

  const displaySummary = summary.map((conversation) =>
    conversation.peerId === activePeerId && !conversation.peerName && activePeerName
      ? { ...conversation, peerName: activePeerName }
      : conversation,
  );
  const activeConversation = displaySummary.find(
    (item) => item.peerId === activePeerId,
  );
  const peerName =
    activeConversation?.peerName ?? t("messaging.conversations.unknown");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-balance text-foreground">
          {t("messaging.title")}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("messaging.subtitle")}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <section className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            {t("messaging.conversations.title")}
          </h2>
          <ConversationList
            conversations={displaySummary}
            activePeerId={activePeerId}
            locale={locale}
          />
        </section>

        <section className="flex min-h-96 flex-col rounded-xl border border-border bg-background p-4 shadow-sm sm:p-5">
          {activePeerId ? (
            <>
              <h2 className="mb-4 text-base font-semibold text-foreground">
                {peerName}
              </h2>
              <div className="flex-1">
                <MessageThread
                  messages={threads}
                  currentUserId={currentUserId}
                  peerName={peerName}
                  locale={locale}
                />
              </div>
              <div className="mt-4">
                <MessageComposer peerId={activePeerId} onSent={handleMessage} />
              </div>
            </>
          ) : (
            <div className="grid flex-1 place-items-center rounded-lg border border-dashed border-border bg-surface-muted p-10 text-center text-sm leading-relaxed text-muted-foreground">
              {t("messaging.conversations.selectPrompt")}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
