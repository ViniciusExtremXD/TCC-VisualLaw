"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Accordion from "@/components/Accordion";
import Badge from "@/components/Badge";
import DocumentManager from "@/components/DocumentManager";
import HighlightedText from "@/components/HighlightedText";
import ProcessMap from "@/components/ProcessMap";
import TermCardModal from "@/components/TermCardModal";
import { strings } from "@/i18n/ptBR";
import { getLexicon, loadMockSession, processText, SAMPLE_TEXT } from "@/lib/processor";
import {
  activateDocument,
  getActiveDocument,
  loadDocRegistry,
  removeDocument,
  saveDocRegistry,
  toggleDocumentStatus,
  upsertDocument,
} from "@/lib/docRegistry";
import { useSession } from "@/store/SessionContext";
import type { DocumentRecord, PipelineResult, TermEvidence } from "@/lib/types";
import Button from "@/ui/components/Button";
import Card from "@/ui/components/Card";
import Icon, { type IconName } from "@/ui/components/Icon";
import NavigationBar from "@/ui/components/NavigationBar";
import Sheet from "@/ui/components/Sheet";
import { useReducedMotionPreference } from "@/ui/hooks/useReducedMotionPreference";
import { uiTokens } from "@/ui/tokens";

const FLOW_CARDS = [
  {
    id: "segmentation",
    icon: "scissors" as IconName,
    title: strings.home.segmentation,
    description: strings.home.segmentationDesc,
    accent: "#0a84ff",
    objective:
      "Separar o texto em cláusulas auditáveis e numeradas para análise controlada.",
    input: "Texto bruto da política ou termo selecionado na sessão.",
    output: "Lista ordenada de cláusulas com clause_id e posição no documento.",
    evidence: "Regra de split aplicada e evidência de segmentação no audit trail.",
    value:
      "Permite rastrear cada decisão do pipeline até um trecho específico do texto original.",
  },
  {
    id: "highlight",
    icon: "search" as IconName,
    title: strings.home.highlight,
    description: strings.home.highlightDesc,
    accent: "#30b0c7",
    objective: "Detectar termos jurídicos do léxico e registrar offsets com proveniência.",
    input: "Cláusula individual já segmentada e normalizada.",
    output: "Highlights com term_id, match, start/end e variante correspondente.",
    evidence: "Campo do léxico usado, variante batida e contexto do match por cláusula.",
    value:
      "Garante auditabilidade técnica da explicação, sem depender de interpretação opaca.",
  },
  {
    id: "visual-law",
    icon: "eye" as IconName,
    title: strings.home.visualLaw,
    description: strings.home.visualLawDesc,
    accent: "#5856d6",
    objective:
      "Apresentar explicação jurídica em linguagem clara com camada semiótica explícita.",
    input: "Termo identificado + categoria + impacto + referências LGPD.",
    output: "Card completo com significado, relevância prática, ação recomendada e FAQ.",
    evidence: "Regra categoria->ícone, impacto->badge e bloco de evidência do termo.",
    value:
      "Une compreensão do usuário e rigor acadêmico no mesmo artefato de leitura.",
  },
] as const;

const QUICK_TRANSLATION_EXAMPLES = [
  {
    id: "consent",
    label: "Consentimento de uso de dados",
    caption: "Aceite e tratamento inicial",
    text:
      "Ao continuar navegando, você declara que leu e concorda com a Política de Privacidade e com a coleta e o uso das suas informações pessoais.",
  },
  {
    id: "sharing",
    label: "Compartilhamento com terceiros",
    caption: "Parceiros, operadores e analytics",
    text:
      "Podemos compartilhar seus dados pessoais com parceiros comerciais, operadores e terceiros para fins de analytics, publicidade e melhoria dos serviços.",
  },
  {
    id: "retention",
    label: "Retenção e armazenamento",
    caption: "Prazo de guarda e descarte",
    text:
      "Seus dados poderão ser mantidos por até cinco anos após o encerramento da conta, salvo prazo legal superior.",
  },
] as const;

function buildQuickSummary(result: PipelineResult) {
  return result.clauses.slice(0, 2);
}

function buildContext(text: string, start: number, end: number): string {
  const contextStart = Math.max(0, start - 40);
  const contextEnd = Math.min(text.length, end + 40);
  const prefix = contextStart > 0 ? "..." : "";
  const suffix = contextEnd < text.length ? "..." : "";
  return `${prefix}${text.slice(contextStart, contextEnd)}${suffix}`;
}

