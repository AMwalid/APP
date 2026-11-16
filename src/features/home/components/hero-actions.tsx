import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";

/**
 * Hero calls to action.
 *
 * Both are locale-aware links styled with the shared `buttonVariants`, so the
 * hero inherits the header's button styling instead of inventing new colours
 * or radii. Primary leads to the institutions directory, secondary to the
 * store.
 */
export async function HeroActions() {
  const t = await getTranslations("Home.Hero");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href="/institutions"
        className={buttonVariants({ variant: "primary", size: "md" })}
      >
        {t("primaryCta")}
      </Link>
      <Link
        href="/store"
        className={buttonVariants({ variant: "outline", size: "md" })}
      >
        {t("secondaryCta")}
      </Link>
    </div>
  );
}
