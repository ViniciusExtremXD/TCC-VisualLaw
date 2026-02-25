"use client";

import type { LexiconEntry, TermEvidence } from "@/lib/types";
import TermCard from "@/components/TermCard";

interface TermCardModalProps {
  entry: LexiconEntry;
  evidence?: TermEvidence | null;
  onClose: () => void;
}

export default function TermCardModal({ entry, evidence, onClose }: TermCardModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="ios-modal p-3"
        style={{ maxWidth: 860, width: "calc(100% - 1.5rem)", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Termo ${entry.term}`}
      >
        <div className="d-flex justify-content-end mb-2">
          <button
            type="button"
            className="btn btn-sm p-0 text-ios-secondary border-0"
            onClick={onClose}
            aria-label="Fechar card do termo"
            style={{ fontSize: "1.25rem" }}
          >
            <i className="bi bi-x-circle-fill"></i>
          </button>
        </div>

        <TermCard entry={entry} evidence={evidence} mode="modal" />
      </div>
    </div>
  );
}