export default function HomePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedFlowCard, setSelectedFlowCard] =
    useState<(typeof FLOW_CARDS)[number] | null>(null);
  const [quickText, setQuickText] = useState("");
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickResult, setQuickResult] = useState<PipelineResult | null>(null);
  const [selectedQuickExampleId, setSelectedQuickExampleId] = useState<string | null>(null);
  const [selectedQuickTermEvidence, setSelectedQuickTermEvidence] = useState<TermEvidence | null>(
    null
  );
  const router = useRouter();
  const { setResults } = useSession();
  const reducedMotion = useReducedMotionPreference();
  const lexicon = useMemo(() => getLexicon(), []);

  useEffect(() => {
    setDocuments(loadDocRegistry());
  }, []);

  const activeDocument = useMemo(() => getActiveDocument(documents), [documents]);

  const persistDocuments = (next: DocumentRecord[]) => {
    setDocuments(next);
    saveDocRegistry(next);
  };

  const handleProcess = () => {
    if (text.trim().length < 20 || !activeDocument) {
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      try {
        const result = processText(text.trim(), activeDocument.doc_id);
        setResults({
          ...result,
          lexicon,
          selectedDocument: activeDocument,
        });
        router.push("/reader");
      } finally {
        setLoading(false);
      }
    }, 80);
  };

  const handleDemo = () => {
    if (!activeDocument) {
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      try {
        const result = loadMockSession(activeDocument.doc_id);
        setResults({
          ...result,
          lexicon,
          selectedDocument: activeDocument,
        });
        router.push("/reader");
      } finally {
        setLoading(false);
      }
    }, 80);
  };

  const handleQuickExampleSelect = (exampleId: string) => {
    const example = QUICK_TRANSLATION_EXAMPLES.find((item) => item.id === exampleId);
    if (!example) {
      return;
    }
    setSelectedQuickExampleId(exampleId);
    setQuickText(example.text);
  };

  const handleQuickTranslate = () => {
    if (quickText.trim().length < 10) {
      return;
    }

    setQuickLoading(true);
    window.setTimeout(() => {
      try {
        setQuickResult(processText(quickText.trim(), activeDocument?.doc_id ?? "QUICK_TRANSLATION"));
      } finally {
        setQuickLoading(false);
      }
    }, 80);
  };

  const handleOpenQuickResult = () => {
    if (!quickResult) {
      return;
    }

    setResults({
      ...quickResult,
      lexicon,
      selectedDocument: activeDocument ?? null,
    });
    router.push("/reader");
  };

  const handleQuickTextChange = (value: string) => {
    setQuickText(value);
    const activeExample = QUICK_TRANSLATION_EXAMPLES.find((item) => item.id === selectedQuickExampleId);
    if (activeExample && activeExample.text !== value) {
      setSelectedQuickExampleId(null);
    }
  };

  const handleQuickTermClick = (clauseId: string, termId: string) => {
    if (!quickResult) {
      return;
    }

    const clause = quickResult.clauses.find((item) => item.clause_id === clauseId);
    const entry = lexicon.find((item) => item.term_id === termId);
    const highlight = (quickResult.highlights[clauseId] ?? []).find((item) => item.term_id === termId);
    const auditHighlight = quickResult.audit.clauses_audit[clauseId]?.highlights.find(
      (item) => item.term_id === termId && item.start === highlight?.start
    );

    if (!clause || !entry || !highlight) {
      return;
    }

    setSelectedQuickTermEvidence({
      term_id: termId,
      clause_id: clauseId,
      match: highlight.match,
      start: highlight.start,
      end: highlight.end,
      context: buildContext(clause.text, highlight.start, highlight.end),
      lexicon_field_used: auditHighlight?.lookup.lexicon_field_used ?? "term",
      matched_variant: auditHighlight?.lookup.matched_variant ?? highlight.match,
      lgpd_refs: entry.lgpd_refs,
      semiotic_rule: `${entry.category} -> ${entry.icon_id}`,
    });
  };

  const quickPreviewClauses = quickResult ? buildQuickSummary(quickResult) : [];
  const quickSelectedEntry = selectedQuickTermEvidence
    ? lexicon.find((item) => item.term_id === selectedQuickTermEvidence.term_id) ?? null
    : null;
  const quickTermCount = quickResult
    ? Object.values(quickResult.highlights).reduce((total, items) => total + items.length, 0)
    : 0;

  return (
    <div className="d-flex flex-column gap-4">
      <NavigationBar
        title={strings.home.heroTitle}
        subtitle={strings.app.title}
        caption={strings.home.heroText}
      />

      <Card className="p-4 d-flex flex-column gap-3" data-testid="home-entry-block" interactive>
        <h2 className="cupertino-title mb-0" style={{ fontSize: "1.1rem" }}>
          {strings.home.entryTitle}
        </h2>

        <DocumentManager
          documents={documents}
          onSave={(document) => persistDocuments(upsertDocument(documents, document))}
          onRemove={(docId) => persistDocuments(removeDocument(documents, docId))}
          onActivate={(docId) => persistDocuments(activateDocument(documents, docId))}
          onToggleStatus={(docId) => persistDocuments(toggleDocumentStatus(documents, docId))}
        />

        <div>
          <label
            htmlFor="text-input"
            className="form-label fw-semibold"
            style={{ fontSize: "0.88rem" }}
          >
            {strings.home.textInputLabel}
          </label>
          <textarea
            id="text-input"
            className="form-control form-control-ios"
            rows={10}
            placeholder={strings.home.textInputPlaceholder}
            value={text}
            onChange={(event) => setText(event.target.value)}
          ></textarea>
          <div className="text-ios-secondary mt-1" style={{ fontSize: "0.8rem" }}>
            {text.length > 0 ? `${text.length} caracteres` : strings.home.minChars}
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row gap-2">
          <Button
            variant="primary"
            className="flex-fill"
            onClick={handleProcess}
            disabled={loading || !activeDocument || text.trim().length < 20}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                {strings.home.processing}
              </>
            ) : (
              <>
                <Icon name="zap" size={16} />
                {strings.home.process}
              </>
            )}
          </Button>

          <Button variant="secondary" onClick={() => setText(SAMPLE_TEXT)} disabled={loading}>
            <Icon name="clipboard-paste" size={16} />
            {strings.home.pasteExample}
          </Button>

          <Button variant="ghost" onClick={handleDemo} disabled={loading || !activeDocument}>
            <Icon name="play-circle" size={16} />
            {strings.home.demo}
          </Button>
        </div>

      </Card>

      <motion.section
        className="row g-3"
        data-testid="home-flow-cards"
        initial={reducedMotion ? undefined : "hidden"}
        animate={reducedMotion ? undefined : "show"}
        variants={
          reducedMotion
            ? undefined
            : {
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.06, delayChildren: 0.08 },
                },
              }
        }
      >
        {FLOW_CARDS.map((card) => (
          <motion.div
            key={card.id}
            className="col-12 col-sm-4"
            variants={
              reducedMotion
                ? undefined
                : {
                    hidden: { opacity: 0, y: 12 },
                    show: { opacity: 1, y: 0 },
                  }
            }
          >
            <motion.button
              type="button"
              className="ios-feature-card h-100 w-100"
              onClick={() => setSelectedFlowCard(card)}
              aria-label={`Detalhes de ${card.title}`}
              whileHover={reducedMotion ? undefined : { y: -3, scale: 1.005 }}
              whileTap={reducedMotion ? undefined : { scale: 0.985 }}
              transition={{
                duration: uiTokens.motion.duration.normal,
                ease: uiTokens.motion.easing.soft,
              }}
            >
              <span className="ios-feature-card-inner">
                <span
                  className="ios-feature-icon"
                  style={{ color: card.accent, background: `${card.accent}1f` }}
                >
                  <Icon name={card.icon} size={20} />
                </span>
                <span className="fw-semibold mb-1" style={{ fontSize: "0.95rem" }}>
                  {card.title}
                </span>
                <span className="text-ios-secondary" style={{ fontSize: "0.82rem" }}>
                  {card.description}
                </span>
                <span className="ios-feature-link">Toque para ver detalhes</span>
              </span>
            </motion.button>
          </motion.div>
        ))}
      </motion.section>

      <div data-testid="home-process-block">
        <ProcessMap />
      </div>

      <Accordion
        title={strings.home.quickTranslateTitle}
        summary={strings.home.quickTranslateSummary}
        testId="quick-translation-accordion"
      >
        <div className="quick-translate-shell">
          <div className="quick-translate-headline">
            <div>
              <div className="audit-section-title mb-2">{strings.home.quickTranslateTitle}</div>
              <div className="text-ios-secondary quick-translate-headline-text">
                {strings.home.quickTranslateHelper}
              </div>
            </div>
          </div>

          <div className="quick-translate-board">
            <section className="quick-translate-column quick-translate-column-input">
              <div className="quick-translate-column-header">
                <div>
                  <div className="quick-translate-column-title">
                    {strings.home.quickTranslateInputTitle}
                  </div>
                  <div className="quick-translate-column-subtitle">
                    {strings.home.quickTranslateLabel}
                  </div>
                </div>
                <div className="quick-translate-column-icon">
                  <Icon name="clipboard-paste" size={18} />
                </div>
              </div>

              <div className="quick-translate-shortcut-block">
                <div className="quick-translate-section-heading">
                  {strings.home.quickTranslateShortcutTitle}
                </div>
                <div className="quick-translate-section-support">
                  {strings.home.quickTranslateShortcutSummary}
                </div>
                <div className="quick-translate-shortcuts" data-testid="quick-translation-shortcuts">
                  {QUICK_TRANSLATION_EXAMPLES.map((example) => (
                    <button
                      key={example.id}
                      type="button"
                      className={`quick-translate-shortcut ${
                        selectedQuickExampleId === example.id ? "quick-translate-shortcut-active" : ""
                      }`}
                      onClick={() => handleQuickExampleSelect(example.id)}
                    >
                      <span className="quick-translate-shortcut-label">{example.label}</span>
                      <span className="quick-translate-shortcut-caption">{example.caption}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="quick-translate-input"
                  className="form-label fw-semibold"
                  style={{ fontSize: "0.84rem" }}
                >
                  {strings.home.quickTranslateLabel}
                </label>
                <textarea
                  id="quick-translate-input"
                  className="form-control form-control-ios quick-translate-textarea"
                  rows={7}
                  placeholder={strings.home.quickTranslatePlaceholder}
                  value={quickText}
                  onChange={(event) => handleQuickTextChange(event.target.value)}
                ></textarea>
              </div>

              <div className="quick-translate-actions">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedQuickExampleId(null);
                    setQuickText(text);
                  }}
                  disabled={!text.trim()}
                >
                  <Icon name="clipboard-paste" size={16} />
                  {strings.home.quickTranslateUseMain}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleQuickTranslate}
                  disabled={quickLoading || quickText.trim().length < 10}
                  data-testid="quick-translate-button"
                >
                  {quickLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      {strings.home.processing}
                    </>
                  ) : (
                    <>
                      <Icon name="languages" size={16} />
                      {strings.home.quickTranslateAction}
                    </>
                  )}
                </Button>
              </div>
            </section>

            <div className="quick-translate-divider" aria-hidden="true">
              <div className="quick-translate-divider-badge">
                <Icon name="languages" size={18} />
              </div>
            </div>

            <section
              className="quick-translate-column quick-translate-column-output"
              data-testid="quick-translation-result-panel"
            >
              <div className="quick-translate-column-header">
                <div>
                  <div className="quick-translate-column-title">
                    {strings.home.quickTranslateOutputTitle}
                  </div>
                  <div className="quick-translate-column-subtitle">
                    {strings.home.quickTranslateResult}
                  </div>
                </div>
                <div className="quick-translate-column-icon">
                  <Icon name="languages" size={18} />
                </div>
              </div>

              {quickLoading ? (
                <div className="quick-translate-empty quick-translate-empty-loading">
                  <div className="quick-translate-empty-icon">
                    <div className="ios-spinner"></div>
                  </div>
                  <div className="quick-translate-empty-title">{strings.home.processing}</div>
                  <div className="quick-translate-empty-copy">
                    Organizando o trecho, identificando termos jurídicos e gerando a transcrição em
                    linguagem simples.
                  </div>
                </div>
              ) : quickResult ? (
                <div className="quick-translate-output">
                  <div className="quick-translate-result-header">
                    <div className="quick-translate-metrics">
                      <span className="quick-translate-metric">
                        <strong>{strings.home.quickTranslateMetricsClauses}:</strong>{" "}
                        {quickResult.clauses.length}
                      </span>
                      <span className="quick-translate-metric">
                        <strong>{strings.home.quickTranslateMetricsTerms}:</strong> {quickTermCount}
                      </span>
                      <span className="quick-translate-metric">
                        <strong>{strings.home.quickTranslateMetricsMode}:</strong>{" "}
                        {strings.home.quickTranslateMetricsModeValue}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleOpenQuickResult}>
                      <Icon name="chevron-right" size={16} />
                      {strings.home.quickTranslateOpenReader}
                    </Button>
                  </div>

                  {quickPreviewClauses.map((clause, index) => {
                    const clauseHighlights = quickResult.highlights[clause.clause_id] ?? [];

                    return (
                      <div
                        key={clause.clause_id}
                        className="quick-translate-card"
                        data-testid="quick-translation-result"
                      >
                        <div className="d-flex align-items-start justify-content-between gap-2 flex-wrap">
                          <div>
                            <div className="quick-translate-card-title">
                              {clause.title || `Cláusula ${index + 1}`}
                            </div>
                            <div className="quick-translate-card-subtitle">{clause.clause_id}</div>
                          </div>
                          <div className="d-flex gap-2">
                            <Badge type="category" value={clause.category} />
                            <Badge type="impact" value={clause.impact} />
                          </div>
                        </div>

                        <div className="quick-translate-card-grid">
                          <div className="quick-translate-pane">
                            <div className="quick-translate-label">
                              {strings.home.quickTranslateSourceLabel}
                            </div>
                            <HighlightedText
                              text={clause.text}
                              highlights={clauseHighlights}
                              onTermClick={(termId) => handleQuickTermClick(clause.clause_id, termId)}
                              className="mb-0 quick-translate-source-text"
                            />
                          </div>

                          <div className="quick-translate-pane quick-translate-pane-output">
                            <div className="quick-translate-label">
                              {strings.home.quickTranslatePlainLabel}
                            </div>
                            <div className="quick-translate-plain-text">
                              {clause.plain_language_summary}
                            </div>
                          </div>
                        </div>

                        <div className="quick-translate-meta-grid">
                          <div className="quick-translate-info-block">
                            <div className="quick-translate-label">
                              {strings.home.quickTranslateTermsTitle}
                            </div>
                            {clauseHighlights.length > 0 ? (
                              <div className="quick-translate-chip-row">
                                {clauseHighlights.map((highlight) => (
                                  <button
                                    key={`${highlight.term_id}-${highlight.start}`}
                                    type="button"
                                    className="quick-term-chip"
                                    onClick={() => handleQuickTermClick(clause.clause_id, highlight.term_id)}
                                    title={`Abrir explicação de ${highlight.match}`}
                                  >
                                    {highlight.match}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="quick-translate-support-text">
                                {strings.home.quickTranslateNoTerms}
                              </div>
                            )}
                          </div>

                          <div className="quick-translate-info-block">
                            <div className="quick-translate-label">
                              {strings.home.quickTranslateRightsLabel}
                            </div>
                            {clause.lgpd_refs.length > 0 ? (
                              <div className="quick-translate-chip-row">
                                {clause.lgpd_refs.map((ref) => (
                                  <span key={`${clause.clause_id}-${ref}`} className="quick-right-chip">
                                    {ref}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <div className="quick-translate-support-text">
                                {strings.home.quickTranslateNoLgpd}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {quickResult.clauses.length > quickPreviewClauses.length ? (
                    <div className="quick-translate-note">{strings.home.quickTranslateMoreClauses}</div>
                  ) : null}
                </div>
              ) : (
                <div className="quick-translate-empty">
                  <div className="quick-translate-empty-icon">
                    <Icon name="languages" size={22} />
                  </div>
                  <div className="quick-translate-empty-title">
                    {strings.home.quickTranslateEmptyTitle}
                  </div>
                  <div className="quick-translate-empty-copy">{strings.home.quickTranslateEmpty}</div>
                </div>
              )}
            </section>
          </div>
        </div>
      </Accordion>

      <Sheet
        open={Boolean(selectedFlowCard)}
        onClose={() => setSelectedFlowCard(null)}
        title={selectedFlowCard?.title}
        subtitle={selectedFlowCard?.description}
        testId="flow-detail-sheet"
        maxWidth={620}
      >
        {selectedFlowCard ? (
          <div
            className="cupertino-card-inset p-3 d-flex flex-column gap-2"
            style={{ fontSize: "0.88rem" }}
          >
            <div>
              <span className="fw-semibold">Objetivo:</span> {selectedFlowCard.objective}
            </div>
            <div>
              <span className="fw-semibold">Entrada:</span> {selectedFlowCard.input}
            </div>
            <div>
              <span className="fw-semibold">Saída:</span> {selectedFlowCard.output}
            </div>
            <div>
              <span className="fw-semibold">Evidência gerada:</span> {selectedFlowCard.evidence}
            </div>
            <div>
              <span className="fw-semibold">Valor acadêmico:</span> {selectedFlowCard.value}
            </div>
          </div>
        ) : null}
      </Sheet>

      {quickSelectedEntry && selectedQuickTermEvidence ? (
        <TermCardModal
          entry={quickSelectedEntry}
          evidence={selectedQuickTermEvidence}
          onClose={() => setSelectedQuickTermEvidence(null)}
        />
      ) : null}
    </div>
  );
}
