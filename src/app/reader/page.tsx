"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/store/SessionContext";
import Badge from "@/components/Badge";
import ProgressBar from "@/components/ProgressBar";
import HighlightedText from "@/components/HighlightedText";
import TermModal from "@/components/TermModal";
import ExportButton from "@/components/ExportButton";
import AcademicToggle from "@/components/AcademicToggle";
import AuditDrawer from "@/components/AuditDrawer";
import HighlightProofModal from "@/components/HighlightProofModal";
import SemioticMap from "@/components/SemioticMap";

export default function ReaderPage() {
  const router = useRouter();
  const {
    clauses,
    highlights,
    explanations,
    audit,
    currentIndex,
    isProcessed,
    academicMode,
    setCurrentIndex,
    reset,
  } = useSession();

  const [modalTermId, setModalTermId] = useState<string | null>(null);
  const [auditDrawerClauseId, setAuditDrawerClauseId] = useState<string | null>(null);
  const [proofTermId, setProofTermId] = useState<string | null>(null);
  const [showSemioticMap, setShowSemioticMap] = useState(false);

  // Sem sessão → manda de volta pro Home
  if (!isProcessed || clauses.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
        <i className="bi bi-inbox text-ios-secondary mb-3" style={{ fontSize: "3.5rem" }}></i>
        <h2 className="fw-semibold mb-2" style={{ fontSize: "1.25rem" }}>
          Nenhum documento processado
        </h2>
        <p className="text-ios-secondary mb-4" style={{ maxWidth: 400, fontSize: "0.9375rem" }}>
          Volte à página inicial para colar um texto ou carregar o exemplo demonstrativo.
        </p>
        <Link href="/" className="btn btn-ios btn-ios-primary">
          <i className="bi bi-arrow-left me-1"></i>
          Voltar ao início
        </Link>
      </div>
    );
  }

  const clause = clauses[currentIndex];
  const clauseHighlights = highlights[clause.clause_id] ?? [];

  const goNext = () => {
    if (currentIndex < clauses.length - 1) setCurrentIndex(currentIndex + 1);
  };
  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleTermClick = (termId: string) => {
    if (academicMode) {
      setProofTermId(termId);
    } else {
      setModalTermId(termId);
    }
  };

  const handleNewDocument = () => {
    reset();
    router.push("/");
  };

  const selectedExplanation = modalTermId ? explanations[modalTermId] : null;
  const selectedTermLabel = modalTermId
    ? clauseHighlights.find((h) => h.term_id === modalTermId)?.match ?? modalTermId
    : "";

  // Para prova de highlight
  const proofHighlight = proofTermId
    ? clauseHighlights.find((h) => h.term_id === proofTermId)
    : null;
  const proofAudit = proofTermId && audit
    ? audit.clauses_audit[clause.clause_id]?.highlights.find((h) => h.term_id === proofTermId)
    : undefined;

  return (
    <div className="d-flex flex-column gap-3">
      {/* ── Header ─────────────────────────────────── */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <h1 className="fw-bold mb-0" style={{ fontSize: "1.375rem" }}>
          <i className="bi bi-book me-2 text-ios-accent"></i>
          Leitura Guiada
        </h1>
        <div className="d-flex gap-2 flex-wrap">
          <AcademicToggle />
          <ExportButton
            clauses={clauses}
            highlights={highlights}
            explanations={explanations}
            audit={audit}
          />
          <button onClick={handleNewDocument} className="btn btn-ios btn-ios-tertiary" style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}>
            <i className="bi bi-plus-circle me-1"></i>
            Novo
          </button>
        </div>
      </div>

      {/* ── Academic mode bar ──────────────────────── */}
      {academicMode && (
        <div className="d-flex align-items-center gap-2 px-3 py-2" style={{
          background: "rgba(175,82,222,0.08)",
          borderRadius: "var(--vl-radius-sm)",
          fontSize: "0.8125rem",
        }}>
          <i className="bi bi-mortarboard-fill" style={{ color: "#8944ab" }}></i>
          <span style={{ color: "#8944ab" }} className="fw-semibold">Modo Acadêmico ativo</span>
          <span className="text-ios-secondary">— Auditoria e semiótica visíveis</span>
          <button
            onClick={() => setShowSemioticMap(true)}
            className="btn btn-sm ms-auto"
            style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", background: "rgba(175,82,222,0.12)", color: "#8944ab", borderRadius: 8, border: "none" }}
          >
            <i className="bi bi-palette me-1"></i>
            Mapa Semiótico
          </button>
        </div>
      )}

      {/* ── Progress ───────────────────────────────── */}
      <ProgressBar current={currentIndex + 1} total={clauses.length} />

      {/* ── Clause Card ────────────────────────────── */}
      <div className="ios-card">
        {/* Card header */}
        <div className="p-3 px-4" style={{ borderBottom: "0.5px solid var(--vl-border)", background: "rgba(0,0,0,0.015)" }}>
          <div className="d-flex align-items-start justify-content-between flex-wrap gap-2">
            <div>
              <h2 className="fw-semibold mb-0" style={{ fontSize: "1.0625rem" }}>
                {clause.title || `Cláusula ${currentIndex + 1}`}
              </h2>
              <span className="text-ios-secondary" style={{ fontSize: "0.75rem" }}>
                {clause.clause_id}
              </span>
            </div>
            <div className="d-flex gap-2">
              <Badge type="category" value={clause.category} />
              <Badge type="impact" value={clause.impact} />
            </div>
          </div>
        </div>

        {/* Clause text with highlights */}
        <div className="p-4">
          <HighlightedText
            text={clause.text}
            highlights={clauseHighlights}
            onTermClick={handleTermClick}
          />

          {/* LGPD refs */}
          {clause.lgpd_refs && clause.lgpd_refs.length > 0 && (
            <div className="mt-3 pt-3" style={{ borderTop: "0.5px solid var(--vl-border)" }}>
              <span className="text-ios-secondary" style={{ fontSize: "0.8125rem" }}>
                <i className="bi bi-bookmark me-1"></i>
                LGPD: {clause.lgpd_refs.join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Hint */}
        {clauseHighlights.length > 0 && (
          <div className="px-4 pb-3">
            <div className="d-flex align-items-center gap-2 text-ios-secondary" style={{ fontSize: "0.8125rem" }}>
              <i className="bi bi-lightbulb"></i>
              Clique nos termos <mark className="term-highlight" style={{ fontSize: "0.8125rem" }}>destacados</mark> para ver {academicMode ? "a prova do highlight." : "a explicação."}
            </div>
          </div>
        )}

        {/* Audit button (academic mode only) */}
        {academicMode && audit && (
          <div className="px-4 pb-3">
            <button
              onClick={() => setAuditDrawerClauseId(clause.clause_id)}
              className="btn btn-sm w-100"
              style={{
                fontSize: "0.8125rem",
                padding: "0.5rem",
                background: "rgba(175,82,222,0.08)",
                color: "#8944ab",
                borderRadius: "var(--vl-radius-sm)",
                border: "1px dashed rgba(175,82,222,0.3)",
              }}
            >
              <i className="bi bi-clipboard-data me-1"></i>
              Ver auditoria desta cláusula
            </button>
          </div>
        )}
      </div>

      {/* ── Nav Controls ───────────────────────────── */}
      <div className="d-flex align-items-center justify-content-between">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="btn btn-ios btn-ios-tertiary"
          style={{ fontSize: "0.875rem", padding: "0.625rem 1.25rem" }}
        >
          <i className="bi bi-chevron-left me-1"></i>
          Anterior
        </button>

        <span className="text-ios-secondary fw-semibold" style={{ fontSize: "0.875rem" }}>
          {currentIndex + 1} / {clauses.length}
        </span>

        <button
          onClick={goNext}
          disabled={currentIndex === clauses.length - 1}
          className="btn btn-ios btn-ios-primary"
          style={{ fontSize: "0.875rem", padding: "0.625rem 1.25rem" }}
        >
          Próxima
          <i className="bi bi-chevron-right ms-1"></i>
        </button>
      </div>

      {/* ── Term Modal (product mode) ──────────────── */}
      {modalTermId && selectedExplanation && !academicMode && (
        <TermModal
          termId={modalTermId}
          termLabel={selectedTermLabel}
          explanation={selectedExplanation}
          onClose={() => setModalTermId(null)}
        />
      )}

      {/* ── Highlight Proof Modal (academic mode) ──── */}
      {proofTermId && proofHighlight && academicMode && (
        <HighlightProofModal
          termId={proofTermId}
          clauseText={clause.text}
          highlight={proofHighlight}
          auditHighlight={proofAudit}
          onClose={() => setProofTermId(null)}
        />
      )}

      {/* ── Audit Drawer ───────────────────────────── */}
      {auditDrawerClauseId && audit && academicMode && (
        <AuditDrawer
          clauseId={auditDrawerClauseId}
          audit={audit}
          onClose={() => setAuditDrawerClauseId(null)}
        />
      )}

      {/* ── Semiotic Map Modal ─────────────────────── */}
      {showSemioticMap && (
        <div className="modal-overlay" onClick={() => setShowSemioticMap(false)}>
          <div
            className="ios-modal p-4"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 640, maxHeight: "85vh", overflowY: "auto" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="fw-bold mb-0" style={{ fontSize: "1.125rem" }}>
                <i className="bi bi-palette2 me-2 text-ios-accent"></i>
                Mapa Semiótico
              </h3>
              <button onClick={() => setShowSemioticMap(false)} className="btn btn-sm p-0 text-ios-secondary border-0" style={{ fontSize: "1.25rem" }}>
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
