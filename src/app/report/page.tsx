"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { ReactNode } from "react";
import TermCard from "@/components/TermCard";
import { useSession } from "@/store/SessionContext";
import { CATEGORY_LABELS, type TermEvidence } from "@/lib/types";
import { IMPACT_SEMIOTIC_MAP, SEMIOTIC_MAP } from "@/lib/semiotic-data";
import {
  DOCUMENT_SEMIOTIC_MAP,
  getDocumentSemanticProfile,
} from "@/data/visual/document-semiotic-map";

function renderHighlightedText(text: string, highlights: Array<{ start: number; end: number }>) {
  if (!highlights || highlights.length === 0) {
    return <span>{text}</span>;
  }

  const sorted = [...highlights].sort((a, b) => a.start - b.start);
  const segments: ReactNode[] = [];
  let cursor = 0;

  for (const item of sorted) {
    if (item.start < cursor || item.end > text.length) {
      continue;
    }

    if (item.start > cursor) {
      segments.push(<span key={`txt-${cursor}`}>{text.slice(cursor, item.start)}</span>);
    }

    segments.push(
      <mark key={`h-${item.start}`} className="term-highlight" style={{ cursor: "default" }}>
        {text.slice(item.start, item.end)}
      </mark>
    );

    cursor = item.end;
  }

  if (cursor < text.length) {
    segments.push(<span key={`txt-${cursor}`}>{text.slice(cursor)}</span>);
  }

  return <span>{segments}</span>;
}

function buildContext(text: string, start: number, end: number): string {
  const left = Math.max(0, start - 40);
  const right = Math.min(text.length, end + 40);
  const prefix = left > 0 ? "..." : "";
  const suffix = right < text.length ? "..." : "";
  return `${prefix}${text.slice(left, right)}${suffix}`;
}

