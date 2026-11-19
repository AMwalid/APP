"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Class } from "../types";

/**
 * The form is loaded on demand rather than imported directly.
 *
 * `class-form` is what pulls in zod and react-hook-form — around 65 kB of
 * first-load JavaScript. Importing it statically would put that on every route
 * that touches the classes barrel, including the teacher overview, which never
 * opens this dialog. Loading it when the dialog mounts keeps the trigger cheap.
 */
const ClassForm = dynamic(
  () => import("./class-form").then((mod) => mod.ClassForm),
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
 * Controlled create/edit class dialog.
 *
 * Always controlled (`open` + `onOpenChange`): the caller owns the state,
 * because two callers use this — the page's "Create class" button and the card
 * menu's "Edit" item. An uncontrolled dialog with an optional trigger could not
 * serve the second one.
 *
 * The props are a discriminated union so `mode="edit"` cannot compile without
 * the class it is editing; there is no runtime "edit but no data" state.
 *
 * `onCloseAutoFocus` is forwarded to the content because the menu that opens
 * this dialog needs to decide where focus lands when it closes.
 */
type ClassDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Rendered as the trigger. Omit when the dialog is opened from elsewhere. */
  trigger?: ReactNode;
  onCloseAutoFocus?: (event: Event) => void;
} & ({ mode: "create"; classItem?: undefined } | { mode: "edit"; classItem: Class });

export function ClassDialog(props: ClassDialogProps) {
  const t = useTranslations("Dashboard");
  const { open, onOpenChange, trigger, onCloseAutoFocus } = props;

  const onDone = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

      <DialogContent
        closeLabel={t("classes.form.close")}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <DialogHeader>
          <DialogTitle>
            {props.mode === "edit"
              ? t("classes.form.titleEdit")
              : t("classes.form.title")}
          </DialogTitle>
          <DialogDescription>
            {props.mode === "edit"
              ? t("classes.form.descriptionEdit")
              : t("classes.form.description")}
          </DialogDescription>
        </DialogHeader>

        {props.mode === "edit" ? (
          <ClassForm mode="edit" classItem={props.classItem} onDone={onDone} />
        ) : (
          <ClassForm mode="create" onDone={onDone} />
        )}
      </DialogContent>
    </Dialog>
  );
}
