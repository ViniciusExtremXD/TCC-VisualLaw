/* ========================================================
 * pipeline.ts - Orquestra o pipeline completo:
 * texto bruto -> clauses + highlights + explanations + audit + traceability
 * ======================================================== */

import type {
  AuditSession,
  Clause,
  ClauseAudit,
  ExplanationsMap,
  HighlightsMap,
  LexiconEntry,
  PipelineResult,
  PipelineStep,
  Category,
  Impact,
} from "./types";
import { segmentText } from "./segmenter";
import { normalize } from "./normalizer";
import { classifyClause, suggestLGPDRefs } from "./classifier";
import { findTermsInText } from "./highlighter";
import { generateExplanations } from "./explainer";
import { summarizeClausePlainLanguage } from "./plain-language";
import { buildTraceabilitySession } from "./traceability";

interface ClauseSeed {
  clause_id: string;
  doc_id: string;
  title: string;
  text: string;
  category?: Category;
  impact?: Impact;
  lgpd_refs?: string[];
  plain_language_summary?: string;
  detected_terms?: string[];
  segmentEvidence?: {
    rule: string;
    evidence: string;
  };
}

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
  {
    step_id: "S6_TRACE",
    name: "Rastreabilidade",
    description: "Encadeamento entre cláusula, termo detectado, regra aplicada e saída final exibida.",
    input_ref: "explanations",
    output_ref: "traceability",
  },
];

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function buildPipelineResultFromClauses(
  clauseSeeds: ClauseSeed[],
  lexicon: LexiconEntry[],
  sourceMode: string,
  docHint: string
): PipelineResult {
  const clausesAudit: Record<string, ClauseAudit> = {};
  const highlights: HighlightsMap = {};
  const lexiconMap = new Map(lexicon.map((entry) => [entry.term_id, entry]));

  const clauses: Clause[] = clauseSeeds.map((seed) => {
    const { category, impact, audit: classAudit } = classifyClause(seed.text);
    const finalCategory = seed.category ?? category;
    const finalImpact = seed.impact ?? impact;
    const lgpd_refs = seed.lgpd_refs?.length ? seed.lgpd_refs : suggestLGPDRefs(finalCategory);
    const { matches, audits } = findTermsInText(seed.text, lexicon);

    if (matches.length > 0) {
      highlights[seed.clause_id] = matches;
    }

    const matchedEntries = matches
      .map((match) => lexiconMap.get(match.term_id))
      .filter((entry): entry is LexiconEntry => Boolean(entry));

    const detectedTerms = uniqueStrings(
      seed.detected_terms?.length
        ? seed.detected_terms
        : matchedEntries.map((entry) => entry.term)
    );

    const plainLanguageSummary = summarizeClausePlainLanguage({
      category: finalCategory,
      impact: finalImpact,
      lgpdRefs: lgpd_refs,
      matchedEntries,
      existingSummary: seed.plain_language_summary,
    });

    clausesAudit[seed.clause_id] = {
      segment: seed.segmentEvidence ?? {
        rule: sourceMode === "dataset_demo" ? "dataset_reference" : "split_paragraphs",
        evidence: sourceMode === "dataset_demo" ? "origin=dataset" : "origin=pipeline",
      },
      normalized_preview: `${normalize(seed.text).slice(0, 120)}...`,
      classification: {
        ...classAudit,
        category: finalCategory,
        method:
          seed.category && seed.category !== classAudit.category
            ? "dataset_reference_with_heuristic_audit"
            : classAudit.method,
      },
      highlights: audits,
      output: {
        plain_language_summary: plainLanguageSummary,
        detected_terms: detectedTerms,
        explanation_ids: uniqueStrings(matches.map((match) => match.term_id)),
      },
      source_annotation: seed.category
        ? {
            category: seed.category,
            impact: seed.impact ?? finalImpact,
            lgpd_refs,
          }
        : undefined,
    };

    return {
      clause_id: seed.clause_id,
      doc_id: seed.doc_id,
      title: seed.title,
      text: seed.text,
      category: finalCategory,
      impact: finalImpact,
      lgpd_refs,
      plain_language_summary: plainLanguageSummary,
      detected_terms: detectedTerms,
    };
  });

  const explanations: ExplanationsMap = generateExplanations(highlights, lexicon);

  const audit: AuditSession = {
    session_id: `SESSION_${Date.now()}`,
    created_at: new Date().toISOString(),
    source: { mode: sourceMode, doc_hint: docHint },
    pipeline: PIPELINE_STEPS,
    clauses_audit: clausesAudit,
  };

  const traceability = buildTraceabilitySession({
    clauses,
    highlights,
    explanations,
    lexicon,
    audit,
    sourceMode,
    docHint,
  });

  return { clauses, highlights, explanations, audit, traceability };
}

export function runPipeline(
  rawText: string,
  docId: string,
  lexicon: LexiconEntry[]
): PipelineResult {
  const rawClauses = segmentText(rawText, docId);
  const clauseSeeds: ClauseSeed[] = rawClauses.map((raw) => ({
    clause_id: raw.clause_id,
    doc_id: raw.doc_id,
    title: raw.title,
    text: raw.text,
    segmentEvidence: raw.segmentEvidence,
  }));

  return buildPipelineResultFromClauses(clauseSeeds, lexicon, "pasted_text", docId);
}
