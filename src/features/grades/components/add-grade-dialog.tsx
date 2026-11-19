"use client";

import { Plus } from "lucide-react";
import dynamic from "next/dynamic";
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

/**
 * The form pulls in zod and react-hook-form, so load it only when the dialog is
 * opened. The gradebook pages then stay as light as the other dashboard routes.
 */
const GradeForm = dynamic(
  () => import("./grade-form").then((mod) => mod.GradeForm),
  {
    ssr: false,
    loading: () => (
      <div aria-hidden className="mt-5 space-y-3">
        <div className="h-10 animate-pulse rounded-control bg-surface-subtle" />
        <div className="h-10 animate-pulse rounded-control bg-surface-subtle" />
      </div>
    ),
  },
);

/** "Add Grade" trigger and dialog shell on the teacher's gradebook page. */
export function AddGradeDialog({
  classId,
  enrollmentId,
}: {
  classId: string;
  enrollmentId: string;
}) {
  const t = useTranslations("Dashboard");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="primary" size="sm" className="shrink-0">
          <Plus aria-hidden className="size-4" />
          {t("gradebook.add.trigger")}
        </Button>
      </DialogTrigger>

      <DialogContent closeLabel={t("gradebook.add.close")}>
        <DialogHeader>
          <DialogTitle>{t("gradebook.add.title")}</DialogTitle>
          <DialogDescription>
            {t("gradebook.add.description")}
          </DialogDescription>
        </DialogHeader>

        <GradeForm
          classId={classId}
          enrollmentId={enrollmentId}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
