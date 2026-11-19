"use client";

import { EllipsisVertical } from "lucide-react";
import { useLocale } from "next-intl";
import { Fragment, useRef, type ReactNode, type RefObject } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type CardAction = {
  id: string;
  label: string;
  icon: ReactNode;
  /** Draws a divider above this item. */
  separatorBefore?: boolean;
  /** The destructive item uses the error palette. */
  destructive?: boolean;
  /** Every action is expected to open a dialog; see the focus note below. */
  onSelect: () => void;
};

type CardActionsMenuProps = {
  /** Accessible name for the trigger, e.g. "Options for Yasmine". */
  label: string;
  actions: readonly CardAction[];
  /**
   * Lets the caller return focus here after a dialog closes. The menu's own
   * trigger is used when omitted.
   */
  triggerRef?: RefObject<HTMLButtonElement | null>;
};

/**
 * The per-card "more" menu, shared by the parent and teacher cards.
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
 *
 * The trigger ref is supplied by the caller (rather than created here) so the
 * caller's dialogs can use it in their `onCloseAutoFocus`.
 */
export function CardActionsMenu({
  label,
  actions,
  triggerRef,
}: CardActionsMenuProps) {
  const locale = useLocale();
  const internalRef = useRef<HTMLButtonElement>(null);
  const ref = triggerRef ?? internalRef;
  const openingDialog = useRef(false);

  return (
    <DropdownMenu dir={locale === "ar" ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <button
          ref={ref}
          type="button"
          aria-label={label}
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
        {actions.map((action) => (
          <Fragment key={action.id}>
            {action.separatorBefore ? <DropdownMenuSeparator /> : null}
            <DropdownMenuItem
              className={cn(
                action.destructive &&
                  "text-destructive-deep data-[highlighted]:bg-destructive-soft data-[highlighted]:text-destructive-deep",
              )}
              onSelect={() => {
                openingDialog.current = true;
                action.onSelect();
              }}
            >
              {action.icon}
              {action.label}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
