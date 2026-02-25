/* ========================================================
 * pipeline.ts — Orquestra o pipeline completo:
 * texto bruto → clauses + highlights + explanations + audit
 * ======================================================== */

import type {
  Clause,
  HighlightsMap,
  ExplanationsMap,
  LexiconEntry,
  PipelineResult,
  AuditSession,
  ClauseAudit,
  PipelineStep,
} from "./types";
import { segmentText } from "./segmenter";
import { normalize } from "./normalizer";
import { classifyClause, suggestLGPDRefs } from "./classifier";
import { findTermsInText } from "./highlighter";
import { generateExplanations } from "./explainer";

const PIPELINE_STEPS: PipelineStep[] = [
  {
    step_id: "S1_SEGMENT",
    name: "Segmentação",
    description: "Quebra do texto em cláusulas por parágrafos e detecção de títulos/cabeçalhos.",
    input_ref: "raw_text",
    output_ref: "clauses",
  },
  {
    step_id: "S2_NORMALIZE",
    name: "Normalização",
    description: "Conversão para lowercase, remoção de acentos e limpeza para busca léxica.",
    input_ref: "clauses",
    output_ref: "normalized_text",
  },
  {
    step_id: "S3_CLASSIFY",
    name: "Classificação",
    description: "Atribuição de categoria e impacto por heurística de palavras-chave.",
    input_ref: "normalized_text",
    output_ref: "classified_clauses",
  },
  {
    step_id: "S4_HIGHLIGHT",
    name: "Destaques",
    description: "Matching léxico: busca de termos jurídicos no texto com offsets e provenance.",
    input_ref: "classified_clauses",
    output_ref: "highlights",
  },
  {
    step_id: "S5_EXPLAIN",
    name: "Explicação / Visual Law",
    description: "Geração de cards explicativos a partir do léxico para cada termo encontrado.",
    input_ref: "highlights",
    output_ref: "explanations",
  },
];

/**
 * Executa o pipeline completo sobre um texto bruto.
 */
export function runPipeline(
  rawText: string,
  docId: string,
  lexicon: LexiconEntry[]
): PipelineResult {
  const clausesAudit: Record<string, ClauseAudit> = {};

  // 1. Segmentação
  const rawClauses = segmentText(rawText, docId);

  // 2+3. Normalização + Classificação + enrichment
  const clauses: Clause[] = rawClauses.map((raw) => {
    const { category, impact, audit: classAudit } = classifyClause(raw.text);
    const lgpd_refs = suggestLGPDRefs(category);

    clausesAudit[raw.clause_id] = {
      segment: raw.segmentEvidence,
      normalized_preview: normalize(raw.text).slice(0, 120) + "...",
      classification: classAudit,
      highlights: [],
    };

    return {
      clause_id: raw.clause_id,
      doc_id: raw.doc_id,
      title: raw.title,
      text: raw.text,
      category,
      impact,
      lgpd_refs,
    };
  });

  // 4. Highlight
  const highlights: HighlightsMap = {};
  for (const clause of clauses) {
    const { matches, audits } = findTermsInText(clause.text, lexicon);
    if (matches.length > 0) {
      highlights[clause.clause_id] = matches;
    }
    if (clausesAudit[clause.clause_id]) {
      clausesAudit[clause.clause_id].highlights = audits;
    }
  }

  // 5. Explanations
  const explanations: ExplanationsMap = generateExplanations(highlights, lexicon);

  const audit: AuditSession = {
    session_id: `SESSION_${Date.now()}`,
    created_at: new Date().toISOString(),
    source: { mode: "pasted_text", doc_hint: docId },
    pipeline: PIPELINE_STEPS,
    clauses_audit: clausesAudit,
  };

  return { clauses, highlights, explanations, audit };
}
