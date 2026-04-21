import { CATEGORY_LABELS } from "./types";
import type {
  AuditSession,
  Clause,
  ExplanationsMap,
  HighlightsMap,
  LexiconEntry,
  TraceabilityRecord,
  TraceabilitySession,
} from "./types";

function buildTermLinks(input: {
  clause: Clause;
  highlights: HighlightsMap[string];
  explanations: ExplanationsMap;
  lexiconMap: Map<string, LexiconEntry>;
  audit: AuditSession | null;
}) {
  const clauseAudit = input.audit?.clauses_audit[input.clause.clause_id];

  return (input.highlights ?? []).map((highlight) => {
    const lexiconEntry = input.lexiconMap.get(highlight.term_id);
    const auditHighlight = clauseAudit?.highlights.find(
      (item) => item.term_id === highlight.term_id && item.start === highlight.start
    );
    const explanation = input.explanations[highlight.term_id];

    return {
      term_id: highlight.term_id,
      termo_juridico: lexiconEntry?.term ?? highlight.match,
      termo_detectado: highlight.match,
      start: highlight.start,
      end: highlight.end,
      regra_matching: auditHighlight?.lookup.matching_rule_id ?? "LEXICON_MATCH",
      campo_lexico: auditHighlight?.lookup.lexicon_field_used ?? "term",
      variante_encontrada: auditHighlight?.lookup.matched_variant ?? highlight.match,
      explicacao_id: explanation?.term_id ?? highlight.term_id,
      traducao_direta:
        explanation?.direct_translation ?? lexiconEntry?.traducao_direta ?? highlight.match,
    };
  });
}

export function buildTraceabilitySession(input: {
  clauses: Clause[];
  highlights: HighlightsMap;
  explanations: ExplanationsMap;
  lexicon: LexiconEntry[];
  audit: AuditSession | null;
  sourceMode: string;
  docHint: string;
}): TraceabilitySession {
  const lexiconMap = new Map(input.lexicon.map((entry) => [entry.term_id, entry]));
  const createdAt = input.audit?.created_at ?? new Date().toISOString();
  const sessionId = input.audit?.session_id ?? `TRACE_${Date.now()}`;

  const records: TraceabilityRecord[] = input.clauses.map((clause) => {
    const clauseAudit = input.audit?.clauses_audit[clause.clause_id];
    const termLinks = buildTermLinks({
      clause,
      highlights: input.highlights[clause.clause_id] ?? [],
      explanations: input.explanations,
      lexiconMap,
      audit: input.audit,
    });

    return {
      trace_id: `TRACE_${clause.clause_id}`,
      document_id: clause.doc_id,
      clause_id: clause.clause_id,
      titulo: clause.title,
      texto_original: clause.text,
      clausula_segmentada: {
        regra: clauseAudit?.segment.rule ?? "n/a",
        evidencia: clauseAudit?.segment.evidence ?? "n/a",
      },
      classificacao_atribuida: {
        categoria: clause.category,
        impacto: clause.impact,
        metodo: clauseAudit?.classification.method ?? "heuristic_keywords",
        regras_disparadas:
          clauseAudit?.classification.rules_fired.map((rule) => rule.rule_id) ?? [],
      },
      termos_detectados: termLinks,
      explicacoes_vinculadas: termLinks.map((item) => item.explicacao_id),
      saida_final: {
        texto_original: clause.text,
        linguagem_simples: clause.plain_language_summary,
        categoria_exibida: CATEGORY_LABELS[clause.category],
        visao_comparativa: true,
      },
    };
  });

  return {
    session_id: sessionId,
    created_at: createdAt,
    source: {
      mode: input.sourceMode,
      doc_hint: input.docHint,
    },
    records,
  };
}
