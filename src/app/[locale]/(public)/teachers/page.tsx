import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MarketingPage } from "@/components/shared/marketing-page";
import { TeacherDirectory, getPublicTeachers } from "@/features/teachers-directory";

const NS = "Marketing.teachers";
const DIRECTORY_NS = "Marketing.teacherDirectory";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: NS });

  return { title: t("metaTitle"), description: t("subtitle") };
}

/** Search state lives in the URL, so results are shareable and SSR-only. */
type SearchParams = Promise<{
  q?: string | string[];
  specialty?: string | string[];
}>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export default async function TeachersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations(NS);
  const directory = await getTranslations(DIRECTORY_NS);
  const { q, specialty: requestedSpecialty } = await searchParams;

  const needle = first(q);
  const specialty = first(requestedSpecialty);

  const teachers = await getPublicTeachers({ needle, specialty });
  // The filter options describe the whole directory, not the current results.
  const optionSource =
    needle || specialty ? await getPublicTeachers() : teachers;
  const specialties = [...new Set(optionSource.flatMap((item) => item.subjects))]
    .sort((a, b) => a.localeCompare(b, locale));

  return (
    <MarketingPage
      title={t("title")}
      subtitle={t("subtitle")}
      heroActions={[
        { label: t("heroPrimary"), href: "/signup" },
        { label: t("heroSecondary"), href: "/book-demo", variant: "outline" },
      ]}
      cta={{
        title: t("cta.title"),
        subtitle: t("cta.subtitle"),
        actions: [
          { label: t("cta.primary"), href: "/signup" },
          { label: t("cta.secondary"), href: "/book-demo", variant: "outline" },
        ],
      }}
    >
      <TeacherDirectory
        teachers={teachers}
        specialties={specialties}
        needle={needle}
        specialty={specialty}
        labels={{
          heading: directory("heading"),
          searchLabel: directory("searchLabel"),
          searchPlaceholder: directory("searchPlaceholder"),
          specialtyLabel: directory("specialtyLabel"),
          specialtyAll: directory("specialtyAll"),
          submit: directory("submit"),
          resultCount: (count) => directory("resultCount", { count }),
          empty: directory("empty"),
          viewProfile: directory("viewProfile"),
          experience: (years) => directory("experience", { years }),
        }}
      />
    </MarketingPage>
  );
}
