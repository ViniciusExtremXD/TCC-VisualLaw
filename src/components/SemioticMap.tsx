"use client";

import type { SemioticEntry } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { SEMIOTIC_MAP } from "@/lib/semiotic-data";

const semioticMap = SEMIOTIC_MAP;

const IMPACT_ROWS = [
  { level: "high", label: "Alto", badge: "bi-exclamation-triangle-fill", color: "#cc0000", interpretation: "Risco significativo à privacidade. Requer atenção imediata do titular." },
  { level: "medium", label: "Médio", badge: "bi-dash-circle-fill", color: "#997a00", interpretation: "Impacto moderado. Merece revisão cuidadosa dos termos." },
  { level: "low", label: "Baixo", badge: "bi-check-circle-fill", color: "#1a7a32", interpretation: "Impacto reduzido. Práticas geralmente aceitas." },
];

export default function SemioticMap() {
  return (
    <div className="d-flex flex-column gap-4">
      {/* Categorias */}
      <div>
        <h2 className="fw-semibold mb-3" style={{ fontSize: "1.0625rem" }}>
          <i className="bi bi-palette me-2 text-ios-accent"></i>
          Mapeamento: Categoria → Signo Visual
        </h2>
        <div className="d-flex flex-column gap-2">
          {semioticMap.map((entry) => (
            <div key={entry.category} className="ios-card p-3">
              <div className="d-flex align-items-start gap-3">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 40, height: 40,
                    borderRadius: 10,
                    background: `${entry.color}15`,
                    color: entry.color,
                    fontSize: "1.125rem",
                  }}
                >
                  <i className="bi bi-circle-fill"></i>
                </div>
                <div className="flex-fill">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className={`badge-ios badge-${entry.category}`}>
                      {CATEGORY_LABELS[entry.category]}
                    </span>
                    <code className="text-ios-secondary" style={{ fontSize: "0.6875rem" }}>
                      {entry.icon_id}
                    </code>
                  </div>
                  <div style={{ fontSize: "0.8125rem" }}>
                    <div className="mb-1">
                      <span className="fw-semibold text-ios-accent">Significante:</span>{" "}
                      Ícone &ldquo;{entry.icon_label}&rdquo; + cor {entry.color}
                    </div>
                    <div>
                      <span className="fw-semibold" style={{ color: "#cc7700" }}>Significado:</span>{" "}
                      {entry.significance}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impacto */}
      <div>
        <h2 className="fw-semibold mb-3" style={{ fontSize: "1.0625rem" }}>
          <i className="bi bi-speedometer2 me-2 text-ios-accent"></i>
          Mapeamento: Impacto → Signo Visual
        </h2>
        <div className="ios-card overflow-hidden">
          <table className="table table-borderless mb-0" style={{ fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--vl-border)", background: "rgba(0,0,0,0.02)" }}>
                <th className="py-2 px-3 fw-semibold text-ios-secondary" style={{ fontSize: "0.75rem" }}>Nível</th>
                <th className="py-2 px-3 fw-semibold text-ios-secondary" style={{ fontSize: "0.75rem" }}>Signo</th>
                <th className="py-2 px-3 fw-semibold text-ios-secondary" style={{ fontSize: "0.75rem" }}>Interpretação</th>
              </tr>
            </thead>
            <tbody>
              {IMPACT_ROWS.map((row) => (
                <tr key={row.level} style={{ borderBottom: "0.5px solid var(--vl-border)" }}>
                  <td className="py-2 px-3">
                    <span className={`badge-ios badge-impact-${row.level}`}>
                      <i className={`bi ${row.badge}`}></i>
                      {row.label}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <i className={`bi ${row.badge}`} style={{ color: row.color }}></i>
                    <span className="ms-1" style={{ fontSize: "0.8125rem" }}>{row.badge}</span>
                  </td>
                  <td className="py-2 px-3" style={{ fontSize: "0.8125rem" }}>
                    {row.interpretation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
