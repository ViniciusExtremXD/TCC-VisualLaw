"use client";

import { CATEGORY_LABELS } from "@/lib/types";
import { IMPACT_SEMIOTIC_MAP, SEMIOTIC_MAP } from "@/lib/semiotic-data";

export default function SemioticMap() {
  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h2 className="fw-semibold mb-3" style={{ fontSize: "1.05rem" }}>
          Mapeamento categoria para signo
        </h2>
        <div className="d-flex flex-column gap-2">
          {SEMIOTIC_MAP.map((entry) => (
            <div key={entry.category} className="ios-card p-3">
              <div className="d-flex align-items-start gap-3">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: `${entry.color}20`,
                    color: entry.color,
                  }}
                >
                  <i className="bi bi-circle-fill"></i>
                </div>
                <div className="flex-fill">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className={`badge-ios badge-${entry.category}`}>
                      {CATEGORY_LABELS[entry.category]}
                    </span>
                    <code style={{ fontSize: "0.72rem" }}>{entry.icon_id}</code>
                  </div>
                  <div style={{ fontSize: "0.83rem" }}>
                    <div>
                      <span className="fw-semibold text-ios-accent">Significante:</span> ícone
                      "{entry.icon_label}" + cor {entry.color}
                    </div>
                    <div>
                      <span className="fw-semibold" style={{ color: "#6b21a8" }}>
                        Significado:
                      </span>{" "}
                      {entry.significance}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="fw-semibold mb-3" style={{ fontSize: "1.05rem" }}>
          Mapeamento impacto para interpretação
        </h2>
        <div className="ios-card overflow-hidden">
          <table className="table table-borderless mb-0" style={{ fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--vl-border)" }}>
                <th className="py-2 px-3">Impacto</th>
                <th className="py-2 px-3">Signo</th>
                <th className="py-2 px-3">Interpretação</th>
              </tr>
            </thead>
            <tbody>
              {IMPACT_SEMIOTIC_MAP.map((row) => (
                <tr key={row.impact} style={{ borderBottom: "0.5px solid var(--vl-border)" }}>
                  <td className="py-2 px-3">
                    <span className={`badge-ios badge-impact-${row.impact}`}>{row.label}</span>
                  </td>
                  <td className="py-2 px-3">
                    <i className={`bi ${row.icon}`} style={{ color: row.color }}></i>
                  </td>
                  <td className="py-2 px-3">{row.interpretation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
