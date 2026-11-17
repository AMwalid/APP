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
