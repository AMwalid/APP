import { useTranslations } from "next-intl";
import { StatCard } from "@/components/shared/stat-card";
import type { SummaryCardData } from "../types";

/**
 * One parent summary figure (attendance, behaviour, next exam).
 *
 * The parent feature keeps its translation-key contract; the shared `StatCard`
 * owns the visuals so the teacher overview renders the same card without
 * importing anything from `features/parents`.
 */
export function SummaryCard({ card }: { card: SummaryCardData }) {
  const t = useTranslations("Dashboard");

  return (
    <StatCard
      label={t(card.labelKey)}
      value={t(card.valueKey)}
      caption={t(card.captionKey)}
      tone={card.tone}
    />
  );
}
