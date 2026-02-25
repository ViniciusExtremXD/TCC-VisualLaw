"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Badge from "@/components/Badge";
import ProgressBar from "@/components/ProgressBar";
import HighlightedText from "@/components/HighlightedText";
import AuditDrawer from "@/components/AuditDrawer";
import SemioticMap from "@/components/SemioticMap";
import ProcessingTracePanel from "@/components/ProcessingTracePanel";
import TermCardModal from "@/components/TermCardModal";
import { strings } from "@/i18n/ptBR";
import { CATEGORY_LABELS, type TermEvidence } from "@/lib/types";
import { useSession } from "@/store/SessionContext";
import { loadDocRegistry } from "@/lib/docRegistry";
import { buildReportPdf } from "@/lib/pdf/reportPdf";

function buildContext(text: string, start: number, end: number): string {
  const contextStart = Math.max(0, start - 40);
  const contextEnd = Math.min(text.length, end + 40);
  const prefix = contextStart > 0 ? "..." : "";
  const suffix = contextEnd < text.length ? "..." : "";
  return `${prefix}${text.slice(contextStart, contextEnd)}${suffix}`;
}

export default function ReaderPage() {
  const router = useRouter();
  const {
    clauses,
    highlights,
    lexicon,
    audit,
    selectedDocument,
    currentIndex,
    isProcessed,
    setCurrentIndex,
    reset,
  } = useSession();

  const [auditDrawerClauseId, setAuditDrawerClauseId] = useState<string | null>(null);
  const [showSemioticMap, setShowSemioticMap] = useState(false);
  const [selectedTermEvidence, setSelectedTermEvidence] = useState<TermEvidence | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  if (!isProcessed || clauses.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
        <i className="bi bi-inbox text-ios-secondary mb-3" style={{ fontSize: "3.5rem" }}></i>
        <h2 className="fw-semibold mb-2" style={{ fontSize: "1.25rem" }}>
          {strings.reader.noSessionTitle}
        </h2>
        <p className="text-ios-secondary mb-4" style={{ maxWidth: 420, fontSize: "0.93rem" }}>
          {strings.reader.noSessionText}
        </p>
        <Link href="/" className="btn btn-ios btn-ios-primary">
          {strings.reader.backHome}
        </Link>
      </div>
    );
  }

  const clause = clauses[currentIndex];
  const clauseHighlights = highlights[clause.clause_id] ?? [];
  const clauseAudit = audit?.clauses_audit[clause.clause_id];

  const goNext = () => {
    if (currentIndex < clauses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNewDocument = () => {
    reset();
    router.push("/");
  };

  const handleTermClick = (termId: string) => {
    const lexiconEntry = lexicon.find((entry) => entry.term_id === termId);
    const highlight = clauseHighlights.find((item) => item.term_id === termId);

    if (!lexiconEntry || !highlight) {
      return;
    }

    const auditHighlight = clauseAudit?.highlights.find(
      (item) => item.term_id === termId && item.start === highlight.start
    );

    setSelectedTermEvidence({
      term_id: termId,
      clause_id: clause.clause_id,
      match: highlight.match,
      start: highlight.start,
      end: highlight.end,
      context: buildContext(clause.text, highlight.start, highlight.end),
      lexicon_field_used: auditHighlight?.lookup.lexicon_field_used ?? "term",
      matched_variant: auditHighlight?.lookup.matched_variant ?? highlight.match,
      lgpd_refs: lexiconEntry.lgpd_refs,
      semiotic_rule: `${CATEGORY_LABELS[lexiconEntry.category]} -> ${lexiconEntry.icon_id}`,
    });
  };

  const handleGeneratePdf = async () => {
    setGeneratingPdf(true);
    try {
      const blob = await buildReportPdf({
        generatedAt: new Date().toLocaleString("pt-BR"),
        version: "0.2.0",
        selectedDocument,
        docRegistry: loadDocRegistry(),
        clauses,
        highlights,
        lexicon,
        audit,
      });

      const filenameDate = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `visual-law-relatorio-${filenameDate}.pdf`;
      const pdfBytes = new Uint8Array(await blob.arrayBuffer());
      const pdfMeta = {
        filename,
        type: blob.type,
        size: blob.size,
        signature: String.fromCharCode(...pdfBytes.slice(0, 5)),
      };
      sessionStorage.setItem("last_pdf_meta", JSON.stringify(pdfMeta));

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.setTimeout(() => URL.revokeObjectURL(url), 2_000);
      router.push("/report");
    } finally {
      setGeneratingPdf(false);
    }
  };

  const selectedEntry = selectedTermEvidence
    ? lexicon.find((item) => item.term_id === selectedTermEvidence.term_id) ?? null
    : null;

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <h1 className="fw-bold mb-0" style={{ fontSize: "1.35rem" }}>
          <i className="bi bi-journal-check me-2 text-ios-accent"></i>
          {strings.reader.title}
        </h1>
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-ios btn-ios-primary"
            style={{ fontSize: "0.86rem", padding: "0.5rem 0.95rem" }}
            onClick={handleGeneratePdf}
            disabled={generatingPdf}
            data-testid="generate-pdf-button"
          >
            <i className="bi bi-filetype-pdf me-1"></i>
            {generatingPdf ? strings.reader.generatingPdf : strings.reader.generatePdf}
          </button>
          <Link href="/report" className="btn btn-ios btn-ios-secondary" style={{ fontSize: "0.86rem", padding: "0.5rem 0.95rem" }}>
            <i className="bi bi-journal-text me-1"></i>
            {strings.reader.reportPreview}
          </Link>
          <button
            type="button"
            className="btn btn-ios btn-ios-tertiary"
            style={{ fontSize: "0.86rem", padding: "0.5rem 0.95rem" }}
            onClick={() => setShowSemioticMap(true)}
          >
            <i className="bi bi-palette me-1"></i>
            {strings.reader.mapButton}
          </button>
          <button
            type="button"
            className="btn btn-ios btn-ios-tertiary"
            style={{ fontSize: "0.86rem", padding: "0.5rem 0.95rem" }}
            onClick={handleNewDocument}
          >
            <i className="bi bi-plus-circle me-1"></i>
            {strings.reader.newDoc}
          </button>
        </div>
      </div>

      <div
        className="d-flex align-items-center gap-2 px-3 py-2"
        style={{ background: "rgba(99,102,241,0.09)", borderRadius: "var(--vl-radius-sm)", fontSize: "0.81rem" }}
      >
        <i className="bi bi-mortarboard-fill" style={{ color: "#4338ca" }}></i>
        <span className="fw-semibold" style={{ color: "#4338ca" }}>
          {strings.reader.permanentMode}
        </span>
        <span className="text-ios-secondary">{strings.reader.permanentModeText}</span>
      </div>

      <ProgressBar current={currentIndex + 1} total={clauses.length} />

      <article className="ios-card">
        <header className="p-3 px-4" style={{ borderBottom: "0.5px solid var(--vl-border)", background: "rgba(0,0,0,0.015)" }}>
          <div className="d-flex align-items-start justify-content-between flex-wrap gap-2">
            <div>
              <h2 className="fw-semibold mb-0" style={{ fontSize: "1.05rem" }}>
                {clause.title || `Cláusula ${currentIndex + 1}`}
              </h2>
              <span className="text-ios-secondary" style={{ fontSize: "0.76rem" }}>{clause.clause_id}</span>
            </div>
            <div className="d-flex gap-2">
              <Badge type="category" value={clause.category} />
              <Badge type="impact" value={clause.impact} />
            </div>
          </div>
        </header>

        <div className="p-4">
          <HighlightedText text={clause.text} highlights={clauseHighlights} onTermClick={handleTermClick} />

          {clause.lgpd_refs.length > 0 && (
            <div className="mt-3 pt-3" style={{ borderTop: "0.5px solid var(--vl-border)", fontSize: "0.82rem" }}>
              <i className="bi bi-bookmark me-1"></i>
              {strings.reader.referencesLgpd}: {clause.lgpd_refs.join(", ")}
            </div>
          )}
        </div>

        <div className="px-4 pb-3">
          <div className="d-flex align-items-center gap-2 text-ios-secondary" style={{ fontSize: "0.81rem" }}>
            <i className="bi bi-lightbulb"></i>
            {strings.reader.termHint}
          </div>
        </div>

        {audit && (
          <div className="px-4 pb-3">
            <button
              type="button"
              className="btn btn-sm w-100"
              style={{
                fontSize: "0.82rem",
                padding: "0.5rem",
                background: "rgba(99,102,241,0.09)",
                color: "#4338ca",
                borderRadius: "var(--vl-radius-sm)",
                border: "1px dashed rgba(99,102,241,0.35)",
              }}
              onClick={() => setAuditDrawerClauseId(clause.clause_id)}
            >
              <i className="bi bi-clipboard-data me-1"></i>
              {strings.reader.openAudit}
            </button>
          </div>
        )}
      </article>

      <ProcessingTracePanel clause={clause} audit={clauseAudit} highlights={clauseHighlights} />

      <div className="d-flex align-items-center justify-content-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="btn btn-ios btn-ios-tertiary"
          style={{ fontSize: "0.86rem", padding: "0.62rem 1.2rem" }}
        >
          <i className="bi bi-chevron-left me-1"></i>
          {strings.reader.prev}
        </button>

        <span className="text-ios-secondary fw-semibold" style={{ fontSize: "0.86rem" }}>
          {currentIndex + 1} / {clauses.length}
        </span>

        <button
          type="button"
          onClick={goNext}
          disabled={currentIndex === clauses.length - 1}
          className="btn btn-ios btn-ios-primary"
          style={{ fontSize: "0.86rem", padding: "0.62rem 1.2rem" }}
        >
          {strings.reader.next}
          <i className="bi bi-chevron-right ms-1"></i>
        </button>
      </div>

      {selectedEntry && selectedTermEvidence && (
        <TermCardModal
          entry={selectedEntry}
          evidence={selectedTermEvidence}
          onClose={() => setSelectedTermEvidence(null)}
        />
      )}

      {auditDrawerClauseId && audit && (
        <AuditDrawer
          clauseId={auditDrawerClauseId}
          audit={audit}
          onClose={() => setAuditDrawerClauseId(null)}
        />
      )}

      {showSemioticMap && (
        <div className="modal-overlay" onClick={() => setShowSemioticMap(false)}>
          <div
            className="ios-modal p-4"
            style={{ maxWidth: 700, maxHeight: "90vh", overflowY: "auto" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="fw-bold mb-0" style={{ fontSize: "1.1rem" }}>
                Mapa semiótico
              </h3>
              <button
                type="button"
                className="btn btn-sm p-0 text-ios-secondary border-0"
                style={{ fontSize: "1.25rem" }}
                onClick={() => setShowSemioticMap(false)}
              >
                <i className="bi bi-x-circle-fill"></i>
              </button>
            </div>
            <SemioticMap />
          </div>
        </div>
      )}
    </div>
  );
}
