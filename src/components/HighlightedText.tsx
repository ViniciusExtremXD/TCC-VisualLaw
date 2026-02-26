"use client";

import { memo, useMemo, type ReactNode } from "react";
import type { TermMatch } from "@/lib/types";
import PremiumHighlightMark from "@/ui/components/PremiumHighlightMark";

interface HighlightedTextProps {
  text: string;
  highlights: TermMatch[];
  onTermClick: (termId: string) => void;
}

/**
 * Renderiza texto com termos do léxico destacados (clicáveis).
 *
 * Algoritmo:
 * 1. Ordena highlights por posição (start).
 * 2. Percorre o texto criando segmentos alternados:
 *    texto normal → <mark> destacado → texto normal → ...
 * 3. Remove sobreposições mantendo o match mais longo.
 */
function HighlightedText({
  text,
  highlights,
  onTermClick,
}: HighlightedTextProps) {
  const segments = useMemo(() => {
    if (!highlights || highlights.length === 0) {
      return [<span key="full-text">{text}</span>];
    }

    const sorted = [...highlights].sort((a, b) => a.start - b.start || b.end - a.end);
    const cleaned: TermMatch[] = [];
    for (const h of sorted) {
      const last = cleaned[cleaned.length - 1];
      if (last && h.start < last.end) {
        if (h.end - h.start > last.end - last.start) {
          cleaned[cleaned.length - 1] = h;
        }
        continue;
      }
      cleaned.push(h);
    }

    const output: ReactNode[] = [];
    let cursor = 0;

    for (const h of cleaned) {
      if (h.start < cursor || h.start >= text.length || h.end > text.length) continue;

      if (h.start > cursor) {
        output.push(<span key={`t-${cursor}`}>{text.slice(cursor, h.start)}</span>);
      }

      output.push(
        <PremiumHighlightMark
          key={`h-${h.start}`}
          id={`h-${h.start}`}
          text={text.slice(h.start, h.end)}
          onClick={() => onTermClick(h.term_id)}
        />
      );

      cursor = h.end;
    }

    if (cursor < text.length) {
      output.push(<span key={`t-${cursor}`}>{text.slice(cursor)}</span>);
    }

    return output;
  }, [highlights, onTermClick, text]);

  return (
    <p
      style={{ fontSize: "0.9375rem", lineHeight: 1.7, whiteSpace: "pre-wrap", color: "#3a3a3c" }}
    >
      {segments}
    </p>
  );
}

export default memo(HighlightedText);
