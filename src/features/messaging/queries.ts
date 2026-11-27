import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  Conversation,
  ConversationRow,
  Message,
  MessageRow,
} from "./types";
import { toMessage } from "./types";

/** Inbox summaries for the signed-in participant, newest thread first. */
export async function getConversations(): Promise<Conversation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_conversations");

  if (error) {
    throw new Error(
      "[messaging] getConversations failed: " + (error.code ?? error.message),
    );
  }

  return ((data ?? []) as ConversationRow[]).map((row) => ({
    peerId: row.peer_id,
    peerName: row.peer_name,
    lastMessage: row.last_message,
    lastMessageAt: row.last_message_at,
    unreadCount: Number(row.unread_count),
  }));
}

/** Oldest-to-newest history for one peer, capped by the RPC at 200 rows. */
export async function getConversation(peerId: string): Promise<Message[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_conversation", {
    p_peer_id: peerId,
  });

  if (error) {
    throw new Error(
      "[messaging] getConversation failed: " + (error.code ?? error.message),
    );
  }

  return ((data ?? []) as MessageRow[]).map(toMessage);
}
