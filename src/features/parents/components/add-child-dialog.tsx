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
 * The form is loaded on demand rather than imported directly.
 *
 * `add-child-form` is what pulls in zod and react-hook-form — around 65 kB of
 * first-load JavaScript. Importing it statically would put that on every route
 * that touches the parents barrel, including the overview page, which never
 * opens this dialog. Loading it when the dialog mounts keeps the trigger cheap.
 */
const AddChildForm = dynamic(
  () => import("./add-child-form").then((mod) => mod.AddChildForm),
  {
    ssr: false,
    loading: () => (
      <div aria-hidden className="mt-5 space-y-3">
        <div className="h-10 animate-pulse rounded-control bg-surface-subtle" />
        <div className="h-10 animate-pulse rounded-control bg-surface-subtle" />
        <div className="h-10 animate-pulse rounded-control bg-surface-subtle" />
      </div>
    ),
  },
);

/**
 * "Add child" trigger and dialog shell.
 *
 * The trigger lives here rather than in the page so the page stays a server
 * component and the open state stays local. Radix handles the focus trap, the
 * Escape key and returning focus to the trigger on close.
 *
 * Closing unmounts the form, so every open starts with empty fields and no
 * stale error messages — no manual reset needed.
 */
export function AddChildDialog() {
  const t = useTranslations("Dashboard");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="primary" size="sm" className="shrink-0">
          <Plus aria-hidden className="size-4" />
          {t("children.addChild")}
        </Button>
      </DialogTrigger>

      <DialogContent closeLabel={t("children.addChildDialog.close")}>
        <DialogHeader>
          <DialogTitle>{t("children.addChildDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("children.addChildDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <AddChildForm onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
