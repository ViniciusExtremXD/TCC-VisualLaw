"use client";

import { useState } from "react";
import type { ClauseAudit, AuditSession } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

interface AuditDrawerProps {
  clauseId: string;
  audit: AuditSession;
  onClose: () => void;
}

const STEP_ICONS = ["bi-scissors", "bi-type", "bi-tags", "bi-search", "bi-eye"];

export default function AuditDrawer({ clauseId, audit, onClose }: AuditDrawerProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "classification" | "lexicon" | "semiotic"
  >("overview");
  const clauseAudit: ClauseAudit | undefined = audit.clauses_audit[clauseId];

  if (!clauseAudit) {
    return (
      <div className="audit-drawer-overlay" onClick={onClose}>
        <div className="audit-drawer" onClick={(event) => event.stopPropagation()}>
          <div className="p-4 text-center text-ios-secondary">
            Dados de auditoria não disponíveis para esta cláusula.
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "overview" as const, label: "Visão geral", icon: "bi-list-check" },
    { key: "classification" as const, label: "Classificação", icon: "bi-tags" },
    { key: "lexicon" as const, label: "Léxico", icon: "bi-book" },
    { key: "semiotic" as const, label: "Semiótica", icon: "bi-palette" },
  ];

  return (
    <div className="audit-drawer-overlay" onClick={onClose}>
      <div className="audit-drawer" onClick={(event) => event.stopPropagation()}>
        <div
          className="d-flex align-items-center justify-content-between p-3 px-4"
          style={{ borderBottom: "0.5px solid var(--vl-border)" }}
        >
          <div>
            <h3 className="fw-bold mb-0" style={{ fontSize: "1.125rem" }}>
              <i className="bi bi-clipboard-data me-2 text-ios-accent"></i>
              Auditoria
            </h3>
            <span className="text-ios-secondary" style={{ fontSize: "0.75rem" }}>
              {clauseId} · {audit.session_id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm p-0 text-ios-secondary border-0"
            style={{ fontSize: "1.25rem" }}
            aria-label="Fechar auditoria"
          >
            <i className="bi bi-x-circle-fill"></i>
          </button>
        </div>

        <div
          className="d-flex gap-1 p-2 px-3"
          style={{ borderBottom: "0.5px solid var(--vl-border)", overflowX: "auto" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`btn btn-sm ${activeTab === tab.key ? "audit-tab-active" : "btn-ios-tertiary"}`}
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem", whiteSpace: "nowrap" }}
            >
              <i className={`bi ${tab.icon} me-1`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-3 px-4" style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
          {activeTab === "overview" && <OverviewTab audit={audit} clauseAudit={clauseAudit} />}
          {activeTab === "classification" && <ClassificationTab clauseAudit={clauseAudit} />}
          {activeTab === "lexicon" && <LexiconTab clauseAudit={clauseAudit} />}
          {activeTab === "semiotic" && <SemioticTab clauseAudit={clauseAudit} />}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ audit, clauseAudit }: { audit: AuditSession; clauseAudit: ClauseAudit }) {
  return (
    <div className="d-flex flex-column gap-3">
      <div className="text-ios-secondary mb-1" style={{ fontSize: "0.8125rem" }}>
        Pipeline executado em {audit.pipeline.length} etapas
      </div>
      {audit.pipeline.map((step, index) => (
        <div key={step.step_id} className="d-flex gap-3">
          <div className="d-flex flex-column align-items-center" style={{ width: 28 }}>
            <div className="stepper-dot">
              <i className={`bi ${STEP_ICONS[index] ?? "bi-circle"}`} style={{ fontSize: "0.75rem" }}></i>
            </div>
            {index < audit.pipeline.length - 1 && <div className="stepper-line" />}
          </div>

          <div className="flex-fill pb-3">
            <div className="fw-semibold" style={{ fontSize: "0.875rem" }}>
              {step.name}
            </div>
            <div className="text-ios-secondary" style={{ fontSize: "0.8125rem" }}>
              {step.description}
            </div>

            {index === 0 && (
              <div className="audit-evidence mt-2">
                <span className="audit-label">Regra:</span> {clauseAudit.segment.rule}
                <br />
                <span className="audit-label">Evidência:</span> {clauseAudit.segment.evidence}
              </div>
            )}

            {index === 1 && (
              <div className="audit-evidence mt-2">
                <span className="audit-label">Preview:</span>
                <code
                  className="d-block mt-1"
                  style={{ fontSize: "0.75rem", wordBreak: "break-all" }}
                >
                  {clauseAudit.normalized_preview}
                </code>
              </div>
            )}

            {index === 2 && (
              <div className="audit-evidence mt-2">
                <span className="audit-label">Categoria:</span>{" "}
                {CATEGORY_LABELS[clauseAudit.classification.category]}
                <br />
                <span className="audit-label">Método:</span> {clauseAudit.classification.method}
                <br />
                <span className="audit-label">Regras disparadas:</span>{" "}
                {clauseAudit.classification.rules_fired.length}
              </div>
            )}

            {index === 3 && (
              <div className="audit-evidence mt-2">
                <span className="audit-label">Termos encontrados:</span> {clauseAudit.highlights.length}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ClassificationTab({ clauseAudit }: { clauseAudit: ClauseAudit }) {
  const { classification } = clauseAudit;
  const sortedScores = Object.entries(classification.scores).sort(([, a], [, b]) => b - a);

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <div className="audit-section-title">Categoria atribuída</div>
        <div className="d-flex align-items-center gap-2 mt-1">
          <span className={`badge-ios badge-${classification.category}`}>
            {CATEGORY_LABELS[classification.category]}
          </span>
          <span className="text-ios-secondary" style={{ fontSize: "0.75rem" }}>
            via {classification.method}
          </span>
        </div>
      </div>

      <div>
        <div className="audit-section-title">Scores por categoria</div>
        <div className="ios-card-inset mt-1">
          <table className="table table-borderless mb-0" style={{ fontSize: "0.8125rem" }}>
            <tbody>
              {sortedScores.map(([category, score]) => (
                <tr key={category} style={{ borderBottom: "0.5px solid var(--vl-border)" }}>
                  <td className="py-2 px-3">
                    {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? category}
                  </td>
                  <td className="py-2 px-3 text-end fw-semibold" style={{ width: 60 }}>
                    {score}
                  </td>
                  <td className="py-2 px-3" style={{ width: 100 }}>
                    <div className="progress-ios" style={{ height: 4 }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${
                            sortedScores[0][1] > 0 ? (score / sortedScores[0][1]) * 100 : 0
                          }%`,
                          background:
                            category === classification.category
                              ? "var(--vl-accent)"
                              : "var(--vl-text-secondary)",
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="audit-section-title">Regras disparadas</div>
        {classification.rules_fired.length === 0 ? (
          <div className="text-ios-secondary" style={{ fontSize: "0.8125rem" }}>
            Nenhuma regra disparou.
          </div>
        ) : (
          <div className="d-flex flex-column gap-2 mt-1">
            {classification.rules_fired.map((rule) => (
              <div key={rule.rule_id} className="audit-evidence">
                <div className="fw-semibold" style={{ fontSize: "0.8125rem" }}>
                  <code>{rule.rule_id}</code>
                  <span className="ms-2 text-ios-secondary">peso: {rule.weight}</span>
                </div>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {rule.keywords.map((keyword) => (
                    <span key={keyword} className="audit-keyword-badge">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LexiconTab({ clauseAudit }: { clauseAudit: ClauseAudit }) {
  return (
    <div className="d-flex flex-column gap-3">
      <div className="audit-section-title">Termos encontrados ({clauseAudit.highlights.length})</div>
      {clauseAudit.highlights.length === 0 ? (
        <div className="text-ios-secondary" style={{ fontSize: "0.8125rem" }}>
          Nenhum termo do léxico foi encontrado nesta cláusula.
        </div>
      ) : (
        clauseAudit.highlights.map((highlight, index) => (
          <div key={`${highlight.term_id}-${index}`} className="audit-evidence">
            <div className="d-flex justify-content-between align-items-start">
              <div className="fw-semibold" style={{ fontSize: "0.875rem" }}>
                &ldquo;{highlight.match}&rdquo;
              </div>
              <code className="text-ios-secondary" style={{ fontSize: "0.6875rem" }}>
                {highlight.term_id}
              </code>
            </div>
            <div className="mt-1" style={{ fontSize: "0.8125rem" }}>
              <span className="audit-label">Offsets:</span> [{highlight.start}, {highlight.end}]
              <br />
              <span className="audit-label">Campo do léxico:</span>{" "}
              {highlight.lookup.lexicon_field_used}
              <br />
              <span className="audit-label">Variante que bateu:</span> {highlight.lookup.matched_variant}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function SemioticTab({ clauseAudit }: { clauseAudit: ClauseAudit }) {
  const category = clauseAudit.classification.category;

  return (
    <div className="d-flex flex-column gap-3">
      <div className="audit-section-title">Mapeamento semiótico da cláusula</div>
      <div className="audit-evidence">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className={`badge-ios badge-${category}`}>{CATEGORY_LABELS[category]}</span>
        </div>
        <div style={{ fontSize: "0.8125rem" }}>
          <span className="audit-label">Significante:</span> badge de categoria + cor associada
          <br />
          <span className="audit-label">Significado:</span> a categoria “{CATEGORY_LABELS[category]}”
          foi atribuída por correspondência heurística de palavras-chave no texto normalizado.
          <br />
          <span className="audit-label">Regra:</span> categoria {category} {"->"} badge visual com cor e
          ícone padronizado conforme mapa semiótico do projeto.
        </div>
      </div>
      <div className="text-ios-secondary" style={{ fontSize: "0.8125rem" }}>
        <i className="bi bi-info-circle me-1"></i>
        Para o mapa semiótico completo com justificativas, use o botão “Mapa semiótico” no
        cabeçalho do Reader.
      </div>
    </div>
  );
}
