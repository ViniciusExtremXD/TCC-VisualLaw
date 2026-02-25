"use client";

import type { Clause, ClauseAudit, HighlightAudit, TermMatch } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { SEMIOTIC_MAP } from "@/lib/semiotic-data";

interface ProcessingTracePanelProps {
  clause: Clause;
  audit?: ClauseAudit;
  highlights: TermMatch[];
}

function renderHighlightLine(match: TermMatch, audit?: HighlightAudit) {
  return (
    <div key={`${match.term_id}-${match.start}`} className="audit-evidence">
      <div className="fw-semibold" style={{ fontSize: "0.8rem" }}>
        {match.match} <code>{match.term_id}</code>
      </div>
      <div style={{ fontSize: "0.77rem" }}>
        offsets: [{match.start}, {match.end}]
        {audit && (
          <>
            {" "}| campo: {audit.lookup.lexicon_field_used} | variante: {audit.lookup.matched_variant}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProcessingTracePanel({ clause, audit, highlights }: ProcessingTracePanelProps) {
  const semiotic = SEMIOTIC_MAP.find((item) => item.category === clause.category);
  const sortedScores = audit
    ? Object.entries(audit.classification.scores).sort(([, a], [, b]) => b - a)
    : [];

  return (
    <section className="ios-card p-3" data-testid="processing-trace">
      <h3 className="fw-bold mb-2" style={{ fontSize: "1rem" }}>
        Rastreamento do Processamento
      </h3>
      <div className="text-ios-secondary mb-3" style={{ fontSize: "0.8rem" }}>
        Conversao textual, regras disparadas, matching lexico e mapeamento semiotico da clausula atual.
      </div>

      <div className="d-flex flex-column gap-3">
        <div>
          <div className="audit-section-title">Texto original (trecho)</div>
          <div className="audit-evidence">{clause.text.slice(0, 280)}{clause.text.length > 280 ? "..." : ""}</div>
        </div>

        <div>
          <div className="audit-section-title">Texto normalizado (preview)</div>
          <div className="audit-evidence">{audit?.normalized_preview ?? "Nao disponivel"}</div>
        </div>

        <div>
          <div className="audit-section-title">Segmentacao</div>
          <div className="audit-evidence">
            regra: {audit?.segment.rule ?? "n/a"} | evidencia: {audit?.segment.evidence ?? "n/a"}
          </div>
        </div>

        <div>
          <div className="audit-section-title">Classificacao</div>
          <div className="audit-evidence mb-2">
            categoria: {CATEGORY_LABELS[clause.category]} | impacto: {clause.impact}
          </div>
          {sortedScores.length > 0 && (
            <div className="ios-card-inset p-2">
              {sortedScores.map(([category, score]) => (
                <div key={category} style={{ fontSize: "0.78rem" }}>
                  {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? category}: {score}
                </div>
              ))}
            </div>
          )}
          {audit && audit.classification.rules_fired.length > 0 && (
            <div className="d-flex flex-column gap-1 mt-2">
              {audit.classification.rules_fired.map((rule) => (
                <div key={rule.rule_id} className="audit-evidence" style={{ fontSize: "0.78rem" }}>
                  <code>{rule.rule_id}</code> | keywords: {rule.keywords.join(", ")} | score: {rule.weight}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="audit-section-title">Lexico (matches e offsets)</div>
          {highlights.length > 0 ? (
            <div className="d-flex flex-column gap-1">
              {highlights.map((highlight) =>
                renderHighlightLine(
                  highlight,
                  audit?.highlights.find((item) => item.term_id === highlight.term_id && item.start === highlight.start)
                )
              )}
            </div>
          ) : (
            <div className="audit-evidence">Nenhum termo do lexico encontrado nesta clausula.</div>
          )}
        </div>

        <div>
          <div className="audit-section-title">Semiotica aplicada</div>
          <div className="audit-evidence" style={{ fontSize: "0.78rem" }}>
            categoria {"->"} icone: {clause.category} {"->"} {semiotic?.icon_id ?? "n/a"}
            <br />
            impacto {"->"} badge: {clause.impact}
            <br />
            justificativa: {semiotic?.significance ?? "Mapeamento padrao do projeto."}
          </div>
        </div>
      </div>
    </section>
  );
}
