import { getTranslations, setRequestLocale } from "next-intl/server";
import { AddChildDialog, ChildCard, getChildren } from "@/features/parents";

/**
 * PAR-03 — the parent's children.
 *
 * One card per child: name, age, school and their latest grade. The list comes
 * from `children`, filtered by RLS and by `parent_id`, so a parent only ever
 * sees their own.
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

        <AddChildDialog />
      </header>

      {childList.length === 0 ? (
        /*
          A new parent has no children yet, and an empty grid under an "Add
          child" button reads as a page that failed to load. This is the one
          state where the dialog is the answer, so it says so.
        */
        <div className="rounded-lg border border-dashed border-border bg-surface-muted p-8 text-center">
          <h2 className="text-base font-semibold text-foreground">
            {t("children.empty.title")}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("children.empty.body")}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {childList.map((child) => (
            <li key={child.id}>
              <ChildCard child={child} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
