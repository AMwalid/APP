"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Label primitive.
 *
 * Radix keeps the association working when the label wraps a control that is
 * rendered by a slot (react-hook-form's `FormControl`), and stops a click on
 * the label from stealing focus from the input.
 */
function Label({
  className,
  ...props
}: ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "text-sm font-medium text-foreground select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
