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
import Accordion from "@/components/Accordion";
import { strings } from "@/i18n/ptBR";
import { CATEGORY_LABELS, type TermEvidence } from "@/lib/types";
import { useSession } from "@/store/SessionContext";
import Button from "@/ui/components/Button";
import Card from "@/ui/components/Card";
import NavigationBar from "@/ui/components/NavigationBar";
import Sheet from "@/ui/components/Sheet";

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
        <Link href="/" className="cupertino-btn cupertino-btn-primary cupertino-btn-md">
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

  const handleGeneratePdf = () => {
    setGeneratingPdf(true);
    sessionStorage.setItem("vlaw_pdf_autodownload", "1");
    router.push("/report?autodownload=1");
    window.setTimeout(() => setGeneratingPdf(false), 1500);
  };

  const selectedEntry = selectedTermEvidence
    ? lexicon.find((item) => item.term_id === selectedTermEvidence.term_id) ?? null
    : null;

  return (
    <div className="d-flex flex-column gap-3">
      <NavigationBar
        title={strings.reader.title}
        subtitle={selectedDocument ? `${selectedDocument.name} • ${selectedDocument.doc_id}` : strings.app.title}
        caption={strings.reader.termHint}
        actions={
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={handleGeneratePdf}
              disabled={generatingPdf}
              data-testid="generate-pdf-button"
            >
              <i className="bi bi-filetype-pdf"></i>
              {generatingPdf ? strings.reader.generatingPdf : strings.reader.generatePdf}
            </Button>

            <Link
              href="/report"
              className="cupertino-btn cupertino-btn-secondary cupertino-btn-sm"
            >
              <i className="bi bi-journal-text"></i>
              {strings.reader.reportPreview}
            </Link>

            <Button variant="ghost" size="sm" onClick={() => setShowSemioticMap(true)}>
              <i className="bi bi-palette"></i>
              {strings.reader.mapButton}
            </Button>

            <Button variant="ghost" size="sm" onClick={handleNewDocument}>
              <i className="bi bi-plus-circle"></i>
              {strings.reader.newDoc}
            </Button>
          </>
        }
      />

      <ProgressBar current={currentIndex + 1} total={clauses.length} />

      <Card as="article">
        <header className="p-3 px-4" style={{ borderBottom: "1px solid var(--cu-separator)", background: "rgba(255,255,255,0.65)" }}>
          <div className="d-flex align-items-start justify-content-between flex-wrap gap-2">
            <div>
              <h2 className="fw-semibold mb-0" style={{ fontSize: "1.02rem" }}>
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
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--cu-separator)", fontSize: "0.82rem" }}>
              <i className="bi bi-bookmark me-1"></i>
              {strings.reader.referencesLgpd}: {clause.lgpd_refs.join(", ")}
            </div>
          )}
        </div>

        {audit ? (
          <div className="px-4 pb-3">
            <Button
              variant="secondary"
              size="sm"
              className="w-100"
              onClick={() => setAuditDrawerClauseId(clause.clause_id)}
            >
              <i className="bi bi-clipboard-data"></i>
              {strings.reader.openAudit}
            </Button>
          </div>
        ) : null}
      </Card>

      <Accordion
        title="Rastreamento do processamento"
        summary="Normalização, classificação, léxico e semiótica da cláusula atual."
        defaultOpen={false}
        testId="processing-trace-accordion"
      >
        <ProcessingTracePanel clause={clause} audit={clauseAudit} highlights={clauseHighlights} />
      </Accordion>

      <div className="d-flex align-items-center justify-content-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={goPrev}
          disabled={currentIndex === 0}
        >
          <i className="bi bi-chevron-left"></i>
          {strings.reader.prev}
        </Button>

        <span className="text-ios-secondary fw-semibold" style={{ fontSize: "0.84rem" }}>
          {currentIndex + 1} / {clauses.length}
        </span>

        <Button
          variant="primary"
          size="sm"
          onClick={goNext}
          disabled={currentIndex === clauses.length - 1}
        >
          {strings.reader.next}
          <i className="bi bi-chevron-right"></i>
        </Button>
      </div>

      {selectedEntry && selectedTermEvidence ? (
        <TermCardModal
          entry={selectedEntry}
          evidence={selectedTermEvidence}
          onClose={() => setSelectedTermEvidence(null)}
        />
      ) : null}

      {auditDrawerClauseId && audit ? (
        <AuditDrawer
          clauseId={auditDrawerClauseId}
          audit={audit}
          onClose={() => setAuditDrawerClauseId(null)}
        />
      ) : null}

      <Sheet
        open={showSemioticMap}
        onClose={() => setShowSemioticMap(false)}
        title="Mapa semiótico"
        subtitle="Relação entre categoria, impacto e interpretação visual"
        maxWidth={760}
      >
        <SemioticMap />
      </Sheet>
    </div>
  );
}
