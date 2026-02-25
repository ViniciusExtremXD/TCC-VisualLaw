/* ========================================================
 * processor.ts — Service layer 100% CLIENT-SIDE
 * Sem fs, sem API, sem server actions.
 * Importa dados mock via JSON modules (bundled no build).
 * ======================================================== */

import type {
  LexiconEntry,
  Clause,
  HighlightsMap,
  ExplanationsMap,
  PipelineResult,
  AuditSession,
  ClauseAudit,
} from "./types";
import { segmentText } from "./segmenter";
import { normalize } from "./normalizer";
import { classifyClause, suggestLGPDRefs } from "./classifier";
import { findTermsInText } from "./highlighter";
import { generateExplanations } from "./explainer";

// ── Dados (módulos TS dentro de src/ — sem JSON externo) ─
import { MOCK_CLAUSES } from "./mock-clauses-data";
import { LEXICON } from "./lexicon-data";

const mockClauses = MOCK_CLAUSES;
const lexicon = LEXICON;

const PIPELINE_STEPS = [
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

/* ── Acesso ao léxico ────────────────────────────────── */

export function getLexicon(): LexiconEntry[] {
  return lexicon;
}

export function getLexiconEntry(termId: string): LexiconEntry | undefined {
  return lexicon.find((e) => e.term_id === termId);
}

export function getAllTermIds(): string[] {
  return lexicon.map((e) => e.term_id);
}

/* ── Processamento de texto bruto (pipeline client-side) */

export function processText(
  rawText: string,
  docId: string = "SESSION"
): PipelineResult {
  const clausesAudit: Record<string, ClauseAudit> = {};

  // 1. Segmentação
  const rawClauses = segmentText(rawText, docId);

  // 2. Classificação + enrichment
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

  // 3. Highlights
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

  // 4. Explanations
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

/* ── Carrega dados mock (clauses pré-prontas) ────────── */

export function loadMockSession(): PipelineResult {
  const clauses = mockClauses;
  const clausesAudit: Record<string, ClauseAudit> = {};

  // Computa highlights + audit em tempo real
  const highlights: HighlightsMap = {};
  for (const clause of clauses) {
    const { matches, audits } = findTermsInText(clause.text, lexicon);
    if (matches.length > 0) {
      highlights[clause.clause_id] = matches;
    }

    // Gera audit para cada cláusula mock
    const { audit: classAudit } = classifyClause(clause.text);
    clausesAudit[clause.clause_id] = {
      segment: { rule: "mock_predefined", evidence: `clause_id=${clause.clause_id}` },
      normalized_preview: normalize(clause.text).slice(0, 120) + "...",
      classification: classAudit,
      highlights: audits,
    };
  }

  const explanations: ExplanationsMap = generateExplanations(highlights, lexicon);

  const audit: AuditSession = {
    session_id: `SESSION_MOCK_${Date.now()}`,
    created_at: new Date().toISOString(),
    source: { mode: "mock_data", doc_hint: "MOCK_DOC" },
    pipeline: PIPELINE_STEPS,
    clauses_audit: clausesAudit,
  };

  return { clauses, highlights, explanations, audit };
}

/* ── Texto-exemplo para demo ────────────────────────── */

export const SAMPLE_TEXT = `Política de Privacidade — Exemplo Demonstrativo

1. Coleta de Dados Pessoais

Coletamos seus dados pessoais quando você cria uma conta, incluindo nome, endereço de e-mail, número de telefone e data de nascimento. O titular dos dados pode atualizar essas informações a qualquer momento nas configurações da conta.

2. Uso de Cookies

Utilizamos cookies e tecnologias semelhantes para coletar informações sobre sua navegação, preferências e comportamento online. Esses rastreadores nos ajudam a personalizar o conteúdo e os anúncios exibidos na plataforma.

3. Finalidade do Tratamento

A finalidade do tratamento de dados é fornecer, manter e melhorar nossos serviços, personalizar sua experiência e exibir publicidade relevante aos nossos usuários.

4. Compartilhamento com Terceiros

Podemos realizar o compartilhamento de seus dados pessoais com terceiros, incluindo parceiros de publicidade, provedores de análise de dados e empresas do grupo corporativo.

5. Parceiros Comerciais

Nossos parceiros comerciais e terceiros podem acessar informações necessárias para a prestação de serviços, como processamento de pagamentos e análise de desempenho de anúncios.

6. Retenção de Dados

A retenção dos seus dados pessoais ocorre pelo tempo necessário para cumprir as finalidades descritas nesta política. Após esse período, os dados podem passar por anonimização ou serem eliminados de nossos sistemas.

7. Seus Direitos

Como titular, você possui o direito de acessar, corrigir e solicitar a exclusão dos seus dados pessoais. O consentimento pode ser revogado a qualquer momento através das configurações de privacidade.

8. Portabilidade

Você pode solicitar a portabilidade dos seus dados pessoais para outro provedor de serviço. O controlador deve atender essa solicitação em prazo razoável, conforme estabelecido pela LGPD.

9. Segurança

Adotamos medidas técnicas e organizacionais para proteger seus dados pessoais. Em caso de incidente de segurança que possa acarretar risco relevante ao titular, comunicaremos à ANPD e aos titulares afetados conforme exigido pela legislação.

10. Pesquisa e Desenvolvimento

Utilizamos seus dados para fins de pesquisa e desenvolvimento de novos recursos, sempre respeitando a finalidade original do tratamento de dados e os princípios estabelecidos pela LGPD.`;
