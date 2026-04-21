"use client";

import { memo, useMemo, type ReactNode } from "react";
import type { TermMatch } from "@/lib/types";
import PremiumHighlightMark from "@/ui/components/PremiumHighlightMark";

interface HighlightedTextProps {
  text: string;
  highlights: TermMatch[];
  onTermClick: (termId: string) => void;
  className?: string;
}

function HighlightedText({ text, highlights, onTermClick, className }: HighlightedTextProps) {
  const segments = useMemo(() => {
    if (!highlights || highlights.length === 0) {
      return [<span key="full-text">{text}</span>];
    }

    const sorted = [...highlights].sort((a, b) => a.start - b.start || b.end - a.end);
    const cleaned: TermMatch[] = [];

    for (const highlight of sorted) {
      const last = cleaned[cleaned.length - 1];
      if (last && highlight.start < last.end) {
        if (highlight.end - highlight.start > last.end - last.start) {
          cleaned[cleaned.length - 1] = highlight;
        }
        continue;
      }
      cleaned.push(highlight);
    }

    const output: ReactNode[] = [];
    let cursor = 0;

    for (const highlight of cleaned) {
      if (highlight.start < cursor || highlight.start >= text.length || highlight.end > text.length) {
        continue;
      }

      if (highlight.start > cursor) {
        output.push(<span key={`t-${cursor}`}>{text.slice(cursor, highlight.start)}</span>);
      }

      output.push(
        <PremiumHighlightMark
          key={`h-${highlight.start}`}
          id={`h-${highlight.start}`}
          text={text.slice(highlight.start, highlight.end)}
          onClick={() => onTermClick(highlight.term_id)}
        />
      );

      cursor = highlight.end;
    }

    if (cursor < text.length) {
      output.push(<span key={`t-${cursor}`}>{text.slice(cursor)}</span>);
    }

    return output;
  }, [highlights, onTermClick, text]);

  return (
    <p
      className={className}
      style={{
        fontSize: "0.9375rem",
        lineHeight: 1.72,
        whiteSpace: "pre-wrap",
        color: "#3a3a3c",
      }}
    >
      {segments}
    </p>
  );
}

export default memo(HighlightedText);
