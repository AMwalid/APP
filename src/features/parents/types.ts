/**
 * Types for the parent overview (PAR-01).
 *
 * The placeholder data carries translation keys rather than strings: the demo
 * values ("95%", "Excellent", "Math — Nov 20") are user-visible text and have
 * to exist in all three locales, which a constant in `queries.ts` could not do.
 * When the real schema lands, these fields become plain values instead.
 */
export type SummaryCardTone = "neutral" | "positive";

export type SummaryCardData = {
  id: string;
  labelKey: string;
  valueKey: string;
  captionKey: string;
  tone: SummaryCardTone;
};

export type Communication = {
  id: string;
  fromKey: string;
  subjectKey: string;
  whenKey: string;
};

export type ParentOverview = {
  cards: SummaryCardData[];
  communications: Communication[];
};

/**
 * One child, as listed on the children page (PAR-03).
 *
 * `age` is a number rather than a key because it is a quantity, not text: the
 * card renders it through an ICU plural so Arabic picks the right word form
 * ("سنتان" for two, "9 سنوات" for nine) instead of reading as translated
 * English.
 */
export type Child = {
  id: string;
  nameKey: string;
  age: number;
  schoolKey: string;
  gradeValueKey: string;
  gradeCaptionKey: string;
};
