"use client";

import { PROCESS_SEMIOTIC_STEPS } from "@/data/visual/document-semiotic-map";

export default function ProcessMap() {
  return (
    <section className="ios-card p-4">
      <h2 className="fw-bold mb-1" style={{ fontSize: "1.1rem" }}>
        Mapa do Processo (Semiotica + Auditoria)
      </h2>
      <p className="text-ios-secondary mb-3" style={{ fontSize: "0.83rem" }}>
        Trilha fixa de processamento academico antes da execucao do pipeline.
      </p>

      <div className="d-flex flex-column gap-3" data-testid="process-map">
        {PROCESS_SEMIOTIC_STEPS.map((step, index) => (
          <article key={step.id} className="d-flex gap-3">
            <div className="d-flex flex-column align-items-center" style={{ width: 28 }}>
              <div className="stepper-dot fw-semibold" style={{ fontSize: "0.76rem" }}>
                {index + 1}
              </div>
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
                  <span className="fw-semibold">Saida:</span> {step.output}
                </div>
                <div>
                  <span className="fw-semibold">Evidencia:</span> {step.evidence}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
