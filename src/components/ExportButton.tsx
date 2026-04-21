"use client";

import { buildAcademicExportBundle } from "@/lib/export-data";
import type {
  AuditSession,
  Clause,
  ExplanationsMap,
  HighlightsMap,
  LexiconEntry,
  TraceabilitySession,
} from "@/lib/types";

export default function ExportButton({
  clauses,
  highlights,
  explanations,
  lexicon,
  audit,
  traceability,
}: {
  clauses: Clause[];
  highlights: HighlightsMap;
  explanations: ExplanationsMap;
  lexicon: LexiconEntry[];
  audit?: AuditSession | null;
  traceability?: TraceabilitySession | null;
}) {
  const downloadJSON = (data: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    const bundle = buildAcademicExportBundle({
      clauses,
      highlights,
      explanations,
      lexicon,
      audit: audit ?? null,
      traceability: traceability ?? null,
    });

    downloadJSON(bundle.clauses, "clauses.json");
    window.setTimeout(() => downloadJSON(bundle.highlights, "highlights.json"), 120);
    window.setTimeout(() => downloadJSON(bundle.explanations, "explanations.json"), 240);
    window.setTimeout(() => downloadJSON(bundle.traceability, "traceability.json"), 360);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="btn btn-ios btn-ios-secondary"
      style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
    >
      <i className="bi bi-download me-1"></i>
      Exportar evidências JSON
    </button>
  );
}
