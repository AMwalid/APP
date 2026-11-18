import type { ReactNode } from "react";

type FormAlertProps = {
  tone: "error" | "success";
  children: ReactNode;
};

/**
 * The one place a form result is announced.
 *
 * Shared rather than owned by a feature: the auth forms and the "add child"
 * dialog both need to report a failed submit, and `components/` is the only
 * layer every feature may import (ARCHITECTURE §9).
 *
 * `role="alert"` interrupts for a failed submit; `role="status"` is polite for
 * an informational outcome like "check your email", which should not talk over
 * whatever the user is doing. Colour comes from tokens only.
 */
export function FormAlert({ tone, children }: FormAlertProps) {
  const isError = tone === "error";

  return (
    <p
      role={isError ? "alert" : "status"}
      className={
        isError
          ? "rounded-control bg-destructive-soft p-3 text-sm leading-relaxed text-destructive-deep"
          : "rounded-control bg-primary-soft p-3 text-sm leading-relaxed text-primary-deep"
      }
    >
      {children}
    </p>
  );
}
