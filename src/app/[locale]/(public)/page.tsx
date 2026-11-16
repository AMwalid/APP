import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/features/home";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <HeroSection />
    </main>
  );
}
