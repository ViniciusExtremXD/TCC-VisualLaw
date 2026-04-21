import fs from "node:fs";
import path from "node:path";
import { runPipeline } from "../../src/lib/pipeline";
import { LEXICON } from "../../src/lib/lexicon-data";
import type {
  AuditSession,
  ExplanationsMap,
  HighlightsMap,
  PipelineResult,
  TraceabilitySession,
} from "../../src/lib/types";

export interface HarnessFixture {
  id: string;
  docId: string;
}

export const HARNESS_FIXTURES: HarnessFixture[] = [
  {
    id: "lgpd-sample",
    docId: "HARNESS_LGPD",
  },
];

export function getHarnessPath(...segments: string[]): string {
  return path.resolve(process.cwd(), "harness", ...segments);
}

export function readFixture(fixture: HarnessFixture): string {
  return fs.readFileSync(getHarnessPath("fixtures", `${fixture.id}.txt`), "utf8");
}

export function normalizePipelineResult(result: PipelineResult) {
  return {
    clauses: result.clauses.map((clause) => ({
      clause_id: clause.clause_id,
      doc_id: clause.doc_id,
      title: clause.title,
      text: clause.text,
      category: clause.category,
      impact: clause.impact,
      lgpd_refs: clause.lgpd_refs,
      detected_terms: clause.detected_terms,
    })),
    highlights: normalizeHighlights(result.highlights),
    explanations: normalizeExplanations(result.explanations),
    audit: normalizeAudit(result.audit),
    traceability: normalizeTraceability(result.traceability),
  };
}

export function runFixture(fixture: HarnessFixture) {
  const rawText = readFixture(fixture);
  return normalizePipelineResult(runPipeline(rawText, fixture.docId, LEXICON));
}

function normalizeHighlights(highlights: HighlightsMap) {
  return Object.fromEntries(
    Object.entries(highlights)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([clauseId, matches]) => [
        clauseId,
        matches.map((match) => ({
          term_id: match.term_id,
          match: match.match,
          start: match.start,
          end: match.end,
        })),
      ])
  );
}

function normalizeExplanations(explanations: ExplanationsMap) {
  return Object.fromEntries(
    Object.entries(explanations)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([termId, explanation]) => [
        termId,
        {
          term_id: explanation.term_id,
          termo_juridico: explanation.termo_juridico,
          direct_translation: explanation.direct_translation,
          plain_definition: explanation.plain_definition,
          practical_example: explanation.practical_example,
          category: explanation.category,
          icon_id: explanation.icon_id,
          impact: explanation.impact,
          lgpd_refs: explanation.lgpd_refs,
        },
      ])
  );
}

function normalizeAudit(audit: AuditSession) {
  return {
    source: audit.source,
    pipeline: audit.pipeline.map((step) => step.step_id),
    clauses_audit: Object.fromEntries(
      Object.entries(audit.clauses_audit)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([clauseId, clauseAudit]) => [
          clauseId,
          {
            segment: clauseAudit.segment,
            classification: {
              category: clauseAudit.classification.category,
              method: clauseAudit.classification.method,
              scores: clauseAudit.classification.scores,
              rules_fired: clauseAudit.classification.rules_fired.map((rule) => ({
                rule_id: rule.rule_id,
                keywords: rule.keywords,
              })),
            },
            highlights: clauseAudit.highlights.map((item) => ({
              term_id: item.term_id,
              match: item.match,
              start: item.start,
              end: item.end,
              lookup: item.lookup,
            })),
            output: clauseAudit.output,
          },
        ])
    ),
  };
}

function normalizeTraceability(traceability: TraceabilitySession) {
  return {
    source: traceability.source,
    records: traceability.records.map((record) => ({
      trace_id: record.trace_id,
      document_id: record.document_id,
      clause_id: record.clause_id,
      classificacao_atribuida: record.classificacao_atribuida,
      termos_detectados: record.termos_detectados.map((term) => ({
        term_id: term.term_id,
        termo_detectado: term.termo_detectado,
        start: term.start,
        end: term.end,
        regra_matching: term.regra_matching,
        campo_lexico: term.campo_lexico,
        explicacao_id: term.explicacao_id,
      })),
      explicacoes_vinculadas: record.explicacoes_vinculadas,
    })),
  };
}
