/* ========================================================
 * highlighter.ts — Encontra termos do léxico no texto
 * e retorna offsets (start/end) + term_id
 * ======================================================== */

import type { LexiconEntry, TermMatch, HighlightAudit } from "./types";
import { normalize, generateVariations } from "./normalizer";

/**
 * Busca todos os termos do léxico dentro de um texto de cláusula.
 * Retorna matches com offsets (start/end) no texto ORIGINAL
 * e auditoria de provenance para cada match.
 */
export function findTermsInText(
  text: string,
  lexicon: LexiconEntry[]
): { matches: TermMatch[]; audits: HighlightAudit[] } {
  const matches: TermMatch[] = [];
  const audits: HighlightAudit[] = [];
  const normalizedText = normalize(text);
  const charMap = buildCharMap(text);

  for (const entry of lexicon) {
    // Todas as formas possíveis do termo
    const allForms = new Set<string>();
    allForms.add(entry.term);
    for (const alias of entry.aliases) {
      allForms.add(alias);
    }
    // Gera variações de cada forma
    const expandedForms = new Map<string, string>(); // normalizedForm → originalForm
    for (const form of allForms) {
      for (const v of generateVariations(form)) {
        expandedForms.set(normalize(v), form);
      }
    }

    // Busca cada forma no texto normalizado
    for (const [normalizedForm, originalForm] of expandedForms) {
      if (normalizedForm.length < 2) continue;

      let searchFrom = 0;
      while (true) {
        const idx = normalizedText.indexOf(normalizedForm, searchFrom);
        if (idx === -1) break;

        const charBefore = idx > 0 ? normalizedText[idx - 1] : " ";
        const charAfter =
          idx + normalizedForm.length < normalizedText.length
            ? normalizedText[idx + normalizedForm.length]
            : " ";

        if (isWordBoundary(charBefore) && isWordBoundary(charAfter)) {
          const origStart = charMap[idx];
          const origEnd = charMap[idx + normalizedForm.length - 1] + 1;

          const overlapping = matches.some(
            (m) =>
              m.term_id === entry.term_id &&
              m.start < origEnd &&
              m.end > origStart
          );

          if (!overlapping) {
            const matchText = text.slice(origStart, origEnd);
            matches.push({
              term_id: entry.term_id,
              match: matchText,
              start: origStart,
              end: origEnd,
            });

            // Determina qual campo do léxico foi usado
            const fieldUsed = originalForm === entry.term ? "term" : "aliases";
            audits.push({
              term_id: entry.term_id,
              match: matchText,
              start: origStart,
              end: origEnd,
              lookup: {
                lexicon_field_used: fieldUsed,
                matched_variant: originalForm,
              },
            });
          }
        }

        searchFrom = idx + 1;
      }
    }
  }

  matches.sort((a, b) => a.start - b.start);
  audits.sort((a, b) => a.start - b.start);

  return { matches, audits };
}

// ── Helpers ─────────────────────────────────────────────

/**
 * Constrói um mapa de posições: índice no texto normalizado → índice no texto original.
 * Isso é necessário porque removeAccents (NFD) pode mudar o comprimento do texto.
 */
function buildCharMap(original: string): number[] {
  const map: number[] = [];
  const lower = original.toLowerCase();

  // NFD decompõe acentos em char base + combining mark
  const nfd = lower.normalize("NFD");
  let origIdx = 0;
  let nfdIdx = 0;

  // Constrói mapa NFD → original
  const nfdToOrig: number[] = [];
  const origChars = [...lower]; // handles surrogate pairs
  const nfdChars = [...nfd];

  // Simples: percorre char-by-char mantendo alinhamento
  let oi = 0;
  let ni = 0;
  const origStr = lower;
  const nfdStr = nfd;

  while (oi < origStr.length && ni < nfdStr.length) {
    nfdToOrig[ni] = oi;
    const origCode = origStr.codePointAt(oi)!;
    const nfdCode = nfdStr.codePointAt(ni)!;

    if (origCode === nfdCode) {
      oi++;
      ni++;
    } else {
      // char original foi decomposto em NFD
      ni++;
      // combining marks apontam para o mesmo char original
      while (ni < nfdStr.length && isCombiningMark(nfdStr.codePointAt(ni)!)) {
        nfdToOrig[ni] = oi;
        ni++;
      }
      oi++;
    }
  }

  // Agora o normalize() completo é: NFD → strip combining → resultado
  // O texto normalizado pula combining marks
  const stripped: number[] = [];
  for (let i = 0; i < nfdStr.length; i++) {
    if (!isCombiningMark(nfdStr.codePointAt(i)!)) {
      stripped.push(nfdToOrig[i]);
    }
  }

  return stripped;
}

function isCombiningMark(code: number): boolean {
  return code >= 0x0300 && code <= 0x036f;
}

function isWordBoundary(char: string): boolean {
  return /[\s.,;:!?()[\]{}"'\/\-–—]/.test(char) || char === " ";
}
