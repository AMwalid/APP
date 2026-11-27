/**
 * Types for the parent overview (PAR-01).
 *
 * Values are data from Supabase, not translation keys: children, grades and
 * inbox summaries are real rows. Labels and captions stay as keys so the three
 * locale catalogs remain identical.
 */
export type SummaryCardTone = "neutral" | "positive";

export type SummaryCardData = {
  id: string;
  labelKey: string;
  value: string;
  captionKey: string;
  /** Used when a real figure is genuinely unavailable, never for a fake one. */
  emptyKey?: string;
  tone: SummaryCardTone;
};

export type Communication = {
  id: string;
  from: string;
  subject: string;
  /** ISO timestamp, formatted in the component with the active locale. */
  when: string;
  /** The real inbox thread, when one exists. */
  href?: string;
};

export type ParentOverview = {
  cards: SummaryCardData[];
  communications: Communication[];
};

/**
 * One child, as listed on the children page (PAR-03 / PAR-04).
 *
 * `age` is a number rather than text because it is a quantity: the card renders
 * it through an ICU plural so Arabic picks the right word form ("سنتان" for two,
 * "9 سنوات" for nine) instead of reading as translated English.
 *
 * `studentId` is the link to a registered student account. Null is a real state
 * the card has to render ("link your child"), not a missing field.
 */
export type Child = {
  id: string;
  name: string;
  age: number;
  school: string;
  studentId: string | null;
};

/**
 * A row of `public.children`, as returned by the query.
 *
 * Hand-written from `supabase/migrations/20261118000000_create_children_table.sql`
 * plus the `student_id` column added in `20261119000400_link_children_to_students.sql`,
 * because `src/types/database.ts` has not been generated yet (the Supabase CLI is
 * not installed). Replace this with `Tables<"children">` the moment it is: the
 * column list here has to stay identical to the migrations until then.
 */
export type ChildRow = {
  id: string;
  name: string;
  age: number;
  school: string;
  student_id: string | null;
};

/**
 * What the child actions hand back: `createChild`, `updateChild`, `deleteChild`.
 *
 * Failures are data, not exceptions, so the dialog keeps its locale and can show
 * a translated message. `fieldErrors` is partial because a single failed submit
 * may only concern one field, and absent for delete, which has no fields.
 */
export type ChildResult =
  | { status: "success" }
  | {
      status: "error";
      fieldErrors?: Partial<Record<ChildFormField, string>>;
      formError?: string;
    };

/**
 * The create/edit child form state.
 *
 * `age` is a string here because that is what an `<input>` produces; the schema
 * validates it and the action converts it once. See `./schemas`.
 */
export type ChildFormValues = {
  name: string;
  age: string;
  school: string;
};

export type ChildFormField = keyof ChildFormValues;

/**
 * A student found by email through `search_student_by_email`. Deliberately only
 * id and email: the RPC does not expose names or any other profile data, and the
 * type mirrors that boundary so nobody is tempted to render more.
 */
export type StudentOption = {
  id: string;
  email: string;
};

/** What the search and link actions hand back, as data rather than exceptions. */
export type StudentSearchResult =
  | { status: "success"; students: StudentOption[] }
  | { status: "error"; formError: string };

export type LinkResult =
  | { status: "success" }
  | { status: "error"; formError: string };
