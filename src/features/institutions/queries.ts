import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { InstitutionProfile, InstitutionRow, PublicInstitution } from "./types";

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
    console.error("Failed to load public institutions", error.message);
    return [];
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

  if (error || !data) {
    if (error) {
      console.error("Failed to load own institution", error.message);
    }
    return null;
  }

  return {
    name: data.name,
    type: data.type,
    location: data.location,
    description: data.description ?? "",
  };
}
