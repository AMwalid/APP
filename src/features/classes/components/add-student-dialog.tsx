"use client";

import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StudentSearch } from "./student-search";

/**
 * "Add student" trigger and dialog shell on the class details page.
 *
 * The open state lives here so the search component can close the dialog after
 * a successful enrollment. Radix still returns focus to the trigger, which is
 * the same behaviour a card menu asks for explicitly with `onCloseAutoFocus`.
 */
export function AddStudentDialog({ classId }: { classId: string }) {
  const t = useTranslations("Dashboard");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="primary" size="sm" className="shrink-0">
          <UserPlus aria-hidden className="size-4" />
          {t("classDetails.add.trigger")}
        </Button>
      </DialogTrigger>

      <DialogContent closeLabel={t("classDetails.add.close")}>
        <DialogHeader>
          <DialogTitle>{t("classDetails.add.title")}</DialogTitle>
          <DialogDescription>
            {t("classDetails.add.description")}
          </DialogDescription>
        </DialogHeader>

        <StudentSearch classId={classId} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
