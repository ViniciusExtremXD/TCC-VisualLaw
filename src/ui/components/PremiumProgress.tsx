"use client";

import { motion } from "framer-motion";
import { uiTokens } from "@/ui/tokens";
import { useReducedMotionPreference } from "@/ui/hooks/useReducedMotionPreference";

interface PremiumProgressProps {
  current: number;
  total: number;
}

export default function PremiumProgress({ current, total }: PremiumProgressProps) {
  const reducedMotion = useReducedMotionPreference();
  const progress = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="cupertino-card-inset p-3 glass hairline">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="text-ios-secondary" style={{ fontSize: "0.8rem" }}>
          {current} de {total}
        </span>
        <span className="text-ios-secondary" style={{ fontSize: "0.8rem" }}>
          {progress}%
        </span>
      </div>
      <div className="progress-ios premium-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <motion.div
          className="progress-bar premium-progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  duration: uiTokens.motion.duration.medium,
                  ease: uiTokens.motion.easing.ios,
                }
          }
        ></motion.div>
      </div>
    </div>
  );
}
