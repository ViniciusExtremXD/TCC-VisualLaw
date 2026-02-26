"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { uiTokens } from "@/ui/tokens";
import { useReducedMotionPreference } from "@/ui/hooks/useReducedMotionPreference";

interface PremiumSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  testId?: string;
  maxWidth?: number;
}

export default function PremiumSheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  testId,
  maxWidth = 860,
}: PremiumSheetProps) {
  const reducedMotion = useReducedMotionPreference();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="cupertino-sheet-overlay"
          onClick={onClose}
          data-testid={testId}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, backdropFilter: "blur(0px)" }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, backdropFilter: "blur(10px)" }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{
            duration: reducedMotion ? 0.12 : uiTokens.motion.duration.medium,
            ease: uiTokens.motion.easing.soft,
          }}
        >
          <motion.div
            className="cupertino-sheet glass elevated specular"
            style={{ maxWidth }}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 34, scale: 0.985 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 34, scale: 0.99 }}
            transition={{
              duration: reducedMotion ? 0.12 : uiTokens.motion.duration.medium,
              ease: uiTokens.motion.easing.ios,
            }}
          >
            <motion.div
              className="cupertino-sheet-handle"
              animate={reducedMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
              transition={
                reducedMotion
                  ? undefined
                  : { duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
              }
            ></motion.div>
            {(title || subtitle) && (
              <header className="cupertino-sheet-header">
                <div>
                  {title ? <h3 className="cupertino-sheet-title">{title}</h3> : null}
                  {subtitle ? <p className="cupertino-sheet-subtitle">{subtitle}</p> : null}
                </div>
                <button
                  type="button"
                  className="cupertino-sheet-close ios-focus"
                  aria-label="Fechar"
                  onClick={onClose}
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              </header>
            )}

            <div className="cupertino-sheet-content">{children}</div>
            {footer ? <footer className="cupertino-sheet-footer">{footer}</footer> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
