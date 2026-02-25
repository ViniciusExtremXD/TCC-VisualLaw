"use client";

import type { TermMatch } from "@/lib/types";

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
export default function HighlightedText({
  text,
  highlights,
  onTermClick,
}: HighlightedTextProps) {
  if (!highlights || highlights.length === 0) {
    return <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, whiteSpace: "pre-wrap", color: "#3a3a3c" }}>{text}</p>;
  }

  // Remove sobreposições: se dois highlights se sobrepõem, mantém o mais longo
  const sorted = [...highlights].sort((a, b) => a.start - b.start || b.end - a.end);
  const cleaned: TermMatch[] = [];
  for (const h of sorted) {
    const last = cleaned[cleaned.length - 1];
    if (last && h.start < last.end) {
      // Sobreposição: mantém o mais longo
      if (h.end - h.start > last.end - last.start) {
        cleaned[cleaned.length - 1] = h;
      }
      continue;
    }
    cleaned.push(h);
  }

  // Monta segmentos
  const segments: React.ReactNode[] = [];
  let cursor = 0;

  for (const h of cleaned) {
    // Valida offsets
    if (h.start < cursor || h.start >= text.length || h.end > text.length) continue;

    // Texto antes do highlight
    if (h.start > cursor) {
      segments.push(
        <span key={`t-${cursor}`}>{text.slice(cursor, h.start)}</span>
      );
    }

    // Highlight clicável
    segments.push(
      <mark
        key={`h-${h.start}`}
        className="term-highlight"
        role="button"
        tabIndex={0}
        title={`Clique para ver: ${h.match}`}
        onClick={() => onTermClick(h.term_id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onTermClick(h.term_id);
        }}
      >
        {text.slice(h.start, h.end)}
      </mark>
    );

    cursor = h.end;
  }

  // Texto restante
  if (cursor < text.length) {
    segments.push(<span key={`t-${cursor}`}>{text.slice(cursor)}</span>);
  }

  return (
    <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, whiteSpace: "pre-wrap", color: "#3a3a3c" }}>
      {segments}
    </p>
  );
}
