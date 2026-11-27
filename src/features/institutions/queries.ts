import "server-only";

import { getConversations } from "@/features/messaging";
import { getSellerProducts } from "@/features/store";
import { createClient } from "@/lib/supabase/server";
import type {
  InstitutionOverview,
  InstitutionProfile,
  InstitutionRow,
  PublicInstitution,
} from "./types";

function asPublicInstitution(row: {
  id: unknown;
  name: unknown;
  type: unknown;
  description: unknown;
  location: unknown;
  created_at: unknown;
}): PublicInstitution {
  return {
    id: String(row.id),
    name: String(row.name),
    type: String(row.type),
    description: row.description == null ? null : String(row.description),
    location: String(row.location),
    createdAt: String(row.created_at),
  };
}

/** Public directory rows, filtered by name or location via a bounded RPC. */
export async function getPublicInstitutions(
  needle: string,
): Promise<PublicInstitution[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_public_institutions", {
    needle,
  });

  if (error) {
    throw new Error(
      "[institutions] getPublicInstitutions failed: " +
        (error.code ?? error.message),
    );
  }

  return Array.isArray(data) ? data.map((row) => asPublicInstitution(row)) : [];
}

/** The signed-in owner's institution, or null when they have none yet. */
export async function getOwnInstitution(): Promise<InstitutionProfile | null> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("institutions")
    .select("id, owner_id, name, type, description, location, created_at")
    .eq("owner_id", auth.user.id)
    .maybeSingle<InstitutionRow>();

  if (error) {
    throw new Error(
      "[institutions] getOwnInstitution failed: " +
        (error.code ?? error.message),
    );
  }

  if (!data) {
    return null;
  }

  return {
    name: data.name,
    type: data.type,
    location: data.location,
    description: data.description ?? "",
  };
}

/**
 * The institution admin's overview (INS-04/06, scoped to available data).
 *
 * Listings come from `products` and conversations from the messaging RPC, both
 * already filtered to the signed-in owner/participant by RLS. There is no
 * institution-linked teacher/student enrollment table, so this reports what is
 * real today instead of inventing engagement or enrollment metrics.
 */
export async function getInstitutionOverview(): Promise<InstitutionOverview> {
  const [products, conversations] = await Promise.all([
    getSellerProducts(),
    getConversations(),
  ]);

  const unreadCount = conversations.reduce(
    (sum, conversation) => sum + conversation.unreadCount,
    0,
  );

  return {
    cards: [
      {
        id: "listings",
        labelKey: "institutionOverview.cards.listings.label",
        value: products.length,
        captionKey: "institutionOverview.cards.listings.caption",
        tone: "neutral",
      },
      {
        id: "conversations",
        labelKey: "institutionOverview.cards.conversations.label",
        value: conversations.length,
        captionKey: "institutionOverview.cards.conversations.caption",
        tone: "neutral",
      },
      {
        id: "unread",
        labelKey: "institutionOverview.cards.unread.label",
        value: unreadCount,
        captionKey: "institutionOverview.cards.unread.caption",
        tone: "positive",
      },
    ],
  };
}
