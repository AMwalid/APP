"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Dropdown menu primitive, adapted from shadcn/ui for this token set.
 *
 * Differences from the upstream file: colours come from semantic tokens only,
 * there are no `ring-*` utilities, and the content reuses the
 * `animate-dropdown-in` animation already defined in `globals.css` (disabled
 * under `prefers-reduced-motion`).
 *
 * `Root` takes `dir` from the caller. Radix reads direction from a React
 * context, not from the `<html dir>` attribute, so without an explicit `dir`
 * the menu opens on the wrong edge of an Arabic page.
 *
 * `onCloseAutoFocus` is forwarded untouched: when an item opens a dialog, the
 * caller has to prevent Radix from pulling focus back to the trigger after the
 * dialog has already claimed it.
 */
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;

function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-dropdown min-w-40 animate-dropdown-in rounded-control border border-border bg-surface p-1 shadow-panel",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuItem({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "flex cursor-default select-none items-center gap-2 rounded-control px-2 py-1.5 text-sm text-foreground outline-none transition-colors duration-150 ease-standard data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-surface-subtle",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};
