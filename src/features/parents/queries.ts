import "server-only";

import type { Grade } from "@/features/grades";
import { getCurrentUser } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import type { Child, ChildRow, ParentOverview } from "./types";

/** A row of `get_child_grades`: numeric columns again arrive as strings. */
type ChildGradeRow = {
  id: string;
  title: string;
  score: string;
  max_score: string;
  created_at: string;
  class_id: string;
  class_name: string;
  subject: string;
};

/** The parent's grade rows additionally carry the class they came from. */
export type ParentGrade = Grade & { classId: string; className: string; subject: string };

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
 * A failed query throws: an empty list would hide an outage behind the page's
 * empty state.
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
    .select("id, name, age, school, student_id")
    .eq("parent_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(
      "[parents] getChildren failed: " + (error.code ?? error.message),
    );
  }

  return (data as ChildRow[]).map(toChild);
}

function toChild(row: ChildRow): Child {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    school: row.school,
    studentId: row.student_id,
  };
}

/**
 * One child owned by the signed-in parent, or null (PAR-04).
 *
 * The grades route uses this as its second lock: a child id that belongs to
 * another parent is indistinguishable from one that does not exist, because
 * both RLS and the explicit parent_id filter return no row.
 */
export async function getChildById(id: string): Promise<Child | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("children")
    .select("id, name, age, school, student_id")
    .eq("id", id)
    .eq("parent_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(
      "[parents] getChildById failed: " + (error.code ?? error.message),
    );
  }

  return data ? toChild(data as ChildRow) : null;
}

/**
 * All grades across all classes for the parent's linked child (PAR-04).
 *
 * There is no role check here on purpose: `get_child_grades` is the boundary and
 * verifies both `children.parent_id = auth.uid()` and the parent role before it
 * returns anything. The caller has already proved the child belongs to them;
 * this function cannot be used to reach another parent's child.
 */
export async function getChildGrades(childId: string): Promise<ParentGrade[]> {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_child_grades", {
    child_id: childId,
  });

  if (error) {
    throw new Error(
      "[parents] getChildGrades failed: " + (error.code ?? error.message),
    );
  }

  return ((data ?? []) as ChildGradeRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    score: Number(row.score),
    maxScore: Number(row.max_score),
    createdAt: row.created_at,
    classId: row.class_id,
    className: row.class_name,
    subject: row.subject,
  }));
}
