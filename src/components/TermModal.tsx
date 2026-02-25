"use client";

import Link from "next/link";
import type { Explanation } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import Badge from "./Badge";

interface TermModalProps {
  termId: string;
  termLabel: string;
  explanation: Explanation;
  onClose: () => void;
}

export default function TermModal({
  termId,
  termLabel,
  explanation,
  onClose,
}: TermModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="ios-modal p-4" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <div className="d-flex justify-content-end mb-2">
          <button
            onClick={onClose}
            className="btn btn-sm p-0 text-ios-secondary border-0"
            aria-label="Fechar"
            style={{ fontSize: "1.25rem", lineHeight: 1 }}
          >
            <i className="bi bi-x-circle-fill"></i>
          </button>
        </div>

        {/* Header */}
        <div className="mb-3">
          <h3 className="fw-bold mb-2" style={{ fontSize: "1.25rem" }}>
            {termLabel}
          </h3>
          <div className="d-flex gap-2 flex-wrap">
            <Badge type="category" value={explanation.category} />
            <Badge type="impact" value={explanation.impact} />
          </div>
        </div>

        {/* Meaning */}
        <div className="p-3 mb-3" style={{ background: "rgba(0,122,255,0.06)", borderRadius: "var(--vl-radius-sm)" }}>
          <div className="fw-semibold text-ios-accent mb-1" style={{ fontSize: "0.8125rem" }}>
            <i className="bi bi-book me-1"></i> O que significa
          </div>
          <p className="mb-0" style={{ fontSize: "0.9375rem", color: "#3a3a3c" }}>
            {explanation.meaning}
          </p>
        </div>

        {/* Why it matters */}
        <div className="p-3 mb-3" style={{ background: "rgba(255,149,0,0.06)", borderRadius: "var(--vl-radius-sm)" }}>
          <div className="fw-semibold mb-1" style={{ fontSize: "0.8125rem", color: "#cc7700" }}>
            <i className="bi bi-exclamation-circle me-1"></i> Por que importa
          </div>
          <p className="mb-0" style={{ fontSize: "0.9375rem", color: "#3a3a3c" }}>
            {explanation.why_it_matters}
          </p>
        </div>

        {/* LGPD */}
        {explanation.lgpd_refs.length > 0 && (
          <div className="text-ios-secondary mb-3" style={{ fontSize: "0.8125rem" }}>
            <i className="bi bi-bookmark me-1"></i>
            LGPD: {explanation.lgpd_refs.join(", ")}
          </div>
        )}

        {/* Actions */}
        <div className="d-flex gap-2">
          <Link
            href={`/term/${termId}`}
            className="btn btn-ios btn-ios-primary flex-fill text-center"
            style={{ fontSize: "0.875rem" }}
          >
            Ver card completo
            <i className="bi bi-arrow-right ms-1"></i>
          </Link>
          <button
            onClick={onClose}
            className="btn btn-ios btn-ios-tertiary"
            style={{ fontSize: "0.875rem" }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
