import { useTranslations } from "next-intl";
import { EntityCard } from "@/components/shared/entity-card";
import type { StudentClass } from "../types";

/**
 * One enrolled class on the student's dashboard (STU-01).
 *
 * The same `EntityCard` shell as the teacher's class card and the parent's child
 * card: name as title, subject as subtitle, then labelled rows for the grade
 * level and the teacher. There is no link or menu here — the student has no
 * roster detail page in this scope, and the teacher's edit actions must not leak
 * into the student view.
 *
 * A class whose teacher profile is missing still renders; the translated
 * fallback says the teacher is unnamed rather than inventing a name.
 */
export function StudentClassCard({ classItem }: { classItem: StudentClass }) {
  const t = useTranslations("Dashboard");

  return (
    <EntityCard
      title={classItem.name}
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
    />
  );
}
