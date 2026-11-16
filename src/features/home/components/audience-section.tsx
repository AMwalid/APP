import {
  BookOpen,
  Building,
  GraduationCap,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AudienceCard } from "./audience-card";

type Audience = {
  id: "parents" | "students" | "teachers" | "institutions";
  href: string;
  icon: LucideIcon;
};

/**
 * The four audiences, in the same order as the navigation contract.
 * Hrefs are locale-less; `@/lib/i18n/navigation` adds the active locale.
 */
const AUDIENCES: readonly Audience[] = [
  { id: "parents", href: "/parents", icon: Users },
  { id: "students", href: "/students", icon: GraduationCap },
  { id: "teachers", href: "/teachers", icon: BookOpen },
  { id: "institutions", href: "/institutions", icon: Building },
];

/**
 * Audience section: a muted band under the hero with one card per user role.
 *
 * The cards live in a list because they are four parallel destinations, and a
 * list gives assistive technology an item count instead of four loose links.
 * Four across from `lg`, two from `md`, one on phones.
 */
export async function AudienceSection() {
  const t = await getTranslations("Home.Audience");

  return (
    <section
      aria-labelledby="audience-title"
      className="border-y border-border bg-surface-muted py-16 lg:py-24"
    >
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="audience-title"
            className="text-3xl font-bold text-balance text-primary-deep sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <ul
          role="list"
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {AUDIENCES.map(({ id, href, icon }) => (
            <li key={id}>
              <AudienceCard
                icon={icon}
                href={href}
                title={t(`items.${id}.title`)}
                description={t(`items.${id}.description`)}
                learnMore={t("learnMore")}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
