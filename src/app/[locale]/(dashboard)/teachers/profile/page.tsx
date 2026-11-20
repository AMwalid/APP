import { setRequestLocale } from "next-intl/server";
import { TeacherProfileView } from "@/features/teacher-profile";

/** TCH-01: the teacher's editable profile. */
export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TeacherProfileView />;
}
