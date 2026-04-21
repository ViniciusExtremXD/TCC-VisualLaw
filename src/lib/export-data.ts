import type {
  AcademicClauseRecord,
  AcademicExplanationExport,
  AcademicHighlightExport,
  AuditSession,
  Clause,
  ExplanationsMap,
  HighlightsMap,
  LexiconEntry,
  TraceabilitySession,
} from "./types";

export function buildAcademicExportBundle(input: {
  clauses: Clause[];
  highlights: HighlightsMap;
  explanations: ExplanationsMap;
  lexicon: LexiconEntry[];
  audit: AuditSession | null;
  traceability: TraceabilitySession | null;
}): {
  clauses: AcademicClauseRecord[];
  highlights: AcademicHighlightExport[];
  explanations: AcademicExplanationExport[];
  traceability: TraceabilitySession | null;
} {
  const lexiconMap = new Map(input.lexicon.map((entry) => [entry.term_id, entry]));

  const clauseExports: AcademicClauseRecord[] = input.clauses.map((clause) => ({
    clause_id: clause.clause_id,
    document_id: clause.doc_id,
    titulo: clause.title,
    texto_original: clause.text,
    categoria: clause.category,
    termos_detectados: clause.detected_terms,
    traducao_resumida: clause.plain_language_summary,
    direito_lgpd_relacionado: clause.lgpd_refs,
    impacto: clause.impact,
  }));

  const highlightExports: AcademicHighlightExport[] = input.clauses.flatMap((clause) => {
    const clauseAudit = input.audit?.clauses_audit[clause.clause_id];
    return (input.highlights[clause.clause_id] ?? []).map((highlight) => {
      const lexiconEntry = lexiconMap.get(highlight.term_id);
      const auditHighlight = clauseAudit?.highlights.find(
        (item) => item.term_id === highlight.term_id && item.start === highlight.start
      );

      return {
        clause_id: clause.clause_id,
        document_id: clause.doc_id,
        term_id: highlight.term_id,
        termo_juridico: lexiconEntry?.term ?? highlight.match,
        trecho_detectado: highlight.match,
        start: highlight.start,
        end: highlight.end,
        regra_matching: auditHighlight?.lookup.matching_rule_id ?? "LEXICON_MATCH",
        campo_lexico: auditHighlight?.lookup.lexicon_field_used ?? "term",
        variante_encontrada: auditHighlight?.lookup.matched_variant ?? highlight.match,
        categoria: clause.category,
        impacto: clause.impact,
      };
    });
  });

  const explanationExports: AcademicExplanationExport[] = Object.values(input.explanations).map(
    (explanation) => ({
      term_id: explanation.term_id,
      termo_juridico: explanation.termo_juridico,
      traducao_direta: explanation.direct_translation,
      definicao_leiga: explanation.plain_definition,
      exemplo_pratico: explanation.practical_example,
      categoria: explanation.category,
      icone_id: explanation.icon_id,
      nivel_impacto: explanation.impact,
      direito_lgpd_relacionado: explanation.lgpd_refs,
      observacao_metodologica: explanation.observacao_metodologica,
    })
  );

  return {
    clauses: clauseExports,
    highlights: highlightExports,
    explanations: explanationExports,
    traceability: input.traceability,
  };
}
