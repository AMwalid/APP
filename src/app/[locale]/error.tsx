"use client";

import { ErrorPanel } from "@/components/shared/error-panel";

/** Catches render failures under `[locale]` that a nearer boundary misses. */
export default function LocaleError({ reset }: { reset: () => void }) {
  return <ErrorPanel reset={reset} />;
}
