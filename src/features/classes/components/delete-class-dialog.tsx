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
import { deleteClass } from "../actions";
import type { Class } from "../types";

type DeleteClassDialogProps = {
  classItem: Class;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseAutoFocus?: (event: Event) => void;
};

/**
 * Confirmation for deleting a class.
 *
 * Reuses the `Dialog` primitive instead of adding `@radix-ui/react-alert-dialog`
 * for a single screen. The trade-off is that it is not a true `alertdialog`
 * role, so focus is not forced onto the destructive button — the Cancel button
 * comes first in the DOM, which keeps the safe action the default.
 *
 * There are no fields, so there is no form library here: `useTransition` tracks
 * the pending delete and the action's failure comes back as a translated
 * message in the shared `FormAlert`.
 *
 * Radix unmounts the content but this component stays mounted while the menu
 * exists, so the error is cleared when the dialog closes rather than left to
 * appear on the next open.
 */
export function DeleteClassDialog({
  classItem,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: DeleteClassDialogProps) {
  const t = useTranslations("Dashboard");
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    if (!next) {
      setFormError(null);
    }

    onOpenChange(next);
  }

  function onConfirm() {
    setFormError(null);

    startTransition(async () => {
      const result = await deleteClass(classItem.id);

      if (result.status === "success") {
        // The card is gone from the next render, so this dialog goes with it.
        handleOpenChange(false);
        return;
      }

      if (result.formError) {
        setFormError(result.formError);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        closeLabel={t("classes.form.close")}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <DialogHeader>
          <DialogTitle>
            {t("classes.deleteDialog.title", { name: classItem.name })}
          </DialogTitle>
          <DialogDescription>
            {t("classes.deleteDialog.description")}
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
            {t("classes.form.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="md"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending
              ? t("classes.deleteDialog.deleting")
              : t("classes.deleteDialog.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
