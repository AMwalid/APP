"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { FormAlert } from "@/components/shared/form-alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { unenrollStudent } from "../actions";
import type { RosterStudent } from "../types";

type RemoveStudentDialogProps = {
  classId: string;
  student: RosterStudent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus?: (event: Event) => void;
};

/**
 * Confirmation for removing one student from the roster.
 *
 * The same shape as `DeleteClassDialog`: no fields, so no form library. The
 * action gets both the class id and the enrollment id and filters on both,
 * which is what makes a stale row from another class impossible to delete.
 */
export function RemoveStudentDialog({
  classId,
  student,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: RemoveStudentDialogProps) {
  const t = useTranslations("Dashboard");
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const name = student.fullName ?? student.email;

  function handleOpenChange(next: boolean) {
    if (!next) {
      setFormError(null);
    }

    onOpenChange(next);
  }

  function onConfirm() {
    setFormError(null);

    startTransition(async () => {
      const result = await unenrollStudent(classId, student.enrollmentId);

      if (result.status === "success") {
        handleOpenChange(false);
        return;
      }

      setFormError(result.formError ?? t("classDetails.errors.removeFailed"));
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        closeLabel={t("classDetails.add.close")}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <DialogHeader>
          <DialogTitle>
            {t("classDetails.remove.title", { name })}
          </DialogTitle>
          <DialogDescription>
            {t("classDetails.remove.description")}
          </DialogDescription>
        </DialogHeader>

        {formError ? (
          <div className="mt-4">
            <FormAlert tone="error">{formError}</FormAlert>
          </div>
        ) : null}

        <DialogFooter className="mt-5">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => handleOpenChange(false)}
          >
            {t("classDetails.add.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="md"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending
              ? t("classDetails.remove.removing")
              : t("classDetails.remove.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
