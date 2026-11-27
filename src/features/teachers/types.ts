import type { Class } from "@/features/classes";

/**
 * Types for the teacher overview (TCH-02 / TCH-03).
 *
 * Labels and captions are translation keys; values are real quantities from
 * Supabase. `classes` is the short preview shown under the figures.
 */
export type TeacherStatTone = "neutral" | "positive";

export type TeacherStat = {
  id: string;
  labelKey: string;
  value: number;
  captionKey: string;
  tone?: TeacherStatTone;
};

export type TeacherOverview = {
  cards: TeacherStat[];
  classes: Class[];
};
