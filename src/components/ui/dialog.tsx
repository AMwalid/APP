"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Dialog primitive, adapted from shadcn/ui for this token set.
 *
 * Differences from the upstream file: colours come from semantic tokens only
 * (`surface`, `border`, `foreground`, `muted-foreground`), there is no
 * `ring-*` utility (focus is the single global `:focus-visible` outline), and
 * the dismiss button is opt-in via `closeLabel`.
 *
 * `closeLabel` is a prop rather than a translation lookup because this file is
 * a primitive: it must not know which namespace a caller is in, and a hardcoded
 * "Close" would be an English string on an Arabic page. Passing the label also
 * gives the caller the accessible name it needs.
 *
 * Motion reuses the `overlay-in` / `sheet-in` animations already defined in
 * `globals.css`, which are disabled under `prefers-reduced-motion`.
 */

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogPortal = DialogPrimitive.Portal;

function DialogOverlay({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-overlay animate-overlay-in bg-foreground/30 backdrop-blur-[2px]",
        className,
      )}
      {...props}
    />
  );
}

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  /** Accessible name for the dismiss button. Omit to render no button. */
  closeLabel?: string;
};

function DialogContent({
  className,
  children,
  closeLabel,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.Content
        className={cn(
          "fixed inset-x-4 top-24 z-modal mx-auto max-w-md animate-sheet-in rounded-control border border-border bg-surface p-6 shadow-panel sm:top-32",
          className,
        )}
        {...props}
      >
        {children}

        {closeLabel ? (
          <DialogPrimitive.Close
            className="absolute end-4 top-4 inline-flex size-8 items-center justify-center rounded-control text-muted-foreground transition-colors duration-150 ease-standard hover:bg-surface-subtle hover:text-foreground"
            aria-label={closeLabel}
          >
            <X aria-hidden className="size-4" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      // `pe-8` keeps the heading clear of the dismiss button on the end edge.
      className={cn("grid gap-1.5 pe-8 text-start", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-wrap justify-end gap-2", className)}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
