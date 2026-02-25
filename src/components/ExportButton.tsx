"use client";

import type { AuditSession } from "@/lib/types";

/**
 * Botão que exporta os 4 JSONs da sessão como download.
 */
export default function ExportButton({
  clauses,
  highlights,
  explanations,
  audit,
}: {
  clauses: unknown;
  highlights: unknown;
  explanations: unknown;
  audit?: AuditSession | null;
}) {

  const downloadJSON = (data: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    downloadJSON(clauses, "clauses.json");
    setTimeout(() => downloadJSON(highlights, "highlights.json"), 200);
    setTimeout(() => downloadJSON(explanations, "explanations.json"), 400);
    if (audit) {
      setTimeout(() => downloadJSON(audit, "audit.json"), 600);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="btn btn-ios btn-ios-secondary"
      style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
    >
      <i className="bi bi-download me-1"></i>
      Exportar{audit ? " (4)" : ""}
    </button>
  );
}
