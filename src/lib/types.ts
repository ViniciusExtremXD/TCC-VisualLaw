/* Core domain types for Visual Law TCC (academic mode only). */

export const CATEGORIES = [
  "data_collection",
  "purpose_use",
  "sharing_third_parties",
  "retention_storage",
  "user_rights",
  "security_incidents",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  data_collection: "Coleta de dados",
  purpose_use: "Finalidade e uso",
  sharing_third_parties: "Compartilhamento com terceiros",
  retention_storage: "Retenção e armazenamento",
  user_rights: "Direitos do titular (LGPD)",
  security_incidents: "Segurança e incidentes",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  data_collection: "#3B82F6",
  purpose_use: "#0EA5E9",
  sharing_third_parties: "#EF4444",
  retention_storage: "#64748B",
  user_rights: "#22C55E",
  security_incidents: "#DC2626",
};

export type Impact = "low" | "medium" | "high";

export interface Clause {
  clause_id: string;
  doc_id: string;
  title: string;
  text: string;
  category: Category;
  lgpd_refs: string[];
  impact: Impact;
  plain_language_summary: string;
  detected_terms: string[];
}

export interface TermMatch {
  term_id: string;
  match: string;
  start: number;
  end: number;
}

export type HighlightsMap = Record<string, TermMatch[]>;

export interface FAQItem {
  q: string;
  a: string;
  source: "lexicon" | "heuristic";
}

export interface Explanation {
  term_id: string;
  termo_juridico: string;
  direct_translation: string;
  plain_definition: string;
  practical_example: string;
  meaning: string;
  why_it_matters: string;
  what_you_can_do: string;
  category: Category;
  icon_id: string;
  impact: Impact;
  lgpd_refs: string[];
  observacao_metodologica?: string;
}

export type ExplanationsMap = Record<string, Explanation>;

export interface LexiconEntry {
  term_id: string;
  term: string;
  aliases: string[];
  category: Category;
  /** Traducao direta e curta em linguagem leiga */
  traducao_direta: string;
  meaning: string;
  why_it_matters: string;
  what_you_can_do: string;
  /** Exemplo pratico concreto de como isso aparece na vida real */
  exemplo_pratico: string;
  impact: Impact;
  icon_id: string;
  lgpd_refs: string[];
  faqs?: FAQItem[];
  observacao_metodologica?: string;
}

export interface IconEntry {
  label: string;
  lucide_name: string;
  color: string;
  category_hint: string;
}

export type IconMap = Record<string, IconEntry>;

export interface RuleFired {
  rule_id: string;
  keywords: string[];
  weight: number;
}

export interface HighlightAudit {
  term_id: string;
  match: string;
  start: number;
  end: number;
  lookup: {
    lexicon_field_used: string;
    matched_variant: string;
    matching_rule_id: string;
  };
}

export interface ClassificationAudit {
  category: Category;
  method: string;
  scores: Record<Category, number>;
  rules_fired: RuleFired[];
}
export interface ClauseAudit {
  segment: {
    rule: string;
    evidence: string;
  };
  normalized_preview: string;
  classification: ClassificationAudit;
  highlights: HighlightAudit[];
  output: {
    plain_language_summary: string;
    detected_terms: string[];
    explanation_ids: string[];
  };
  source_annotation?: {
    category: Category;
    impact: Impact;
    lgpd_refs: string[];
  };
}

export interface PipelineStep {
  step_id: string;
  name: string;
  description: string;
  input_ref: string;
  output_ref: string;
}

export interface AuditSession {
  session_id: string;
  created_at: string;
  source: { mode: string; doc_hint: string };
  pipeline: PipelineStep[];
  clauses_audit: Record<string, ClauseAudit>;
}

export interface TraceabilityTermLink {
  term_id: string;
  termo_juridico: string;
  termo_detectado: string;
  start: number;
  end: number;
  regra_matching: string;
  campo_lexico: string;
  variante_encontrada: string;
  explicacao_id: string;
  traducao_direta: string;
}

