import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Closing call to action, between the How It Works steps and the footer.
 *
 * The band uses `primary-soft` rather than the audience band's neutral
 * `surface-muted`, so the two sections never read as the same block. Only the
 * top edge gets a hairline: the bottom edge meets the dark footer, which is
 * already the strongest edge on the page.
 *
 * The button is a `Link` styled with the shared `buttonVariants` — it
 * navigates, so it must be an anchor, exactly like the hero's calls to action.
 */
export async function CtaSection() {
  const t = await getTranslations("Home.Cta");

  return (
    <section
      aria-labelledby="cta-title"
      className="border-t border-border bg-primary-soft py-16 lg:py-24"
    >
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="cta-title"
            className="text-3xl font-bold text-balance text-primary-deep sm:text-4xl lg:text-5xl"
          >
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: "primary", size: "md" }),
              "mt-8 px-6 py-3 text-base",
            )}
          >
            {t("button")}
          </Link>
        </div>
      </div>
    </section>
  );
}
