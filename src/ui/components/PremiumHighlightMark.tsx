"use client";

import { motion } from "framer-motion";
import { uiTokens } from "@/ui/tokens";
import { useReducedMotionPreference } from "@/ui/hooks/useReducedMotionPreference";

interface PremiumHighlightMarkProps {
  id: string;
  text: string;
  onClick: () => void;
}

export default function PremiumHighlightMark({ id, text, onClick }: PremiumHighlightMarkProps) {
  const reducedMotion = useReducedMotionPreference();

  return (
    <motion.button
      key={id}
      type="button"
      className="term-highlight premium-highlight-mark ios-focus"
      title={`Clique para ver: ${text}`}
      onClick={onClick}
      whileHover={reducedMotion ? undefined : { scale: 1.02, y: -0.4 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      initial={reducedMotion ? undefined : { opacity: 0, y: 1.5 }}
      animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{
        duration: uiTokens.motion.duration.fast,
        ease: uiTokens.motion.easing.soft,
      }}
    >
      {text}
    </motion.button>
  );
}
