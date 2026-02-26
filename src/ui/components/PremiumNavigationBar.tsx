"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { uiTokens } from "@/ui/tokens";
import { useReducedMotionPreference } from "@/ui/hooks/useReducedMotionPreference";

interface PremiumNavigationBarProps {
  title: string;
  subtitle?: string;
  caption?: string;
  actions?: ReactNode;
  largeTitle?: boolean;
  testId?: string;
}

export default function PremiumNavigationBar({
  title,
  subtitle,
  caption,
  actions,
  largeTitle = true,
  testId,
}: PremiumNavigationBarProps) {
  const [compact, setCompact] = useState(false);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    const handleScroll = () => {
      setCompact(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className="cupertino-nav elevated hairline"
      data-testid={testId}
      animate={{
        paddingTop: compact ? "0.65rem" : "0.85rem",
        paddingBottom: compact ? "0.72rem" : "1rem",
      }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              duration: uiTokens.motion.duration.medium,
              ease: uiTokens.motion.easing.ios,
            }
      }
    >
      <div className="cupertino-nav-top-row">
        {subtitle ? <span className="cupertino-nav-subtitle">{subtitle}</span> : <span></span>}
        {actions ? <div className="d-flex align-items-center gap-2 flex-wrap">{actions}</div> : null}
      </div>

      {largeTitle ? (
        <motion.h1
          className="cupertino-large-title mb-0"
          animate={{
            letterSpacing: compact ? "-0.01em" : "-0.02em",
            fontSize: compact ? "clamp(1.48rem, 3.2vw, 1.82rem)" : "clamp(1.7rem, 4vw, 2.15rem)",
          }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  duration: uiTokens.motion.duration.medium,
                  ease: uiTokens.motion.easing.swift,
                }
          }
        >
          {title}
        </motion.h1>
      ) : (
        <h2 className="cupertino-title mb-0">{title}</h2>
      )}

      {caption ? (
        <motion.p
          className="cupertino-caption mb-0 mt-2"
          animate={{ opacity: compact ? 0.88 : 1 }}
          transition={reducedMotion ? { duration: 0 } : { duration: uiTokens.motion.duration.medium }}
        >
          {caption}
        </motion.p>
      ) : null}
    </motion.header>
  );
}
