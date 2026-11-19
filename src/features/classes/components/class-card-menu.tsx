"use client";

import { Pencil, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { CardActionsMenu } from "@/components/shared/card-actions-menu";
import type { Class } from "../types";
import { ClassDialog } from "./class-dialog";
import { DeleteClassDialog } from "./delete-class-dialog";

/**
 * The per-card menu, and the owner of both dialog states.
 *
 * Keeping the dialogs here (rather than one per card rendered up front) means a
 * card carries one button until the menu is actually used. `ClassCard` stays a
 * server component; this is the only client island in it.
 *
 * The menu and its focus handshake live in `components/shared/card-actions-menu`
 * so the parent's child card behaves identically. This file only supplies the
 * two actions and the dialogs they open.
 */
export function ClassCardMenu({ classItem }: { classItem: Class }) {
  const t = useTranslations("Dashboard");
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function returnFocusToTrigger(event: Event) {
    event.preventDefault();
    triggerRef.current?.focus();
  }

  return (
    <>
      <CardActionsMenu
        label={t("classes.card.actions", { name: classItem.name })}
        triggerRef={triggerRef}
        actions={[
          {
            id: "edit",
            label: t("classes.card.edit"),
            icon: <Pencil aria-hidden className="size-4" />,
            onSelect: () => setEditOpen(true),
          },
          {
            id: "delete",
            label: t("classes.card.delete"),
            icon: <Trash aria-hidden className="size-4" />,
            separatorBefore: true,
            destructive: true,
            onSelect: () => setDeleteOpen(true),
          },
        ]}
      />

      <ClassDialog
        mode="edit"
        classItem={classItem}
        open={editOpen}
        onOpenChange={setEditOpen}
        onCloseAutoFocus={returnFocusToTrigger}
      />

      <DeleteClassDialog
        classItem={classItem}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onCloseAutoFocus={returnFocusToTrigger}
      />
    </>
  );
}
