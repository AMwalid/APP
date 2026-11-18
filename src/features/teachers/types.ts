/**
 * Types for the teacher overview (TCH-02 / TCH-03 shell).
 *
 * The placeholder carries translation keys for copy and plain numbers for
 * quantities. The numbers are data, not copy: when the class and student tables
 * land, only the query body changes.
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
};
