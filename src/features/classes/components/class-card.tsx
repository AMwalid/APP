import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { EntityCard } from "@/components/shared/entity-card";
import { Link } from "@/lib/i18n/navigation";
import type { Class } from "../types";
import { ClassCardMenu } from "./class-card-menu";

/**
 * One class: name, subject, grade level and its roster count.
 *
 * The shell lives in `components/shared/entity-card`, the same one the parent's
 * child card uses. Name is the title, subject the subtitle, grade level and
 * roster the two rows — the same rhythm as name / age / school / grade.
 *
 * The title and the footer link both open the detail page. Linking the title is
 * the obvious affordance; the footer makes "manage the roster" discoverable,
 * and its accessible name includes the class name because a screen reader
 * announces links out of context. The edit/delete menu stays a separate client
 * island: an interactive control cannot live inside a link.
 */
export function ClassCard({ classItem }: { classItem: Class }) {
  const t = useTranslations("Dashboard");
  const href = `/teachers/classes/${classItem.id}`;

  return (
    <EntityCard
      title={
        <Link
          href={href}
          aria-label={t("classes.card.open", { name: classItem.name })}
          className="rounded-sm transition-colors duration-150 ease-standard hover:text-primary-hover"
        >
          {classItem.name}
        </Link>
      }
      subtitle={classItem.subject}
      menu={<ClassCardMenu classItem={classItem} />}
      rows={[
        {
          id: "grade",
          label: t("classes.card.gradeLevel"),
          value: classItem.gradeLevel,
        },
        {
          id: "students",
          label: t("classes.card.students"),
          value:
            classItem.studentCount === 0
              ? t("classes.card.noStudents")
              : t("classes.card.studentsCount", { count: classItem.studentCount }),
          muted: classItem.studentCount === 0,
        },
      ]}
      footer={
        <Link
          href={href}
          aria-label={t("classes.card.manageRoster", { name: classItem.name })}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-primary-hover transition-colors duration-150 ease-standard hover:text-primary-deep"
        >
          {t("classes.card.manageRosterShort")}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-150 ease-standard group-hover:translate-x-0.5 rtl:rotate-180"
          />
        </Link>
      }
    />
  );
}
