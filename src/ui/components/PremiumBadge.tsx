"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { Category, Impact } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { uiTokens } from "@/ui/tokens";
import { useReducedMotionPreference } from "@/ui/hooks/useReducedMotionPreference";
import Icon, { type IconName } from "@/ui/components/Icon";

const IMPACT_LABELS: Record<Impact, string> = {
  high: "Alto",
  medium: "Médio",
  low: "Baixo",
};

const IMPACT_ICONS: Record<Impact, IconName> = {
  high: "alert-triangle",
  medium: "minus-circle",
  low: "check-circle",
};

interface PremiumBadgeProps {
  type: "category" | "impact";
  value: Category | Impact;
  children?: ReactNode;
}

export default function PremiumBadge({ type, value, children }: PremiumBadgeProps) {
  const reducedMotion = useReducedMotionPreference();

  if (type === "category") {
    const category = value as Category;
    return (
      <motion.span
        className={`badge-ios badge-${category}`}
        initial={reducedMotion ? undefined : { scale: 0.92, opacity: 0 }}
        animate={reducedMotion ? undefined : { scale: 1, opacity: 1 }}
        transition={{
          duration: uiTokens.motion.duration.medium,
          ease: uiTokens.motion.easing.soft,
        }}
      >
        {children ?? CATEGORY_LABELS[category] ?? category}
      </motion.span>
    );
  }

  const impact = value as Impact;
  return (
    <motion.span
      className={`badge-ios badge-impact-${impact}`}
      initial={reducedMotion ? undefined : { scale: 0.92, opacity: 0 }}
      animate={reducedMotion ? undefined : { scale: 1, opacity: 1 }}
      transition={{
        duration: uiTokens.motion.duration.medium,
        ease: uiTokens.motion.easing.soft,
      }}
    >
      <Icon name={IMPACT_ICONS[impact]} size={14} />
      {children ?? IMPACT_LABELS[impact] ?? impact}
    </motion.span>
  );
}
