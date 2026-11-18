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
 * `age` is a number rather than text because it is a quantity: the card renders
 * it through an ICU plural so Arabic picks the right word form ("سنتان" for two,
 * "9 سنوات" for nine) instead of reading as translated English.
 *
 * There is no grade here yet. Grades belong to a different table that does not
 * exist, so the card says so instead of inventing a mark.
 */
export type Child = {
  id: string;
  name: string;
  age: number;
  school: string;
};

/**
 * A row of `public.children`, as returned by the query.
 *
 * Hand-written from `supabase/migrations/20261118000000_create_children_table.sql`
 * because `src/types/database.ts` has not been generated yet (the Supabase CLI
 * is not installed). Replace this with `Tables<"children">` the moment it is:
 * the column list here has to stay identical to the migration until then.
 */
export type ChildRow = {
  id: string;
  name: string;
  age: number;
  school: string;
};

/**
 * What `createChild` hands back.
 *
 * Failures are data, not exceptions, so the form keeps its locale and can show
 * a translated message. `fieldErrors` is partial because a single failed submit
 * may only concern one field.
 */
export type AddChildResult =
  | { status: "success" }
  | {
      status: "error";
      fieldErrors?: Partial<Record<AddChildField, string>>;
      formError?: string;
    };

/**
 * The "add child" form state.
 *
 * `age` is a string here because that is what an `<input>` produces; the schema
 * validates it and the submit handler converts it once. See `./schemas`.
 */
export type AddChildValues = {
  name: string;
  age: string;
  school: string;
};

export type AddChildField = keyof AddChildValues;
