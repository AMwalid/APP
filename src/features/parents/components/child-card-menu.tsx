"use client";

import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
 * Focus is the fiddly part. Radix's dropdown returns focus to the trigger when
 * it closes, and its dialog returns focus to whatever was focused when it
 * opened. Opening a dialog from a menu item makes those two fight, and the menu
 * usually wins after the dialog is already open. So:
 *
 * - when an item opens a dialog, the menu's close is told not to restore focus;
 * - when the dialog closes, it puts focus back on the menu trigger itself.
 *
 * `openingDialog` is a ref, not state, because it has to be readable inside the
 * close handler in the same tick the item was selected.
 */
export function ChildCardMenu({ child }: { child: Child }) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const openingDialog = useRef(false);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function openDialog(setOpen: (open: boolean) => void) {
    openingDialog.current = true;
    setOpen(true);
  }

  function returnFocusToTrigger(event: Event) {
    event.preventDefault();
    triggerRef.current?.focus();
  }

  return (
    <>
      <DropdownMenu dir={locale === "ar" ? "rtl" : "ltr"}>
        <DropdownMenuTrigger asChild>
          <button
            ref={triggerRef}
            type="button"
            aria-label={t("children.card.actions", { name: child.name })}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-control text-muted-foreground transition-colors duration-150 ease-standard hover:bg-surface-subtle hover:text-foreground data-[state=open]:bg-surface-subtle data-[state=open]:text-foreground"
          >
            <EllipsisVertical aria-hidden className="size-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          onCloseAutoFocus={(event) => {
            // Only when an item is opening a dialog. A plain Escape or an
            // outside click must still return focus to the trigger.
            if (openingDialog.current) {
              openingDialog.current = false;
              event.preventDefault();
            }
          }}
        >
          <DropdownMenuItem onSelect={() => openDialog(setEditOpen)}>
            <Pencil aria-hidden className="size-4" />
            {t("children.card.edit")}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive-deep data-[highlighted]:bg-destructive-soft data-[highlighted]:text-destructive-deep"
            onSelect={() => openDialog(setDeleteOpen)}
          >
            <Trash aria-hidden className="size-4" />
            {t("children.card.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
