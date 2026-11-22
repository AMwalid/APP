import { getLocale, getTranslations } from "next-intl/server";
import { HeroActions } from "./hero-actions";
import { HeroSearch } from "./hero-search";
import { cn } from "@/lib/utils";

/**
 * Start column of the hero: badge, headline, subheadline, search and CTAs.
 *
 * `items-start` keeps every child on the start edge, which is the right edge
 * in Arabic and the left edge in French and English.
 *
 * The Arabic headline stays one step larger than the Latin one: Cairo has a
 * smaller optical size per pixel than Inter, so 60px of Arabic reads like 48px
 * of Latin. Matching the pixel size instead would make Arabic look shrunken.
 */
export async function HeroContent() {
  const [t, locale] = await Promise.all([
    getTranslations("Home.Hero"),
    getLocale(),
  ]);
  const titleSize = locale === "ar" ? "lg:text-6xl" : "lg:text-5xl";

  return (
    <div className="flex flex-col items-start gap-6">
      <span className="inline-flex items-center rounded-nav bg-primary-soft px-3 py-1 text-xs font-semibold tracking-widest text-primary-hover uppercase">
        {t("badge")}
      </span>
      <h1
        id="hero-title"
        className={cn(
          "max-w-xl text-4xl leading-tight font-bold text-balance text-primary-deep sm:text-5xl",
          titleSize,
        )}
      >
        {t("title")}
      </h1>
      <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
        {t("subtitle")}
      </p>
      <HeroSearch locale={locale} />
      <HeroActions />
    </div>
  );
}
