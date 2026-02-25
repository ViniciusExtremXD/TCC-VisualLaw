/* ========================================================
 * classifier.ts — Classificação heurística de cláusulas
 * Baseada em palavras-chave por categoria.
 * Preparado para trocar por modelo ML no futuro.
 * ======================================================== */

import type { Category, Impact, ClassificationAudit, RuleFired } from "./types";
import { normalize } from "./normalizer";

// ── Regras de classificação ─────────────────────────────
interface CategoryRule {
  rule_id: string;
  category: Category;
  keywords: string[];
  weight: number;
}

const RULES: CategoryRule[] = [
  {
    rule_id: "RULE_CAT_COLLECT_01",
    category: "data_collection",
    keywords: [
      "coletar", "coleta", "coletamos", "coletados",
      "informacoes", "informacao", "dados pessoais",
      "dado pessoal", "cookies", "cookie", "rastreador",
      "rastreadores", "localizacao", "ip", "dispositivo",
      "navegacao", "numero de telefone", "e-mail",
      "data de nascimento", "nome", "identificacao",
      "metadados", "perfil",
    ],
    weight: 1,
  },
  {
    rule_id: "RULE_CAT_PURPOSE_01",
    category: "purpose_use",
    keywords: [
      "finalidade", "proposito", "objetivo", "utilizar",
      "utilizamos", "para fins de", "melhorar", "personalizar",
      "experiencia", "publicidade", "anuncios", "anuncio",
      "marketing", "pesquisa", "desenvolvimento", "fornecer servico",
      "manter", "operar", "analytics",
    ],
    weight: 1,
  },
  {
    rule_id: "RULE_CAT_SHARE_01",
    category: "sharing_third_parties",
    keywords: [
      "compartilhar", "compartilhamos", "compartilhamento",
      "terceiros", "parceiros", "parceiro", "anunciantes",
      "provedor", "provedores", "transferir", "transferencia",
      "ceder", "repasse", "empresas parceiras",
      "autoridades", "governo",
    ],
    weight: 1,
  },
  {
    rule_id: "RULE_CAT_RETAIN_01",
    category: "retention_storage",
    keywords: [
      "retencao", "reter", "retemos", "armazenamento",
      "armazenar", "armazenamos", "prazo", "periodo",
      "guardar", "manter dados", "exclusao de conta",
      "90 dias", "eliminacao", "anonimizacao", "anonimizar",
      "backup",
    ],
    weight: 1,
  },
  {
    rule_id: "RULE_CAT_RIGHTS_01",
    category: "user_rights",
    keywords: [
      "direito", "direitos", "titular", "titulares",
      "consentimento", "revogar", "revogacao", "portabilidade",
      "acesso", "acessar", "correcao", "corrigir",
      "exclusao", "excluir", "solicitar", "lgpd",
      "encarregado", "dpo", "autoridade", "anpd",
      "configuracoes de privacidade", "oposicao",
    ],
    weight: 1,
  },
  {
    rule_id: "RULE_CAT_SECURITY_01",
    category: "security_incidents",
    keywords: [
      "seguranca", "incidente", "vazamento", "violacao",
      "brecha", "protecao", "proteger", "medidas tecnicas",
      "criptografia", "acesso nao autorizado", "destruicao",
      "perda", "risco", "comunicar", "data breach",
      "organizacionais",
    ],
    weight: 1,
  },
];

// ── Impacto heurístico ──────────────────────────────────
const HIGH_IMPACT_SIGNALS = [
  "compartilh", "terceiros", "parceiros", "anunciant",
  "vazamento", "incidente", "dados pessoais", "dado pessoal",
  "consentimento", "revogar", "direito", "lgpd",
  "excluir", "exclusao",
];

const LOW_IMPACT_SIGNALS = [
  "cookie", "melhoria", "analytics", "pesquisa",
];

/**
 * Classifica uma cláusula em uma das 6 categorias
 * e atribui um nível de impacto.
 * Retorna também a trilha de auditoria da classificação.
 */
export function classifyClause(text: string): {
  category: Category;
  impact: Impact;
  audit: ClassificationAudit;
} {
  const normalizedText = normalize(text);

  // Conta matches por categoria
  const scores: Record<Category, number> = {
    data_collection: 0,
    purpose_use: 0,
    sharing_third_parties: 0,
    retention_storage: 0,
    user_rights: 0,
    security_incidents: 0,
  };

  const rulesFired: RuleFired[] = [];

  for (const rule of RULES) {
    const matchedKeywords: string[] = [];
    for (const kw of rule.keywords) {
      const normalizedKw = normalize(kw);
      let idx = 0;
      let count = 0;
      while ((idx = normalizedText.indexOf(normalizedKw, idx)) !== -1) {
        count++;
        idx += normalizedKw.length;
      }
      if (count > 0) {
        scores[rule.category] += rule.weight * count;
        matchedKeywords.push(kw);
      }
    }
    if (matchedKeywords.length > 0) {
      rulesFired.push({
        rule_id: rule.rule_id,
        keywords: matchedKeywords,
        weight: rule.weight * matchedKeywords.length,
      });
    }
  }

  // Categoria com maior score
  let bestCategory: Category = "data_collection";
  let bestScore = 0;
  for (const [cat, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat as Category;
    }
  }

  // Impacto
  let impact: Impact = "medium";
  const highCount = HIGH_IMPACT_SIGNALS.filter((s) =>
    normalizedText.includes(normalize(s))
  ).length;
  const lowCount = LOW_IMPACT_SIGNALS.filter((s) =>
    normalizedText.includes(normalize(s))
  ).length;

  if (highCount >= 2) impact = "high";
  else if (lowCount >= 2 && highCount === 0) impact = "low";

  const audit: ClassificationAudit = {
    category: bestCategory,
    method: "heuristic_keywords",
    scores: { ...scores },
    rules_fired: rulesFired,
  };

  return { category: bestCategory, impact, audit };
}

/**
 * Sugere referências LGPD baseado na categoria.
 */
export function suggestLGPDRefs(category: Category): string[] {
  const refs: Record<Category, string[]> = {
    data_collection: ["Art. 7°, I", "Art. 9°"],
    purpose_use: ["Art. 6°, I", "Art. 9°"],
    sharing_third_parties: ["Art. 18, VII"],
    retention_storage: ["Art. 15", "Art. 16"],
    user_rights: ["Art. 17", "Art. 18"],
    security_incidents: ["Art. 46", "Art. 48"],
  };
  return refs[category] || [];
}
