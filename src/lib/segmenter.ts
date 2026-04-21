/* ========================================================
 * segmenter.ts — Segmentação de texto em cláusulas
 * Estratégia: parágrafos separados por linhas em branco
 * ou padrões "1.", "a)", "Seção X", etc.
 * ======================================================== */

import type { Clause } from "./types";

/** Regex para detectar títulos/cabeçalhos de seção */
const HEADING_RE = /^(?:\d+[\.\)]\s*|[a-z][\.\)]\s*|#{1,3}\s+|Seção\s+\d+|Artigo\s+\d+|Cláusula\s+\d+)/i;

export interface SegmentEvidence {
  rule: string;
  evidence: string;
}

/**
 * Segmenta texto bruto em blocos (cláusulas).
 * Retorna também evidência de segmentação para auditoria.
 */
export function segmentText(
  rawText: string,
  docId: string = "DOC"
): (Omit<
  Clause,
  "category" | "lgpd_refs" | "impact" | "plain_language_summary" | "detected_terms"
> & { segmentEvidence: SegmentEvidence })[] {
  // Normaliza quebras de linha
  const text = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Divide por 2+ newlines (parágrafos)
  const rawParagraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Agrupa título + corpo
  const blocks: { title: string; text: string; segRule: string; segEvidence: string }[] = [];
  let i = 0;

  while (i < rawParagraphs.length) {
    const para = rawParagraphs[i];
    const isShortHeading = para.length < 80 && HEADING_RE.test(para);
    const isStandaloneTitle = para.length < 60 && !para.endsWith(".");

    if ((isShortHeading || isStandaloneTitle) && i + 1 < rawParagraphs.length) {
      blocks.push({
        title: para.replace(/^[\d]+[\.\)]\s*/, "").replace(/^#{1,3}\s+/, ""),
        text: rawParagraphs[i + 1],
        segRule: "heading_merge",
        segEvidence: `paragraph_index=${i},merged_with=${i + 1}`,
      });
      i += 2;
    } else {
      const firstSentence = para.split(/[.!?]/)[0];
      blocks.push({
        title:
          firstSentence.length <= 60
            ? firstSentence
            : firstSentence.slice(0, 57) + "...",
        text: para,
        segRule: "split_paragraphs",
        segEvidence: `paragraph_index=${i}`,
      });
      i += 1;
    }
  }

  // Gera IDs estáveis
  return blocks.map((block, idx) => ({
    clause_id: `${docId}_C${String(idx + 1).padStart(3, "0")}`,
    doc_id: docId,
    title: block.title,
    text: block.text,
    segmentEvidence: {
      rule: block.segRule,
      evidence: block.segEvidence,
    },
  }));
}
