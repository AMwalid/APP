/**
 * Types for 1:1 direct messaging (PAR-06 / TCH-05).
 *
 * The Supabase CLI is not wired into this checkout yet, so row shapes are
 * written from `20261126000000_create_direct_messages.sql` and must stay in
 * sync with it until generated types are available.
 */

export type Conversation = {
  peerId: string;
  peerName: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};

export type ConversationRow = {
  peer_id: string;
  peer_name: string | null;
  last_message: string;
  last_message_at: string;
  unread_count: number | string;
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  readAt: string | null;
  createdAt: string;
};

export type MessageRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
};

export type MessageFormValues = {
  receiverId: string;
  content: string;
};

export type MessageField = keyof MessageFormValues;

export type SendMessageResult =
  | { status: "success"; message: Message }
  | {
      status: "error";
      fieldErrors?: Partial<Record<MessageField, string>>;
      formError?: string;
    };

export type TeacherMessageState =
  | "guest"
  | "eligible"
  | "self"
  | "unavailable";

export function toMessage(row: MessageRow): Message {
  return {
    id: row.id,
    senderId: row.sender_id,
    receiverId: row.receiver_id,
    content: row.content,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}
