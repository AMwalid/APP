"use client";

import { Pencil, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { CardActionsMenu } from "@/components/shared/card-actions-menu";
import type { Child } from "../types";
import { ChildDialog } from "./child-dialog";
import { DeleteChildDialog } from "./delete-child-dialog";

/**
 * The per-card menu, and the owner of both dialog states.
 *
 * Keeping the dialogs here (rather than one per card rendered up front) means a
 * card carries one button until the menu is actually used. `ChildCard` stays a
 * server component; this is the only client island in it.
 *
 * The menu and its focus handshake live in `components/shared/card-actions-menu`
 * so the teacher's class card behaves identically. This file only supplies the
 * two actions and the dialogs they open.
 */
export function ChildCardMenu({ child }: { child: Child }) {
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
        label={t("children.card.actions", { name: child.name })}
        triggerRef={triggerRef}
        actions={[
          {
            id: "edit",
            label: t("children.card.edit"),
            icon: <Pencil aria-hidden className="size-4" />,
            onSelect: () => setEditOpen(true),
          },
          {
            id: "delete",
            label: t("children.card.delete"),
            icon: <Trash aria-hidden className="size-4" />,
            separatorBefore: true,
            destructive: true,
            onSelect: () => setDeleteOpen(true),
          },
        ]}
      />

      <ChildDialog
        mode="edit"
        child={child}
        open={editOpen}
        onOpenChange={setEditOpen}
        onCloseAutoFocus={returnFocusToTrigger}
      />

      <DeleteChildDialog
        child={child}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onCloseAutoFocus={returnFocusToTrigger}
      />
    </>
  );
}
