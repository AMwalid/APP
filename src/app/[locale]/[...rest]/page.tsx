import { notFound } from "next/navigation";

/** Send unmatched locale URLs to the localized `not-found.tsx` boundary. */
export default function CatchAllPage() {
  notFound();
}
