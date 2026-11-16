import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Text input primitive.
 *
 * Colour comes from semantic tokens only. There is no `ring-*` utility here:
 * focus is the single `:focus-visible` outline declared in `globals.css`, so
 * fields, buttons and links all share one focus treatment.
 *
 * `aria-invalid` is what react-hook-form's `FormControl` sets, so the error
 * border follows validation without a separate prop.
 */
function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-control border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors duration-150 ease-standard placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
