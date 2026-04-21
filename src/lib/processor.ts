/* ========================================================
 * processor.ts - Service layer 100% CLIENT-SIDE
 * Sem fs, sem API, sem server actions.
 * ======================================================== */

import type { LexiconEntry, PipelineResult } from "./types";
import { LEXICON } from "./lexicon-data";
import { MOCK_CLAUSES } from "./mock-clauses-data";
import { buildPipelineResultFromClauses, runPipeline } from "./pipeline";

const lexicon = LEXICON;
const mockClauses = MOCK_CLAUSES;

export function getLexicon(): LexiconEntry[] {
  return lexicon;
}

export function getLexiconEntry(termId: string): LexiconEntry | undefined {
  return lexicon.find((entry) => entry.term_id === termId);
}

export function getAllTermIds(): string[] {
  return lexicon.map((entry) => entry.term_id);
}

export function processText(
  rawText: string,
  docId: string = "FREE_TEXT"
): PipelineResult {
  return runPipeline(rawText, docId, lexicon);
}

export function loadMockSession(docId: string = "X_PRIVACY"): PipelineResult {
  const selectedClauses = mockClauses.filter((clause) => clause.doc_id === docId);
  const fallbackDocId = mockClauses[0]?.doc_id ?? "X_PRIVACY";
  const clauses = selectedClauses.length > 0
    ? selectedClauses
    : mockClauses.filter((clause) => clause.doc_id === fallbackDocId);

  return buildPipelineResultFromClauses(clauses, lexicon, "dataset_demo", docId);
}

export const SAMPLE_TEXT = `Política de Privacidade - Exemplo Demonstrativo

Coletamos dados pessoais fornecidos diretamente por você no cadastro, como nome, e-mail, número de telefone e data de nascimento. Também registramos dados de navegação, identificadores de dispositivo e coleta automática de interações para manter a conta e personalizar recursos.

Usamos cookies, localização aproximada e rastreadores semelhantes para medir audiência, lembrar preferências e apoiar publicidade direcionada dentro e fora da plataforma.

A finalidade do tratamento de dados inclui operar o serviço, prevenir fraude, personalizar conteúdo e exibir publicidade direcionada. Quando aplicável, usamos consentimento, execução do contrato ou legítimo interesse como base legal para cada operação.

Podemos realizar compartilhamento de dados com terceiros, operadores de tecnologia e parceiros comerciais localizados no Brasil ou no exterior. Em alguns casos ocorre transferência internacional para servidores contratados para armazenamento, segurança e análise de desempenho.`;
