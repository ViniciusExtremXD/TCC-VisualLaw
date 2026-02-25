"use client";

import Link from "next/link";
import { CATEGORY_LABELS, type LexiconEntry, type TermEvidence } from "@/lib/types";
import { SEMIOTIC_MAP } from "@/lib/semiotic-data";
import { resolveTermFaqs } from "@/lib/faq";

interface TermCardProps {
  entry: LexiconEntry;
  evidence?: TermEvidence | null;
  mode?: "page" | "modal" | "report";
}

const IMPACT_LABELS = {
  high: "Alto",
  medium: "Médio",
  low: "Baixo",
} as const;

export default function TermCard({ entry, evidence, mode = "page" }: TermCardProps) {
  const semio = SEMIOTIC_MAP.find((row) => row.category === entry.category);
  const faqItems = resolveTermFaqs(entry);
  const showReaderLinks = mode === "page";

  return (
    <div className="d-flex flex-column gap-3">
      {showReaderLinks && (
        <Link href="/reader" className="text-ios-accent text-decoration-none fw-semibold" style={{ fontSize: "0.9rem" }}>
          <i className="bi bi-chevron-left me-1"></i>
          Voltar para leitura guiada
        </Link>
      )}

      <article className="ios-card">
        <header className="p-4" style={{ background: "linear-gradient(135deg, rgba(0,122,255,0.06), rgba(99,102,241,0.08))" }}>
          <div className="d-flex flex-column gap-2">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h2 className="fw-bold mb-0" style={{ fontSize: "1.3rem" }}>{entry.term}</h2>
              <code>{entry.term_id}</code>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <span className={`badge-ios badge-${entry.category}`}>{CATEGORY_LABELS[entry.category]}</span>
              <span className={`badge-ios badge-impact-${entry.impact}`}>{IMPACT_LABELS[entry.impact]}</span>
            </div>
          </div>
        </header>

        <section className="p-4" style={{ borderTop: "0.5px solid var(--vl-border)" }}>
          <h3 className="fw-semibold text-ios-accent mb-1" style={{ fontSize: "0.9rem" }}>
            O que significa
          </h3>
          <p className="mb-0" style={{ fontSize: "0.92rem", lineHeight: 1.6 }}>{entry.meaning}</p>
        </section>

        <section className="p-4" style={{ borderTop: "0.5px solid var(--vl-border)", background: "rgba(255,149,0,0.05)" }}>
          <h3 className="fw-semibold mb-1" style={{ fontSize: "0.9rem", color: "#9a6700" }}>
            Por que importa
          </h3>
          <p className="mb-0" style={{ fontSize: "0.92rem", lineHeight: 1.6 }}>{entry.why_it_matters}</p>
        </section>

        <section className="p-4" style={{ borderTop: "0.5px solid var(--vl-border)", background: "rgba(16,185,129,0.06)" }}>
          <h3 className="fw-semibold mb-1" style={{ fontSize: "0.9rem", color: "#0f766e" }}>
            O que você pode fazer
          </h3>
          <p className="mb-0" style={{ fontSize: "0.92rem", lineHeight: 1.6 }}>{entry.what_you_can_do}</p>
        </section>

        <section className="p-4" style={{ borderTop: "0.5px solid var(--vl-border)", background: "rgba(99,102,241,0.05)" }}>
          <h3 className="fw-semibold mb-2" style={{ fontSize: "0.9rem", color: "#4338ca" }}>
            Camada semiótica
          </h3>
          <div style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
            <div>
              <span className="fw-semibold">Significante:</span> ícone <code>{semio?.icon_id ?? entry.icon_id}</code> + badge de categoria/impacto.
            </div>
            <div>
              <span className="fw-semibold">Significado:</span> {semio?.significance ?? "Mapeamento semiótico padrão."}
            </div>
            <div>
              <span className="fw-semibold">Regra:</span> categoria {CATEGORY_LABELS[entry.category]} mapeia para
              signo {semio?.icon_label ?? entry.icon_id}.
            </div>
          </div>
        </section>

        <section className="p-4" style={{ borderTop: "0.5px solid var(--vl-border)" }}>
          <h3 className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
            Evidência / auditoria do termo
          </h3>
          {evidence ? (
            <div className="ios-card-inset p-3" style={{ fontSize: "0.84rem" }}>
              <div>term_id: <code>{evidence.term_id}</code></div>
              <div>clause_id: <code>{evidence.clause_id}</code></div>
              <div>match: "{evidence.match}"</div>
              <div>start/end: [{evidence.start}, {evidence.end}]</div>
              <div>contexto: {evidence.context}</div>
              <div>campo léxico usado: {evidence.lexicon_field_used}</div>
              <div>variante batida: {evidence.matched_variant}</div>
              <div>Referências LGPD: {evidence.lgpd_refs.length > 0 ? evidence.lgpd_refs.join(", ") : "-"}</div>
              <div>regra semiótica: {evidence.semiotic_rule}</div>
            </div>
          ) : (
            <div className="ios-card-inset p-3 text-ios-secondary" style={{ fontSize: "0.84rem" }}>
              Evidência pontual indisponível nesta visualização. Abra o termo a partir do Reader para ver offsets e provenance.
            </div>
          )}
        </section>

        <section className="p-4" style={{ borderTop: "0.5px solid var(--vl-border)" }}>
          <h3 className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
            Principais dúvidas (FAQ)
          </h3>
          {mode === "report" ? (
            <ol className="mb-0" style={{ fontSize: "0.84rem" }}>
              {faqItems.map((item) => (
                <li key={`${entry.term_id}-${item.q}`} className="mb-2">
                  <strong>{item.q}</strong>
                  <div>{item.a}</div>
                  <small className="text-ios-secondary">fonte: {item.source}</small>
                </li>
              ))}
            </ol>
          ) : (
            <div className="d-flex flex-column gap-2">
              {faqItems.map((item, index) => (
                <details key={`${entry.term_id}-${item.q}`} className="ios-card-inset p-2">
                  <summary className="fw-semibold" style={{ cursor: "pointer", fontSize: "0.84rem" }}>
                    {index + 1}. {item.q}
                  </summary>
                  <div className="mt-2" style={{ fontSize: "0.83rem" }}>
                    {item.a}
                    <div className="text-ios-secondary">fonte: {item.source}</div>
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>

        <section className="p-4" style={{ borderTop: "0.5px solid var(--vl-border)" }}>
          <h3 className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
            Mini-tabela acadêmica
          </h3>
          <div className="ios-card-inset overflow-hidden">
            <table className="table table-borderless mb-0" style={{ fontSize: "0.85rem" }}>
              <tbody>
                <tr style={{ borderBottom: "0.5px solid var(--vl-border)" }}>
                  <td className="px-3 py-2 fw-semibold" style={{ width: "35%" }}>Categoria</td>
                  <td className="px-3 py-2">{CATEGORY_LABELS[entry.category]}</td>
                </tr>
                <tr style={{ borderBottom: "0.5px solid var(--vl-border)" }}>
                  <td className="px-3 py-2 fw-semibold">Impacto</td>
                  <td className="px-3 py-2">{IMPACT_LABELS[entry.impact]}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 fw-semibold">Referências LGPD</td>
                  <td className="px-3 py-2">{entry.lgpd_refs.length > 0 ? entry.lgpd_refs.join(", ") : "-"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>

      {showReaderLinks && (
        <div className="text-center">
          <Link href="/reader" className="btn btn-ios btn-ios-primary">
            Voltar para leitura guiada
          </Link>
        </div>
      )}
    </div>
  );
}
