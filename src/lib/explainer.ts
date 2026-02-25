/* ========================================================
 * explainer.ts — Gera explanations a partir do léxico
 * para cada termo encontrado nos highlights.
 * ======================================================== */

import type {
  LexiconEntry,
  Explanation,
  ExplanationsMap,
  HighlightsMap,
} from "./types";

/**
 * Dado os highlights produzidos e o léxico, gera um mapa
 * term_id → Explanation (card Visual Law).
 */
export function generateExplanations(
  highlights: HighlightsMap,
  lexicon: LexiconEntry[]
): ExplanationsMap {
  // Coleta IDs únicos de termos encontrados
  const foundTermIds = new Set<string>();
  for (const matches of Object.values(highlights)) {
    for (const m of matches) {
      foundTermIds.add(m.term_id);
    }
  }

  // Monta mapa de lookup
  const lexiconMap = new Map<string, LexiconEntry>();
  for (const entry of lexicon) {
    lexiconMap.set(entry.term_id, entry);
  }

  // Gera explanations
  const explanations: ExplanationsMap = {};

  for (const termId of foundTermIds) {
    const entry = lexiconMap.get(termId);
    if (!entry) continue;

    explanations[termId] = {
      meaning: entry.meaning,
      why_it_matters: entry.why_it_matters,
      what_you_can_do: entry.what_you_can_do,
      category: entry.category,
      icon_id: entry.icon_id,
      impact: entry.impact,
      lgpd_refs: entry.lgpd_refs,
    };
  }

  return explanations;
}
