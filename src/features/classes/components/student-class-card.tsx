import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { EntityCard } from "@/components/shared/entity-card";
import { Link } from "@/lib/i18n/navigation";
import type { StudentClass } from "../types";

/**
 * One enrolled class on the student's dashboard (STU-01 / GRD-01).
 *
 * The same `EntityCard` shell as the teacher's class card and the parent's child
 * card: name as title, subject as subtitle, then labelled rows for the grade
 * level and the teacher. The title and the footer both open the class's
 * gradebook — the student's equivalent of the teacher's class detail page.
 * There is no menu: the teacher's roster actions must not leak into this view.
 *
 * A class whose teacher profile is missing still renders; the translated
 * fallback says the teacher is unnamed rather than inventing a name.
 */
export function StudentClassCard({ classItem }: { classItem: StudentClass }) {
  const t = useTranslations("Dashboard");
  const href = `/students/classes/${classItem.id}`;

  return (
    <EntityCard
      title={
        <Link
          href={href}
          aria-label={t("studentOverview.card.open", { name: classItem.name })}
          className="rounded-sm transition-colors duration-150 ease-standard hover:text-primary-hover"
        >
          {classItem.name}
        </Link>
      }
      subtitle={classItem.subject}
      rows={[
        {
          id: "grade",
          label: t("studentOverview.card.gradeLevel"),
          value: classItem.gradeLevel,
        },
        {
          id: "teacher",
          label: t("studentOverview.card.teacher"),
          value:
            classItem.teacherName ??
            t("studentOverview.card.teacherUnknown"),
          muted: classItem.teacherName === null,
        },
      ]}
      footer={
        <Link
          href={href}
          aria-label={t("studentOverview.card.viewGradesFor", {
            name: classItem.name,
          })}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-primary-hover transition-colors duration-150 ease-standard hover:text-primary-deep"
        >
          {t("studentOverview.card.viewGrades")}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-150 ease-standard group-hover:translate-x-0.5 rtl:rotate-180"
          />
        </Link>
      }
    />
  );
}
