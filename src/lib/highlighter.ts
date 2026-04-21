/* ========================================================
 * highlighter.ts — Encontra termos do léxico no texto
 * e retorna offsets (start/end) + term_id
 * ======================================================== */

import type { LexiconEntry, TermMatch, HighlightAudit } from "./types";
import { normalize, generateVariations } from "./normalizer";

/**
 * Busca todos os termos do léxico dentro de um texto de cláusula.
 * Retorna matches com offsets (start/end) no texto original
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
    const allForms = new Set<string>();
    allForms.add(entry.term);
    for (const alias of entry.aliases) {
      allForms.add(alias);
    }

    const expandedForms = new Map<string, string>();
    for (const form of allForms) {
      for (const variation of generateVariations(form)) {
        expandedForms.set(normalize(variation), form);
      }
    }

    for (const [normalizedForm, originalForm] of expandedForms) {
      if (normalizedForm.length < 2) {
        continue;
      }

      let searchFrom = 0;
      while (true) {
        const idx = normalizedText.indexOf(normalizedForm, searchFrom);
        if (idx === -1) {
          break;
        }

        const charBefore = idx > 0 ? normalizedText[idx - 1] : " ";
        const charAfter =
          idx + normalizedForm.length < normalizedText.length
            ? normalizedText[idx + normalizedForm.length]
            : " ";

        if (isWordBoundary(charBefore) && isWordBoundary(charAfter)) {
          const origStart = charMap[idx];
          const origEnd = charMap[idx + normalizedForm.length - 1] + 1;

          const overlapping = matches.some(
            (match) =>
              match.term_id === entry.term_id &&
              match.start < origEnd &&
              match.end > origStart
          );

          if (!overlapping) {
            const matchText = text.slice(origStart, origEnd);
            matches.push({
              term_id: entry.term_id,
              match: matchText,
              start: origStart,
              end: origEnd,
            });

            const fieldUsed = originalForm === entry.term ? "term" : "aliases";
            audits.push({
              term_id: entry.term_id,
              match: matchText,
              start: origStart,
              end: origEnd,
              lookup: {
                lexicon_field_used: fieldUsed,
                matched_variant: originalForm,
                matching_rule_id:
                  fieldUsed === "term" ? "LEXICON_PRIMARY_TERM" : "LEXICON_ALIAS_VARIANT",
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

function buildCharMap(original: string): number[] {
  const lower = original.toLowerCase();
  const nfd = lower.normalize("NFD");
  const nfdToOrig: number[] = [];

  let originalIndex = 0;
  let nfdIndex = 0;

  while (originalIndex < lower.length && nfdIndex < nfd.length) {
    nfdToOrig[nfdIndex] = originalIndex;
    const originalCode = lower.codePointAt(originalIndex)!;
    const nfdCode = nfd.codePointAt(nfdIndex)!;

    if (originalCode === nfdCode) {
      originalIndex++;
      nfdIndex++;
      continue;
    }

    nfdIndex++;
    while (nfdIndex < nfd.length && isCombiningMark(nfd.codePointAt(nfdIndex)!)) {
      nfdToOrig[nfdIndex] = originalIndex;
      nfdIndex++;
    }
    originalIndex++;
  }

  const stripped: number[] = [];
  for (let i = 0; i < nfd.length; i++) {
    if (!isCombiningMark(nfd.codePointAt(i)!)) {
      stripped.push(nfdToOrig[i]);
    }
  }

  return stripped;
}

function isCombiningMark(code: number): boolean {
  return code >= 0x0300 && code <= 0x036f;
}

function isWordBoundary(char: string): boolean {
  return /[\s.,;:!?()[\]{}"'/\\\-–—]/.test(char) || char === " ";
}
