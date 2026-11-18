import "server-only";

import { getCurrentUser } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import type { Child, ChildRow, ParentOverview } from "./types";

/**
 * The parent overview.
 *
 * Placeholder until the schema exists: PAR-01 will read attendance, behaviour,
 * exam dates and school messages for each child from Supabase. The shape is the
 * contract the page and cards already render against, so only the body of this
 * function changes when the tables land — nothing in the UI does.
 *
 * The `*Key` fields are translation keys, not values; see `./types`.
 */
export async function getParentOverview(): Promise<ParentOverview> {
  return {
    cards: [
      {
        id: "attendance",
        labelKey: "overview.cards.attendance.label",
        valueKey: "overview.cards.attendance.value",
        captionKey: "overview.cards.attendance.caption",
        tone: "neutral",
      },
      {
        id: "behavior",
        labelKey: "overview.cards.behavior.label",
        valueKey: "overview.cards.behavior.value",
        captionKey: "overview.cards.behavior.caption",
        tone: "positive",
      },
      {
        id: "nextExam",
        labelKey: "overview.cards.nextExam.label",
        valueKey: "overview.cards.nextExam.value",
        captionKey: "overview.cards.nextExam.caption",
        tone: "neutral",
      },
    ],
    communications: [
      {
        id: "m1",
        fromKey: "overview.communications.items.m1.from",
        subjectKey: "overview.communications.items.m1.subject",
        whenKey: "overview.communications.items.m1.when",
      },
      {
        id: "m2",
        fromKey: "overview.communications.items.m2.from",
        subjectKey: "overview.communications.items.m2.subject",
        whenKey: "overview.communications.items.m2.when",
      },
      {
        id: "m3",
        fromKey: "overview.communications.items.m3.from",
        subjectKey: "overview.communications.items.m3.subject",
        whenKey: "overview.communications.items.m3.when",
      },
    ],
  };
}

/**
 * The parent's children (PAR-03), oldest first.
 *
 * RLS already limits the table to the signed-in parent; the explicit
 * `parent_id` filter is defence in depth and the one the index covers. A signed
 * out visitor gets an empty list rather than an error — the page is behind the
 * middleware, so this only happens if a session expires mid-navigation.
 *
 * A failed query returns `[]` and logs the code: a broken list is not worth
 * crashing the page over, but it must not be silent either.
 *
 * `toChild` exists because the Supabase client is untyped until
 * `src/types/database.ts` is generated; it keeps the cast in one place.
 */
export async function getChildren(): Promise<Child[]> {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("children")
    .select("id, name, age, school")
    .eq("parent_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[parents] getChildren failed", error.code ?? error.message);
    return [];
  }

  return (data as ChildRow[]).map(toChild);
}

function toChild(row: ChildRow): Child {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    school: row.school,
  };
}
