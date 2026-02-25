/* ========================================================
 * types.ts — Tipos centrais do projeto Visual Law TCC
 * ======================================================== */

// ── Categorias de cláusula ──────────────────────────────
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
  data_collection: "Coleta de Dados",
  purpose_use: "Finalidade / Uso",
  sharing_third_parties: "Compartilhamento / Terceiros",
  retention_storage: "Retenção / Armazenamento",
  user_rights: "Direitos do Usuário (LGPD)",
  security_incidents: "Segurança / Incidentes",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  data_collection: "#3B82F6",
  purpose_use: "#0EA5E9",
  sharing_third_parties: "#EF4444",
  retention_storage: "#64748B",
  user_rights: "#22C55E",
  security_incidents: "#DC2626",
};

// ── Impacto ─────────────────────────────────────────────
export type Impact = "low" | "medium" | "high";

// ── Cláusula ────────────────────────────────────────────
export interface Clause {
  clause_id: string;
  doc_id: string;
  title: string;
  text: string;
  category: Category;
  lgpd_refs: string[];
  impact: Impact;
}

// ── Highlight (match de termo dentro de cláusula) ───────
export interface TermMatch {
  term_id: string;
  match: string;      // texto encontrado
  start: number;      // offset no texto da cláusula
  end: number;
}

export type HighlightsMap = Record<string, TermMatch[]>; // clause_id → matches

// ── Explanation (card Visual Law) ───────────────────────
export interface Explanation {
  meaning: string;
  why_it_matters: string;
  what_you_can_do: string;
  category: Category;
  icon_id: string;
  impact: Impact;
  lgpd_refs: string[];
}

export type ExplanationsMap = Record<string, Explanation>; // term_id → explanation

// ── Léxico (entrada do dicionário) ──────────────────────
export interface LexiconEntry {
  term_id: string;
  term: string;
  aliases: string[];
  category: Category;
  meaning: string;
  why_it_matters: string;
  what_you_can_do: string;
  impact: Impact;
  icon_id: string;
  lgpd_refs: string[];
}

// ── Icon Map ────────────────────────────────────────────
export interface IconEntry {
  label: string;
  lucide_name: string;
  color: string;
  category_hint: string;
}

export type IconMap = Record<string, IconEntry>;

// ── Audit types ─────────────────────────────────────────

export interface RuleFired {
  rule_id: string;
  keywords: string[];
  weight: number;
}

export interface ClassificationAudit {
  category: Category;
  method: "heuristic_keywords";
  scores: Record<Category, number>;
  rules_fired: RuleFired[];
}

export interface HighlightAudit {
  term_id: string;
  match: string;
  start: number;
  end: number;
  lookup: {
    lexicon_field_used: string;
    matched_variant: string;
  };
}

export interface ClauseAudit {
  segment: {
    rule: string;
    evidence: string;
  };
  normalized_preview: string;
  classification: ClassificationAudit;
  highlights: HighlightAudit[];
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

// ── Semiotic map ────────────────────────────────────────

export interface SemioticEntry {
  category: Category;
  icon_id: string;
  icon_label: string;
  color: string;
  significance: string;
  impact_interpretation: string;
}

export type SemioticMapType = SemioticEntry[];

// ── Pipeline result ─────────────────────────────────────
export interface PipelineResult {
  clauses: Clause[];
  highlights: HighlightsMap;
  explanations: ExplanationsMap;
  audit: AuditSession;
}
