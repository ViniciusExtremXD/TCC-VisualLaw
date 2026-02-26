"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ClauseAudit, AuditSession } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import Icon, { type IconName } from "@/ui/components/Icon";
import Sheet from "@/ui/components/Sheet";
import { useReducedMotionPreference } from "@/ui/hooks/useReducedMotionPreference";
import { uiTokens } from "@/ui/tokens";

interface AuditDrawerProps {
  clauseId: string;
  audit: AuditSession;
  onClose: () => void;
}

const STEP_ICONS: IconName[] = ["scissors", "type", "tag", "search", "eye"];
const TABS = [
  { key: "overview", label: "Visão geral", icon: "list-checks" as IconName },
  { key: "classification", label: "Classificação", icon: "tag" as IconName },
  { key: "lexicon", label: "Léxico", icon: "book-open" as IconName },
  { key: "semiotic", label: "Semiótica", icon: "palette" as IconName },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function AuditDrawer({ clauseId, audit, onClose }: AuditDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const reducedMotion = useReducedMotionPreference();

  const clauseAudit: ClauseAudit | undefined = audit.clauses_audit[clauseId];

  return (
    <Sheet
      open={Boolean(clauseAudit)}
      onClose={onClose}
      title="Auditoria detalhada"
      subtitle={`${clauseId} · ${audit.session_id}`}
      testId="audit-sheet"
      maxWidth={840}
    >
      {!clauseAudit ? (
        <div className="text-center text-ios-secondary">
          Dados de auditoria não disponíveis para esta cláusula.
        </div>
      ) : (
        <>
          <div className="audit-tabbar">
            {TABS.map((tab) => {
              const selected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`audit-tab-btn ${selected ? "audit-tab-active" : ""}`}
                >
                  <Icon name={tab.icon} size={14} />
                  {tab.label}
                  {selected ? (
                    <motion.span
                      layoutId="audit-tab-underline"
                      className="audit-tab-underline"
                      transition={{
                        duration: reducedMotion ? 0 : uiTokens.motion.duration.medium,
                        ease: uiTokens.motion.easing.soft,
                      }}
                    ></motion.span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 10 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
              transition={{
                duration: reducedMotion ? 0.08 : uiTokens.motion.duration.normal,
                ease: uiTokens.motion.easing.swift,
              }}
            >
              {activeTab === "overview" && <OverviewTab audit={audit} clauseAudit={clauseAudit} />}
              {activeTab === "classification" && (
                <ClassificationTab clauseAudit={clauseAudit} />
              )}
              {activeTab === "lexicon" && <LexiconTab clauseAudit={clauseAudit} />}
              {activeTab === "semiotic" && <SemioticTab clauseAudit={clauseAudit} />}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </Sheet>
  );
}

function OverviewTab({ audit, clauseAudit }: { audit: AuditSession; clauseAudit: ClauseAudit }) {
  return (
    <div className="d-flex flex-column gap-3">
      <div className="text-ios-secondary" style={{ fontSize: "0.8125rem" }}>
        Pipeline executado em {audit.pipeline.length} etapas
      </div>

      {audit.pipeline.map((step, index) => (
        <div key={step.step_id} className="d-flex gap-3">
            <div className="d-flex flex-column align-items-center" style={{ width: 28 }}>
              <div className="stepper-dot">
                <Icon name={STEP_ICONS[index] ?? "circle"} size={14} />
              </div>
              {index < audit.pipeline.length - 1 && <div className="stepper-line" />}
            </div>

          <div className="flex-fill pb-2">
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
                <code className="d-block mt-1" style={{ fontSize: "0.75rem", wordBreak: "break-all" }}>
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
                <span className="audit-label">Termos encontrados:</span>{" "}
                {clauseAudit.highlights.length}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function ClassificationTab({ clauseAudit }: { clauseAudit: ClauseAudit }) {
  const sortedScores = useMemo(
    () => Object.entries(clauseAudit.classification.scores).sort(([, a], [, b]) => b - a),
    [clauseAudit.classification.scores]
  );

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <div className="audit-section-title">Categoria atribuída</div>
        <div className="d-flex align-items-center gap-2 mt-1">
          <span className={`badge-ios badge-${clauseAudit.classification.category}`}>
            {CATEGORY_LABELS[clauseAudit.classification.category]}
          </span>
          <span className="text-ios-secondary" style={{ fontSize: "0.75rem" }}>
            via {clauseAudit.classification.method}
          </span>
        </div>
      </div>

      <div>
        <div className="audit-section-title">Scores por categoria</div>
        <div className="cupertino-card-inset mt-1">
          <table className="table table-borderless mb-0" style={{ fontSize: "0.8125rem" }}>
            <tbody>
              {sortedScores.map(([category, score]) => (
                <tr key={category} style={{ borderBottom: "1px solid var(--cu-separator)" }}>
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
                          width: `${sortedScores[0][1] > 0 ? (score / sortedScores[0][1]) * 100 : 0}%`,
                          background:
                            category === clauseAudit.classification.category
                              ? "var(--cu-tint)"
                              : "var(--cu-tertiary-label)",
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
        {clauseAudit.classification.rules_fired.length === 0 ? (
          <div className="text-ios-secondary" style={{ fontSize: "0.8125rem" }}>
            Nenhuma regra disparou.
          </div>
        ) : (
          <div className="d-flex flex-column gap-2 mt-1">
            {clauseAudit.classification.rules_fired.map((rule) => (
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
      <div className="audit-section-title">
        Termos encontrados ({clauseAudit.highlights.length})
      </div>
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
              <span className="audit-label">Variante que bateu:</span>{" "}
              {highlight.lookup.matched_variant}
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
          <span className="audit-label">Significado:</span> a categoria “
          {CATEGORY_LABELS[category]}” foi atribuída por correspondência heurística de
          palavras-chave no texto normalizado.
          <br />
          <span className="audit-label">Regra:</span> categoria {category} {"->"} badge visual com
          cor e ícone padronizado conforme mapa semiótico do projeto.
        </div>
      </div>
      <div className="text-ios-secondary" style={{ fontSize: "0.8125rem" }}>
        <Icon name="info" size={14} className="me-1" />
        Para o mapa semiótico completo com justificativas, use o botão “Mapa semiótico”
        no cabeçalho do Reader.
      </div>
    </div>
  );
}
