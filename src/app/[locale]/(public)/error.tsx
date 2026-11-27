"use client";

import { ErrorPanel } from "@/components/shared/error-panel";

/** Public-site boundary, rendered between the site header and footer. */
export default function PublicError({ reset }: { reset: () => void }) {
  return <ErrorPanel reset={reset} />;
}
