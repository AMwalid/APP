import {
  LineChart,
  MessageSquare,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

type Step = {
  id: "track" | "communicate" | "store";
  icon: LucideIcon;
};

/**
 * The three steps, in the order of spec §10: real-time tracking, then direct
 * communication, then the educational store. Ids only: the copy lives in the
 * message files and the visible number is derived from the index, so
 * reordering this array can never leave the numerals out of sync.
 */
const STEPS: readonly Step[] = [
  { id: "track", icon: LineChart },
  { id: "communicate", icon: MessageSquare },
  { id: "store", icon: ShoppingBag },
];

/**
 * "How it works": the white section that follows the dark stats band.
 *
 * An ordered list, because these are steps rather than parallel destinations —
 * the browser then announces "1 of 3" on its own. `role="list"` restores the
 * list semantics that Tailwind's preflight strips in Safari/VoiceOver.
 *
 * The `01` is `aria-hidden`: it is a visual echo of a position the list already
 * exposes, and leaving it audible would make the reading "zero one, one of
 * three". The number and its icon share one row so a column stays compact at
 * `md`, and because the row is a plain flex row it mirrors for free in RTL.
 */
export async function HowItWorksSection() {
  const t = await getTranslations("Home.HowItWorks");

  return (
    <section aria-labelledby="how-title" className="bg-surface py-16 lg:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="how-title"
            className="text-3xl font-bold text-balance text-primary-deep sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <ol
          role="list"
          className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8"
        >
          {STEPS.map(({ id, icon: Icon }, index) => (
            <li
              key={id}
              className="flex flex-col items-center text-center"
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="text-5xl font-bold leading-none text-primary/20 tabular-nums"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary-hover">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-primary-deep">
                {t(`items.${id}.title`)}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {t(`items.${id}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
