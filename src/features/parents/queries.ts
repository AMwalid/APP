import type { ParentOverview } from "./types";

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
