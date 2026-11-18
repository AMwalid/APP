import "server-only";

import type { TeacherOverview } from "./types";

/**
 * The teacher overview (TCH-02 / TCH-03 shell).
 *
 * Placeholder until the class and student tables exist: the shape is the
 * contract the page renders against, so only this body changes when the schema
 * lands. Labels and captions are translation keys because they are copy; the
 * values are numbers because they are data.
 *
 * The page is behind `teachers/layout.tsx`, so there is no role check here.
 */
export async function getTeacherOverview(): Promise<TeacherOverview> {
  return {
    cards: [
      {
        id: "students",
        labelKey: "teacherOverview.cards.students.label",
        value: 45,
        captionKey: "teacherOverview.cards.students.caption",
        tone: "neutral",
      },
      {
        id: "classes",
        labelKey: "teacherOverview.cards.classes.label",
        value: 3,
        captionKey: "teacherOverview.cards.classes.caption",
        tone: "neutral",
      },
      {
        id: "grading",
        labelKey: "teacherOverview.cards.grading.label",
        value: 12,
        captionKey: "teacherOverview.cards.grading.caption",
        tone: "neutral",
      },
    ],
  };
}
