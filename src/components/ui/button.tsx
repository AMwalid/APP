import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui-style button primitive.
 *
 * Colour comes only from semantic tokens (`primary`, `primary-hover`,
 * `primary-soft`, `primary-foreground`) so the palette stays in
 * `src/styles/globals.css`.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control text-sm font-medium transition-colors duration-150 ease-standard disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline:
          "border border-primary-hover text-primary-hover hover:bg-primary-soft",
        ghost: "text-primary-hover hover:text-primary-deep",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive-deep",
      },
      size: {
        sm: "px-3 py-2",
        md: "px-4 py-2.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  },
);

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
