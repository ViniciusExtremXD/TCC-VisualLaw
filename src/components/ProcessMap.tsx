"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Accordion from "@/components/Accordion";
import { PROCESS_SEMIOTIC_STEPS } from "@/data/visual/document-semiotic-map";
import { strings } from "@/i18n/ptBR";
import { useReducedMotionPreference } from "@/ui/hooks/useReducedMotionPreference";
import { uiTokens } from "@/ui/tokens";

export default function ProcessMap() {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotionPreference();

  return (
    <section className="ios-card elevated p-4" data-testid="process-map-block">
      <h2 className="fw-bold mb-1" style={{ fontSize: "1.1rem" }}>
        {strings.home.processMapTitle}
      </h2>
      <p className="text-ios-secondary mb-2" style={{ fontSize: "0.83rem" }}>
        {strings.home.processMapSummary}
      </p>

      <Accordion
        title={strings.home.processMapDetails}
        summary="Segmentação, classificação, léxico, semiótica e auditoria com evidências por etapa."
        testId="process-map-accordion"
        onToggle={setOpen}
      >
        <motion.div
          className="d-flex flex-column gap-3"
          data-testid="process-map"
          initial={false}
          animate={{ opacity: 1 }}
        >
          {PROCESS_SEMIOTIC_STEPS.map((step, index) => (
            <motion.article
              key={step.id}
              className="d-flex gap-3"
              initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={
                reducedMotion
                  ? undefined
                  : {
                      duration: uiTokens.motion.duration.medium,
                      delay: index * 0.04,
                      ease: uiTokens.motion.easing.soft,
                    }
              }
            >
              <div className="d-flex flex-column align-items-center" style={{ width: 28 }}>
                <motion.div
                  className={`stepper-dot fw-semibold ${open ? "stepper-dot-ping" : ""}`}
                  style={{ fontSize: "0.76rem" }}
                  animate={reducedMotion ? undefined : { scale: open ? [1, 1.08, 1] : 1 }}
                  transition={{
                    duration: uiTokens.motion.duration.slow,
                    delay: index * 0.05,
                    ease: uiTokens.motion.easing.soft,
                  }}
                >
                  {index + 1}
                </motion.div>
                {index < PROCESS_SEMIOTIC_STEPS.length - 1 && <div className="stepper-line"></div>}
              </div>
              <div className="flex-fill pb-2">
                <div className="fw-semibold" style={{ fontSize: "0.92rem" }}>
                  {step.title}
                </div>
                <div className="text-ios-secondary" style={{ fontSize: "0.8rem" }}>
                  {step.objective}
                </div>
                <div className="ios-card-inset p-2 mt-1" style={{ fontSize: "0.78rem" }}>
                  <div>
                    <span className="fw-semibold">Entrada:</span> {step.input}
                  </div>
                  <div>
                    <span className="fw-semibold">Saída:</span> {step.output}
                  </div>
                  <div>
                    <span className="fw-semibold">Evidência:</span> {step.evidence}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Accordion>
    </section>
  );
}
