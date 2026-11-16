import { Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";

/**
 * Placeholder hero search.
 *
 * Deliberately inert for this phase: there is no `<form>`, so submitting does
 * nothing and no URL changes. When `/find-resources` exists, this becomes a
 * real form action and only this file changes.
 *
 * The visible label is the field's `<label>` (screen-reader only); the button
 * carries its own text, so the field is announced once, not twice.
 */
export async function HeroSearch() {
  const t = await getTranslations("Home.Hero");

  return (
    <div role="search" className="w-full max-w-xl">
      <label htmlFor="hero-search" className="sr-only">
        {t("searchLabel")}
      </label>
      <div className="flex items-center gap-2 rounded-control border border-border bg-surface p-1.5 ps-3 transition-colors duration-150 ease-standard focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <Search
          aria-hidden="true"
          className="size-5 shrink-0 text-muted-foreground"
        />
        <input
          id="hero-search"
          type="search"
          placeholder={t("searchPlaceholder")}
          className="h-9 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="button"
          className={buttonVariants({ variant: "primary", size: "md" })}
        >
          {t("searchButton")}
        </button>
      </div>
    </div>
  );
}
