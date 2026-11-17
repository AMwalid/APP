import { Plus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { ChildCard, getChildren } from "@/features/parents";

/**
 * PAR-03 — the parent's children.
 *
 * One card per child: name, age, school and their latest grade. The "Add child"
 * button is intentionally inert — it is the visual anchor for the creation flow,
 * which arrives as a dialog once child profiles are writable.
 *
 * The grid lives here rather than in the feature because it is page composition,
 * the same way the overview page maps its own cards.
 */
export default async function ParentChildrenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Dashboard" });
  const childList = await getChildren();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-balance text-foreground">
            {t("children.title")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t("children.subtitle")}
          </p>
        </div>

        {/*
          Primary button, deliberately without a handler: it is the place the
          creation dialog will hang from. `type="button"` keeps it from
          submitting anything if it ever lands inside a form.
        */}
        <Button type="button" variant="primary" size="sm" className="shrink-0">
          <Plus aria-hidden className="size-4" />
          {t("children.addChild")}
        </Button>
      </header>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {childList.map((child) => (
          <li key={child.id}>
            <ChildCard child={child} />
          </li>
        ))}
      </ul>
    </div>
  );
}
