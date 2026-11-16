import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SignupForm } from "@/features/auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Auth" });

  return {
    title: t("Signup.metaTitle"),
    description: t("Signup.subtitle"),
  };
}

export default async function SignupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SignupForm />;
}
