"use client";

import { UserMinus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { CardActionsMenu } from "@/components/shared/card-actions-menu";
import type { RosterStudent } from "../types";
import { RemoveStudentDialog } from "./remove-student-dialog";

/**
 * The per-row menu on the class roster.
 *
 * Mirrors `ClassCardMenu`: the menu and its dialog live together so a row only
 * carries one button until the menu is used, and the dialog returns focus to
 * that button when it closes. Same shared `CardActionsMenu`, same handshake.
 */
export function RosterRowMenu({
  classId,
  student,
}: {
  classId: string;
  student: RosterStudent;
}) {
  const t = useTranslations("Dashboard");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [removeOpen, setRemoveOpen] = useState(false);

  function returnFocusToTrigger(event: Event) {
    event.preventDefault();
    triggerRef.current?.focus();
  }

  return (
    <>
      <CardActionsMenu
        label={t("classDetails.roster.actions", {
          name: student.fullName ?? student.email,
        })}
        triggerRef={triggerRef}
        actions={[
          {
            id: "remove",
            label: t("classDetails.roster.remove"),
            icon: <UserMinus aria-hidden className="size-4" />,
            destructive: true,
            onSelect: () => setRemoveOpen(true),
          },
        ]}
      />

      <RemoveStudentDialog
        classId={classId}
        student={student}
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        onCloseAutoFocus={returnFocusToTrigger}
      />
    </>
  );
}
