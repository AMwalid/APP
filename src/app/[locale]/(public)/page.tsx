import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("HomePage");

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-var(--header-height))] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-semibold tracking-widest text-primary uppercase">
        {t("eyebrow")}
      </p>
      <h1 className="text-4xl font-bold text-primary-deep">{t("title")}</h1>
      <p className="max-w-xl text-muted-foreground">{t("subtitle")}</p>
      <p className="text-xs text-muted-foreground">{t("shellNote")}</p>
    </main>
  );
}
