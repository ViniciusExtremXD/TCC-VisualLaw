"use client";

import type { Category, Impact } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

const IMPACT_LABELS: Record<Impact, string> = {
  high: "Alto",
  medium: "Médio",
  low: "Baixo",
};

const IMPACT_ICONS: Record<Impact, string> = {
  high: "bi-exclamation-triangle-fill",
  medium: "bi-dash-circle-fill",
  low: "bi-check-circle-fill",
};

interface BadgeProps {
  type: "category" | "impact";
  value: Category | Impact;
}

export default function Badge({ type, value }: BadgeProps) {
  if (type === "category") {
    const cat = value as Category;
    return (
      <span className={`badge-ios badge-${cat}`}>
        {CATEGORY_LABELS[cat] ?? cat}
      </span>
    );
  }

  const impact = value as Impact;
  return (
    <span className={`badge-ios badge-impact-${impact}`}>
      <i className={`bi ${IMPACT_ICONS[impact]}`}></i>
      {IMPACT_LABELS[impact] ?? impact}
    </span>
  );
}
