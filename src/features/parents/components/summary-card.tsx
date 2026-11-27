import { useTranslations } from "next-intl";
import { StatCard } from "@/components/shared/stat-card";
import type { SummaryCardData } from "../types";

/**
 * One real parent summary figure (children, grades, average score).
 *
 * The value is already formatted data from the query; only the label, caption
 * and the rare "no value" fallback are translated. The shared `StatCard` owns
 * the visuals so the other overviews render the same card without importing
 * anything from `features/parents`.
 */
export function SummaryCard({ card }: { card: SummaryCardData }) {
  const t = useTranslations("Dashboard");

  return (
    <StatCard
      label={t(card.labelKey)}
      value={card.value || (card.emptyKey ? t(card.emptyKey) : "")}
      caption={t(card.captionKey)}
      tone={card.tone}
    />
  );
}
