/* Dataset clause-level usado na demonstracao academica */
import datasetClauses from "../../data/dataset/clauses.json";
import type { AcademicClauseRecord, Clause } from "./types";

export const DATASET_CLAUSE_RECORDS: AcademicClauseRecord[] =
  datasetClauses as AcademicClauseRecord[];

export const MOCK_CLAUSES: Clause[] = DATASET_CLAUSE_RECORDS.map((record) => ({
  clause_id: record.clause_id,
  doc_id: record.document_id,
  title: record.titulo,
  text: record.texto_original,
  category: record.categoria,
  impact: record.impacto,
  lgpd_refs: record.direito_lgpd_relacionado,
  plain_language_summary: record.traducao_resumida,
  detected_terms: record.termos_detectados,
}));
