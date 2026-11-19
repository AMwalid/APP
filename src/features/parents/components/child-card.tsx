import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { EntityCard } from "@/components/shared/entity-card";
import { Link } from "@/lib/i18n/navigation";
import type { Child } from "../types";
import { ChildCardMenu } from "./child-card-menu";
import { LinkStudentDialog } from "./link-student-dialog";

/**
 * One child: name, age, school and their student-account link (PAR-03 / PAR-04).
 *
 * The shell lives in `components/shared/entity-card`: the teacher's class card
 * uses the same one, and neither feature has to import the other. This file only
 * decides which strings and controls go in which slot.
 *
 * The footer is the one branch that matters: an unlinked child gets a client
 * dialog that searches for a student by email; a linked child gets a plain link
 * to the read-only gradebook. There is no menu action for either — the dialog
 * and the link are the whole flow, and edit/delete stay in the menu.
 */
export function ChildCard({ child }: { child: Child }) {
  const t = useTranslations("Dashboard");
  const gradesHref = `/parents/children/${child.id}/grades`;

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
          id: "student",
          label: t("children.card.studentAccount"),
          value: child.studentId
            ? t("children.card.linked")
            : t("children.card.notLinked"),
          muted: child.studentId === null,
        },
      ]}
      footer={
        child.studentId ? (
          <Link
            href={gradesHref}
            aria-label={t("children.card.viewGradesFor", { name: child.name })}
            className="group inline-flex items-center gap-1 text-sm font-semibold text-primary-hover transition-colors duration-150 ease-standard hover:text-primary-deep"
          >
            {t("children.card.viewGrades")}
            <ArrowRight
              aria-hidden
              className="size-4 transition-transform duration-150 ease-standard group-hover:translate-x-0.5 rtl:rotate-180"
            />
          </Link>
        ) : (
          <LinkStudentDialog child={child} />
        )
      }
    />
  );
}
