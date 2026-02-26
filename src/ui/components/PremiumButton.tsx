"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { uiTokens } from "@/ui/tokens";
import { useReducedMotionPreference } from "@/ui/hooks/useReducedMotionPreference";

export type PremiumButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type PremiumButtonSize = "sm" | "md";

export function getPremiumButtonClassName(
  variant: PremiumButtonVariant = "primary",
  size: PremiumButtonSize = "md",
  className = ""
) {
  return [
    "cupertino-btn",
    `cupertino-btn-${variant}`,
    `cupertino-btn-${size}`,
    "ios-tap",
    "ios-focus",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export const getCupertinoButtonClassName = getPremiumButtonClassName;

interface PremiumButtonProps extends Omit<HTMLMotionProps<"button">, "type"> {
  variant?: PremiumButtonVariant;
  size?: PremiumButtonSize;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
}

export default function PremiumButton({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: PremiumButtonProps) {
  const reducedMotion = useReducedMotionPreference();

  return (
    <motion.button
      type={type}
      className={getPremiumButtonClassName(variant, size, className)}
      whileTap={reducedMotion ? undefined : { scale: 0.97, y: 0.5 }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              y: -0.8,
              transition: {
                duration: uiTokens.motion.duration.fast,
                ease: uiTokens.motion.easing.soft,
              },
            }
      }
      transition={{
        duration: uiTokens.motion.duration.normal,
        ease: uiTokens.motion.easing.swift,
      }}
      {...props}
    />
  );
}
