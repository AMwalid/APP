import { getTranslations } from "next-intl/server";

/**
 * Display order of the metrics. Ids only: the value and label live in the
 * message files, so French can keep its spaced thousands separator and every
 * locale can change the copy without touching this component.
 */
const STAT_IDS = [
  "students",
  "teachers",
  "institutions",
  "support",
] as const;

/**
 * Full-width proof band directly under the audience cards.
 *
 * Marked up as a description list: each number is the `<dd>` and its label the
 * `<dt>`, so assistive technology announces "10,000+, Active Students" as one
 * pair instead of eight loose strings. `flex-col-reverse` shows the number on
 * top while keeping the label first in the DOM, and it needs no direction
 * logic to mirror.
 *
 * Two columns on phones, four from `lg`. Four stacked metrics on a phone would
 * be a ~400px slab; a 2x2 block still reads as a band.
 */
export async function StatsBand() {
  const t = await getTranslations("Home.Stats");

  return (
    <section
      aria-labelledby="stats-title"
      className="bg-primary-deep py-12 lg:py-16"
    >
      <div className="container-page">
        <h2 id="stats-title" className="sr-only">
          {t("title")}
        </h2>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {STAT_IDS.map((id) => (
            <div
              key={id}
              className="flex flex-col-reverse items-center text-center"
            >
              <dt className="mt-2 text-sm leading-snug text-primary-foreground/80">
                {t(`items.${id}.label`)}
              </dt>
              <dd className="text-3xl font-bold whitespace-nowrap text-primary-foreground sm:text-4xl lg:text-5xl">
                {t(`items.${id}.value`)}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
