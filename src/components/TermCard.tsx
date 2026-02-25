"use client";

import Link from "next/link";
import type { LexiconEntry } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import type { Category, Impact, SemioticEntry } from "@/lib/types";
import { SEMIOTIC_MAP } from "@/lib/semiotic-data";

const semioticMap = SEMIOTIC_MAP;

const IMPACT_LABELS: Record<Impact, string> = {
  high: "Alto",
  medium: "Médio",
  low: "Baixo",
};

const IMPACT_ICONS: Record<Impact, string> = {
  high: "bi-exclamation-triangle-fill",
  medium: "bi-dash-circle-fill",
  low: "bi-check-circle-fill",
};

interface TermCardProps {
  entry: LexiconEntry;
}

export default function TermCard({ entry }: TermCardProps) {
  const semioticEntry = semioticMap.find((s) => s.category === entry.category);

  return (
    <div className="d-flex flex-column gap-3">
      {/* Back link */}
      <Link href="/reader" className="text-ios-accent text-decoration-none fw-semibold" style={{ fontSize: "0.9375rem" }}>
        <i className="bi bi-chevron-left me-1"></i>
        Voltar para leitura
      </Link>

      {/* Main card */}
      <div className="ios-card">
        {/* Header gradient */}
        <div className="p-4" style={{ background: "linear-gradient(135deg, rgba(0,122,255,0.06), rgba(175,82,222,0.06))" }}>
          <div className="d-flex align-items-start gap-3">
            <div
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{
                width: 56, height: 56,
                borderRadius: 16,
                background: "#fff",
                boxShadow: "var(--vl-shadow)",
                fontSize: "1.5rem"
              }}
            >
              <i className="bi bi-shield-check text-ios-accent"></i>
            </div>
            <div>
              <h1 className="fw-bold mb-1" style={{ fontSize: "1.5rem", letterSpacing: "-0.02em" }}>
                {entry.term}
              </h1>
              <div className="text-ios-secondary mb-2" style={{ fontSize: "0.8125rem" }}>
                {entry.term_id} · Ícone: {entry.icon_id}
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <span className={`badge-ios badge-${entry.category}`}>
                  {CATEGORY_LABELS[entry.category as Category] ?? entry.category}
                </span>
                <span className={`badge-ios badge-impact-${entry.impact}`}>
                  <i className={`bi ${IMPACT_ICONS[entry.impact as Impact]}`}></i>
                  Impacto: {IMPACT_LABELS[entry.impact as Impact] ?? entry.impact}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* O que significa */}
        <div className="p-4" style={{ borderBottom: "0.5px solid var(--vl-border)" }}>
          <h2 className="fw-semibold text-ios-accent text-uppercase mb-2" style={{ fontSize: "0.8125rem", letterSpacing: "0.04em" }}>
            <i className="bi bi-book me-1"></i> O que significa
          </h2>
          <p className="mb-0" style={{ fontSize: "0.9375rem", lineHeight: 1.6, color: "#3a3a3c" }}>
            {entry.meaning}
          </p>
        </div>

        {/* Por que importa */}
        <div className="p-4" style={{ borderBottom: "0.5px solid var(--vl-border)", background: "rgba(255,149,0,0.04)" }}>
          <h2 className="fw-semibold text-uppercase mb-2" style={{ fontSize: "0.8125rem", letterSpacing: "0.04em", color: "#cc7700" }}>
            <i className="bi bi-exclamation-circle me-1"></i> Por que importa
          </h2>
          <p className="mb-0" style={{ fontSize: "0.9375rem", lineHeight: 1.6, color: "#3a3a3c" }}>
            {entry.why_it_matters}
          </p>
        </div>

        {/* O que você pode fazer */}
        <div className="p-4" style={{ borderBottom: "0.5px solid var(--vl-border)", background: "rgba(52,199,89,0.04)" }}>
          <h2 className="fw-semibold text-uppercase mb-2" style={{ fontSize: "0.8125rem", letterSpacing: "0.04em", color: "#248a3d" }}>
            <i className="bi bi-hand-thumbs-up me-1"></i> O que você pode fazer
          </h2>
          <p className="mb-0" style={{ fontSize: "0.9375rem", lineHeight: 1.6, color: "#3a3a3c" }}>
            {entry.what_you_can_do}
          </p>
        </div>

        {/* Camada Semiótica */}
        {semioticEntry && (
          <div className="p-4" style={{ borderBottom: "0.5px solid var(--vl-border)", background: "rgba(175,82,222,0.04)" }}>
            <h2 className="fw-semibold text-uppercase mb-2" style={{ fontSize: "0.8125rem", letterSpacing: "0.04em", color: "#8944ab" }}>
              <i className="bi bi-palette me-1"></i> Camada Semiótica
            </h2>
            <div className="d-flex flex-column gap-2" style={{ fontSize: "0.9375rem", lineHeight: 1.6, color: "#3a3a3c" }}>
              <div>
                <span className="fw-semibold" style={{ color: "#8944ab" }}>Significante: </span>
                <span className={`badge-ios badge-${entry.category} me-1`}>
                  {CATEGORY_LABELS[entry.category as Category]}
                </span>
                <span className={`badge-ios badge-impact-${entry.impact}`}>
                  <i className={`bi ${IMPACT_ICONS[entry.impact as Impact]}`}></i>
                  {IMPACT_LABELS[entry.impact as Impact]}
                </span>
                <span className="ms-2">
                  Ícone &ldquo;{semioticEntry.icon_label}&rdquo; + cor {semioticEntry.color}
                </span>
              </div>
              <div>
                <span className="fw-semibold" style={{ color: "#8944ab" }}>Significado: </span>
                {semioticEntry.significance}
              </div>
              <div>
                <span className="fw-semibold" style={{ color: "#8944ab" }}>Regra: </span>
                Categoria &ldquo;{CATEGORY_LABELS[entry.category as Category]}&rdquo; →
                sempre ícone &ldquo;{semioticEntry.icon_id}&rdquo;,
                cor {semioticEntry.color}
              </div>
            </div>
          </div>
        )}

        {/* Summary table */}
        <div className="p-4">
          <h2 className="fw-semibold text-ios-secondary text-uppercase mb-3" style={{ fontSize: "0.8125rem", letterSpacing: "0.04em" }}>
            Resumo
          </h2>
          <div className="ios-card-inset overflow-hidden">
            <table className="table table-borderless mb-0" style={{ fontSize: "0.9375rem" }}>
              <tbody>
                <tr style={{ borderBottom: "0.5px solid var(--vl-border)" }}>
                  <td className="fw-medium text-ios-secondary py-2 px-3" style={{ width: "40%" }}>Categoria</td>
                  <td className="py-2 px-3">{CATEGORY_LABELS[entry.category as Category] ?? entry.category}</td>
                </tr>
                <tr style={{ borderBottom: "0.5px solid var(--vl-border)" }}>
                  <td className="fw-medium text-ios-secondary py-2 px-3">Impacto</td>
                  <td className="py-2 px-3">{IMPACT_LABELS[entry.impact as Impact] ?? entry.impact}</td>
                </tr>
                <tr style={{ borderBottom: "0.5px solid var(--vl-border)" }}>
                  <td className="fw-medium text-ios-secondary py-2 px-3">Direitos LGPD</td>
                  <td className="py-2 px-3">{entry.lgpd_refs.length > 0 ? entry.lgpd_refs.join(", ") : "—"}</td>
                </tr>
                {entry.aliases.length > 0 && (
                  <tr>
                    <td className="fw-medium text-ios-secondary py-2 px-3">Termos similares</td>
                    <td className="py-2 px-3">{entry.aliases.join(", ")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="text-center pb-3">
        <Link href="/reader" className="btn btn-ios btn-ios-primary">
          <i className="bi bi-arrow-left me-1"></i>
          Voltar para leitura guiada
        </Link>
      </div>
    </div>
  );
}
