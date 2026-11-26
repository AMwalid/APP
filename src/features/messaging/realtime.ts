"use client";

import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useEffect, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Message, MessageRow } from "./types";
import { toMessage } from "./types";

type UseMessageRealtimeOptions = {
  currentUserId: string;
  onMessage: (message: Message) => void;
};

/**
 * Subscribes to INSERTs in either direction for the signed-in user.
 *
 * Supabase Realtime filters one column per subscription, so outgoing and
 * incoming messages need separate handlers. Duplicates are removed by the
 * caller using the message id.
 */
export function useMessageRealtime({
  currentUserId,
  onMessage,
}: UseMessageRealtimeOptions) {
  const supabase = useMemo(() => createClient(), []);
  const handler = useRef(onMessage);

  useEffect(() => {
    handler.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const handleChange = (
      payload: RealtimePostgresChangesPayload<MessageRow>,
    ) => {
      if (payload.eventType !== "INSERT" || !payload.new) {
        return;
      }

      handler.current(toMessage(payload.new as MessageRow));
    };

    const channel = supabase
      .channel(`messages:${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${currentUserId}`,
        },
        handleChange,
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${currentUserId}`,
        },
        handleChange,
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [currentUserId, supabase]);
}
