import "server-only";

import type { Grade } from "@/features/grades";
import { getConversations } from "@/features/messaging";
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
 * The parent overview (PAR-01).
 *
 * Every figure comes from a real RLS-scoped read: linked children, their grades
 * through `get_child_grades`, and the parent's own inbox through
 * `get_conversations`. There is no attendance or behavior table yet, so this
 * reports academic performance and communications instead of inventing values.
 *
 * Quantities and percentages are formatted with the active locale here; the
 * components only translate labels and captions.
 */
export async function getParentOverview(locale: string): Promise<ParentOverview> {
  const [children, conversations] = await Promise.all([
    getChildren(),
    getConversations(),
  ]);

  const gradeGroups = await Promise.all(
    children
      .filter((child) => child.studentId)
      .map((child) => getChildGrades(child.id)),
  );
  const grades = gradeGroups.flat();

  const scoreTotal = grades.reduce(
    (sum, grade) => sum + grade.score / grade.maxScore,
    0,
  );
  const average = grades.length === 0 ? null : scoreTotal / grades.length;

  const numberFormat = new Intl.NumberFormat(locale);
  const percentFormat = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  });

  return {
    cards: [
      {
        id: "children",
        labelKey: "overview.cards.children.label",
        value: numberFormat.format(children.length),
        captionKey: "overview.cards.children.caption",
        tone: "neutral",
      },
      {
        id: "grades",
        labelKey: "overview.cards.grades.label",
        value: numberFormat.format(grades.length),
        captionKey: "overview.cards.grades.caption",
        tone: "neutral",
      },
      {
        id: "average",
        labelKey: "overview.cards.average.label",
        value: average === null ? "" : percentFormat.format(average),
        captionKey: "overview.cards.average.caption",
        emptyKey: "overview.cards.average.empty",
        tone: "positive",
      },
    ],
    communications: conversations.slice(0, 5).map((conversation) => ({
      id: conversation.peerId,
      from: conversation.peerName ?? "",
      subject: conversation.lastMessage,
      when: conversation.lastMessageAt,
      href: `/dashboard/messages?peer=${conversation.peerId}`,
    })),
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
