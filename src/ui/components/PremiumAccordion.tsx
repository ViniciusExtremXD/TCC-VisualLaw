"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { uiTokens } from "@/ui/tokens";
import { useReducedMotionPreference } from "@/ui/hooks/useReducedMotionPreference";
import Icon from "@/ui/components/Icon";

interface PremiumAccordionProps {
  title: string;
  summary?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  testId?: string;
  onToggle?: (open: boolean) => void;
  className?: string;
}

export default function PremiumAccordion({
  title,
  summary,
  children,
  defaultOpen = false,
  testId,
  onToggle,
  className = "",
}: PremiumAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    onToggle?.(open);
  }, [onToggle, open]);

  return (
    <div className={`cupertino-accordion glass hairline ${className}`.trim()} data-testid={testId}>
      <button
        type="button"
        className="cupertino-accordion-trigger ios-focus"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <motion.span
          className="d-inline-flex align-items-center"
          animate={{ rotate: open ? 180 : 0 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  duration: uiTokens.motion.duration.normal,
                  ease: uiTokens.motion.easing.swift,
                }
          }
        >
          <Icon name="chevron-down" size={16} />
        </motion.span>
      </button>

      {summary ? <p className="cupertino-accordion-summary">{summary}</p> : null}

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            className="cupertino-accordion-content"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto", y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
            transition={
              reducedMotion
                ? { duration: 0.1 }
                : {
                    duration: uiTokens.motion.duration.medium,
                    ease: uiTokens.motion.easing.soft,
                  }
            }
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
