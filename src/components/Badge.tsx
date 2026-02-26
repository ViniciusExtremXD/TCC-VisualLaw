"use client";

import type { Category, Impact } from "@/lib/types";
import PremiumBadge from "@/ui/components/PremiumBadge";

interface BadgeProps {
  type: "category" | "impact";
  value: Category | Impact;
}

export default function Badge({ type, value }: BadgeProps) {
  if (type === "category") {
    return <PremiumBadge type="category" value={value as Category} />;
  }

  return <PremiumBadge type="impact" value={value as Impact} />;
}