export interface TraceabilityRecord {
  trace_id: string;
  document_id: string;
  clause_id: string;
  titulo: string;
  texto_original: string;
  clausula_segmentada: {
    regra: string;
    evidencia: string;
  };
  classificacao_atribuida: {
    categoria: Category;
    impacto: Impact;
    metodo: string;
    regras_disparadas: string[];
  };
  termos_detectados: TraceabilityTermLink[];
  explicacoes_vinculadas: string[];
  saida_final: {
    texto_original: string;
    linguagem_simples: string;
    categoria_exibida: string;
    visao_comparativa: boolean;
  };
}

export interface TraceabilitySession {
  session_id: string;
  created_at: string;
  source: {
    mode: string;
    doc_hint: string;
  };
  records: TraceabilityRecord[];
}

export interface SemioticEntry {
  category: Category;
  icon_id: string;
  icon_label: string;
  color: string;
  significance: string;
  impact_interpretation: string;
}

export interface ImpactSemioticEntry {
  impact: Impact;
  label: string;
  icon: string;
  color: string;
  interpretation: string;
}

export type SemioticMapType = SemioticEntry[];

export interface PipelineResult {
  clauses: Clause[];
  highlights: HighlightsMap;
  explanations: ExplanationsMap;
  audit: AuditSession;
  traceability: TraceabilitySession;
}

export type DocumentType = "privacy" | "terms" | "cookies" | "other";
export type DocumentStatus = "active" | "inactive";

export interface DocumentRecord {
  doc_id: string;
  name: string;
  type: DocumentType;
  platform: string;
  language: string;
  url?: string;
  last_updated?: string;
  status: DocumentStatus;
}

export interface ProcessStepDefinition {
  id: string;
  title: string;
  objective: string;
  input: string;
  output: string;
  evidence: string;
}

export interface DocumentSemanticProfile {
  doc_type: DocumentType;
  label: string;
  primary_icon: string;
  icon_justification: string;
  target_categories: Category[];
  rule_summary: string;
}

export interface TermEvidence {
  term_id: string;
  clause_id: string;
  match: string;
  start: number;
  end: number;
  context: string;
  lexicon_field_used: string;
  matched_variant: string;
  lgpd_refs: string[];
  semiotic_rule: string;
}

export interface AcademicLexiconRecord {
  term_id: string;
  termo_juridico: string;
  aliases?: string[];
  traducao_direta: string;
  definicao_leiga: string;
  exemplo_pratico: string;
  categoria: Category;
  icone_id: string;
  nivel_impacto: Impact;
  direito_lgpd_relacionado: string[];
  lgpd_refs?: string[];
  palavras_chave_relacionadas: string[];
  corpus_support?: string[];
  observacao_metodologica?: string;
}

export interface AcademicClauseRecord {
  clause_id: string;
  document_id: string;
  doc_id?: string;
  titulo: string;
  title?: string;
  texto_original: string;
  text?: string;
  categoria: Category;
  category?: Category;
  termos_detectados: string[];
  traducao_resumida: string;
  direito_lgpd_relacionado: string[];
  lgpd_refs?: string[];
  impacto: Impact;
  impact?: Impact;
  source_kind?: string;
  source_package?: string;
  source_excerpt_id?: string;
  official_url?: string;
  review_status?: string;
}

export interface CorpusManifestRecord {
  document_id: string;
  titulo: string;
  plataforma: string;
  tipo: DocumentType;
  idioma: string;
  coleta_referencia: string;
  natureza_fonte: string;
  objetivo_no_corpus: string;
}

export interface AcademicHighlightExport {
  clause_id: string;
  document_id: string;
  term_id: string;
  termo_juridico: string;
  trecho_detectado: string;
  start: number;
  end: number;
  regra_matching: string;
  campo_lexico: string;
  variante_encontrada: string;
  categoria: Category;
  impacto: Impact;
}

export interface AcademicExplanationExport {
  term_id: string;
  termo_juridico: string;
  traducao_direta: string;
  definicao_leiga: string;
  exemplo_pratico: string;
  categoria: Category;
  icone_id: string;
  nivel_impacto: Impact;
  direito_lgpd_relacionado: string[];
  observacao_metodologica?: string;
}
