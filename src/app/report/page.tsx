"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import Accordion from "@/components/Accordion";
import TermCard from "@/components/TermCard";
import { strings } from "@/i18n/ptBR";
import { useSession } from "@/store/SessionContext";
import { CATEGORY_LABELS, type TermEvidence } from "@/lib/types";
import { IMPACT_SEMIOTIC_MAP, SEMIOTIC_MAP } from "@/lib/semiotic-data";
import {
  DOCUMENT_SEMIOTIC_MAP,
  getDocumentSemanticProfile,
} from "@/data/visual/document-semiotic-map";

function renderHighlightedText(text: string, highlights: Array<{ start: number; end: number }>) {
  if (!highlights || highlights.length === 0) {
    return <span>{text}</span>;
  }

  const sorted = [...highlights].sort((a, b) => a.start - b.start);
  const segments: ReactNode[] = [];
  let cursor = 0;

  for (const item of sorted) {
    if (item.start < cursor || item.end > text.length) {
      continue;
    }

    if (item.start > cursor) {
      segments.push(<span key={`txt-${cursor}`}>{text.slice(cursor, item.start)}</span>);
    }

    segments.push(
      <mark key={`h-${item.start}`} className="term-highlight" style={{ cursor: "default" }}>
        {text.slice(item.start, item.end)}
      </mark>
    );

    cursor = item.end;
  }

  if (cursor < text.length) {
    segments.push(<span key={`txt-${cursor}`}>{text.slice(cursor)}</span>);
  }

  return <span>{segments}</span>;
}

function buildContext(text: string, start: number, end: number): string {
  const left = Math.max(0, start - 40);
  const right = Math.min(text.length, end + 40);
  const prefix = left > 0 ? "..." : "";
  const suffix = right < text.length ? "..." : "";
  return `${prefix}${text.slice(left, right)}${suffix}`;
}

