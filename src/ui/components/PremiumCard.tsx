"use client";

import type { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { motion } from "framer-motion";
import { uiTokens } from "@/ui/tokens";
import { useReducedMotionPreference } from "@/ui/hooks/useReducedMotionPreference";

interface PremiumCardProps {
  inset?: boolean;
  children: ReactNode;
  as?: "section" | "article" | "div";
  interactive?: boolean;
  className?: string;
  id?: string;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLElement>;
  "data-testid"?: string;
}

export default function PremiumCard({
  inset = false,
  children,
  className = "",
  as = "section",
  interactive = false,
  id,
  style,
  onClick,
  "data-testid": dataTestId,
}: PremiumCardProps) {
  const reducedMotion = useReducedMotionPreference();
  const MotionElement =
    as === "article" ? motion.article : as === "div" ? motion.div : motion.section;

  return (
    <MotionElement
      className={`${
        inset ? "cupertino-card-inset" : "cupertino-card elevated hairline"
      } ${interactive ? "ios-card-hover" : ""} ${className}`.trim()}
      whileHover={
        interactive && !reducedMotion
          ? {
              y: -1.5,
              scale: 1.002,
              transition: {
                duration: uiTokens.motion.duration.normal,
                ease: uiTokens.motion.easing.soft,
              },
            }
          : undefined
      }
      whileTap={
        interactive && !reducedMotion
          ? { scale: 0.997, transition: { duration: uiTokens.motion.duration.fast } }
          : undefined
      }
      layout={!reducedMotion}
      transition={{
        duration: uiTokens.motion.duration.medium,
        ease: uiTokens.motion.easing.ios,
      }}
      id={id}
      style={style}
      onClick={onClick}
      data-testid={dataTestId}
    >
      {children}
    </MotionElement>
  );
}