export default function ReportPage() {
  const {
    clauses,
    highlights,
    lexicon,
    audit,
    selectedDocument,
    isProcessed,
  } = useSession();

  const generatedAt = useMemo(() => new Date().toLocaleString("pt-BR"), []);

  const termEvidenceMap = useMemo(() => {
    const map = new Map<string, TermEvidence>();

    for (const clause of clauses) {
      const clauseHighlights = highlights[clause.clause_id] ?? [];
      const clauseAudit = audit?.clauses_audit[clause.clause_id];

      for (const hit of clauseHighlights) {
        if (map.has(hit.term_id)) {
          continue;
        }

        const lexiconEntry = lexicon.find((item) => item.term_id === hit.term_id);
        if (!lexiconEntry) {
          continue;
        }

        const auditHighlight = clauseAudit?.highlights.find(
          (row) => row.term_id === hit.term_id && row.start === hit.start
        );

        map.set(hit.term_id, {
          term_id: hit.term_id,
          clause_id: clause.clause_id,
          match: hit.match,
          start: hit.start,
          end: hit.end,
          context: buildContext(clause.text, hit.start, hit.end),
          lexicon_field_used: auditHighlight?.lookup.lexicon_field_used ?? "term",
          matched_variant: auditHighlight?.lookup.matched_variant ?? hit.match,
          lgpd_refs: lexiconEntry.lgpd_refs,
          semiotic_rule: `${CATEGORY_LABELS[lexiconEntry.category]} -> ${lexiconEntry.icon_id}`,
        });
      }
    }

    return map;
  }, [audit, clauses, highlights, lexicon]);

  if (!isProcessed || clauses.length === 0) {
    return (
      <div className="ios-card p-4 text-center">
        <h1 className="fw-bold" style={{ fontSize: "1.2rem" }}>
          Relatorio indisponivel
        </h1>
        <p className="text-ios-secondary">Execute o processamento no Reader antes de gerar o PDF.</p>
        <Link href="/" className="btn btn-ios btn-ios-primary">
          Voltar para Home
        </Link>
      </div>
    );
  }

  const semioForDoc = selectedDocument
    ? getDocumentSemanticProfile(selectedDocument)
    : null;

  return (
    <div className="report-page d-flex flex-column gap-4" data-testid="report-page">
      <div className="d-flex gap-2 justify-content-between align-items-center flex-wrap print-hidden">
        <h1 className="fw-bold mb-0" style={{ fontSize: "1.3rem" }}>
          Relatorio Academico Visual Law
        </h1>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-ios btn-ios-primary" onClick={() => window.print()} data-testid="print-report-button">
            <i className="bi bi-printer me-1"></i>
            Imprimir / Salvar PDF
          </button>
          <Link href="/reader" className="btn btn-ios btn-ios-tertiary">
            Voltar ao Reader
          </Link>
        </div>
      </div>

      <section className="ios-card p-4 report-section">
        <h2 className="fw-bold mb-2" style={{ fontSize: "1.4rem" }}>
          Visual Law TCC - Relatorio de Auditoria
        </h2>
        <div style={{ fontSize: "0.9rem" }}>
          <div><strong>Data/hora:</strong> {generatedAt}</div>
          <div><strong>Versao MVP:</strong> 0.1.0 academico</div>
          <div>
            <strong>Documento selecionado:</strong>{" "}
            {selectedDocument
              ? `${selectedDocument.name} (${selectedDocument.doc_id})`
              : "Nao informado"}
          </div>
          {selectedDocument && (
            <div>
              <strong>Metadados:</strong> tipo {selectedDocument.type}, plataforma {selectedDocument.platform}, idioma {selectedDocument.language}
            </div>
          )}
        </div>
      </section>

      <section className="ios-card p-4 report-section">
        <h2 className="fw-semibold mb-2" style={{ fontSize: "1.05rem" }}>Sumario de clausulas</h2>
        <ol className="mb-0" style={{ fontSize: "0.9rem" }}>
          {clauses.map((clause) => (
            <li key={clause.clause_id}>
              <strong>{clause.clause_id}</strong> - {clause.title || "Sem titulo"}
            </li>
          ))}
        </ol>
      </section>

      <section className="d-flex flex-column gap-3 report-section">
        <h2 className="fw-semibold" style={{ fontSize: "1.05rem" }}>Analise por clausula</h2>
        {clauses.map((clause) => {
          const clauseHighlights = highlights[clause.clause_id] ?? [];
          const clauseAudit = audit?.clauses_audit[clause.clause_id];

          return (
            <article key={clause.clause_id} className="ios-card p-3 report-block">
              <h3 className="fw-bold" style={{ fontSize: "1rem" }}>
                {clause.clause_id} - {clause.title || "Clausula"}
              </h3>
              <p style={{ fontSize: "0.88rem", whiteSpace: "pre-wrap" }}>{clause.text}</p>

              <div className="ios-card-inset p-2" style={{ fontSize: "0.82rem" }}>
                <div><strong>Categoria:</strong> {CATEGORY_LABELS[clause.category]}</div>
                <div><strong>Impacto:</strong> {clause.impact}</div>
                <div><strong>LGPD refs:</strong> {clause.lgpd_refs.join(", ") || "-"}</div>
                <div><strong>Termos detectados:</strong> {clauseHighlights.map((h) => h.match).join(", ") || "nenhum"}</div>
              </div>

              <div className="mt-2" style={{ fontSize: "0.84rem", lineHeight: 1.6 }}>
                <strong>Trecho com destaques:</strong>
                <div>{renderHighlightedText(clause.text, clauseHighlights)}</div>
              </div>

              <div className="mt-2" style={{ fontSize: "0.82rem" }}>
                <strong>Evidencia de classificacao:</strong>
                <div>regra segmentacao: {clauseAudit?.segment.rule ?? "n/a"}</div>
                <div>evidencia segmentacao: {clauseAudit?.segment.evidence ?? "n/a"}</div>
                <div>scores: {clauseAudit ? JSON.stringify(clauseAudit.classification.scores) : "n/a"}</div>
                <div>
                  rules_fired: {clauseAudit?.classification.rules_fired.map((rule) => rule.rule_id).join(", ") || "nenhuma"}
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="d-flex flex-column gap-3 report-section">
        <h2 className="fw-semibold" style={{ fontSize: "1.05rem" }}>Termos encontrados e cards completos</h2>
        {[...termEvidenceMap.keys()].map((termId) => {
          const entry = lexicon.find((item) => item.term_id === termId);
          const evidence = termEvidenceMap.get(termId) ?? null;

          if (!entry) {
            return null;
          }

          return (
            <article key={termId} className="report-block">
              <TermCard entry={entry} evidence={evidence} mode="report" />
            </article>
          );
        })}
      </section>

      <section className="ios-card p-4 report-section">
        <h2 className="fw-semibold mb-3" style={{ fontSize: "1.05rem" }}>Apendice semantico e semiotico</h2>

        <div className="mb-3">
          <h3 className="fw-semibold" style={{ fontSize: "0.95rem" }}>
            Categoria {"->"} Icone {"->"} Justificativa
          </h3>
          <ul className="mb-0" style={{ fontSize: "0.83rem" }}>
            {SEMIOTIC_MAP.map((item) => (
              <li key={item.category}>
                <strong>{CATEGORY_LABELS[item.category]}</strong> | icone {item.icon_id} | {item.significance}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-3">
          <h3 className="fw-semibold" style={{ fontSize: "0.95rem" }}>
            Impacto {"->"} Interpretacao
          </h3>
          <ul className="mb-0" style={{ fontSize: "0.83rem" }}>
            {IMPACT_SEMIOTIC_MAP.map((item) => (
              <li key={item.impact}>
                <strong>{item.label}</strong> ({item.icon}) - {item.interpretation}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="fw-semibold" style={{ fontSize: "0.95rem" }}>Doc mapping</h3>
          {semioForDoc ? (
            <div className="ios-card-inset p-2" style={{ fontSize: "0.83rem" }}>
              <div><strong>Tipo:</strong> {semioForDoc.profile.label}</div>
              <div><strong>Icone principal:</strong> {semioForDoc.profile.primary_icon}</div>
              <div><strong>Categorias alvo:</strong> {semioForDoc.categories.map((category) => CATEGORY_LABELS[category]).join(", ")}</div>
              <div><strong>Regra:</strong> {semioForDoc.profile.rule_summary}</div>
              <div><strong>Justificativa:</strong> {semioForDoc.profile.icon_justification}</div>
              {semioForDoc.platformNote && <div><strong>Ajuste por plataforma:</strong> {semioForDoc.platformNote}</div>}
            </div>
          ) : (
            <div className="text-ios-secondary">Documento sem mapping selecionado.</div>
          )}

          <details className="mt-2">
            <summary className="fw-semibold" style={{ cursor: "pointer", fontSize: "0.83rem" }}>
              Ver matriz completa doc_type_semantics
            </summary>
            <pre className="mt-2 p-2" style={{ background: "#f3f4f6", fontSize: "0.72rem", whiteSpace: "pre-wrap" }}>
              {JSON.stringify(DOCUMENT_SEMIOTIC_MAP.doc_type_semantics, null, 2)}
            </pre>
          </details>
        </div>
      </section>
    </div>
  );
}
