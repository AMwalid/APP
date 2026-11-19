import { useTranslations } from "next-intl";
import { EntityCard } from "@/components/shared/entity-card";
import type { Class } from "../types";
import { ClassCardMenu } from "./class-card-menu";

/**
 * One class: name, subject, grade level and its roster.
 *
 * The shell lives in `components/shared/entity-card`, the same one the parent's
 * child card uses. Name is the title, subject the subtitle, grade level and
 * roster the two rows — the same rhythm as name / age / school / grade.
 *
 * There is no enrollment UI yet, so the roster row says so instead of showing a
 * count the query does not fetch. When TCH-03 lands, it becomes a real number.
 *
 * The edit/delete menu is a client island; this component itself stays on the
 * server.
 */
export function ClassCard({ classItem }: { classItem: Class }) {
  const t = useTranslations("Dashboard");

  return (
    <EntityCard
      title={classItem.name}
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
          value: t("classes.card.noStudents"),
          muted: true,
        },
      ]}
    />
  );
}
