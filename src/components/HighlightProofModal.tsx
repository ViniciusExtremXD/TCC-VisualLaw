"use client";

import Link from "next/link";
import type { TermMatch, HighlightAudit } from "@/lib/types";

interface HighlightProofModalProps {
  termId: string;
  clauseText: string;
  highlight: TermMatch;
  auditHighlight?: HighlightAudit;
  onClose: () => void;
}

export default function HighlightProofModal({
  termId,
  clauseText,
  highlight,
  auditHighlight,
  onClose,
}: HighlightProofModalProps) {
  // Contexto: ~40 chars antes e depois do match
  const contextStart = Math.max(0, highlight.start - 40);
  const contextEnd = Math.min(clauseText.length, highlight.end + 40);
  const before = clauseText.slice(contextStart, highlight.start);
  const matched = clauseText.slice(highlight.start, highlight.end);
  const after = clauseText.slice(highlight.end, contextEnd);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="ios-modal p-4" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold mb-0" style={{ fontSize: "1.0625rem" }}>
            <i className="bi bi-search me-2 text-ios-accent"></i>
            Prova do Highlight
          </h3>
          <button onClick={onClose} className="btn btn-sm p-0 text-ios-secondary border-0" style={{ fontSize: "1.25rem" }}>
            <i className="bi bi-x-circle-fill"></i>
          </button>
        </div>

        {/* Term ID */}
        <div className="audit-evidence mb-3">
          <div className="d-flex justify-content-between">
            <span className="audit-label">term_id</span>
            <code style={{ fontSize: "0.8125rem" }}>{termId}</code>
          </div>
          <div className="d-flex justify-content-between mt-1">
            <span className="audit-label">match</span>
            <span className="fw-semibold" style={{ fontSize: "0.8125rem" }}>&ldquo;{highlight.match}&rdquo;</span>
          </div>
          <div className="d-flex justify-content-between mt-1">
            <span className="audit-label">start / end</span>
            <code style={{ fontSize: "0.8125rem" }}>[{highlight.start}, {highlight.end}]</code>
          </div>
        </div>

        {/* Contexto */}
        <div className="mb-3">
          <div className="audit-label mb-1">Contexto no texto</div>
          <div className="p-3" style={{
            background: "rgba(0,0,0,0.03)",
            borderRadius: "var(--vl-radius-sm)",
            fontSize: "0.875rem",
            lineHeight: 1.6,
          }}>
            {contextStart > 0 && <span className="text-ios-secondary">…</span>}
            <span>{before}</span>
            <mark className="term-highlight fw-semibold">{matched}</mark>
            <span>{after}</span>
            {contextEnd < clauseText.length && <span className="text-ios-secondary">…</span>}
          </div>
        </div>

        {/* Provenance (audit) */}
        {auditHighlight && (
          <div className="audit-evidence mb-3">
            <div className="audit-label mb-1">Provenance (Léxico)</div>
            <div className="d-flex justify-content-between mt-1">
              <span className="audit-label">Campo usado</span>
              <code style={{ fontSize: "0.8125rem" }}>{auditHighlight.lookup.lexicon_field_used}</code>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <span className="audit-label">Variante que bateu</span>
              <span style={{ fontSize: "0.8125rem" }}>{auditHighlight.lookup.matched_variant}</span>
            </div>
          </div>
        )}

        {/* Link */}
        <div className="d-flex gap-2">
          <Link
            href={`/term/${termId}`}
            className="btn btn-ios btn-ios-primary flex-fill text-center"
            style={{ fontSize: "0.875rem" }}
          >
            Ver card completo
            <i className="bi bi-arrow-right ms-1"></i>
          </Link>
          <button onClick={onClose} className="btn btn-ios btn-ios-tertiary" style={{ fontSize: "0.875rem" }}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
