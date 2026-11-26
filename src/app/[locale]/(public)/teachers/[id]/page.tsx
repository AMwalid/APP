import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/features/auth";
import { getProfile } from "@/features/profile";
import type { TeacherMessageState } from "@/features/messaging";
import {
  PublicTeacherProfile,
  getPublicTeacher,
} from "@/features/teachers-directory";

const NS = "Marketing.publicTeacherProfile";

type RouteParams = { locale: string; id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const teacher = await getPublicTeacher(id);
  const t = await getTranslations({ locale, namespace: NS });

  if (!teacher) {
    return { title: t("metaTitleMissing") };
  }

  return {
    title: t("metaTitle", { name: teacher.fullName }),
    description: (teacher.bio || teacher.specialization).slice(0, 160),
  };
}

/** Thin route: validate/fetch the teacher, then hand off to the feature view. */
export default async function PublicTeacherProfilePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const teacher = await getPublicTeacher(id);
  if (!teacher) {
    notFound();
  }

  const user = await getCurrentUser();
  const profile = user ? await getProfile() : null;

  let messageState: TeacherMessageState = "guest";
  if (user) {
    if (!profile) {
      messageState = "unavailable";
    } else if (profile.id === teacher.id) {
      messageState = "self";
    } else if (
      profile.role === "parent" ||
      profile.role === "teacher" ||
      profile.role === "institution_admin"
    ) {
      messageState = "eligible";
    } else {
      messageState = "unavailable";
    }
  }

  return (
    <PublicTeacherProfile teacher={teacher} messageState={messageState} />
  );
}
