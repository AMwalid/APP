import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  getInstitutionTeachers,
  getPublicInstitution,
  PublicInstitutionProfile,
} from "@/features/institutions";

const NS = "Marketing.publicInstitutionProfile";

type RouteParams = { locale: string; id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const institution = await getPublicInstitution(id);
  const t = await getTranslations({ locale, namespace: NS });

  if (!institution) {
    return { title: t("metaTitleMissing") };
  }

  return {
    title: t("metaTitle", { name: institution.name }),
    description: (institution.description || institution.location).slice(0, 160),
  };
}

/** Thin route: validate/fetch the school, then hand off to the feature view. */
export default async function PublicInstitutionProfilePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const institution = await getPublicInstitution(id);
  if (!institution) {
    notFound();
  }

  const teachers = await getInstitutionTeachers(institution.id);

  return (
    <PublicInstitutionProfile institution={institution} teachers={teachers} />
  );
}