export default function ReportPage() {
  const { clauses, highlights, lexicon, audit, selectedDocument, isProcessed } = useSession();

  const generatedAt = useMemo(() => new Date().toLocaleString("pt-BR"), []);

  const termEvidenceMap = useMemo(() => {
    const map = new Map<string, TermEvidence>();

    for (const clause of clauses) {
      const clauseHighlights = highlights[clause.clause_id] ?? [];
      const clauseAudit = audit?.clauses_audit[clause.clause_id];

      for (const hit of clauseHighlights) {
        if (map.has(hit.term_id)) {
          continue;
        }

        const lexiconEntry = lexicon.find((item) => item.term_id === hit.term_id);
        if (!lexiconEntry) {
          continue;
        }

        const auditHighlight = clauseAudit?.highlights.find(
          (row) => row.term_id === hit.term_id && row.start === hit.start
        );

        map.set(hit.term_id, {
          term_id: hit.term_id,
          clause_id: clause.clause_id,
          match: hit.match,
          start: hit.start,
          end: hit.end,
          context: buildContext(clause.text, hit.start, hit.end),
          lexicon_field_used: auditHighlight?.lookup.lexicon_field_used ?? "term",
          matched_variant: auditHighlight?.lookup.matched_variant ?? hit.match,
          lgpd_refs: lexiconEntry.lgpd_refs,
          semiotic_rule: `${CATEGORY_LABELS[lexiconEntry.category]} -> ${lexiconEntry.icon_id}`,
        });
      }
    }

    return map;
  }, [audit, clauses, highlights, lexicon]);

  if (!isProcessed || clauses.length === 0) {
    return (
      <div className="ios-card p-4 text-center">
        <h1 className="fw-bold" style={{ fontSize: "1.2rem" }}>
          {strings.report.unavailableTitle}
        </h1>
        <p className="text-ios-secondary">{strings.report.unavailableText}</p>
        <Link href="/" className="btn btn-ios btn-ios-primary">
          {strings.reader.backHome}
        </Link>
      </div>
    );
  }

  const semioForDoc = selectedDocument ? getDocumentSemanticProfile(selectedDocument) : null;
  const getImpactLabel = (impact: "high" | "medium" | "low") =>
    impact === "high" ? "Alto" : impact === "medium" ? "Médio" : "Baixo";

  return (
    <div className="report-page d-flex flex-column gap-4" data-testid="report-page">
      <div className="d-flex gap-2 justify-content-between align-items-center flex-wrap print-hidden">
        <h1 className="fw-bold mb-0" style={{ fontSize: "1.3rem" }}>
          {strings.report.pageTitle}
        </h1>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-ios btn-ios-primary"
            onClick={() => window.print()}
            data-testid="print-report-button"
          >
            <i className="bi bi-printer me-1"></i>
            {strings.report.printButton}
          </button>
          <Link href="/reader" className="btn btn-ios btn-ios-tertiary">
            {strings.report.backToReader}
          </Link>
        </div>
      </div>

      <section className="ios-card p-4 report-section">
        <h2 className="fw-bold mb-2" style={{ fontSize: "1.2rem" }}>
          {strings.report.coverTitle}
        </h2>
        <div className="mb-3 text-ios-secondary" style={{ fontSize: "0.86rem" }}>
          {strings.report.reportNotice}
        </div>
        <div style={{ fontSize: "0.9rem" }}>
          <div>
            <strong>{strings.report.generatedAt}:</strong> {generatedAt}
          </div>
          <div>
            <strong>{strings.report.version}:</strong> 0.2.0
          </div>
          <div>
            <strong>{strings.report.selectedDocument}:</strong>{" "}
            {selectedDocument
              ? `${selectedDocument.name} (${selectedDocument.doc_id})`
              : strings.report.noData}
          </div>
          {selectedDocument && (
            <div>
              <strong>{strings.report.metadata}:</strong> tipo {selectedDocument.type}, plataforma{" "}
              {selectedDocument.platform}, idioma {selectedDocument.language}
            </div>
          )}
        </div>
      </section>

      <section className="report-section">
        <Accordion title={strings.report.summary} defaultOpen>
          <ol className="mb-0" style={{ fontSize: "0.9rem" }}>
            {clauses.map((clause) => (
              <li key={clause.clause_id}>
                <strong>{clause.clause_id}</strong> - {clause.title || "Cláusula"}
              </li>
            ))}
          </ol>
        </Accordion>
      </section>

      <section className="report-section">
        <Accordion title={strings.report.clauseAnalysis} defaultOpen>
          <div className="d-flex flex-column gap-3">
            {clauses.map((clause, index) => {
              const clauseHighlights = highlights[clause.clause_id] ?? [];
              const clauseAudit = audit?.clauses_audit[clause.clause_id];

              return (
                <article key={clause.clause_id} className="ios-card p-3 report-block">
                  <h3 className="fw-bold" style={{ fontSize: "1rem" }}>
                    {clause.clause_id} - {clause.title || `Cláusula ${index + 1}`}
                  </h3>

                  <div className="ios-card-inset p-2 mb-2" style={{ fontSize: "0.82rem" }}>
                    <div>
                      <strong>{strings.common.category}:</strong> {CATEGORY_LABELS[clause.category]}
                    </div>
                    <div>
                      <strong>{strings.common.impact}:</strong> {getImpactLabel(clause.impact)}
                    </div>
                    <div>
                      <strong>{strings.common.lgpdRefs}:</strong>{" "}
                      {clause.lgpd_refs.length > 0 ? clause.lgpd_refs.join(", ") : "-"}
                    </div>
                    <div>
                      <strong>Termos detectados:</strong>{" "}
                      {clauseHighlights.length > 0
                        ? clauseHighlights.map((item) => item.match).join(", ")
                        : "nenhum"}
                    </div>
                  </div>

                  <div className="mb-2" style={{ fontSize: "0.88rem" }}>
                    <strong>{strings.report.clauseText}:</strong>
                    <p className="mb-0 mt-1" style={{ whiteSpace: "pre-wrap" }}>
                      {clause.text}
                    </p>
                  </div>

                  <div className="mb-2" style={{ fontSize: "0.84rem", lineHeight: 1.6 }}>
                    <strong>{strings.report.highlightedExcerpt}:</strong>
                    <div>{renderHighlightedText(clause.text, clauseHighlights)}</div>
                  </div>

                  <div style={{ fontSize: "0.82rem" }}>
                    <strong>{strings.report.classificationEvidence}:</strong>
                    <div>regra de segmentação: {clauseAudit?.segment.rule ?? "n/a"}</div>
                    <div>evidência de segmentação: {clauseAudit?.segment.evidence ?? "n/a"}</div>
                    <div>
                      rules_fired: {clauseAudit?.classification.rules_fired.map((rule) => rule.rule_id).join(", ") || "nenhuma"}
                    </div>
                    <div>
                      scores: {clauseAudit ? JSON.stringify(clauseAudit.classification.scores) : "n/a"}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Accordion>
      </section>

      <section className="report-section">
        <Accordion title={strings.report.termsSection} defaultOpen>
          <div className="d-flex flex-column gap-3">
            {[...termEvidenceMap.keys()].map((termId) => {
              const entry = lexicon.find((item) => item.term_id === termId);
              const evidence = termEvidenceMap.get(termId) ?? null;

              if (!entry) {
                return null;
              }

              return (
                <article key={termId} className="report-block">
                  <TermCard entry={entry} evidence={evidence} mode="report" />
                </article>
              );
            })}
          </div>
        </Accordion>
      </section>

      <section className="report-section">
        <Accordion title={strings.report.appendix} defaultOpen>
          <div className="ios-card-inset p-3 mb-3" style={{ fontSize: "0.84rem" }}>
            <h3 className="fw-semibold" style={{ fontSize: "0.95rem" }}>
              Categoria {"->"} Ícone {"->"} Justificativa
            </h3>
            <ul className="mb-0">
              {SEMIOTIC_MAP.map((item) => (
                <li key={item.category}>
                  <strong>{CATEGORY_LABELS[item.category]}</strong> | ícone {item.icon_id} |{" "}
                  {item.significance}
                </li>
              ))}
            </ul>
          </div>

          <div className="ios-card-inset p-3 mb-3" style={{ fontSize: "0.84rem" }}>
            <h3 className="fw-semibold" style={{ fontSize: "0.95rem" }}>
              Impacto {"->"} Interpretação
            </h3>
            <ul className="mb-0">
              {IMPACT_SEMIOTIC_MAP.map((item) => (
                <li key={item.impact}>
                  <strong>{item.label}</strong> ({item.icon}) - {item.interpretation}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="fw-semibold" style={{ fontSize: "0.95rem" }}>
              {strings.report.documentMapping}
            </h3>
            {semioForDoc ? (
              <div className="ios-card-inset p-2" style={{ fontSize: "0.83rem" }}>
                <div>
                  <strong>Tipo:</strong> {semioForDoc.profile.label}
                </div>
                <div>
                  <strong>Ícone principal:</strong> {semioForDoc.profile.primary_icon}
                </div>
                <div>
                  <strong>Categorias-alvo:</strong>{" "}
                  {semioForDoc.categories.map((category) => CATEGORY_LABELS[category]).join(", ")}
                </div>
                <div>
                  <strong>Regra:</strong> {semioForDoc.profile.rule_summary}
                </div>
                <div>
                  <strong>Justificativa:</strong> {semioForDoc.profile.icon_justification}
                </div>
                {semioForDoc.platformNote && (
                  <div>
                    <strong>Ajuste por plataforma:</strong> {semioForDoc.platformNote}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-ios-secondary">Documento sem mapeamento selecionado.</div>
            )}

            <details className="mt-2">
              <summary className="fw-semibold" style={{ cursor: "pointer", fontSize: "0.83rem" }}>
                {strings.report.viewRawMap}
              </summary>
              <pre
                className="mt-2 p-2"
                style={{ background: "#f3f4f6", fontSize: "0.72rem", whiteSpace: "pre-wrap" }}
              >
                {JSON.stringify(DOCUMENT_SEMIOTIC_MAP.doc_type_semantics, null, 2)}
              </pre>
            </details>
          </div>
        </Accordion>
      </section>
    </div>
  );
}
