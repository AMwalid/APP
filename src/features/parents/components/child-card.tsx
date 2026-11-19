import { useTranslations } from "next-intl";
import { EntityCard } from "@/components/shared/entity-card";
import type { Child } from "../types";
import { ChildCardMenu } from "./child-card-menu";

/**
 * One child: name, age, school and their latest grade.
 *
 * The shell lives in `components/shared/entity-card`: the teacher's class card
 * uses the same one, and neither feature has to import the other. This file
 * only decides which strings go in which slot.
 *
 * Grades live in a table that does not exist yet, so the row states that rather
 * than showing a placeholder mark. Once grading lands, this becomes
 * `child.latestGrade` and the "no grades" branch goes away.
 *
 * The edit/delete menu is a client island; this component itself stays on the
 * server.
 */
export function ChildCard({ child }: { child: Child }) {
  const t = useTranslations("Dashboard");

  return (
    <EntityCard
      title={child.name}
      subtitle={t("children.card.age", { years: child.age })}
      menu={<ChildCardMenu child={child} />}
      rows={[
        {
          id: "school",
          label: t("children.card.school"),
          value: child.school,
        },
        {
          id: "grade",
          label: t("children.card.latestGrade"),
          value: t("children.card.noGrade"),
          muted: true,
        },
      ]}
    />
  );
}
