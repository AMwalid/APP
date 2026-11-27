"use client";

import { ErrorPanel } from "@/components/shared/error-panel";

/** Dashboard-specific boundary: keeps the retry panel inside the shell. */
export default function DashboardError({ reset }: { reset: () => void }) {
  return <ErrorPanel reset={reset} />;
}
